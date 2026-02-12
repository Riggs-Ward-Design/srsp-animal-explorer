import './ItemCard.css';
import { Item } from "../_lib/dataModel.ts";
import {CSSProperties, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {findUrl, imageUrls, thumbUrls} from "../_lib/assets.ts";

interface ItemCardProps {
    item: Item;
    isOpen: boolean;
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
}

const ItemCard = (props: ItemCardProps) => {

    const thumbUrl = findUrl(thumbUrls, props.item.commonName);
    const fullImageUrl = findUrl(imageUrls, props.item.commonName);
    const id = `item:${props.item.commonName}`;

    const [fullLoaded, setFullLoaded] = useState(false);
    const [animDone, setAnimDone] = useState(false);

    useEffect(() => {
        if (!props.isOpen || !fullImageUrl) return;
        setFullLoaded(false);
        setAnimDone(false);
        const img = new Image();
        img.src = fullImageUrl;
        img.decode().then(() => setFullLoaded(true)).catch(() => {});
    }, [props.isOpen, fullImageUrl]);

    const showFull = props.isOpen && fullLoaded && animDone;

    const imageContent = (open: boolean) => (
        <motion.div
            layoutId={'image-' + id}
            style={{ borderRadius: '32px', overflow: 'hidden', flexBasis: !open ? '100%' : '40%'}}
        >
            {fullImageUrl && <img
                src={showFull ? fullImageUrl : thumbUrl}
                alt={props.item.commonName}
                draggable={false}
            />}
        </motion.div>
    );

    return (
        <motion.div
            className={props.className + " item-card"}
            style={{ ...props.style, borderRadius: "32px", overflow: "hidden" }}
            onClick={props.onClick}
            layoutId={id}
            onLayoutAnimationComplete={() => setAnimDone(true)}
        >
            {!props.isOpen && imageContent(false)}
            {props.isOpen && imageContent(true)}

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