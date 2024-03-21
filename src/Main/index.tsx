import { useOpenLayers } from './hooks';
import * as styles from './styles.scss'
const Main = () => {
    useOpenLayers()
    return (
        <div className={styles.container}>
            <div className={styles.title}>Shopping Malls in Singapore</div>
            <div id="ol-map" className={styles.map}></div>
        </div>
    )
}

export default Main;