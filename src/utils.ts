export const utils = {
    normalizeTime: (timeInSec: number) => {
        return timeInSec * 1000;
    },
    componentToHex: (c) => {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: (r, g, b) => {
        return "#" + utils.componentToHex(r) + utils.componentToHex(g) + utils.componentToHex(b);
    },
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};


