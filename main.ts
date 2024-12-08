datalogger.onLogFull(function () {
    while (true) {
        radio.sendString("" + (_full))
        basic.showString("F")
        if (input.buttonIsPressed(Button.A)) {
            radio.sendString("" + (_empty))
            break;
        }
    }
})
radio.onReceivedString(function (receivedString) {
    message = logger.stringToBuffer(receivedString)
})
let light2: Buffer = null
let temp: Buffer = null
let message: Buffer = null
let start_sent = false
let _empty: Buffer = null
let _full: Buffer = null
let _ready = logger.stringToBuffer("ready")
radio.setGroup(23)
radio.setTransmitPower(7)
let _start = logger.stringToBuffer("start")
let _ack = logger.stringToBuffer("ack")
_full = logger.stringToBuffer("full")
_empty = logger.stringToBuffer("empty")
while (true) {
    if (!(start_sent)) {
        if (input.buttonIsPressed(Button.AB)) {
            radio.sendString("" + (_start))
            start_sent = true
        }
    } else {
        continue;
    }
    control.waitMicros(5000000)
    if (message && logger.compareBuffers(message, _ready)) {
        radio.sendString("" + (_ack))
        basic.showString("A")
        control.waitMicros(5000000)
        temp = message
        light2 = message
        basic.showString("R")
        datalogger.log(
        datalogger.createCV("Temperature", temp),
        datalogger.createCV("Light", light2)
        )
    }
    control.waitMicros(5000000)
}
