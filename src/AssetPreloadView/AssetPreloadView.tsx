import { getAllUrls } from "../_lib/assets.ts";

const AssetPreloadView = () => {

    const urls = getAllUrls();

    return <>
        {urls.map((url) => <img src={url} style={{ width: 0, height: 0 }} alt={''}/>)}
    </>
}

export default AssetPreloadView;