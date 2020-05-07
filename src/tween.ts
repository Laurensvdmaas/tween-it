export class Tween {
    private change:any = [];
    private defaultConfig = {
        delay: 0
    };
    private currentTime = 0;
    private timeout;
    public position;
    pipeFn;
    raf;
    progress;
    onUpdate;
    fromValues:any[] = [];
    changeValues:any[] = [];
    objKeys:any[] = [];
    completeFn;
    resolve;
    shadowObj = {};
    private startTime = 0;

    constructor(private obj, public duration, private from, private to, public config) {
        this.config = Object.assign({}, this.defaultConfig, this.config);

        this.change = this.getChange(from, to);
        this.shadowObj = Object.assign({}, this.from);

        // this.fromValues = this.buildTree(this.from, 1);
        // this.changeValues = this.buildTree(this.change, 1);
        // this.objKeys = this.buildTree(this.from, 0);
    }

    buildTree(x, i) {
        return Object.entries(x).map((arr) => {
            return typeof arr[1] === 'object' && arr[1] !== null ? this.buildTree(arr[1], i) : arr[i]
        });
    }

    private animate() {
        this.raf = requestAnimationFrame(this.animate.bind(this));
        this.currentTime = Date.now() - this.startTime;
        const progress = this.currentTime / this.duration;
        this.progress = progress < 1 ? progress : 1;

        this.shadowObj = this.loopProperties(this.from, this.change);
        
        this.onUpdate(this.cleanObj());

        if (this.currentTime >= this.duration) {
            if (this.completeFn) this.completeFn();

            if(this.resolve) this.resolve();

            this.destroy();
        }
    }

    loopProperties(from, change) {
        let obj = {};

        Object.keys(from).forEach((key, i) => {
            if(key === "type" || key === "clean") obj[key] = from[key];
            else if(typeof from[key] === 'object' && from[key] !== null ) {
                obj[key] = this.loopProperties(from[key], change[key])
            } else {
                obj[key] = from[key] + change[key] * this.config.ease(this.progress)
            }
        });

        return obj;
    }

    loopClean(obj) {
        Object.keys(obj).forEach(key => {
             if(obj[key].clean) {
                 this.obj[key] = obj[key].clean(obj[key].value)
             } else if(typeof obj[key] === 'object' && obj[key] !== null) {
                 this.obj[key] = this.loopClean(obj[key])
             } else {
                this.obj[key] = obj[key];
            }
        });

        return obj;
    }

    cleanObj() {
        let obj:any = this.shadowObj;

        this.loopClean(obj);


        if (this.pipeFn) {
            obj = JSON.parse(JSON.stringify(obj.map(this.pipeFn)));
        }

        return obj;
    }

    getValue() {
        return this.cleanObj();
    }


    public setDelay(time: Number) {
        this.config.delay = time;

        return this;
    }

    public pipe(pipe: Function) {
        this.pipeFn = pipe;

        return this;
    }

    toPromise() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    }

    private getChange(from, to, debug = false) {
        let x = {};

        Object.keys(from).forEach((key:string) => {
            if(typeof to[key] === "function" || typeof to[key] === "string") {
                x[key] = from[key];
            } else if(typeof to[key] === 'object' && to[key] !== null) {
                x[key] = this.getChange(from[key], to[key]);
            } else {
                x[key] = to[key] - from[key];
            }

        });


        return x;
    }

    public complete(fn: Function) {
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
        Object.keys(this.from).forEach((key: string) => {
            this.obj[key] = this.from[key];
            this.play();
        });


        return this;
    }

    public setTime(time) {
        this.currentTime = time;

        return this;
    }

    destroy(){cancelAnimationFrame(this.raf)};
}
