namespace logger {
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
}