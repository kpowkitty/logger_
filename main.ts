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
radio.onReceivedBuffer(function (buff) {
    message = buff
})
let receivedLightLevel = ""
let receivedTempLevel = ""
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
    while (started) {
        if (!(start_sent)) {
            if (input.buttonIsPressed(Button.AB)) {
                logger.sendBuffer(_start)
                start_sent = true
            } else {
                continue;
            }
        }
        basic.showString("SS")
        control.waitMicros(5000000)
        while (notReady) {
            basic.showString("W")
            if (message != logger.none() && logger.compareBuffers(message, _ready)) {
                basic.showString("RR")
                notReady = false
                logger.sendBuffer(_ack)
                basic.showString("A")
                control.waitMicros(5000000)
                while (waiting) {
                    if (message != logger.none() && !(logger.compareBuffers(message, _ready))) {
                        receivedTempLevel = logger.storeTemp(message)
                        receivedLightLevel = logger.storeLight(message)
                        basic.showString("R")
                        datalogger.log(
                        datalogger.createCV("Temperature", receivedTempLevel),
                        datalogger.createCV("Light", receivedLightLevel)
                        )
                        waiting = false
                    }
                }
            }
            control.waitMicros(5000000)
            notReady = false
        }
        started = false
    }
})
