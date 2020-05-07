import * as BezierEasing from "bezier-easing";

type BezierEasing = () => any;

const bezierEasing:any = BezierEasing;

export const easings:any = {
    cubicBezier: bezierEasing,
    ease: bezierEasing(0.25, 0.1, 0.25, 1.0),
    linear: bezierEasing(0.00, 0.0, 1.00, 1.0),
    easeIn: bezierEasing(0.42, 0.0, 1.00, 1.0),
    easeOut: bezierEasing(0.00, 0.0, 0.58, 1.0),
    easeInOut: bezierEasing(0.42, 0.0, 0.58, 1)
};
