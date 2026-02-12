import './ExplorerButtonCarousel.css';
import StandardIconButton from "../rwd-library/StandardIconButton/StandardIconButton.tsx";
import ExplorerButton from "../ExplorerButton/ExplorerButton.tsx";
import type { Node, ItemNode, FolderNode } from "../_lib/dataModel.ts";
import { useEffect, useMemo, useState } from "react";
import ItemCard from "../ItemCard/ItemCard.tsx";

interface ExplorerButtonCarouselProps {
    entries: Node[];
    openFolderNode: FolderNode;
    openItemNode?: ItemNode;
    push: (label: string) => void;
    title?: string;
}

const PAGE_SIZE = 6;

const chunk = <T,>(arr: T[], size: number) => {
    const pages: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        pages.push(arr.slice(i, i + size));
    }
    return pages.length > 0 ? pages : [[]];
};

const ExplorerButtonCarousel = (props: ExplorerButtonCarouselProps) => {
    const [currentButtonsPage, setCurrentButtonsPage] = useState<number>(0);

    const pages = useMemo(() => chunk(props.entries, PAGE_SIZE), [props.entries]);
    const pageCount = pages.length;

    useEffect(() => {
        setCurrentButtonsPage(0);
    }, [props.openFolderNode]);

    useEffect(() => {
        if (!props.openItemNode) {
            return;
        }

        const index = props.entries.indexOf(props.openItemNode);
        if (index < 0) {
            return;
        }

        const targetPage = Math.floor(index / PAGE_SIZE);
        setCurrentButtonsPage(targetPage);
    }, [props.openItemNode, props.entries]);

    useEffect(() => {
        setCurrentButtonsPage(p => Math.max(0, Math.min(p, pageCount - 1)));
    }, [pageCount]);

    const canPageLeft = pageCount > 1 && currentButtonsPage > 0;
    const canPageRight = pageCount > 1 && currentButtonsPage < pageCount - 1;

    const FADE_OPACITY = 0.25;

    return (
        <div key={`carousel-${props.openFolderNode.name}`} className='carousel'>
            {props.title && (
                <h1 style={{
                    opacity: !props.openItemNode ? 1 : FADE_OPACITY,
                    transition: 'opacity 500ms'
                }}>
                    {props.title}
                </h1>
            )}

            <div className='carousel-row'>
                <div className='carousel-button-area'>
                    {canPageLeft && (
                        <StandardIconButton
                            onClick={() => setCurrentButtonsPage(p => p - 1)}
                            style={{
                                opacity: !props.openItemNode ? 1 : FADE_OPACITY,
                                pointerEvents: !props.openItemNode ? 'auto' : 'none',
                                transition: 'opacity 500ms'
                            }}
                            iconName='left-chevron'
                        />
                    )}
                </div>

                <div className='carousel-viewport'>
                    <div
                        className='carousel-track'
                        style={{transform: `translateX(${-currentButtonsPage * 100}%)`}}
                    >
                        {pages.map((page, pageIndex) => (
                            <div className='carousel-page' key={`page:${pageIndex}`}>
                                {page.map((n) => {

                                    const isOnCurrentPage = pageIndex === currentButtonsPage

                                    if (n.nodeType === 'folder') {
                                        return (
                                            <ExplorerButton
                                                className='carousel-button'
                                                key={`folder:${n.name}`}
                                                node={n}
                                                onClick={() => props.push(n.name)}
                                                style={{
                                                    opacity: isOnCurrentPage ? 1 : 0,
                                                    pointerEvents: isOnCurrentPage ? 'auto' : 'none',
                                                    transition: 'opacity 500ms'
                                                }}
                                            />
                                        );
                                    }

                                    const isOpen = props.openItemNode === n;

                                    return (
                                        <div key={`item-wrap:${n.name}`} style={{display: 'contents'}}>
                                            {/* Always render the button version in-flow; hide it when open */}
                                            {!isOpen && (
                                                <ItemCard
                                                    item={n.item}
                                                    isOpen={false}
                                                    onClick={() => props.push(n.name)}
                                                    className="carousel-button"
                                                    style={{
                                                        opacity: isOnCurrentPage ? (!props.openItemNode ? 1 : FADE_OPACITY) : 0,
                                                        pointerEvents: isOnCurrentPage ? (!props.openItemNode ? 'auto' : 'none') : 'none',
                                                        transition: 'opacity 500ms'
                                                    }}
                                                />
                                            )}

                                            {/* Placeholder to preserve grid space when open */}
                                            {isOpen && <div className="carousel-button placeholder"/>}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className='carousel-button-area'>
                    {canPageRight && (
                        <StandardIconButton
                            onClick={() => setCurrentButtonsPage(p => p + 1)}
                            style={{
                                opacity: !props.openItemNode ? 1 : FADE_OPACITY,
                                pointerEvents: !props.openItemNode ? 'auto' : 'none',
                                transition: 'opacity 500ms'
                            }}
                            iconName='right-chevron'
                        />
                    )}
                </div>
            </div>

            {/* Open card rendered at carousel level, outside the viewport */}
            {props.openItemNode && (
                <ItemCard
                    item={props.openItemNode.item}
                    isOpen={true}
                    className="carousel-open-card"
                    style={{ zIndex: 10 }}
                />
            )}
        </div>
    );
};

export default ExplorerButtonCarousel;