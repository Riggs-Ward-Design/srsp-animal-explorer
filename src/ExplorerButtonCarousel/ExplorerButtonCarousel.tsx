/**
 * Created by Will on 1/21/2026
 */

import './ExplorerButtonCarousel.css';
import StandardIconButton from "../rwd-library/StandardIconButton/StandardIconButton.tsx";
import ExplorerButton from "../ExplorerButton/ExplorerButton.tsx";
import type {Node, ItemNode, FolderNode} from "../_lib/dataContext";
import { useEffect, useState } from "react";
import ItemCard from "../ItemCard/ItemCard.tsx";

interface ExplorerButtonCarouselProps {
    entries: Node[];
    openFolderNode: FolderNode;
    openItemNode?: ItemNode;
    push: (label: string) => void
    title?: string;
}

const ExplorerButtonCarousel = (props: ExplorerButtonCarouselProps) => {

    const [currentButtonsPage, setCurrentButtonsPage] = useState<number>(0);

    useEffect(() => setCurrentButtonsPage(0), [props.openFolderNode])

    const canPageLeft = props.entries.length > 6 && currentButtonsPage > 0;
    const canPageRight = props.entries.length > 6 && currentButtonsPage < ((props.entries.length / 6) - 1);

    const page = props.entries.slice((currentButtonsPage) * 6, (currentButtonsPage + 1) * 6);

    const FADE_OPACITY = 0.25;

    return <>
        <div className='carousel'>

            {props.title && (
                <h1 style={{
                    opacity: !props.openItemNode ? 1 : FADE_OPACITY,
                    transition: 'opacity 500ms'
                }}>
                    {props.title}
                </h1>
            )}

            <div style={{display: 'flex', width: '100%'}}>

                <div className='carousel-button-area'>
                    {canPageLeft && <StandardIconButton
                        onClick={() => setCurrentButtonsPage(p => p - 1)}
                        style={{
                            opacity:       !props.openItemNode ? 1 : FADE_OPACITY,
                            pointerEvents: !props.openItemNode ? 'auto' : 'none',
                            transition: 'opacity 500ms'
                        }}
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

                        const isOpen = props.openItemNode === n;
                        return (
                            <>
                                <ItemCard
                                    key={n.name}
                                    item={n.item}
                                    isOpen={isOpen}
                                    onClick={() => props.push(n.name)}
                                    className={`carousel-${isOpen ? "open-card" : "button"}`}
                                    style={{
                                        opacity:       isOpen || !props.openItemNode ? 1 : FADE_OPACITY,
                                        pointerEvents: isOpen || !props.openItemNode ? 'auto' : 'none',
                                        zIndex:        isOpen ? 10 : 0,
                                        transition: 'opacity 500ms, z-index 500ms'
                                    }}
                                />

                                {isOpen && (
                                    <div className="carousel-button placeholder" />
                                )}
                            </>
                        );
                        }
                    )}

                </div>

                <div className='carousel-button-area'>
                    {canPageRight && <StandardIconButton
                        onClick={() => setCurrentButtonsPage(p => p + 1)}
                        style={{
                            opacity:       !props.openItemNode ? 1 : FADE_OPACITY,
                            pointerEvents: !props.openItemNode ? 'auto' : 'none',
                            transition: 'opacity 500ms'
                        }}
                        iconName='right-chevron'
                    />}
                </div>

            </div>
        </div>
    </>
};

export default ExplorerButtonCarousel;