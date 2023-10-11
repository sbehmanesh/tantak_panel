import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
})