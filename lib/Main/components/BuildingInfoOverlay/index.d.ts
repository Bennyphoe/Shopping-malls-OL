import { FC } from "react";
export type BuildingInfo = {
    name: string;
    address: string;
    floorArea: number;
    imgUrl?: string;
    websiteUrl?: string;
};
type BuildingInfoOverlayProps = {
    information: BuildingInfo;
};
declare const BuildingInfoOverlay: FC<BuildingInfoOverlayProps>;
export default BuildingInfoOverlay;
//# sourceMappingURL=index.d.ts.map