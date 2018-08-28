class Tween {
    private change = {};
    private defaultConfig = {
        position: 0,
        delay: 0
    };
    private currentTime = 0;
    private timeout;
    public position;
    pipeFn;
    raf;
    onUpdate;
    completeFn;
    private startTime = 0;

    constructor(private obj:Object[], public duration, private from:Object[], private to, public config) {
        this.config = Object.assign({}, this.defaultConfig, this.config);

        this.change = this.getChange();

    }

    private animate() {
        this.raf = requestAnimationFrame(this.animate.bind(this));
        this.currentTime = Date.now() - this.startTime;
        this.loopProperties();

        this.onUpdate(this.cleanObj());

        if (this.currentTime > this.duration) {
            this.loopProperties();

            if (this.completeFn) {
                this.completeFn();
            }

            cancelAnimationFrame(this.raf);
        }
    }

    cleanObj() {
        let obj:any = this.obj;

        if(this.pipeFn) {
            obj = JSON.parse(JSON.stringify(obj.map(this.pipeFn)));
        }

        if(obj.length == 1) {
            obj = obj[0];
        }

        return obj;
    }

    loopProperties() {
        this.obj.forEach((obj, i) => {
            Object.keys(this.from[i]).forEach((key) => {
                obj[key] = this.config.ease(this.currentTime, this.from[i][key], this.change[i][key], this.duration);
            });
        });
    }

    public setDelay(time) {
        this.config.delay = time;

        return this;
    }

    public pipe(pipe) {
        this.pipeFn = pipe;

        return this;
    }

    private getChange() {
        let change = [];

        this.obj.forEach((_obj, i) => {
            let obj = {};

            Object.keys(this.from[i]).forEach((key) => {
                obj[key] = this.to[key] - this.from[i][key];
            });

            change.push(obj);
        });

        return change;
    }

    public complete(fn) {
        this.completeFn = fn;

        return this;
    }


    public play(callback:any = () => {
    }) {
        setTimeout(() => {
            this.startTime = Date.now();
            this.onUpdate = callback;

            this.animate();
        }, this.config.delay);

        return this;
    }

    public pause() {
        clearTimeout(this.timeout);
        return this;
    }

    public restart() {
        Object.keys(this.from).forEach((key) => {
            this.obj[key] = this.from[key];
            this.play();
        });


        return this;
    }

    public setTime(time) {
        this.currentTime = time;

        return this;
    }
}