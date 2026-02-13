import {CSSProperties, ReactNode, useState} from "react";

interface ShimmerProps {
    children: ReactNode;
    color?: string;
    duration?: number;
    frequency?: number;
    angle?: number;
    width?: number;
    maxIterations?: number;
}

function Shimmer(props: ShimmerProps) {

    const color = props.color ?? "rgba(255, 255, 255, 0.9)";
    const duration = props.duration ?? 0.8;
    const frequency = props.frequency ?? 3;
    const angle = props.angle ?? 225;
    const width = props.width ?? 0.2;
    const maxIterations = props.maxIterations ?? Infinity;

    const keyframeName = `shimmer-${Math.random().toString(36).substr(2, 9)}`;
    const [iterations, setIterations] = useState(0);
    const shouldAnimate = iterations < maxIterations;

    const shimmerPercent = (duration / frequency) * 100;
    const startStop = Math.max(0, (0.5 - width / 2) * 100);
    const endStop = Math.min(100, (0.5 + width / 2) * 100);

    const containerStyle: CSSProperties = {
        position: "relative",
        display: "inline-block",
        background: `linear-gradient(
            ${angle}deg,
            currentColor 0%,
            currentColor ${startStop}%,
            ${color} 50%,
            currentColor ${endStop}%,
            currentColor 100%
        )`,
        backgroundSize: "400% 400%",
        backgroundPosition: "0% 0%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: shouldAnimate ? `${keyframeName} ${frequency}s linear infinite` : 'none',
        animationDelay: `${frequency}s`,
    };

    return (
        <>
            <style>
                {`
                    @keyframes ${keyframeName} {
                        0% {
                            background-position: 0% 0%;
                        }
                        ${shimmerPercent}% {
                            background-position: 100% 100%;
                        }
                        100% {
                            background-position: 100% 100%;
                        }
                    }
                `}
            </style>
            <span
                style={containerStyle}
                onAnimationIteration={() => setIterations(i => i + 1)}
            >
                {props.children}
            </span>
        </>
    );
}

export default Shimmer;