import {Tween} from "./tween";

export class Timeline {
    public duration = 0;
    public defaultConfig = {
        delay: 0
    };
    onUpdateFn:any;
    pipeFn:any;

    public currentTime = 0;

    constructor(private tweens:Tween[], private config:any = {}) {
        this.config = Object.assign({}, this.defaultConfig, config);
    }

    public play(fn?: Function) {
        this.onUpdateFn = fn;

        setTimeout(this.animate.bind(this), this.config.delay);

        return this;
    }

    public pipe(fn?: Function) {

        this.pipeFn = fn;

        this.tweens.forEach((tween) => {
            tween.pipe(this.pipeFn);
        });

        return this;
    }
    
    onUpdate() {
        if(typeof this.onUpdateFn == "function") {
            this.onUpdateFn(this.tweens.map((tween) => tween.getValue()));
        }
    }

    private animate() {
        let time = 0;


        this.tweens.forEach((tween:Tween) => {
            let position = (typeof tween.config.position != "undefined" ? tween.config.position : time);

            tween.setDelay(position).play(this.onUpdate.bind(this));

            time = position + tween.duration;
        });
    }
}
