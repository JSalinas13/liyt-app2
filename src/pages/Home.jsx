import React from 'react'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

export default function Home() {
    const position = [19.4326, -99.1332]; // Ejemplo: CDMX
    const line = [
        [19.4326, -99.1332],
        [19.4376, -99.1332],
    ];

    return (
        <div className="h-screen w-screen">
            <MapContainer center={position} zoom={15} minZoom={15} maxZoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                <Marker position={position} />
                <Polyline positions={line} color="red" />
            </MapContainer>
        </div>
    )
}
