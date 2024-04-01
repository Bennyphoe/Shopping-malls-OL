import { Feature, Map } from "ol";
import { Coordinate } from "ol/coordinate";
import { LineString, Point } from "ol/geom";
import { Vector } from "ol/source";


export const generateLineStringsFromOrigin = (olMap: Map, origin: Coordinate) => {
  const shoppingMallLayer = olMap.getAllLayers().filter(layer => layer.get("title") === "shoppingMallsVectorLayer")[0]
  const searchLayer = olMap.getAllLayers().filter(layer => layer.get("title") === "searchVectorLayer")[0]
  const searchSource = searchLayer.getSource() as Vector
  const source = shoppingMallLayer.getSource() as Vector
  const features = source.getFeatures()
  features.forEach(feature => {
    const geometry = feature.getGeometry()
    if (geometry instanceof Point) {
      const coordinates = geometry.getCoordinates()
      const lineFeature = new Feature({
        geometry: new LineString([origin, coordinates]),
      })
      searchSource.addFeature(lineFeature)
    }
  })
}