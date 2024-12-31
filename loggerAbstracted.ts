namespace loggerAbstracted {
    //% block
    export function requestRescue() {
        let error = "Timeout"
        datalogger.log(datalogger.createCV("Error", error))
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
        control.waitMicros(600000000)
    }

    
}