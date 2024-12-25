datalogger.onLogFull(function () {
    full = true
    while (full) {
        logger.sendBuffer(_full)
        basic.showString("F")
        if (input.buttonIsPressed(Button.A)) {
            logger.sendBuffer(_empty)
            start_sent = false
            notReady = true
            full = false
            message = logger.none()
            receivedTempLevel = logger.none()
            receivedLightLevel = logger.none()
        }
    }
})
radio.onReceivedBuffer(function (receivedBuffer) {
    if (logger.parseIncomingData(receivedBuffer) == 0) {
        basic.showString("T")
        receivedTempLevel = logger.storeTemp(receivedBuffer)
    } else if (logger.parseIncomingData(receivedBuffer) == 1) {
        basic.showString("L")
        receivedLightLevel = logger.storeLight(receivedBuffer)
    } else {
        message = receivedBuffer
    }
})
let full = false
let error = ""
let start_sent = false
let waiting = false
let notReady = false
let receivedLightLevel = ""
let receivedTempLevel = ""
let message: Buffer = null
let _empty: Buffer = null
let _full: Buffer = null
let watchdogLimit = 10000
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
    if (!(start_sent)) {
        basic.showString("O")
        basic.pause(100)
        if (input.buttonIsPressed(Button.AB)) {
            logger.sendBuffer(_start)
            start_sent = true
            basic.showString("S")
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
        }
        if (message != logger.none() && logger.compareBuffers(message, _ready)) {
            basic.showString("R")
            notReady = false
            logger.sendBuffer(_ack)
            basic.showString("A")
            lastActionTime = input.runningTime()
            while (waiting) {
                basic.pause(100)
                if (message != logger.none() && logger.compareBuffers(message, _request)) {
                    logger.sendBuffer(_ack)
                }
                if (receivedTempLevel != logger.none() && receivedLightLevel != logger.none()) {
                    datalogger.log(
                    datalogger.createCV("Temperature", receivedTempLevel),
                    datalogger.createCV("Light", receivedLightLevel)
                    )
                    waiting = false
                    basic.showString("L")
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
    control.waitMicros(6000000)
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
