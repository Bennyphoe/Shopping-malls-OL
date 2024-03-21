import { useEffect } from "react"
import Map from 'ol/Map.js'
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import 'ol/ol.css'; 

export const useOpenLayers = () => {
    useEffect(() => {
        const map = new Map(
            {
                view: new View({
                    center: [0, 0],
                    zoom: 0
                }),
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                target: 'ol-map'
            }
        );
        return () => map.setTarget(null)
    }, [])
}