import * as styles from './styles.scss';
import { useOpenLayers } from './hooks';
import 'ol/ol.css';
import BuildingInfoOverlay from './components/BuildingInfoOverlay';
import { useEffect, useState } from 'react';
import { useGetAddressQuery } from './queries/UseGetAddressQuery';
import { Vector } from 'ol/source';
import { Feature } from 'ol';
import { LineString, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { useGetDistanceBetweenAddressQuery } from './queries/UseGetProximityQuery';
import { generateLineStringsFromOrigin } from './utils';



const Main = () => {
  const {mapRef, overlayRef, selectedBuildingInfo, olMap, mallAddresses: destinations} = useOpenLayers()
  const [searchOption, setSearchOption] = useState<string>("")
  const [appliedOption, setAppliedOption] = useState<string>("")
  const {data: addressInfo} = useGetAddressQuery(appliedOption)
  const {data: featureDistances} = useGetDistanceBetweenAddressQuery(appliedOption, destinations)
  useEffect(() => {
    if (addressInfo && olMap) {
      const searchLayer = olMap?.getAllLayers().filter(layer => layer.get('title') === 'searchVectorLayer')[0]
      const vectorSource = searchLayer?.getSource()
      if (vectorSource && vectorSource instanceof Vector) {
        const currentFeatures = vectorSource.getFeatures()
        if (currentFeatures.length > 0) {
          //remove all features first
          vectorSource.removeFeatures(currentFeatures)
        }
        const newPointFeature = new Feature({
          geometry: new Point(fromLonLat([addressInfo.long, addressInfo.lat])),
        })
        // newPointFeature.setId("origin")
        vectorSource.addFeature(newPointFeature)
        
        //Create line string between the origin and the destinations
        generateLineStringsFromOrigin(olMap, fromLonLat([addressInfo.long, addressInfo.lat]))

        //ON hover display the duration and distance 
        //Using featureDistances, can set properties on the linestring generated above, maybe set it
        //in the generateLineStringFromOrigin function
        //Add the map hover interaction in hooks, on hover, filter by searchVectorLayer, get the feature
        //that is a lineString, set overlay at event coordinate with duration and distance 
        

      }
    }
  }, [addressInfo, olMap])
  return (
      <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>Shopping Malls in Singapore</div>
            <div className={styles.searchContainer}>
              <span className={styles.searchLabel}>Search Address: </span>
              <input className={styles.searchInput} type='text' placeholder='Enter an address...' value={searchOption} onChange={(e) => setSearchOption(e.target.value)}></input>
              <button className={styles.searchButton} onClick={() => {
                if (searchOption) {
                  setAppliedOption(searchOption)
                }
              }}>Search</button>
            </div>
            
          </div>
          <div ref={mapRef} className={styles.map}></div>
          <div ref={overlayRef}>
            {selectedBuildingInfo && <BuildingInfoOverlay information={selectedBuildingInfo}/>}
          </div>
      </div>
  )
}

export default Main;


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