import Jem from '../../../images/Jem.jpg'
import VivoCity from '../../../images/vivocity.jpg'
import PlazaSingapura from '../../../images/plazaSingapura.jpg'
import JurongPoint from '../../../images/jurongPoint.jpg'
import Nex from '../../../images/Nex.jpg'

export const getBuildingImg = (name: string) => {
    if (name === "Jurong Point") {
        return JurongPoint
    } else if (name === "Jem") {
        return Jem
    } else if (name === "Plaza Singapura") {
        return PlazaSingapura
    } else if (name === "Vivo City") {
        return VivoCity
    } else {
        return Nex
    }
}