import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Vector, VectorTile } from 'ol/layer';
import apply from 'ol-mapbox-style';
import VectorSource from 'ol/source/Vector.js'
import GeoJSON from 'ol/format/GeoJSON.js';
import shoppingMalls from './shoppingMalls.geojson'
import VectorTileSource from 'ol/source/VectorTile.js';
import MVT from 'ol/format/MVT.js';
import { Collection, Feature } from 'ol';
import { Geometry, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';


export const useOpenLayers = () => {
    const [olMap, setOlMap] = useState<Map>()
    const mapRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const map = new Map(
            {
              view: new View({
                  center: [0, 0],
                  zoom: 0,
              }),
              target: mapRef.current as HTMLElement,
            }
        )
        map.on('click', e => {
            const features = map.getFeaturesAtPixel(e.pixel)
            console.log(features)
        })
        apply(map, 'https://api.maptiler.com/maps/10acd558-91af-43db-846f-44edd252befb/style.json?key=exzLn9YZ8tTAzRR3fhHZ').then(map => {
            setOlMap(map as Map)
        })
        
        return () => map.setTarget(undefined)
    }, [])

    useEffect(() => {
        if (olMap) {
            const features: Feature<Geometry>[] = new GeoJSON().readFeatures(shoppingMalls)
            const parsedFeatures: Feature<Geometry>[] = []
            features.forEach((feature: Feature) => {
                const geometry = feature.getGeometry()
                if (geometry instanceof Point) {
                    const projectedCoordinates = fromLonLat(geometry.getCoordinates())
                    const updatedFeature = new Feature({
                        ...feature.getProperties(),
                        geometry: new Point(projectedCoordinates),
                    })
                    parsedFeatures.push(updatedFeature)
                }
            })
            const featureVectorLayer = new Vector({
                source: new VectorSource({
                   features: parsedFeatures,
                   format: new GeoJSON()
                }),
                visible: true,
                zIndex: 2
            })
            olMap.addLayer(featureVectorLayer)
            //On click of the map, get the features at that pixel, get access to the properties in the feature and open up overlay to display tooltip on Shopping mall's information
        }
    }, [olMap])
    return mapRef
}



// Layers provided access to Raster and Vector GeoSpatial Data
// Raster data are digital images png or Jpg, uses metrics of square areas
// dont really style them, just consume it in the browser
// Tiled or Untiled
// Tiled images are images that are divided into grids (BaseTileLayer)
// Untiled images are based on a single image (BaseImageLayer)


//There are 3 types of Vector layers
//Vector TileLayer - Similar to Raster Tile Layer but data based on vector data based on point, lines and polygons
//Open Map Tiles - provides Open Street Map with Vector tiles, URL should include x,y,z, format(JSONFeature, MVT: Mapbox), Goes to MapTiler
//To Add Styling, Create Style in MapTiler, Save it and publish the map. Copy the JSON link
//Install olms
//olms.apply(map, styled map link)
//use olms.applyStyle to only apply to a layer Check ol-mapbox-style docs on how to use this function
//Vector ImageLayer and Vector Layer are for untiled Vector layers 