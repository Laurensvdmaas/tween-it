import * as BezierEasing from "bezier-easing";

export const easings:any = {
    cubicBezier: BezierEasing,
    ease: BezierEasing(0.25, 0.1, 0.25, 1.0),
    linear: BezierEasing(0.00, 0.0, 1.00, 1.0),
    easeIn: BezierEasing(0.42, 0.0, 1.00, 1.0),
    easeOut: BezierEasing(0.00, 0.0, 0.58, 1.0),
    easeInOut: BezierEasing(0.42, 0.0, 0.58, 1)
};