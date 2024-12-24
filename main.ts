datalogger.onLogFull(function () {
    while (true) {
        logger.sendBuffer(_full)
        basic.showString("F")
        if (input.buttonIsPressed(Button.A)) {
            start_sent = false
            notReady = true
            logger.sendBuffer(_empty)
            break;
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
let start_sent = false
let waiting = false
let notReady = false
let receivedLightLevel = ""
let receivedTempLevel = ""
let message: Buffer = null
let _empty: Buffer = null
let _full: Buffer = null
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
        basic.showString("W")
        basic.pause(100)
        if (input.buttonIsPressed(Button.AB)) {
            logger.sendBuffer(_start)
            start_sent = true
            basic.showString("S")
        } else {
            continue;
        }
    }
    while (notReady) {
        basic.showString("W")
        basic.pause(100)
        if (message != logger.none() && logger.compareBuffers(message, _ready)) {
            basic.showString("R")
            notReady = false
            logger.sendBuffer(_ack)
            basic.showString("A")
            while (waiting) {
                basic.pause(100)
                // Only store the data and exit the while loop if both datapoints are received
                if (receivedTempLevel != logger.none() && receivedLightLevel != logger.none()) {
                    datalogger.log(
                    datalogger.createCV("Temperature", receivedTempLevel),
                    datalogger.createCV("Light", receivedLightLevel)
                    )
                    waiting = false
                    basic.showString("L")
                }
            }
        }
    }
    message = logger.none()
    receivedTempLevel = logger.none()
    receivedLightLevel = logger.none()
    control.waitMicros(60000000)
}
