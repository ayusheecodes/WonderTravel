import { useMemo } from 'react'
import Map, { Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './MapViewer.module.css'

const MAP_STYLE = import.meta.env.VITE_MAP_STYLE || 'https://demotiles.maplibre.org/style.json'

const isValidCoordinate = (coordinates) => (
  Array.isArray(coordinates) &&
  coordinates.length >= 2 &&
  Number.isFinite(Number(coordinates[0])) &&
  Number.isFinite(Number(coordinates[1]))
)

export default function MapViewer({ activities, destinationName }) {
  const mappableActivities = useMemo(
    () => (activities || []).filter((activity) => isValidCoordinate(activity.coordinates)),
    [activities]
  )

  const initialViewState = useMemo(() => {
    if (!mappableActivities.length) {
      return {
        longitude: 77.1892,
        latitude: 32.2396,
        zoom: 11,
      }
    }

    return {
      longitude: Number(mappableActivities[0].coordinates[0]),
      latitude: Number(mappableActivities[0].coordinates[1]),
      zoom: 11,
    }
  }, [mappableActivities])

  if (!activities || activities.length === 0) return null

  if (!mappableActivities.length) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.emptyMap}>
          <h3>{destinationName || 'Trip'} route map</h3>
          <p>Coordinates are not available for this day yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.mapContainer}>
      <Map
        key={`${initialViewState.longitude}-${initialViewState.latitude}`}
        initialViewState={initialViewState}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%', borderRadius: '16px' }}
      >
        {mappableActivities.map((activity, index) => (
          <Marker
            key={`${index}-${activity.title}`}
            longitude={Number(activity.coordinates[0])}
            latitude={Number(activity.coordinates[1])}
            anchor="bottom"
          >
            <div className={styles.markerPin}>
              <span>{index + 1}</span>
            </div>
            <div className={styles.markerTitle}>{activity.title}</div>
          </Marker>
        ))}
      </Map>
    </div>
  )
}
