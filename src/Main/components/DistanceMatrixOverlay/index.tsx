import { FC } from "react";
import * as styles from './styles.scss';

export type DistanceMatrixOverlayProps = {
  distance: string;
  duration: string;
}

const DistanceMatrixOverlay: FC<DistanceMatrixOverlayProps> = ({distance, duration}) => {
  return (
    <div className={styles.container}>
      <div className={styles.matrixValue}>Distance: {distance}</div>
      <div className={styles.matrixValue}>Duration: {duration}</div>
    </div>
  )
}

export default DistanceMatrixOverlay