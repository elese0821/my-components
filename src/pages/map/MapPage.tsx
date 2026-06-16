import React, { useState, useCallback } from 'react';
import { Map, MapMarker, ZoomControl, MapTypeControl, useKakaoLoader } from 'react-kakao-maps-sdk';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { MagnifyingGlassIcon, MapPinIcon, TrashIcon, StarIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface Location {
    id: number;
    name: string;
    roadAddress: string;
    jibunAddress: string;
    zonecode: string;
    lat: number;
    lng: number;
    starred: boolean;
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 }; // 서울시청

export default function MapPage() {
    const [center, setCenter] = useState(DEFAULT_CENTER);
    const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selected, setSelected] = useState<Location | null>(null);
    const [showPostcode, setShowPostcode] = useState(false);
    const [isPanto, setIsPanto] = useState(false);

    const isLoaded = useKakaoLoader({
        appkey: import.meta.env.VITE_APP_KAKAO_JS_KEY ?? '',
        libraries: ['services'],
    });

    const geocode = useCallback((address: string, cb: (lat: number, lng: number) => void) => {
        if (!window.kakao?.maps?.services) return;
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: any[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK) {
                cb(Number(result[0].y), Number(result[0].x));
            }
        });
    }, []);

    const handleComplete = (data: any) => {
        setShowPostcode(false);
        geocode(data.roadAddress || data.address, (lat, lng) => {
            const newLoc: Location = {
                id: Date.now(),
                name: data.buildingName || data.roadAddress || data.address,
                roadAddress: data.roadAddress || data.address,
                jibunAddress: data.jibunAddress || '',
                zonecode: data.zonecode,
                lat, lng,
                starred: false,
            };
            setLocations(prev => [newLoc, ...prev]);
            setCenter({ lat, lng });
            setSelectedCoords({ lat, lng });
            setSelected(newLoc);
            setIsPanto(true);
            setTimeout(() => setIsPanto(false), 300);
        });
    };

    const handleMarkerClick = (loc: Location) => {
        setSelected(loc);
        setCenter({ lat: loc.lat, lng: loc.lng });
        setIsPanto(true);
        setTimeout(() => setIsPanto(false), 300);
    };

    const toggleStar = (id: number) => {
        setLocations(prev => prev.map(l => l.id === id ? { ...l, starred: !l.starred } : l));
        if (selected?.id === id) setSelected(prev => prev ? { ...prev, starred: !prev.starred } : prev);
    };

    const removeLocation = (id: number) => {
        setLocations(prev => prev.filter(l => l.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    const sorted = [...locations].sort((a, b) => Number(b.starred) - Number(a.starred));

    return (
        <div className='section_wrap flex flex-col gap-0 px-0 pb-0 overflow-hidden' style={{ height: 'calc(100vh - 100px)', minHeight: '480px' }}>
            {/* 모바일: 세로 스택(패널 위 / 지도 아래), 태블릿+: 가로 배치 */}
            <div className='flex flex-col sm:flex-row h-full'>
                {/* 사이드 패널 — 모바일에서는 상단 고정 높이, 데스크탑에서 전체 높이 */}
                <div className='w-full sm:w-64 md:w-72 flex-shrink-0 flex flex-col bg-white border-b sm:border-b-0 sm:border-r border-gray-200 overflow-hidden h-36 sm:h-full'>
                    {/* 검색 헤더 */}
                    <div className='px-3 py-2.5 sm:p-4 border-b border-gray-100 flex-shrink-0'>
                        <h2 className='text-xs sm:text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5'>
                            <MapPinIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500' />
                            주소 검색
                        </h2>
                        <button
                            onClick={() => setShowPostcode(true)}
                            className='w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all'
                        >
                            <MagnifyingGlassIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                            <span className='truncate'>도로명 또는 지번 주소 검색</span>
                        </button>
                    </div>

                    {/* 저장된 위치 목록
                        모바일: 가로 스크롤 카드 / 데스크탑: 세로 리스트 */}
                    <div className='flex-1 overflow-x-auto sm:overflow-x-hidden overflow-y-hidden sm:overflow-y-auto min-h-0'>
                        {locations.length === 0 ? (
                            <div className='flex flex-row sm:flex-col items-center justify-center h-full text-gray-300 px-4 gap-2'>
                                <MapPinIcon className='h-6 w-6 sm:h-10 sm:w-10 sm:mb-2 shrink-0' />
                                <p className='text-xs'>주소를 검색하면 저장됩니다.</p>
                            </div>
                        ) : (
                            <div className='flex flex-row sm:flex-col gap-1.5 sm:gap-0 p-2 sm:p-0 h-full sm:h-auto'>
                                <p className='hidden sm:block px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50'>
                                    저장된 위치 {locations.length}개
                                </p>
                                {sorted.map(loc => (
                                    <div
                                        key={loc.id}
                                        onClick={() => handleMarkerClick(loc)}
                                        className={`group shrink-0 sm:shrink flex items-start gap-2 px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer rounded-lg sm:rounded-none border sm:border-0 sm:border-b border-gray-100 transition-colors w-40 sm:w-full ${
                                            selected?.id === loc.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <MapPinIcon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${selected?.id === loc.id ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <div className='flex-1 min-w-0'>
                                            <p className={`text-xs font-medium truncate ${selected?.id === loc.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {loc.name}
                                            </p>
                                            <p className='text-xs text-gray-400 truncate mt-0.5'>{loc.roadAddress}</p>
                                            <p className='text-xs text-gray-300'>{loc.zonecode}</p>
                                        </div>
                                        <div className='flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity' onClick={e => e.stopPropagation()}>
                                            <button onClick={() => toggleStar(loc.id)} className='p-1 hover:text-yellow-400 transition-colors'>
                                                {loc.starred
                                                    ? <StarSolid className='h-3.5 w-3.5 text-yellow-400' />
                                                    : <StarIcon className='h-3.5 w-3.5 text-gray-300' />
                                                }
                                            </button>
                                            <button onClick={() => removeLocation(loc.id)} className='p-1 hover:text-red-400 transition-colors'>
                                                <TrashIcon className='h-3.5 w-3.5 text-gray-300' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 지도 영역 — 나머지 공간 전부 */}
                <div className='flex-1 relative min-h-0'>
                    <Map
                        center={center}
                        isPanto={isPanto}
                        style={{ width: '100%', height: '100%' }}
                        level={4}
                    >
                        <ZoomControl position='RIGHT' />
                        <MapTypeControl position='TOPRIGHT' />
                        {locations.map(loc => (
                            <MapMarker
                                key={loc.id}
                                position={{ lat: loc.lat, lng: loc.lng }}
                                onClick={() => handleMarkerClick(loc)}
                            />
                        ))}
                    </Map>

                    {/* 선택된 위치 정보 카드 */}
                    {selected && (
                        <div className='absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-10'>
                            <div className='flex items-start justify-between gap-3'>
                                <div className='flex items-start gap-2 flex-1 min-w-0'>
                                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                                        <MapPinIcon className='h-4 w-4 text-blue-600' />
                                    </div>
                                    <div className='min-w-0'>
                                        <p className='text-sm font-semibold text-gray-800 truncate'>{selected.name}</p>
                                        <p className='text-xs text-gray-500 mt-0.5'>{selected.roadAddress}</p>
                                        {selected.jibunAddress && (
                                            <p className='text-xs text-gray-400'>{selected.jibunAddress}</p>
                                        )}
                                        <div className='flex items-center gap-3 mt-2'>
                                            <span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded'>우편번호 {selected.zonecode}</span>
                                            <span className='text-xs text-gray-400'>
                                                {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-1 flex-shrink-0'>
                                    <button onClick={() => toggleStar(selected.id)} className='p-1.5 rounded-lg hover:bg-yellow-50 transition-colors'>
                                        {selected.starred
                                            ? <StarSolid className='h-4 w-4 text-yellow-400' />
                                            : <StarIcon className='h-4 w-4 text-gray-400' />
                                        }
                                    </button>
                                    <button onClick={() => setSelected(null)} className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors'>
                                        <XMarkIcon className='h-4 w-4 text-gray-400' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* API 키 미설정 안내 */}
                    {!import.meta.env.VITE_APP_KAKAO_JS_KEY && (
                        <div className='absolute inset-0 bg-gray-100 flex items-center justify-center z-20'>
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-sm text-center'>
                                <MapPinIcon className='h-10 w-10 text-gray-300 mx-auto mb-3' />
                                <p className='text-sm font-semibold text-gray-700'>카카오맵 API 키 필요</p>
                                <p className='text-xs text-gray-400 mt-1'>
                                    .env 파일에 <code className='bg-gray-100 px-1 rounded'>VITE_APP_KAKAO_JS_KEY</code>를 설정해주세요.
                                </p>
                                <a
                                    href='https://developers.kakao.com'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline'
                                >
                                    카카오 개발자 센터 <ChevronRightIcon className='h-3 w-3' />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 우편번호 검색 모달 */}
            {showPostcode && (
                <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50' onClick={() => setShowPostcode(false)}>
                    <div className='bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md' onClick={e => e.stopPropagation()}>
                        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
                            <p className='text-sm font-semibold text-gray-800'>주소 검색</p>
                            <button onClick={() => setShowPostcode(false)} className='p-1 rounded-lg hover:bg-gray-100 transition-colors'>
                                <XMarkIcon className='h-5 w-5 text-gray-400' />
                            </button>
                        </div>
                        <DaumPostcodeEmbed onComplete={handleComplete} style={{ height: '460px' }} />
                    </div>
                </div>
            )}
        </div>
    );
}
