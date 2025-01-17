import React, { useEffect, useState } from 'react';
import PhotoUploader from '../PhotoUploader';
import axios from 'axios';
import AccountNav from '../AccountNav';
import { Navigate, useParams } from 'react-router-dom';

export default function PlacesFormPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);
    const [amenities, setAmenities] = useState({
        wifi: false,
        parking: false,
        kitchen: false,
        airConditioning: false,
        petFriendly: false,
        smokingAllowed: false
    });
    const [roomType, setRoomType] = useState('');
    const [bedrooms, setBedrooms] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then((res) => {
            const { data } = res;
            setTitle(data.title || '');
            setAddress(data.address || '');
            setAddedPhotos(data.photos || []);
            setDescription(data.description || '');
            setExtraInfo(data.extraInfo || '');
            setMaxGuests(data.maxGuests || 1);
            setPrice(data.price || 100);
            setAmenities(data.amenities || {
                wifi: false,
                parking: false,
                kitchen: false,
                airConditioning: false,
                petFriendly: false,
                smokingAllowed: false
            });
            setRoomType(data.roomType || '');
            setBedrooms(data.bedrooms || 0);
            setBathrooms(data.bathrooms || 0);
            setLocation(data.location || '');
        }).catch((error) => {
            console.error("Error fetching place data:", error);
        });
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
            title,
            address,
            addedPhotos,
            description,
            extraInfo,
            maxGuests,
            price,
            amenities,
            roomType,
            bedrooms,
            bathrooms,
            location
        };

        try {
            if (id) {
                // Updating the already existing place
                const { data } = await axios.put(`/places/${id}`, placeData);
                console.log(data);
                setRedirect(true);
            } else {
                // Adding new place
                const { data } = await axios.post('/places', placeData);
                console.log(data);
                setRedirect(true);
            }
        } catch (error) {
            console.error("Error saving place:", error);
        }
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />;
    }

    return (
        <>
            <AccountNav />
            <div className='border-2 p-2 border-primary rounded-md'>
                <form onSubmit={savePlace}>
                    {preInput('*Title', 'Keep your title as short as possible and as descriptive as it can be')}
                    <input
                        type="text"
                        placeholder='e.g. My Lovely apartment'
                        value={title}
                        onChange={ev => setTitle(ev.target.value)}
                    />
                    {preInput('*Address', 'Make it large and as much as descriptive as possible')}
                    <input
                        type="text"
                        placeholder='e.g. 14-h ring road'
                        value={address}
                        onChange={ev => setAddress(ev.target.value)}
                    />
                    {preInput('*Location', 'Provide the specific location or area of your place')}
                    <input
                        type="text"
                        placeholder='e.g. please use google maps link here'
                        value={location}
                        onChange={ev => setLocation(ev.target.value)}
                    />

                    {preInput('Photos', 'More photos increase the chance your place gets selected')}
                    <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

                    {preInput('*Description', 'Write the details about your place, e.g. nearest places, stations, area, services provided')}
                    <textarea
                        rows='4'
                        cols='50'
                        placeholder='->'
                        value={description}
                        onChange={ev => setDescription(ev.target.value)}
                    />
                    {preInput('Amenities', 'Select the amenities available at your place')}
                    <div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                        <div className='flex items-center'>
                            <input
                                type="checkbox"
                                checked={amenities.wifi || false}
                                onChange={(e) => setAmenities(prev => ({ ...prev, wifi: e.target.checked }))}
                                className="mr-2"
                            />
                            <label className="text-gray-700">WiFi</label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type="checkbox"
                                checked={amenities.parking || false}
                                onChange={(e) => setAmenities(prev => ({ ...prev, parking: e.target.checked }))}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Parking</label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type="checkbox"
                                checked={amenities.kitchen || false}
                                onChange={(e) => setAmenities(prev => ({ ...prev, kitchen: e.target.checked }))}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Kitchen</label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type="checkbox"
                                checked={amenities.airConditioning || false}
                                onChange={(e) => setAmenities(prev => ({ ...prev, airConditioning: e.target.checked }))}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Air Conditioning</label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type="checkbox"
                                checked={amenities.petFriendly || false}
                                onChange={(e) => setAmenities(prev => ({ ...prev, petFriendly: e.target.checked }))}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Pet Friendly</label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type="checkbox"
                                checked={amenities.smokingAllowed || false}
                                onChange={(e) => setAmenities(prev => ({ ...prev, smokingAllowed: e.target.checked }))}
                                className="mr-2"
                            />
                            <label className="text-gray-700">Smoking Allowed</label>
                        </div>
                    </div>
                    {preInput('Extra Info', 'e.g. house rules, sleep time, etc...')}
                    <textarea
                        cols='50'
                        placeholder='->'
                        value={extraInfo}
                        onChange={ev => setExtraInfo(ev.target.value)}
                    />
                    {preInput('Room Type', 'Specify the type of room')}
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                    >
                        <option value="">Select Room Type</option>
                        <option value="Entire place">Entire place (private)</option>
                        <option value="Entire place shared">Entire place (shared) </option>
                        <option value="Private room">Private room</option>
                        <option value="Shared room">Shared room</option>
                    </select>
                    {preInput('Bedrooms', 'Number of bedrooms')}
                    <input
                        type="number"
                        placeholder='Number of bedrooms'
                        value={bedrooms}
                        onChange={ev => setBedrooms(Number(ev.target.value))}
                    />
                    {preInput('Bathrooms', 'Number of bathrooms')}
                    <input
                        type="number"
                        placeholder='Number of bathrooms'
                        value={bathrooms}
                        onChange={ev => setBathrooms(Number(ev.target.value))}
                    />
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                        <div>
                            <h2 className='mt-2 -mb-1'>Max no. of Guests</h2>
                            <input
                                type="number"
                                placeholder='4'
                                value={maxGuests}
                                onChange={ev => setMaxGuests(Number(ev.target.value))}
                            />
                        </div>
                        <div>
                            <h2 className='mt-2 -mb-1'>Price per Month</h2>
                            <input
                                type="number"
                                placeholder='100'
                                value={price}
                                onChange={ev => setPrice(Number(ev.target.value))}
                            />
                        </div>
                    </div>
                    <input type="submit" value="Save" className="mt-4 p-2 bg-blue-500 text-white rounded-md cursor-pointer" />
                </form>
            </div>
        </>
    );
}



// old code
// import { useEffect, useState } from "react";
// import Perks from "../Perks";
// import PhotoUploader from "../PhotoUploader";
// import axios from "axios";
// import AccountNav from "../AccountNav";
// import { Navigate, useParams } from "react-router-dom";

// export default function PlacesFormPage() {
//     const { id } = useParams();
//     const [title, setTitle] = useState('');
//     const [address, setAddress] = useState('');
//     const [addedPhotos, setAddedPhotos] = useState([]);
//     const [description, setDescription] = useState('');
//     const [perks, setPerks] = useState([]);
//     const [extraInfo, setExtraInfo] = useState('');
//     const [checkIn, setCheckIn] = useState('');
//     const [checkOut, setCheckOut] = useState('');
//     const [maxGuests, setMaxGuests] = useState(1);
//     const [price, setPrice] = useState(100);
//     const [redirect, setRedirect] = useState(false);

//     useEffect(() => {
//         if (!id) {
//             return;
//         }
//         axios.get('/places/' + id).then((res) => {
//             const { data } = res;
//             setTitle(data.title);
//             setAddress(data.address);
//             setAddedPhotos(data.photos);
//             setDescription(data.description);
//             setPerks(data.perks);
//             setExtraInfo(data.extraInfo);
//             setCheckIn(data.checkIn);
//             setCheckOut(data.checkOut);
//             setMaxGuests(data.maxGuests);
//             setPrice(data.price);
//         })
//     }, [id])

//     function inputHeader(text) {
//         return (
//             <h2 className="text-2xl mt-4">{text}</h2>
//         );
//     }

//     function inputDescription(text) {
//         return (
//             <p className="text-gray-500 text-sm">{text}</p>
//         );
//     }

//     function preInput(header, description) {
//         return (
//             <>
//                 {inputHeader(header)}
//                 {inputDescription(description)}
//             </>
//         );
//     }

//     async function savePlace(ev) {
//         ev.preventDefault();
//         const placeData = {
//             title,
//             address,
//             addedPhotos,
//             description,
//             perks,
//             extraInfo,
//             checkIn,
//             checkOut,
//             maxGuests,
//             price
//         };

//         try {
//             if (id) {
//                 // Updating the already existing place
//                 const { data } = await axios.put(`/places/${id}`, placeData);
//                 console.log(data);
//                 setRedirect(true);
//             } else {
//                 // Adding new place
//                 const { data } = await axios.post('/places', placeData);
//                 console.log(data);
//                 setRedirect(true);
//             }
//         } catch (error) {
//             console.error("Error saving place:", error);
//         }
//     }


//     if (redirect) {
//         return <Navigate to={'/account/places'} />
//     }

//     return (
//         <>
//             <AccountNav />
//             <div className='border-2 p-2 border-primary rounded-md'>
//                 <form onSubmit={savePlace}>
//                     {preInput('*Title', 'Keep your title as short as possible and as descriptive as it can be')}
//                     <input
//                         type="text"
//                         placeholder='e.g. My Lovely apartment'
//                         value={title}
//                         onChange={ev => setTitle(ev.target.value)}
//                     />
//                     {preInput('*Address', 'Make it large and as much as descriptive as possible')}
//                     <input
//                         type="text"
//                         placeholder=' e.g. 14-h ring road'
//                         value={address}
//                         onChange={ev => setAddress(ev.target.value)}
//                     />
//                     {preInput('Photos', 'More photos increase the chance your place gets selected')}

//                     <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

//                     {preInput('*Description', 'Write the details about your place, e.g. nearest places, stations, area, services provided')}
//                     <textarea
//                         rows='4'
//                         cols='50'
//                         placeholder='->'
//                         value={description}
//                         onChange={ev => setDescription(ev.target.value)}
//                     />
//                     {preInput('Perks', 'Brief about your perks, e.g. free food, 1km far from station')}
//                     <div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
//                         <Perks selected={perks} onChange={setPerks} />
//                     </div>
//                     {preInput('Extra Info', 'e.g. house rules, sleep time, etc...')}
//                     <textarea
//                         cols='50'
//                         placeholder='->'
//                         value={extraInfo}
//                         onChange={ev => setExtraInfo(ev.target.value)}
//                     />
//                     {preInput('Check In & Check Out Times', 'Add check-in and check-out times & keep in mind to have time gaps between guest switch')}
//                     <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
//                         <div>
//                             <h2 className='mt-2 -mb-1'>Check In</h2>
//                             <input
//                                 type="text"
//                                 placeholder='14:00'
//                                 value={checkIn}
//                                 onChange={ev => setCheckIn(ev.target.value)}
//                             />
//                         </div>
//                         <div>
//                             <h2 className='mt-2 -mb-1'>Check Out</h2>
//                             <input
//                                 type="text"
//                                 placeholder='15:00'
//                                 value={checkOut}
//                                 onChange={ev => setCheckOut(ev.target.value)}
//                             />
//                         </div>
//                         <div>
//                             <h2 className='mt-2 -mb-1'>Max no. of Guests</h2>
//                             <input
//                                 type="number"
//                                 placeholder='4'
//                                 value={maxGuests}
//                                 onChange={ev => setMaxGuests(ev.target.value)}
//                             />
//                         </div>
//                         <div>
//                             <h2 className='mt-2 -mb-1'>Price per night</h2>
//                             <input
//                                 type="number"
//                                 placeholder='4'
//                                 value={price}
//                                 onChange={ev => setPrice(ev.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <input type="submit" value="Save" />
//                 </form>
//             </div>
//         </>
//     );
// }
