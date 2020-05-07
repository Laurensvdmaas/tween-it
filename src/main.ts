import {easings} from "./easings";
import {Tween} from "./tween";
import {Timeline} from "./timeline";
import {utils} from "./utils";

export class TweenIt { 
    private tweens = {};

    private defaultConfig:any = {
        ease: easings.linear,
        delay: 0
    };

    constructor(private config = {}) {
        this.config = Object.assign({}, this.defaultConfig, this.config);
    }

    public to(obj, duration, to, config = {}):Tween {
        let from = this.getFrom(obj, to),
            _to = this.getFrom(to, obj);

        
        return new Tween(obj, duration, from, _to, Object.assign({}, this.config, config));
    }

    private getFrom(obj, to) {
        let x = {};

        Object.keys(to).forEach((key) => {
            const value = obj[key];


            if(!isNaN(value)) x[key] = (value || 0);
            if(typeof value === "string" && value[0] === "#") {
                x[key] = {
                    value: utils.hexToRgb(value),
                    clean: (val) => {

                        return utils.rgbToHex(parseInt(val.r), parseInt(val.g), parseInt(val.b));
                    }
                }
            }
        });

        return x;
    }

    public timeline(tweens:any[], config = {}):Timeline {
        return new Timeline(tweens, config);
    }
}
