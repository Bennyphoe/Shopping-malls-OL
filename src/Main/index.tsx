import * as styles from './styles.scss';
import { useOpenLayers } from './hooks';
import 'ol/ol.css';
import BuildingInfoOverlay from './components/BuildingInfoOverlay';
import { useEffect, useState } from 'react';
import { useGetAddressQuery } from './queries/UseGetAddressQuery';



const Main = () => {
  const {mapRef, overlayRef, selectedBuildingInfo, olMap} = useOpenLayers()
  const [searchOption, setSearchOption] = useState<string>()
  const [appliedOption, setAppliedOption] = useState<string>("17 Dover Crescent")
  const {data: addressInfo} = useGetAddressQuery(appliedOption)
  useEffect(() => {
    if (addressInfo) {
      //CREATE A LAYER IN HOOK FIRST
      //IF there is exisiting features, remove all of them first
      //add it a new point feature with new styling into the layer
      //Check for distance with tje features in shopping mall layer, if its within 5km, duplicate that feature
      //Add those features into this layer
      //make its zIndex higher than all other layer
    }
  }, [addressInfo])
  return (
      <div className={styles.container}>
          <div className={styles.title}>Shopping Malls in Singapore</div>
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