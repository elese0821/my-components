import React, { useEffect, useState } from 'react';
import { Map, MapMarker, useKakaoLoader, ZoomControl } from 'react-kakao-maps-sdk';

export default function MapComponent({ roadAddress }) {
    const [state, setState] = useState({
        lat: 37.56853403933998,
        lng: 126.8277766799008
    });
    const [coords, setCoords] = useState(null);
    const isLoaded = useKakaoLoader({
        appkey: import.meta.env.VITE_APP_KAKAO_JS_KEY, // 발급 받은 APPKEY
        libraries: ["services", "clusterer", "drawing"],
    });


    useEffect(() => {
        if (isLoaded && roadAddress) {
            kakaoMapGeoCoder(roadAddress);
        }
    }, [roadAddress]);

    const kakaoMapGeoCoder = (address) => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = {
                        lat: result[0].y,
                        lng: result[0].x
                    };
                    setCoords(coords);
                } else {
                    console.error('Geocoder failed due to:', status);
                }
            });
        } else {
            console.error('Kakao Map services are not available.');
        }
    }

    return (
        <Map
            center={coords || state}
            isPanto={true}
            style={{
                width: "100%",
                height: "400px",
                position: "relative",
                zIndex: 0,
            }}
            level={3}
        >
            <ZoomControl />
            <MapMarker position={coords || state} />
        </Map>
    );
}
