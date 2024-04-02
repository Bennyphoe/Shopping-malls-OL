import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Vector } from 'ol/layer';
import apply from 'ol-mapbox-style';
import VectorSource from 'ol/source/Vector.js'
import GeoJSON from 'ol/format/GeoJSON.js';
import shoppingMalls from './shoppingMalls.geojson'
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import { Geometry, LineString, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { BuildingInfo } from './components/BuildingInfoOverlay';
import { getBuildingImg } from './components/BuildingInfoOverlay/utils';
import Style, { StyleFunction } from 'ol/style/Style.js';
import { Circle, Fill, Stroke, Text } from 'ol/style';
import Select, { SelectEvent } from 'ol/interaction/Select.js';
import { pointerMove, singleClick } from 'ol/events/condition';
import { DistanceMatrixOverlayProps } from './components/DistanceMatrixOverlay';

const getDefaultPointStyle: StyleFunction = (feature: Feature)=> {
    return new Style({
        image: new Circle({
            fill: new Fill({
                color: [189, 212, 233, 0.8]
            }),
            stroke: new Stroke({
                color: [88, 108, 127, 0.8],
                width: 3
            }),
            radius: 10
        }),
        text: new Text({
            text: feature.get('name'),
            font: '12px Arial',
            fill: new Fill({
                color: [189, 212, 233, 0.8]
            }),
            offsetY: -20
        })
    })
}

const selectedPointStyle = new Style({
    image: new Circle({
        fill: new Fill({
            color: [146, 110, 225, 0.8]
        }),
        stroke: new Stroke({
            color: [88, 108, 127, 0.8],
            width: 3
        }),
        radius: 10
    })
})


const searchPointStyle = new Style({
    image: new Circle({
      fill: new Fill({
        color: [231, 148, 171, 0.8]
      }),
      stroke: new Stroke({
        color: [232, 46, 99, 0.8],
        width: 3
      }),
      radius: 10
    }),
    stroke: new Stroke({
        color: [111, 153, 255, 0.55],
        width: 2,
    }),
  })


export const useOpenLayers = () => {
    const mapRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const distanceRef = useRef<HTMLDivElement>(null)
    const [olMap, setOlMap] = useState<Map>();
    const [mallAddresses, setMallAddresses] = useState<string[]>([])
    const [selectedBuildingInfo, setSelectedBuildingInfo] = useState<BuildingInfo>()
    const [hoverDistanceInfo, setHoverDistanceInfo] = useState<DistanceMatrixOverlayProps>()
    useEffect(() => {
        const map = new Map(
            {
              view: new View({
                  center: [11556337.77755491, 149346.65534895373],
                  zoom: 0,
                  extent: [11520145.202444727, 130545.25583954992, 11591281.477661451, 169115.7839731198]
              }),
              target: mapRef.current as HTMLElement,
            }
        )
        apply(map, 'https://api.maptiler.com/maps/10acd558-91af-43db-846f-44edd252befb/style.json?key=exzLn9YZ8tTAzRR3fhHZ').then((map: Map) => {
            const features: Feature<Geometry>[] = new GeoJSON().readFeatures(shoppingMalls)
            const parsedFeatures: Feature<Geometry>[] = []
            const address: string[] = []
            features.forEach((feature: Feature) => {
                const geometry = feature.getGeometry()
                if (geometry instanceof Point) {
                    const projectedCoordinates = fromLonLat(geometry.getCoordinates())
                    const updatedFeature = new Feature({
                        ...feature.getProperties(),
                        geometry: new Point(projectedCoordinates),
                    })
                    updatedFeature.setStyle(getDefaultPointStyle)
                    address.push(feature.get('address'))
                    parsedFeatures.push(updatedFeature)
                }
            })
            setMallAddresses(address)
            const featureVectorLayer = new Vector({
                source: new VectorSource({
                    features: parsedFeatures,
                    format: new GeoJSON()
                }),
                visible: true,
                zIndex: 10000,
            })
            featureVectorLayer.set('title', 'shoppingMallsVectorLayer')
            map.addLayer(featureVectorLayer)
        })

        

        const buildingInfoOverlay = new Overlay({
            element: overlayRef.current as HTMLElement,
            positioning: 'bottom-left',
            id: 'building',
            autoPan: true,
            offset: [12, 0]
        })

        map.addOverlay(buildingInfoOverlay)

        const onClickMapHandler = (event: MapBrowserEvent<any>) => {
            buildingInfoOverlay.setPosition(undefined)
            setSelectedBuildingInfo(undefined)
            map.forEachFeatureAtPixel(event.pixel, (feature) => {
                const properties = feature.getProperties()
                setSelectedBuildingInfo({
                    name: properties["name"],
                    address: properties["address"],
                    floorArea: properties["floorArea"],
                    imgUrl: getBuildingImg(properties["name"]),
                    websiteUrl: properties["websiteUrl"]
                })
                buildingInfoOverlay.setPosition(event.coordinate)
            }, {layerFilter: (layer) => layer.get('title') === 'shoppingMallsVectorLayer'})
        }

        map.on('click', onClickMapHandler)


        //Select feature interaction
        const selectInteraction = new Select({
            condition: singleClick,
            layers: (layer) => {
                return layer.get('title') === 'shoppingMallsVectorLayer'
            },
            style: selectedPointStyle
        })
        map.addInteraction(selectInteraction)

       
        //Create a layer for user input address
        const searchVectorLayer = new Vector({
            source: new VectorSource({
                features: [],
            }),
            zIndex: 100001,
            style: searchPointStyle
        })
        searchVectorLayer.set('title', 'searchVectorLayer')
        map.addLayer(searchVectorLayer)

        //overlay for distance matrix
        const distanceOverlay = new Overlay({
            element: distanceRef.current as HTMLElement,
            positioning: 'top-left',
            id: 'distance',
            autoPan: true,
            offset: [12, 0]
        })

        map.addOverlay(distanceOverlay)

        //Add hover using Select interaction
        const hoverInteraction = new Select({
            condition: pointerMove,
            layers: (layer) => layer.get('title') === "searchVectorLayer",
            filter: (feature) => feature.getGeometry() instanceof LineString, 
            hitTolerance: 2
        })

        hoverInteraction.on("select", (event: SelectEvent) => {
            distanceOverlay.setPosition(undefined)
            setHoverDistanceInfo(undefined)
            if (event.selected.length > 0 && event.selected[0].getGeometry() instanceof LineString) {
                const coordinate = event.mapBrowserEvent.coordinate
                const featureSelected = event.selected[0]
                setHoverDistanceInfo({
                    distance: featureSelected.get("distance"),
                    duration: featureSelected.get("duration")
                })
                distanceOverlay.setPosition(coordinate)
            }
        })

        map.addInteraction(hoverInteraction)


        setOlMap(map)
        
        return () => map.setTarget(undefined)
    }, [])

    
    return {mapRef, overlayRef, distanceRef, selectedBuildingInfo, olMap, mallAddresses, hoverDistanceInfo}
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