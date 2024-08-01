import React, { useEffect, useState } from 'react';
import AccountNav from '../AccountNav';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageFlatmates = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('/flatmate/requests');
                // console.log('Fetched flatmate requests:', response.data);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching flatmate requests:', error);
            }
        };

        fetchRequests();
    }, []);

    const handleDelete = async (requestId) => {
        try {
            await axios.delete(`/flatmate/requests/${requestId}`);
            setRequests(requests.filter((request) => request._id !== requestId));
        } catch (error) {
            console.error('Error deleting flatmate request:', error);
        }
    };

    return (
        <div className='relative min-h-[70vh]'>
            <AccountNav />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {requests.map((request) => (
                    <div key={request._id} className="bg-white shadow-md rounded-lg overflow-hidden relative">
                        {request.place && request.place.photos && request.place.photos.length > 0 ? (
                            <img src={request.place.photos[0]} alt="Place" className="w-full h-48 object-cover" />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">No Photo Available</div>
                        )}
                        <div className="p-4">
                            <h2 className="text-xl font-bold">{request.name}</h2>
                            <p className="text-gray-700 mt-2">{request.introduction}</p>
                            <p className="text-gray-600 mt-1">Preference : {request.preferenceType}</p>
                            <p className="text-gray-600 mt-1">Flatmate Gender : {request.gender}</p>
                            <Link to={'/account/manageflatmates/checkrequest/' + request._id} className="mt-2 bg-primary text-white p-1 rounded-md">Total Request : {request.requestMessage.length}</Link>
                        </div>
                        <button
                            onClick={() => handleDelete(request._id)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <Link to={'/account/manageflatmates/new'} className='bg-primary rounded-full text-white p-3 fixed bottom-8 right-8 shadow-lg'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </Link>
        </div>
    );
};

export default ManageFlatmates;
