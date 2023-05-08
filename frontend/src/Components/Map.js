import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, Autocomplete, InfoWindowF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

function Map({userLocation, storesData, mapCenter, setMapCenter}) {

    // const [storesData, setStoresData] = useState(restaurantsData);
    const [map, setMap] = useState(null);
    const navigate = useNavigate();    
    const [selectedMarker, setSelectedMarker] = useState(null);
    // const [currentUserLocation, setCurrentUserLocation] = useState(userLocation);
    const [currentCenter, setCurrentCenter] = useState(mapCenter);
    // const init_center = userLocation;

    const containerStyle = {
      width: '45vw',
      height: '70vh',
      top: '20px',
      left: '10px',
    };

    useEffect(() => {
        console.log('Load Google Map.');
    }, []);

    // useEffect(() => {
    //     setCenter(mapCenter);
    // }, [mapCenter]);

    // const handleCenterChanged = () => {
    //     if (map) {
    //         const newCenter = map.getCenter();
    //         setCenter(newCenter);
    //     }
    // };

    // const handleZoomChanged = () => {
    //   if (map) {
    //       const newZoom = map.getZoom();
    //       setZoom(newZoom);
    //   }
    // };

    const handleMarkerClick = (marker) => {
        console.log('markerChanged');
        setSelectedMarker(marker);
    };

    const handleMarkerClose = () => {
        console.log('markerClosed');
        setSelectedMarker(null);
    };

    const handleCenterChanged = () => {
        // setMapCenter(currentCenter);
        console.log('centerChanged');
        if (map != null) {
            setMapCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() });
        }
    };

    const [ libraries ] = useState(['places']);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const onLoad = (map) => {
        setMap(map);
    };

    // console.log('currentUserLocation:', currentUserLocation);

    return (
        <>
        {isLoaded && (
            <GoogleMap mapContainerStyle={containerStyle} center={userLocation} zoom={15} onLoad={onLoad} onDrag={() => handleCenterChanged()} onClick={() => handleMarkerClose()}>
                {storesData.map((storeData) => (
                    <MarkerF key={storeData._id} position={{lat: storeData.location.coordinates[1], lng: storeData.location.coordinates[0]}} onClick={() => handleMarkerClick(storeData)} >
                        {selectedMarker === storeData && (
                            <InfoWindowF onCloseClick={() => handleMarkerClose(storeData)}>
                                <div>
                                    <h2>{storeData.name}</h2>
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