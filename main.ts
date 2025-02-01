datalogger.onLogFull(function () {
    full = true
    while (full) {
        logger.sendBuffer(_full)
        basic.showString("F")
        if (input.buttonIsPressed(Button.A)) {
            logger.sendBuffer(_empty)
            control.reset()
        }
    }
})
radio.onReceivedBuffer(function (receivedBuffer) {
    if (logger.parseIncomingData(receivedBuffer) == 0) {
        loggerAbstracted.logTemperature(receivedBuffer)
    } else if (logger.parseIncomingData(receivedBuffer) == 1) {
        loggerAbstracted.logLight(receivedBuffer)
    } else {
        message = receivedBuffer
    }
})
let full = false
let message: Buffer = null
message = logger.none()
let receivedTempLevel: string = logger.none()
let receivedLightLevel: string = logger.none()
radio.setGroup(23)
radio.setTransmitPower(7)
while (true) {
    if (!(loggerAbstracted.startedYet())) {
        continue;
    }
    loggerAbstracted.waitForReady()
    loggerAbstracted.waitForData()
    if (!(loggerAbstracted.waitingForData())) {
        loggerAbstracted.storeData()
    }
    loggerAbstracted.resetVariables()
}
