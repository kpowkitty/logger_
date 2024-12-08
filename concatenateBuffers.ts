namespace logger {
    //% block
    export function concatenateBuffers(buf1: Buffer, buf2: Buffer): Buffer {
        return Buffer.concat([buf1, buf2]);
    }
}