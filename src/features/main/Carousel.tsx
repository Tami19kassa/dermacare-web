import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Carousel: React.FC = () => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        { image: '/assets/images/carousel/sunscreen.jpg', title: t('carousel_title1'), subtitle: t('carousel_subtitle1') },
        { image: '/assets/images/carousel/hydration.jpg', title: t('carousel_title2'), subtitle: t('carousel_subtitle2') },
        { image: '/assets/images/carousel/cleansing.jpg', title: t('carousel_title3'), subtitle: t('carousel_subtitle3') },
    ];

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    // Auto-play functionality
    useEffect(() => {
        const timer = setTimeout(() => {
            nextSlide();
        }, 6000);  
        return () => clearTimeout(timer);
    }, [currentIndex]);

    return (
        <section className="h-64 rounded-2xl relative group">
            <div
                style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
                className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
                {/* Text Content */}
                <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-bold">{slides[currentIndex].title}</h3>
                    <p className="text-sm opacity-90">{slides[currentIndex].subtitle}</p>
                </div>
            </div>
            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <FiChevronLeft onClick={prevSlide} size={30} />
            </div>
            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <FiChevronRight onClick={nextSlide} size={30} />
            </div>
        </section>
    );
};

export default Carousel;