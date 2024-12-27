datalogger.onLogFull(function () {
    full = true
    while (full) {
        logger.sendBuffer(_full)
        basic.showString("F")
        if (input.buttonIsPressed(Button.A)) {
            logger.sendBuffer(_empty)
            startSent = false
            notReady = true
            full = false
            message = logger.none()
            receivedTempLevel = logger.none()
            receivedLightLevel = logger.none()
            logMessage = "Signal sent that log is empty"
            datalogger.log(datalogger.createCV("Message", logMessage))
        }
    }
})
radio.onReceivedBuffer(function (receivedBuffer) {
    if (logger.parseIncomingData(receivedBuffer) == 0) {
        basic.showString("T")
        receivedTempLevel = logger.storeTemp(receivedBuffer)
        logMessage = "Temp received"
        datalogger.log(datalogger.createCV("Message", logMessage))
    } else if (logger.parseIncomingData(receivedBuffer) == 1) {
        basic.showString("L")
        receivedLightLevel = logger.storeLight(receivedBuffer)
        logMessage = "Light received"
        datalogger.log(datalogger.createCV("Message", logMessage))
    } else {
        message = receivedBuffer
    }
})
let full = false
let logMessage = ""
let error = ""
let startSent = false
let waiting = false
let notReady = false
let receivedLightLevel = ""
let receivedTempLevel = ""
let message: Buffer = null
let _empty: Buffer = null
let _full: Buffer = null
let watchdogLimit = 600000
let lastActionTime = input.runningTime()
let _request = logger.stringToBuffer("request")
_full = logger.stringToBuffer("full")
_empty = logger.stringToBuffer("empty")
message = logger.none()
receivedTempLevel = logger.none()
receivedLightLevel = logger.none()
let _ready = logger.stringToBuffer("ready")
let _start = logger.stringToBuffer("start")
let _ack = logger.stringToBuffer("ack")
radio.setGroup(23)
radio.setTransmitPower(7)
let _req = logger.stringToBuffer("request")
while (true) {
    notReady = true
    waiting = true
    if (!(startSent)) {
        basic.showString("O")
        basic.pause(100)
        if (message != logger.none() && logger.compareBuffers(message, _request)) {
            logger.sendBuffer(_ready)
            startSent = true
            basic.showString("S")
            error = "Program Restarted"
            datalogger.log(datalogger.createCV("Error", error))
        }
        if (input.buttonIsPressed(Button.AB)) {
            logger.sendBuffer(_start)
            startSent = true
            basic.showString("S")
            logMessage = "Start sent"
            datalogger.log(datalogger.createCV("Message", logMessage))
            lastActionTime = input.runningTime()
        } else {
            continue;
        }
    }
    while (notReady) {
        basic.showString("W")
        basic.pause(100)
        if (message != logger.none() && logger.compareBuffers(message, _request)) {
            logger.sendBuffer(_ack)
            logMessage = "Rescue activated"
            datalogger.log(datalogger.createCV("Message", logMessage))
        }
        if (message != logger.none() && logger.compareBuffers(message, _ready)) {
            basic.showString("R")
            logMessage = "Ready received"
            datalogger.log(datalogger.createCV("Message", logMessage))
            notReady = false
            logger.sendBuffer(_ack)
            basic.showString("A")
            logMessage = "Acknowledgement sent"
            datalogger.log(datalogger.createCV("Message", logMessage))
            lastActionTime = input.runningTime()
            while (waiting) {
                basic.pause(100)
                if (message != logger.none() && logger.compareBuffers(message, _request)) {
                    logger.sendBuffer(_ack)
                    logMessage = "Rescue activated"
                    datalogger.log(datalogger.createCV("Message", logMessage))
                }
                if (receivedTempLevel != logger.none() && receivedLightLevel != logger.none()) {
                    datalogger.log(
                    datalogger.createCV("Temperature", receivedTempLevel),
                    datalogger.createCV("Light", receivedLightLevel)
                    )
                    waiting = false
                    basic.showString("L")
                    logMessage = "Data logged"
                    datalogger.log(datalogger.createCV("Message", logMessage))
                    lastActionTime = input.runningTime()
                }
            }
        }
        while (input.runningTime() - lastActionTime > watchdogLimit) {
            error = "Ready Timeout"
            datalogger.log(datalogger.createCV("Error", error))
            basic.showString("E")
            logger.sendBuffer(_request)
            basic.pause(100)
            if (message != logger.none() && logger.compareBuffers(message, _ready)) {
                lastActionTime = input.runningTime()
            }
        }
    }
    message = logger.none()
    receivedTempLevel = logger.none()
    receivedLightLevel = logger.none()
    lastActionTime = input.runningTime()
    control.waitMicros(600000000)
    while (input.runningTime() - lastActionTime > watchdogLimit) {
        error = "EOL Timeout"
        datalogger.log(datalogger.createCV("Error", error))
        basic.showString("E")
        logger.sendBuffer(_request)
        basic.pause(100)
        if (message != logger.none() && logger.compareBuffers(message, _ready)) {
            lastActionTime = input.runningTime()
        }
    }
}
