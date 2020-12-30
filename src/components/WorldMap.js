import React from 'react';
import "./WorldMap.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { showDataOnMap } from "./util";

function ChangeMap({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function WorldMap({ countries, casesType, center, zoom}) {
    return (
        <div className="map">
        <MapContainer>
            <ChangeMap center={center} zoom={zoom} />
            <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">
                OpenStreetMap</a> contributors'
            />
            {showDataOnMap(countries, casesType)}
        </MapContainer>
            
        </div>
    )
}

export default WorldMap;
