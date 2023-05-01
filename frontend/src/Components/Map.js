import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, Autocomplete, InfoWindowF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '40vw',
  height: '40vh',
};

function Map(userLocation) {

    const [searchQuery, setSearchQuery] = useState('');
    const [storesData, setStoresData] = useState(userLocation.restaurantsData);
    const [map, setMap] = useState(null);
    const navigate = useNavigate();    
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [center, setCenter] = useState({
        lat: userLocation.userLocation.lat,
        lng: userLocation.userLocation.lng,
    });

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const handleMarkerClose = () => {
        setSelectedMarker(null);
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    });

    const onLoad = (map) => {
        setMap(map);
    };

    return (
        <>
        {isLoaded && (
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} onLoad={onLoad} onClick={() => handleMarkerClose()}>
                {storesData.map((storeData) => (
                    <MarkerF key={storeData._id} position={{lat: storeData.location.coordinates[1], lng: storeData.location.coordinates[0]}} onClick={() => handleMarkerClick(storeData)} >
                        {selectedMarker === storeData && (
                            <InfoWindowF onCloseClick={() => handleMarkerClose(storeData)}>
                                <div>
                                    <h2>{storeData.name}</h2>
                                    <p>{storeData.category}</p>
                                    <p>{storeData.address}</p>
                                    <p>{storeData.tel}</p>
                                    <a href={`/store/${storeData._id}`} onClick={()=>{
                                navigate(`/store/${storeData._id}`, 
                                    { state: { storeData: storeData } });}}>{"店家資訊"}</a>
                                </div>
                            </InfoWindowF>
                        )}
                    </MarkerF>
                ))}
            </GoogleMap>
        )}
        </>
    );
}

export default Map;