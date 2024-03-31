import Map from 'ol/Map.js';
import { BuildingInfo } from './components/BuildingInfoOverlay';
export declare const useOpenLayers: () => {
    mapRef: import("react").RefObject<HTMLDivElement>;
    overlayRef: import("react").RefObject<HTMLDivElement>;
    selectedBuildingInfo: BuildingInfo | undefined;
    olMap: Map | undefined;
};
//# sourceMappingURL=hooks.d.ts.map