namespace logger {
    //% block
    export function stringToBuffer(str: string): Buffer {
        return Buffer.fromUTF8(str);
    }
}