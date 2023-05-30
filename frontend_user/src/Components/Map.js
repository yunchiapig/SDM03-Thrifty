import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { includes } from 'lodash';
const DefaultImg = require('../images/iconDefault.png');

function Map({userLocation, storesData, mapCenter, setMapCenter}) {
    const [map, setMap] = useState(null);
    // const [icon, setIcon] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const navigate = useNavigate();    
    const { t, i18n } = useTranslation();
    // const init_center = userLocation;

    const containerStyle = {
      width: '95%',
      height: '100%',
      top: '20px',
      left: '10px',
    };

    useEffect(() => {
        console.log('Load Google Map.');
    }, []);


    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const handleMarkerClose = () => {
        setSelectedMarker(null);
    };

    const handleCenterChanged = () => {
        if (map !== null) {
            // console.log("center", map.getCenter().lat(), " ", map.getCenter().lng());
            setMapCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() });
        }
    };

    const [ libraries ] = useState(['places']);
    const { isLoaded } = useJsApiLoader({
        // key: `map-${i18n.language}`,
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        id: 'google-map-script',
        libraries,
        // language: i18n.language
    });

    const onLoad = (map) => {
        setMap(map);
        // setIcon({
        //     '全家': {
        //         url: "https://play-lh.googleusercontent.com/e3AKbefh3znufeBBSF1anaUZwV7oSkTjNCn67ZdSD18DwE95y7lZY9uHDloXH8fcmg=w240-h480-rw",
        //         scaledSize: new window.google.maps.Size(30, 30)
        //     },
    
        //     '7-11': {
        //         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/250px-7-eleven_logo.svg.png",
        //         scaledSize: new window.google.maps.Size(30, 30)
        //     },
    
        //     '其他': {
        //         url: "https://pics.craiyon.com/2023-05-09/756e18f59e1d499a8eba020cb4106f00.webp",
        //         scaledSize: new window.google.maps.Size(30, 30)
        //     }
        // });
    };
    

    return (
        <>
        {isLoaded && (
            <GoogleMap mapContainerStyle={containerStyle} center={userLocation} zoom={15} 
                onLoad={onLoad} onDragEnd={() => handleCenterChanged()} onClick={() => handleMarkerClose()}>
                {storesData.map((storeData) => 
                    {
                        let icon_url;
                        if (storeData.category === "全家") {
                            icon_url = "https://play-lh.googleusercontent.com/e3AKbefh3znufeBBSF1anaUZwV7oSkTjNCn67ZdSD18DwE95y7lZY9uHDloXH8fcmg=w240-h480-rw";
                        }
                        else {
                            icon_url=DefaultImg;
                            if(storeData.mainpage_img_url && 'http' === storeData.mainpage_img_url.substring(0, 4)){
                                icon_url = storeData.mainpage_img_url;
                            }
                        }
                        return(
                        <MarkerF key={storeData._id} position={{lat: storeData.location.coordinates[1], lng: storeData.location.coordinates[0]}}
                        onClick={() => handleMarkerClick(storeData)} icon={ {url: icon_url, scaledSize: new window.google.maps.Size(30, 30) } }>
                        {selectedMarker === storeData && (
                            <InfoWindowF onCloseClick={() => handleMarkerClose(storeData)}>
                                <div>
                                    <h2 className='info-window-text'>{storeData.name}</h2>
                                    <p className='info-window-text'>{storeData.address}</p>
                                    <p className='info-window-text'>{storeData.tel}</p>
                                    <a className='info-window-link' href={`/store/${storeData._id}`} onClick={()=>{
                                        navigate(`/store/${storeData._id}`, 
                                    { state: { storeData: storeData } });}}>{"店家資訊"}</a>
                                </div>
                            </InfoWindowF>
                        )}
                    </MarkerF>
                    )}
                )}
            </GoogleMap>
        )}
        </>
    );
}

export default Map;