/**
 * Created by Will on 1/21/2026
 */

import './ExplorerButtonCarousel.css';
import StandardIconButton from "../rwd-library/StandardIconButton/StandardIconButton.tsx";
import {getBitmap, imageUrls} from "../_lib/assets.ts";
import ExplorerButton from "../ExplorerButton/ExplorerButton.tsx";
import {useEffect, useState} from "react";
import {ExplorerEntry} from "../_lib/useDataContext.ts";
import {kebabCase} from "change-case";

interface ExplorerButtonCarouselProps {
    entries: ExplorerEntry[];
    push: (label: string) => void
}

const ExplorerButtonCarousel = ({entries, push}: ExplorerButtonCarouselProps) => {

    const [currentButtonsPage, setCurrentButtonsPage] = useState<number>(0);

    useEffect(() => setCurrentButtonsPage(0), [entries])

    const canPageLeft = entries.length > 6 && currentButtonsPage > 0;
    const canPageRight = entries.length > 6 && currentButtonsPage < ((entries.length / 6) - 1);

    const getImageUrl = (name: string) => {
        const imageUrl = `../_assets/content-images/${kebabCase(name)}.jpeg`
        return imageUrls[imageUrl];
    }

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
                {page.map(e => {
                    const url = e.kind === "item" ? getImageUrl(e.name) : undefined;
                    const bmp = url ? getBitmap(url) : undefined;
                    return (
                        <ExplorerButton
                            key={e.name}
                            label={e.kind === "folder" ? e.name : bmp ? undefined : e.name}
                            bitmap={bmp}
                            onClick={() => push(e.name)}
                        />
                    );
                })}

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