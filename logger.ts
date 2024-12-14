namespace logger {
    //% block
    export function none(): null {
        return null
    }

    //% block
    export function concatenateBuffers(buf1: Buffer, buf2: Buffer): Buffer {
        return Buffer.concat([buf1, buf2]);
    }

    //% block
    export function compareBuffers(buf1: Buffer, buf2: Buffer): boolean {
        if (buf1.length != buf2.length) {
            return false;
        }

        for (let i = 0; i < buf1.length; i++) {
            if (buf1.getUint8(i) != buf2.getUint8(i)) {
                return false;
            }
        }
        return true;
    }

	//% block
    export function bufferToString(buff: Buffer): string {
        let str = buff.toString();
        return str
    }

    //% block
    export function storeData(temp: string, light: string): { Temperature: number; Light: number } {
        const data: { Temperature: number; Light: number } = {
            Temperature: 0,
            Light: 0
        };
        const KEY_SIZE = 5;

        const ktemp = "temp ";
        const klight = "light";

        // XXX Returns empty / partially filled data if error
        if (temp.slice(0, KEY_SIZE) !== ktemp) {
            basic.showString("Assertion failed:");
            basic.showString("dtemp[:KEY_SIZE]:" + temp.slice(0, KEY_SIZE));
            return data;
        }
        data.Temperature = Math.round(parseInt(temp.slice(KEY_SIZE)) * 1.8) + 32;

        if (light.slice(0, KEY_SIZE) !== klight) {
            basic.showString("Assertion failed:");
            basic.showString("dlight[:KEY_SIZE]:" + light.slice(0, KEY_SIZE));
            return data;
        }
        data.Light = parseInt(light.slice(KEY_SIZE));

        return data;
    }
    
	//% block
    export function stringToBuffer(str: string): Buffer {
        return Buffer.fromUTF8(str);
    }
}
