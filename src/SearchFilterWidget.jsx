import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SearchFilterWidget() {
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
    const [places, setPlaces] = useState([]);

    const fetchPlaces = async () => {
        try {
            const { data } = await axios.get('/search', {
                params: {
                    price,
                    wifi,
                    parking,
                    kitchen,
                    airConditioning,
                    petFriendly,
                    smokingAllowed,
                    roomType,
                    bedrooms,
                    bathrooms
                }
            });
            setPlaces(data);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, [price, wifi, parking, kitchen, airConditioning, petFriendly, smokingAllowed, roomType, bedrooms, bathrooms]);

    return (
        <div className="bg-white p-4 rounded-md shadow-md lg:col-span-1">
            <h2 className="text-lg font-semibold mb-2">Filters</h2>

            {/* Price Range Filter */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price Range: ₹{price[0]} - ₹{price[1]}</label>
                <input
                    type="range"
                    className="w-full"
                    min="0"
                    max="100000"
                    step="1000"
                    value={price[0]}
                    onChange={(e) => setPrice([Number(e.target.value), price[1]])}
                />
                <input
                    type="range"
                    className="w-full"
                    min="0"
                    max="100000"
                    step="1000"
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

            {/* Display Filtered Places */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Filtered Places</h2>
                {places.length > 0 ? (
                    places.map(place => (
                        <div key={place._id} className="p-4 mb-4 border border-gray-300 rounded-md">
                            <h3 className="text-xl font-semibold">{place.title}</h3>
                            <p className="text-gray-700">{place.address}</p>
                            <p className="text-gray-700">Price: ₹{place.price}</p>
                            <p className="text-gray-700">Room Type: {place.roomType}</p>
                            <p className="text-gray-700">Bedrooms: {place.bedrooms}</p>
                            <p className="text-gray-700">Bathrooms: {place.bathrooms}</p>
                            <p className="text-gray-700">Amenities:
                                {place.amenities.wifi && " WiFi"}
                                {place.amenities.parking && " Parking"}
                                {place.amenities.kitchen && " Kitchen"}
                                {place.amenities.airConditioning && " Air Conditioning"}
                                {place.amenities.petFriendly && " Pet Friendly"}
                                {place.amenities.smokingAllowed && " Smoking Allowed"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No places found with the selected filters.</p>
                )}
            </div>
        </div>
    );
}

