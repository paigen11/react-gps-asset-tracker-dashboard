import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import styles from "../../styles/Map.module.scss";

const Map = ({
  coords,
  lastPosition,
  markers,
  latestTimestamp,
}: {
  coords: number[][];
  lastPosition: [number, number];
  markers: [number, number][];
  latestTimestamp: string;
}) => {
  const geoJsonObj: any = [
    {
      type: "LineString",
      coordinates: coords,
    },
  ];

  const mapMarkers = markers.map((latLng, i) => (
    <CircleMarker key={i} center={latLng} fillColor="navy" />
  ));

  return (
    <>
      <h2>Asset Tracker Map</h2>
      <MapContainer
        center={lastPosition}
        zoom={12}
        className={styles.container}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`}
        />
        <Marker position={lastPosition} draggable={true}>
          <Popup>
            Last recorded position:
            <br />
            {lastPosition[0].toFixed(3)}&#176;,&nbsp;
            {lastPosition[1].toFixed(3)}&#176;
            <br />
            {latestTimestamp}
          </Popup>
          <GeoJSON data={geoJsonObj}></GeoJSON>
          {mapMarkers}
        </Marker>
      </MapContainer>
    </>
  );
};

export default Map;
