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
let message: Buffer = null
let start_sent = false
let notReady = false
let _full: Buffer = null
let _empty: Buffer = null
radio.setGroup(23)
radio.setTransmitPower(7)
_empty = logger.stringToBuffer("empty")
_full = logger.stringToBuffer("full")
let _ready = logger.stringToBuffer("ready")
let _start = logger.stringToBuffer("start")
let _ack = logger.stringToBuffer("ack")
notReady = true
while (true) {
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
            while (true) {
                if (message != logger.none() && message != _ready) {
                    receivedTempLevel = logger.storeTemp(message)
                    receivedLightLevel = logger.storeLight(message)
                    basic.showString("R")
                    datalogger.log(
                    datalogger.createCV("Temperature", receivedTempLevel),
                    datalogger.createCV("Light", receivedLightLevel)
                    )
                    break;
                }
            }
        }
        control.waitMicros(5000000)
        notReady = true
    }
}
