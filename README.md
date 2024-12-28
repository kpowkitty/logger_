# Coding for Conservation
## Micro:bit program for tracking light and temperature in native bee hives
### Used in combination with [Sensor](https://github.com/kpowkitty/sensor_)

#### About
[Planet Bee Foundation](https://www.planetbee.org/) is programming [BBC Micro:bits](https://microbit.org/) with [Microsoft's Makecode](https://makecode.microbit.org/) in order to bring conservation efforts to student's classrooms across America!
This program, __a WIP__, is being designed in combination with a Sensor script, so there will be one Micro:bit on the native bee home collecting the datapoints (the "Sensor"), and another Micro:bit within its bluetooth range that stores the data away from the nest, so the user can safely retrieve it without disturbing the home (the "Logger").

#### How to use
1. Open this project in makecode following the __edit this project__ below
2. Download the hex file (bottom left corner)
3. Put the file on your Micro:bit
4. __Must be used with [Sensor](https://github.com/kpowkitty/sensor_) on another Micro:bit__

Once you have both Micro:bits set up, press "A+B" on your Logger chip. It sends the start signal to the sensor chip.
You can leave them alone, and they will record until the logs are full. Right now, it is logging every 10 minutes, but that can be adjusted.

#### To adjust the logging time:
There are three points that need to be changed. (1) the watchdog timer, in seconds (2) the waits at the end of each script, in microseconds
<br>
- I have it set so the sensor restarts its cycle slightly faster than the logger to ensure it's prepared and ready to send data before the Logger restarts its cycle.
- __NOTE__: If you make the logging time really quick, the chips are bound to get off cycle, as there are sometimes delays, and sometimes the messages are not received properly. I have set up error handling for that, but it is __not__ perfect. Our project wants minimal logging.

#### To collect the data:
1. Plug your Logger Micro:bit into a computer.
2. Locate your Micro:bit drive.
3. Open the "MY_DATA.HTM" file in your browser.
4. Download the csv file.
5. IF you left them on and cycling, and want to restart their cycles, press "A" on the Logger.

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/kpowkitty/logger_** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/kpowkitty/logger_** and click import
