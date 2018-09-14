import {easings} from "./easings";
import {Tween} from "./tween";
import {Timeline} from "./timeline";

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

        if (!(obj instanceof Array)) {
            obj = [obj];
        }

        let from = this.getFrom(obj, to);

        
        let tween = new Tween(obj, duration, from, to, Object.assign({}, this.config, config));

        this.tweens[this.generateUID()] = tween;

        return tween;
    }

    private getFrom(obj, to) {
        let from = [];

        obj.forEach((_obj) => {
            let x = {};

            Object.keys(to).forEach((key) => {
                x[key] = (_obj[key] || 0);
            });

            from.push(x);
        });

        return from;
    }

    public timeline(tweens:any[], config = {}):Timeline {
        return new Timeline(tweens, config);
    }

    private generateUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
}