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
let started = false
let waiting = false
let _ack: Buffer = null
let _start: Buffer = null
let _ready: Buffer = null
let message: Buffer = null
let _empty: Buffer = null
let notReady = false
let start_sent = false
let _full: Buffer = null
let receivedTempLevel: string
let receivedLightLevel: string
radio.setGroup(23)
radio.setTransmitPower(7)
basic.forever(function () {
    _empty = logger.stringToBuffer("empty")
    _full = logger.stringToBuffer("full")
    _ready = logger.stringToBuffer("ready")
    _start = logger.stringToBuffer("start")
    _ack = logger.stringToBuffer("ack")
    waiting = true
    notReady = true
    started = true
    start_sent = false
    receivedTempLevel = null
receivedLightLevel = null
while (started) {
        if (!(start_sent)) {
            basic.pause(100)
            if (input.buttonIsPressed(Button.AB)) {
                logger.sendBuffer(_start)
                start_sent = true
            } else {
                continue;
            }
        }
        basic.showString("SS")
        basic.pause(5000)
        while (notReady) {
            basic.showString("W")
            if (message != logger.none() && logger.compareBuffers(message, _ready)) {
                basic.showString("RR")
                notReady = false
                logger.sendBuffer(_ack)
                basic.showString("A")
                basic.pause(10000)
                while (waiting) {
                    basic.showString("WD")
                    basic.pause(100)
                    // Only store the data and exit the while loop if both datapoints are received
                    if (receivedTempLevel != logger.none() && receivedLightLevel != logger.none()) {
                        datalogger.log(
                        datalogger.createCV("Temperature", receivedTempLevel),
                        datalogger.createCV("Light", receivedLightLevel)
                        )
                        waiting = false
                    }
                }
            }
            notReady = false
        }
        started = false
    }
})
