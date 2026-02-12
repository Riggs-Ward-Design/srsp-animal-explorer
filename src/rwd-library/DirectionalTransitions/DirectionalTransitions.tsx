import {AnimatePresence, motion, useIsPresent, type Variants} from "framer-motion";
import {type ReactNode, useRef, useState} from "react";

type TransitionType =
      'fade'
    | 'fadePushLeft'
    | 'fadePushRight'
    | 'fadePushUp'
    | 'fadePushDown'
    | 'fadePushIn'
    | 'fadePushOut'
    ;

export type Coords3D = {
    x?: number;
    y?: number;
    z?: number;
}

export type TransitionOptions = {
    lateralDistance?: string;
    depthScale?: number;
    duration?: number;
}

interface DirectionalTransitionsProps {
    children?: ReactNode | undefined
    currentPosition: Coords3D
    options?: TransitionOptions
}

const createVariantsByType = (options: TransitionOptions | undefined) => {
    const lateralDistance = options?.lateralDistance ?? "10%";
    const depthScale = options?.depthScale ?? 1.25;
    const duration = (options?.duration ?? 0.5) / 2;

    const inTransition = {duration: duration, delay: duration * 0.9, ease: "easeOut"};
    const outTransition = {duration: duration, ease: "easeIn"};

    return {
        fade: {
            initial: {opacity: 0},
            animate: {opacity: 1, transition: inTransition},
            exit:    {opacity: 0, transition: outTransition},
        },
        fadePushRight: {
            initial: {opacity: 0, x: lateralDistance},
            animate: {opacity: 1, x: "0%", transition: inTransition},
            exit:    {opacity: 0, x: "-" + lateralDistance, transition: outTransition},
        },
        fadePushLeft: {
            initial: {opacity: 0, x: "-" + lateralDistance},
            animate: {opacity: 1, x: "0%", transition: inTransition},
            exit:    {opacity: 0, x: lateralDistance, transition: outTransition},
        },
        fadePushUp: {
            initial: {opacity: 0, y: "-" + lateralDistance},
            animate: {opacity: 1, y: "0%", transition: inTransition},
            exit:    {opacity: 0, y: lateralDistance, transition: outTransition},
        },
        fadePushDown: {
            initial: {opacity: 0, y: lateralDistance},
            animate: {opacity: 1, y: "0%", transition: inTransition},
            exit:    {opacity: 0, y: "-" + lateralDistance, transition: outTransition},
        },
        fadePushIn: {
            initial: {opacity: 0, scale: 1.0 / depthScale,},
            animate: {opacity: 1, scale: 1.0, transition: inTransition},
            exit:    {opacity: 0, scale: depthScale, transition: outTransition},
        },
        fadePushOut: {
            initial: {opacity: 0, scale: depthScale,},
            animate: {opacity: 1, scale: 1.0, transition: inTransition},
            exit:    {opacity: 0, scale: 1.0 / depthScale, transition: outTransition},
        },
    };
}

function getTransitionTypeFromPositions(prev: Coords3D, current: Coords3D): TransitionType {
    prev.x ??= 0; prev.y ??= 0; prev.z ??= 0; current.x ??= 0; current.y ??= 0; current.z ??= 0;
    if (current.x > prev.x && current.y === prev.y && current.z === prev.z) return 'fadePushRight';
    if (current.x < prev.x && current.y === prev.y && current.z === prev.z) return 'fadePushLeft';
    if (current.y > prev.y && current.x === prev.x && current.z === prev.z) return 'fadePushUp';
    if (current.y < prev.y && current.x === prev.x && current.z === prev.z) return 'fadePushDown';
    if (current.z > prev.z && current.x === prev.x && current.y === prev.y) return 'fadePushIn';
    if (current.z < prev.z && current.x === prev.x && current.y === prev.y) return 'fadePushOut';
    return 'fade';
}

const DirectionalTransitions = ({children, currentPosition, options}: DirectionalTransitionsProps)=> {

    const [clickable, setClickable] = useState<boolean>(true);
    const isPresent = useIsPresent();

    const pos = currentPosition;

    const variants = {
        initial: (t: TransitionType) => createVariantsByType(options)[t].initial,
        animate: (t: TransitionType) => createVariantsByType(options)[t].animate,
        exit:    (t: TransitionType) => createVariantsByType(options)[t].exit,
    } as Variants;

    const prevPositionRef = useRef<Coords3D>(currentPosition);
    const transitionTypeRef = useRef<TransitionType>('fade');

    const posKey = `${currentPosition.x},${currentPosition.y},${currentPosition.z}`;
    const prevKey = `${prevPositionRef.current.x},${prevPositionRef.current.y},${prevPositionRef.current.z}`;

    if (posKey !== prevKey) {
        transitionTypeRef.current = getTransitionTypeFromPositions(prevPositionRef.current, currentPosition);
        prevPositionRef.current = currentPosition;
    }

    const transitionType = transitionTypeRef.current;

    return (
        <AnimatePresence mode='popLayout' custom={transitionType}>
            <motion.div
                key={`panel-${pos.x},${pos.y},${pos.z}`}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    pointerEvents: clickable ? "auto" : "none"
                }}

                variants={variants}
                custom={transitionType}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}

                onAnimationStart={() => {
                    setClickable(false);
                }}

                onAnimationComplete={() => {
                    if (isPresent) setClickable(true);
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default DirectionalTransitions