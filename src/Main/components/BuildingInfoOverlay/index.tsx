import { FC } from "react";
import * as styles from './styles.scss';

export type BuildingInfo = {
    name: string;
    address: string;
    floorArea: number;
    imgUrl?: string;
}
type BuildingInfoOverlayProps = {
    information: BuildingInfo
}

const BuildingInfoOverlay: FC<BuildingInfoOverlayProps> = ({information}) => {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img src={information.imgUrl} alt="Building Image" className={styles.image}/>
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.buildingName}>{information.name}</div>
                <div className={styles.label}>Address</div>
                <div className={styles.value}>{information.address}</div>
                <div className={styles.label}>Floor Area</div>
                <div className={styles.value}>{information.floorArea}m&sup2;</div>
            </div>
        </div>
    )
}

export default BuildingInfoOverlay