namespace logger {
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
}