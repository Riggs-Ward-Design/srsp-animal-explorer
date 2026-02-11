// file: src/ItemCard/ItemCard.tsx
import './ItemCard.css';
import { Item } from "../_lib/dataContext.ts";
import { kebabCase } from "change-case";
import { imageUrls } from "../_lib/assets.ts";
import {CSSProperties, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

interface ItemCardProps {
    item: Item;
    isOpen: boolean;
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
}

const ItemCard = (props: ItemCardProps) => {

    const getImageUrl = (name: string) => {
        const imageUrl = `../_assets/content-images/${kebabCase(name)}.jpeg`
        return imageUrls[imageUrl];
    }

    const url = getImageUrl(props.item.commonName);
    const id = `item:${props.item.commonName}`;

    return (
        <motion.div
            className={props.className + " item-card"}
            style={{ ...props.style, borderRadius: "32px", overflow: "hidden" }}
            onClick={props.onClick}
            layoutId={id}
        >
            <div
                className="item-card-image"
                style={{ flexBasis: props.isOpen ? '40%' : '100%' }}
            >
                {url && <img src={url} alt={props.item.commonName} draggable={false} />}
            </div>

            <AnimatePresence initial={false} mode="popLayout">
                {props.isOpen && (
                    <motion.div
                        key="content"
                        className="item-card-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="name">
                            <h1>{props.item.commonName}</h1>
                            <span className="sci-name">{props.item.scientificName}</span>
                        </div>

                        <section className="habitat">
                            <h2>Habitat:</h2>
                            <p>{props.item.habitat}</p>
                        </section>

                        <section className="diet">
                            <h2>Diet:</h2>
                            <p>{props.item.diet}</p>
                        </section>

                        <section className="fun">
                            <h2>Fun Fact:</h2>
                            <p>{props.item.funFact}</p>
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ItemCard;