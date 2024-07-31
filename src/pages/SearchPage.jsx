import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [price, setPrice] = useState([0, 100000]);
    const [wifi, setWifi] = useState(false);
    const [parking, setParking] = useState(false);
    const [kitchen, setKitchen] = useState(false);
    const [airConditioning, setAirConditioning] = useState(false);
    const [petFriendly, setPetFriendly] = useState(false);
    const [smokingAllowed, setSmokingAllowed] = useState(false);
    const [roomType, setRoomType] = useState('');
    const [bedrooms, setBedrooms] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);
    const [results, setResults] = useState([]);
    const [load, setLoad] = useState(false);

    const fetchData = async () => {
        try {
            setLoad(true);
            const response = await axios.get('/search', {
                params: {
                    search: searchQuery,
                    price: price.join(','),
                    wifi,
                    parking,
                    kitchen,
                    airConditioning,
                    petFriendly,
                    smokingAllowed,
                    roomType,
                    bedrooms,
                    bathrooms,
                },
            });
            setResults(response.data);
            setLoad(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoad(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div className="mt-5 p-4 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Filters Area */}
                <div className="bg-white p-4 rounded-md shadow-md lg:col-span-1">
                    <h2 className="text-lg font-semibold mb-2">Filters</h2>

                    {/* Price Range Filter */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price Range: ₹{price[0]} - ₹{price[1]}</label>
                        <input
                            type="range"
                            className="w-full range-slider"
                            min="0"
                            max="100000"
                            step="10"
                            value={price[0]}
                            onChange={(e) => setPrice([Number(e.target.value), price[1]])}
                        />
                        <input
                            type="range"
                            className="w-full range-slider"
                            min="0"
                            max="100000"
                            step="10"
                            value={price[1]}
                            onChange={(e) => setPrice([price[0], Number(e.target.value)])}
                        />
                    </div>

                    {/* Room Type Filter */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Room Type</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                        >
                            <option value="">Select Room Type</option>
                            <option value="Entire place">Entire place</option>
                            <option value="Entire place shared">Entire place (shared)</option>
                            <option value="Private room">Private room</option>
                            <option value="Shared room">Shared room</option>
                        </select>
                    </div>

                    {/* Amenities Filter */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Amenities</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={wifi}
                                onChange={(e) => setWifi(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-gray-700">WiFi</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={parking}
                                onChange={(e) => setParking(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Parking</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={kitchen}
                                onChange={(e) => setKitchen(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Kitchen</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={airConditioning}
                                onChange={(e) => setAirConditioning(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Air Conditioning</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={petFriendly}
                                onChange={(e) => setPetFriendly(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Pet Friendly</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={smokingAllowed}
                                onChange={(e) => setSmokingAllowed(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Smoking Allowed</label>
                        </div>
                    </div>

                    {/* Bedrooms Filter */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Bedrooms</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={bedrooms}
                            onChange={(e) => setBedrooms(Number(e.target.value))}
                            min="0"
                        />
                    </div>

                    {/* Bathrooms Filter */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Bathrooms</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={bathrooms}
                            onChange={(e) => setBathrooms(Number(e.target.value))}
                            min="0"
                        />
                    </div>
                </div>

                {/* Search Area */}
                <div className="flex flex-col gap-4 lg:col-span-3">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Search</h2>
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex items-center mb-4">
                            <input
                                type="text"
                                className="flex-grow p-2 border border-gray-300 rounded-md"
                                placeholder="Search by title or address"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="ml-4 p-2 bg-primary text-white rounded-md"
                                disabled={load}
                            >
                                {load ? "Searching..." : "Search"}
                            </button>
                        </form>
                    </div>

                    {/* Search Results */}
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Results</h2>
                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.map((place) => (
                                    <div key={place._id} className="bg-gray-100 p-4 rounded-md shadow-md">
                                        <img
                                            src={place.photos[0]}
                                            alt={place.title}
                                            className="w-full h-40 object-cover rounded-md mb-2"
                                        />
                                        <h3 className="text-lg font-semibold">{place.title}</h3>
                                        <p className="text-gray-600">{place.address}</p>
                                        <p className="text-gray-800 font-semibold">₹{place.price} per month</p>
                                        <p className="text-gray-600">Max Guests: {place.maxGuests}</p>
                                        <p className="text-gray-600">Bedrooms: {place.bedrooms}</p>
                                        <p className="text-gray-600">Bathrooms: {place.bathrooms}</p>
                                        <p className="text-gray-600">Rating: {place.rating}/5</p>
                                        <a
                                            href={`/place/${place._id}`}
                                            className="mt-2 inline-block p-2 bg-blue-600 text-white rounded-md"
                                        >
                                            View Details
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No results found. Please adjust your search criteria.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
