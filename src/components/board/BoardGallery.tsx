import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCreative } from 'swiper/modules';
import createSpringSlider from './spring-slider';
import './spring-slider.scss';
import { Button } from '@material-tailwind/react';
import { useOutletContext } from 'react-router-dom';
import { ContextType } from '../../pages/board/@types/types';

const BoardGallery = () => {
    const { list } = useOutletContext<ContextType>();
    const swiperContainerRef = useRef(null);

    useEffect(() => {
        if (swiperContainerRef.current) {
            createSpringSlider(swiperContainerRef.current, {
                modules: [Navigation, Pagination, EffectCreative],
                navigation: {
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    640: { slidesPerView: 3 },
                    800: { slidesPerView: 4 },
                    1100: { slidesPerView: 5 },
                },
            });
        }
    }, []);

    return (
        <div ref={swiperContainerRef}>
            <Swiper>
                {list.map((el, i) => {

                    return (
                        <React.Fragment key={i}>
                            <SwiperSlide className='bg-white '>
                                <div>{el.title}</div>
                                <div
                                    dangerouslySetInnerHTML={{ __html: el.contents }}
                                    className=' p-4'
                                />
                            </SwiperSlide>
                        </React.Fragment>
                    )
                })}
            </Swiper>
            {/* <div className='flex justify-between'>
                <Button className="swiper-button-prev cursor-pointer bg-transparent text-black shadow-none">이전</Button>
                <Button className="swiper-button-next cursor-pointer bg-transparent text-black shadow-none">다음</Button>
            </div> */}
            <div className="swiper-pagination">페이지</div>
        </div>
    );
};

export default BoardGallery;
