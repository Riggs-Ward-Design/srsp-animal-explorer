/**
 * Created by Will on 1/28/2026
 */

import './ItemView.css';
import {Item} from "../_lib/dataContext.ts";
import {kebabCase} from "change-case";
import {getBitmap, imageUrls} from "../_lib/assets.ts";
import BitmapToCanvas from "../BitmapToCanvas/BitmapToCanvas.tsx";

interface ItemViewProps {
    item: Item;
}

const ItemView = ({item}: ItemViewProps) => {

    const getImageUrl = (name: string) => {
        const imageUrl = `../_assets/content-images/${kebabCase(name)}.jpeg`
        return imageUrls[imageUrl];
    }
    const url = getImageUrl(item.commonName);
    const bmp = url ? getBitmap(url) : undefined;

    return (
        <div className="item-view rounded">

            <div className={'item-view-image rounded'}>
                {bmp && <BitmapToCanvas bitmap={bmp}/>}
            </div>

            <div className={'item-view-content'}>

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

export default ItemView;