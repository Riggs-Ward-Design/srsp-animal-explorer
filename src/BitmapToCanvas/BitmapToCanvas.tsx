import { useEffect, useRef } from "react";

interface BitmapToCanvasProps {
    bitmap: ImageBitmap;
    className?: string;
}

const BitmapToCanvas = (props: BitmapToCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        const dpr = window.devicePixelRatio || 1;

        const draw = () => {
            const rect = parent.getBoundingClientRect();
            const cw = Math.max(1, Math.floor(rect.width * dpr));
            const ch = Math.max(1, Math.floor(rect.height * dpr));

            if (canvas.width !== cw || canvas.height !== ch) {
                canvas.width = cw;
                canvas.height = ch;
            }

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const bw = props.bitmap.width;
            const bh = props.bitmap.height;

            const scale = Math.max(cw / bw, ch / bh);
            const dw = bw * scale;
            const dh = bh * scale;
            const dx = (cw - dw) / 2;
            const dy = (ch - dh) / 2;

            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(props.bitmap, dx, dy, dw, dh);
        };

        draw();

        const ro = new ResizeObserver(() => draw());
        ro.observe(parent);

        return () => ro.disconnect();
    }, [props.bitmap]);

    return <canvas ref={canvasRef} className={props.className} />;
};

export default BitmapToCanvas;
