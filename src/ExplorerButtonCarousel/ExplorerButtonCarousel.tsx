/**
 * Created by Will on 1/21/2026
 */

import './ExplorerButtonCarousel.css';
import StandardIconButton from "../rwd-library/StandardIconButton/StandardIconButton.tsx";
import ExplorerButton from "../ExplorerButton/ExplorerButton.tsx";
import type { Node } from "../_lib/dataContext";
import {useEffect, useState} from "react";

interface ExplorerButtonCarouselProps {
    entries: Node[];
    push: (label: string) => void
}

const ExplorerButtonCarousel = ({entries, push}: ExplorerButtonCarouselProps) => {

    const [currentButtonsPage, setCurrentButtonsPage] = useState<number>(0);

    useEffect(() => setCurrentButtonsPage(0), [entries])

    const canPageLeft = entries.length > 6 && currentButtonsPage > 0;
    const canPageRight = entries.length > 6 && currentButtonsPage < ((entries.length / 6) - 1);

    const page = entries.slice((currentButtonsPage) * 6, (currentButtonsPage + 1) * 6);

    return (
        <div className='carousel'>

            <div className='carousel-button-area'>
                {canPageLeft && <StandardIconButton
                    onClick={() => setCurrentButtonsPage(p => p - 1)}
                    iconName='left-chevron'
                />}
            </div>

            <div className='carousel-page'>
                {page.map(n =>
                    <ExplorerButton
                        key={n.name}
                        node={n}
                        onClick={() => push(n.name)}
                    />
                )}

                {/* Spacing */}
                {entries.length > 6 && Array.from({ length: (6 - (page.length % 6)) % 6 }).map(() => <ExplorerButton/>)}

            </div>

            <div className='carousel-button-area'>
                {canPageRight && <StandardIconButton
                    onClick={() => setCurrentButtonsPage(p => p + 1)}
                    iconName='right-chevron'
                />}
            </div>

        </div>
    )
};

export default ExplorerButtonCarousel;