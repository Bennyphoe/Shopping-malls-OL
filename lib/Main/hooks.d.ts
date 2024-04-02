import Map from 'ol/Map.js';
import { BuildingInfo } from './components/BuildingInfoOverlay';
import { DistanceMatrixOverlayProps } from './components/DistanceMatrixOverlay';
export declare const useOpenLayers: () => {
    mapRef: import("react").RefObject<HTMLDivElement>;
    overlayRef: import("react").RefObject<HTMLDivElement>;
    distanceRef: import("react").RefObject<HTMLDivElement>;
    selectedBuildingInfo: BuildingInfo | undefined;
    olMap: Map | undefined;
    mallAddresses: string[];
    hoverDistanceInfo: DistanceMatrixOverlayProps | undefined;
};
//# sourceMappingURL=hooks.d.ts.map