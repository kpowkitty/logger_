let logMessage = ""
let error = ""
let startSent = false
let waiting = true
let notReady = true
let _empty: Buffer = null
let _full: Buffer = null
let watchdogLimit = 5400000
let lastActionTime = input.runningTime()
let _request = logger.stringToBuffer("request")
_full = logger.stringToBuffer("full")
_empty = logger.stringToBuffer("empty")
let _ready = logger.stringToBuffer("ready")
let _start = logger.stringToBuffer("start")
let _ack = logger.stringToBuffer("ack")
let _req = logger.stringToBuffer("request")

namespace loggerAbstracted {
    //% block
    export function requestRescue() {
        basic.showString("E")
        logger.sendBuffer(_request)
        basic.pause(100)
        if (message != logger.none() && logger.compareBuffers(message, _ack)) {
            lastActionTime = input.runningTime()
        }
    }

    //% block
    export function resetVariables() {
        message = logger.none()
        receivedTempLevel = logger.none()
        receivedLightLevel = logger.none()
        lastActionTime = input.runningTime()
        waiting = true
        notReady = true
        wait60Minutes()
        checkForTimeout()
    }

    //% block
    export function waitForReady() {
        basic.showString("W")
        basic.clearScreen()
        while (notReady) { 
            basic.pause(100)
            if (message != logger.none() && logger.compareBuffers(message, _request)) {
                logger.sendBuffer(_ack)
            }
            if (message != logger.none() && logger.compareBuffers(message, _ready)) {
                basic.showString("R")
                notReady = false
                logger.sendBuffer(_ack)
                basic.showString("A")
                lastActionTime = input.runningTime()
            }
            if (timingOut()) {
                errorLog("Ready timeout")
            }
            while (timingOut()) {
                requestRescue()
            }
        }
    }  

    //% block
    export function sendRescue() {
        logger.sendBuffer(_ack)
        logMessage = "Rescue activated"
        datalogger.log(datalogger.createCV("Message", logMessage))
    }

    //% block
    export function timingOut(): Boolean {
        return input.runningTime() - lastActionTime > watchdogLimit
    }

    //% block
    export function waitForData() {
        while (waiting) {
            basic.pause(100)
            if (message != logger.none() && logger.compareBuffers(message, _request)) {
                sendRescue()
            }
            if (receivedTempLevel != logger.none() && receivedLightLevel != logger.none()) {
                waiting = false
                lastActionTime = input.runningTime()
            }
            if (timingOut()) {
                errorLog("Ready timeout")
            }
            while (timingOut()) {
                requestRescue()
            }
        }
    }

    //% block
    export function waitingForData() {
        return waiting
    }

    //% block
    export function storeData() {
        datalogger.log(
            datalogger.createCV("Temperature", receivedTempLevel),
            datalogger.createCV("Light", receivedLightLevel)
        )
        waiting = false
        basic.showString("L")
        basic.clearScreen()
        lastActionTime = input.runningTime()
    }

    //% block
    export function checkForTimeout() {
        while (timingOut()) {
            requestRescue()
        }
    }

    //% block
    export function logTemperature(receivedBuffer: Buffer) {
        basic.showString("T")
        basic.clearScreen()
        receivedTempLevel = logger.storeTemp(receivedBuffer)
    }

    //% block
    export function logLight(receivedBuffer: Buffer) {
        basic.showString("L")
        basic.clearScreen()
        receivedLightLevel = logger.storeLight(receivedBuffer)
    }

    //% block
    export function startedYet() {
        basic.showString("O")
        basic.pause(100)
        if (message != logger.none() && logger.compareBuffers(message, _request)) {
            logger.sendBuffer(_ready)
            basic.showString("S")
            basic.clearScreen()
            startSent = true
            errorLog("Program Restarted")
            return true
        }
        if (input.buttonIsPressed(Button.AB)) {
            logger.sendBuffer(_start)
            startSent = true
            basic.showString("S")
            basic.clearScreen()
            lastActionTime = input.runningTime()
            return true
        }
        if (startSent) {
            return true
        }
        return false
    }

    export function wait60Minutes() {
        basic.pause(3600000) // 60 minutes in milliseconds
    }

    // Helper functions for logging dynamically
    export function errorLog(myError: string) {
        datalogger.log(datalogger.createCV("Error", myError))
    }

    export function messageLog(myMessage: string) {
        datalogger.log(datalogger.createCV("Message", myMessage))
    }
}