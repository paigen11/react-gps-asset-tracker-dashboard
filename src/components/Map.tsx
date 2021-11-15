import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
// import styles from "../../styles/Map.module.scss";

const Map = ({
  coords,
  lastPosition,
}: {
  coords: number[][];
  lastPosition: [number, number];
}) => {
  console.log("data changed!");
  // todo address this later
  const geoJsonObj: type = [
    {
      type: "LineString",
      coordinates: coords,
    },
  ];

  // todo stop hardcoding these center etc. format last position popup more nicely and add date/time and possibly nodes for logged data points
  return (
    <MapContainer
      center={[33.82854810044288, -84.32526648205214]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`}
      />
      <Marker position={lastPosition} draggable={true} animate={true}>
        <Popup>Last recorded position: `${lastPosition}`</Popup>
        <GeoJSON data={geoJsonObj}></GeoJSON>
      </Marker>
    </MapContainer>
  );
};

export default Map;
