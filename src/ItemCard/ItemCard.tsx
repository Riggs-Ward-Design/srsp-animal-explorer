/**
 * Created by Will on 1/28/2026
 */

import './ItemCard.css';
import {Item} from "../_lib/dataContext.ts";
import {kebabCase} from "change-case";
import { imageUrls } from "../_lib/assets.ts";

interface ItemCardProps {
    item: Item;
}

const ItemCard = ({item}: ItemCardProps) => {

    const getImageUrl = (name: string) => {
        const imageUrl = `../_assets/content-images/${kebabCase(name)}.jpeg`
        return imageUrls[imageUrl];
    }
    const url = getImageUrl(item.commonName);

    return (
        <div className="item-card rounded">

            <div className={'item-card-image rounded'}>
                {url && <img src={url}/>}
            </div>

            <div className={'item-card-content'}>

                <div className="name">
                    <h1>{item.commonName}</h1>
                    <span className="sci-name">{item.scientificName}</span>
                </div>

                <section className="habitat">
                    <h2>Habitat:</h2>
                    <p>{item.habitat}</p>
                </section>

                <section className="diet">
                    <h2>Diet:</h2>
                    <p>{item.diet}</p>
                </section>

                <section className="fun">
                    <h2>Fun Fact:</h2>
                    <p>{item.funFact}</p>
                </section>

            </div>

        </div>
    );
};

export default ItemCard;