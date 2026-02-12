/**
 * Created by Will on 2/12/2026
 */

import ExplorerView from "../ExplorerView/ExplorerView";
import AttractScreen from "../AttractScreen/AttractScreen.tsx";
import {useIdleTimer} from "react-idle-timer";
import {useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

interface MainViewProps {
    flipped?: boolean;
}

function MainView(props: MainViewProps) {

    const [isActive, setIsActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useIdleTimer({
        element: containerRef.current ?? undefined,
        onIdle: () => setIsActive(false),
        onAction: () => setIsActive(true),
        timeout: 5 * 1000,
    })

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: "100%",
                height: "100%",
                rotate: props.flipped ? "180deg" : "0deg",
            }}
        >
            <AttractScreen />
            <AnimatePresence>
                {isActive && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                        >
                            <ExplorerView onReset={() => setIsActive(false)}/>
                        </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default MainView;
