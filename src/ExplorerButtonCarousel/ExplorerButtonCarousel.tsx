/**
 * Created by Will on 1/21/2026
 */

import './ExplorerButtonCarousel.css';
import StandardIconButton from "../rwd-library/StandardIconButton/StandardIconButton.tsx";
import ExplorerButton from "../ExplorerButton/ExplorerButton.tsx";
import type { Node, ItemNode } from "../_lib/dataContext";
import { useEffect, useState } from "react";
import ItemCard from "../ItemCard/ItemCard.tsx";

interface ExplorerButtonCarouselProps {
    entries: Node[];
    openItemNode?: ItemNode;
    push: (label: string) => void
    title?: string;
}

const ExplorerButtonCarousel = (props: ExplorerButtonCarouselProps) => {

    const [currentButtonsPage, setCurrentButtonsPage] = useState<number>(0);

    useEffect(() => setCurrentButtonsPage(0), [props.entries])

    const canPageLeft = props.entries.length > 6 && currentButtonsPage > 0;
    const canPageRight = props.entries.length > 6 && currentButtonsPage < ((props.entries.length / 6) - 1);

    const page = props.entries.slice((currentButtonsPage) * 6, (currentButtonsPage + 1) * 6);

    return <>
        <div
            className='carousel'
            style={{ opacity: !props.openItemNode ? 1 : 0.25, pointerEvents: !props.openItemNode ? 'auto' : 'none'}}>

            {props.title && <h1>{props.title}</h1>}

            <div style={{display: 'flex', width: '100%'}}>

                <div className='carousel-button-area'>
                    {canPageLeft && <StandardIconButton
                        onClick={() => setCurrentButtonsPage(p => p - 1)}
                        iconName='left-chevron'
                    />}
                </div>

                <div className='carousel-page'>
                    {page.map(n => {

                            if (n.nodeType === 'folder') return (
                                <ExplorerButton
                                    className='carousel-button'
                                    key={n.name}
                                    node={n}
                                    onClick={() => props.push(n.name)}
                                />
                            );

                            // Spacer for open item
                            if (props.openItemNode === n) return (
                                <ExplorerButton className='carousel-button'/>
                            );

                            return (
                                <ItemCard
                                    item={n.item}
                                    isOpen={false}
                                    onClick={() => props.push(n.name)}
                                    className='carousel-button'
                                />
                            );
                        }
                    )}

                    {/* Spacing */}
                    {props.entries.length > 6 && Array.from({length: (6 - (page.length % 6)) % 6}).map(() =>
                        <ExplorerButton/>)}

                </div>

                <div className='carousel-button-area'>
                    {canPageRight && <StandardIconButton
                        onClick={() => setCurrentButtonsPage(p => p + 1)}
                        iconName='right-chevron'
                    />}
                </div>

            </div>
        </div>

        {/*Open item card in front */}
        {props.openItemNode && (
            <ItemCard
                item={props.openItemNode.item}
                className='carousel-open-card'
                isOpen={true}
            />
        )}
    </>
};

export default ExplorerButtonCarousel;