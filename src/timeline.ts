import {Tween} from "./tween";

export class Timeline {
    public duration = 0;
    public defaultConfig = {
        delay: 0
    };
    onUpdate;
    pipeFn;

    public currentTime = 0;

    constructor(private tweens:Tween[], private config:any = {}) {
        this.config = Object.assign({}, this.defaultConfig, config);
    }

    public play(fn) {
        this.onUpdate = fn;

        setTimeout(this.animate.bind(this), this.config.delay);

        return this;
    }

    public pipe(fn) {

        this.pipeFn = fn;

        return this;
    }

    private animate() {
        let time = 0;

        this.tweens.forEach((tween:Tween) => {
            let position = tween.config.position || time;

            tween.setDelay(position).pipe(this.pipeFn).play(this.onUpdate);

            time = position + tween.duration;
        });
    }
}