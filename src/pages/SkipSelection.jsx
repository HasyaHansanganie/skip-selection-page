import React, { useRef, useState, useEffect } from 'react';
import { FaExclamationTriangle, FaChevronRight, FaChevronLeft, FaBars, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * Allows user to select a skip size from a scrollable card list.
 * Supports responsive design with sidebar toggle on mobile.
 */
export default function SkipSelection({ toggleSidebar }) {

    const [selectedSize, setSelectedSize] = useState(null);
    const containerRef = useRef(null); // Ref for the scroll container
    const cardRefs = useRef([]);       // Refs for each skip card for scrolling
    const navigate = useNavigate();

    // State to hold the list of available skip sizes fetched from the API
    const [skipSizes, setSkipSizes] = useState([]);

    // Fetch skip data based on a specific postcode and area when the component mounts
    useEffect(() => {
        fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft')
            .then(res => res.json())
            .then(data => setSkipSizes(data))
            .catch(err => console.error('Error fetching skip data:', err));
    }, []);

    // Utility function to return the correct skip image path based on the skip size
    const getSkipImage = (size) => {
        const imageMap = {
            4: "/images/4yrd.png",
            16: "/images/16yrd.png",
            20: "/images/20yrd.png",
            40: "/images/40yrd.png",
        };
        return imageMap[size] || "/images/normalSkip.png";
    };

    /**
     * Scrolls horizontally to the card at the given index
     * @param {number} index - The index of the skip card to scroll to
     */
    const scrollToCard = (index) => {
        if (cardRefs.current[index]) {
            cardRefs.current[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    };

    /**
     * Handles click on a skip size card.
     * Selects or deselects the card and scrolls it into view.
     * @param {number} index - The index of the clicked card
     */
    const handleCardClick = (index) => {
        if (selectedSize === index) {
            setSelectedSize(null); // Deselect if clicking already selected card
        } else {
            setSelectedSize(index);
            scrollToCard(index);
        }
    };

    return (
        <div className="p-3 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10">
                {/* Sidebar toggle button for mobile */}
                <button className="lg:hidden mb-4 text-gray-600" onClick={toggleSidebar}>
                    <FaBars />
                </button>

                {/* Page heading and description */}
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Choose Your Skip Size</h2>
                    <p className="text-gray-600">Select the skip size that best suits your needs</p>
                </div>

                {/* Skip Size Selection */}
                <div className="grid grid-cols-5 gap-3 mt-10 lg:mt-5 lg:mb-4 rounded-lg">
                    {skipSizes.map((skip, index) => (
                        <label
                            key={index}
                            className={`px-4 py-2 rounded-full cursor-pointer border shadow font-semibold text-sm transition-all duration-200 
                                ${selectedSize === index
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100'
                                }`}
                        >
                            <input
                                type="radio"
                                name="skip-size"
                                className="hidden"
                                checked={selectedSize === index}
                                onChange={() => handleCardClick(index)}
                            />
                            {skip.size} <span className="hidden lg:inline">yd</span>
                        </label>
                    ))}
                </div>
                {/* Shown only on mobile */}
                <p className="text-xs text-gray-500 mt-2 sm:hidden text-center">
                    Sizes are in yards (yd)
                </p>

            </div>

            {/* Scrollable skip cards container */}
            <div className="relative overflow-visible">
                {/* Left scroll button - visible on large screens */}
                <button
                    className="hidden lg:flex absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
                    onClick={() => containerRef.current.scrollBy({ left: -300, behavior: 'smooth' })}
                    aria-label="Scroll skip sizes left"
                >
                    <FaChevronLeft />
                </button>

                <div
                    className="flex space-x-6 overflow-x-auto no-scrollbar snap-x snap-mandatory p-4 pb-10 items-center overflow-visible"
                    ref={containerRef}
                >
                    {skipSizes.map((skip, index) => {
                        const isSelected = selectedSize === index;

                        return (
                            <div
                                key={index}
                                ref={(el) => (cardRefs.current[index] = el)}
                                className={`flex-shrink-0 snap-center transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.25)] border rounded-xl bg-white
                                ${isSelected ? 'w-80 h-[24rem] ring-4 ring-blue-500 z-10' : 'w-72 h-[20rem] hover:scale-105'}
                                `}
                                style={{ transitionTimingFunction: 'ease-in-out' }}
                                onClick={() => handleCardClick(index)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && handleCardClick(index)}
                                aria-pressed={isSelected}
                            >
                                <div className="flex flex-col h-full justify-between">

                                    {/* Skip size header and image */}
                                    <div className="relative bg-neutral-900 rounded-2xl p-4 px-6">
                                        <h3 className="text-lg font-bold text-white">
                                            <span className="text-4xl">{skip.size}</span> Yard Skip
                                        </h3>
                                        <p className="text-sm text-gray-400">{skip.hire_period_days} day hire period</p>
                                        <div className="mt-4 h-28 flex items-center justify-center rounded-md overflow-hidden">
                                            <img src={getSkipImage(skip.size)} alt={`${skip.size} yard skip`} className="h-full object-contain" />
                                        </div>
                                        {/* Warning if skip not allowed on road */}
                                        {!skip.allowed_on_road && (
                                            <div className="absolute bottom--1 right-2 text-yellow-900 flex items-center text-sm font-bold border bg-white shadow-md rounded-md px-2">
                                                <FaExclamationTriangle className="mr-1" />
                                                Not allowed on the road
                                            </div>
                                        )}
                                    </div>

                                    {/* Pricing and action buttons */}
                                    <div className={`flex ${isSelected ? 'flex-col gap-8' : 'flex-row'} justify-between items-center p-5`}>
                                        <span className="text-4xl font-bold">£{skip.price_before_vat}</span>
                                        {isSelected ? (
                                            <div className="space-x-4 text-md font-semibold">
                                                <button
                                                    className="px-4 py-2 bg-gray-200 border border-gray-400 rounded"
                                                    onClick={() => navigate('/waste-type')}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded inline-flex items-center space-x-2"
                                                    onClick={() => navigate('/permit-check')}
                                                >
                                                    <span>Continue</span>
                                                    <FaArrowRight />
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="px-3 py-1 text-md bg-blue-500 text-white font-semibold rounded">Select</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right scroll button - visible on large screens */}
                <button
                    className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
                    onClick={() => containerRef.current.scrollBy({ left: 300, behavior: 'smooth' })}
                    aria-label="Scroll skip sizes right"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}
