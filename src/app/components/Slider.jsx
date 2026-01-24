"use client";

import { useState, useEffect } from "react";

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "خرید و فروش آسان و سریع",
      description: "بهترین قیمت‌ها را در دیوار پیدا کنید",
      image: "https://via.placeholder.com/1200x400/5c6bc0/ffffff?text=Slide+1",
      bgColor: "bg-gradient-to-l from-[#5c6bc0] to-[#7986cb]",
    },
    {
      id: 2,
      title: "املاک، خودرو، لوازم خانگی و بیشتر",
      description: "هزاران آگهی در دسته‌بندی‌های مختلف",
      image: "https://via.placeholder.com/1200x400/42a5f5/ffffff?text=Slide+2",
      bgColor: "bg-gradient-to-l from-[#42a5f5] to-[#64b5f6]",
    },
    {
      id: 3,
      title: "ثبت آگهی رایگان",
      description: "آگهی خود را به رایگان ثبت کنید و به هزاران نفر نمایش دهید",
      image: "https://via.placeholder.com/1200x400/66bb6a/ffffff?text=Slide+3",
      bgColor: "bg-gradient-to-l from-[#66bb6a] to-[#81c784]",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gray-200">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full h-full ${slide.bgColor} flex items-center justify-center relative`}
          >
            {/* Background Image Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all z-20"
        aria-label="Previous slide"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all z-20"
        aria-label="Next slide"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

