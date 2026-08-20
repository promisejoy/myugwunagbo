import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';

const slides = [
  {
    id: 1,
    image: '/img/469561696_573785381917492_5352245378316206825_n.jpg',
    alt: 'Ugwunagbo Landscape',
    title: 'Welcome to Ugwunagbo Local Government Area',
    subtitle: 'Committed to serving our community with integrity, transparency, and excellence',
  },
  {
    id: 2,
    image: '/img/two.jpeg',
    alt: 'Ugwunagbo Community',
    title: 'Our Vibrant Community',
    subtitle: 'A place rich in cultural heritage, unity, and shared values',
  },
  {
    id: 3,
    image: '/img/three.jpeg',
    alt: 'Ugwunagbo Development',
    title: 'Development & Progress',
    subtitle: 'Working together to build sustainable infrastructure for a better future',
  },
  {
    id: 4,
    image: '/img/four.jpeg',
    alt: 'Ugwunagbo Culture',
    title: 'Preserving Our Culture',
    subtitle: 'Celebrating our traditions and passing them down for generations to come',
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  return (
    <section 
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] min-h-[400px] max-h-[650px] bg-[#002200] overflow-hidden select-none"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      aria-label="Hero Carousel"
    >
      {/* Slide Stack (Fade Transition) */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Zoom Effect */}
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={slide.image}
                alt={slide.alt}
                className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1920x800?text=Ugwunagbo+LGA';
                }}
              />
              
              {/* Dual Vignette Overlay for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
            </div>

            {/* Centered Responsive Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 md:px-12">
              <div 
                className={`max-w-4xl w-full text-center p-6 sm:p-8 md:p-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 shadow-2xl transition-all duration-700 delay-300 transform ${
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <span className="inline-block px-3 py-1 mb-3 text-xs sm:text-sm font-semibold text-[#ffcc00] uppercase tracking-widest bg-[#006400]/60 rounded-full border border-[#ffcc00]/30">
                  Ugwunagbo Local Government Area
                </span>
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4 drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="text-xs sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-[#ffcc00] text-white hover:text-[#006400] backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Previous Slide"
      >
        <FaChevronLeft className="text-base sm:text-xl" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-[#ffcc00] text-white hover:text-[#006400] backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Next Slide"
      >
        <FaChevronRight className="text-base sm:text-xl" />
      </button>

      {/* Bottom Bar Controls (Indicators & Play State) */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white/80 hover:text-[#ffcc00] transition-colors pr-2 border-r border-white/20 text-xs sm:text-sm"
          title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        {/* Indicators */}
        <div className="flex items-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-6 sm:w-8 bg-[#ffcc00]'
                  : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;