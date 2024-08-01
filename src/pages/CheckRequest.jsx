import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AccountNav from '../AccountNav';
import axios from 'axios';

const CheckRequest = () => {
    const [requests, setRequests] = useState([]);
    const { id } = useParams(); // Destructure id from useParams

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`/flatmate/requests/${id}`); // Adjust the endpoint to match the API route
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching flatmate requests:', error);
            }
        };

        fetchRequests();
    }, [id]); // Add id as a dependency

    const handleAccept = async (messageId) => {
        try {
            const response = await axios.put(`/flatmate/requests/${id}/accept`, { messageId });
            setRequests(response.data); // Update the state with the updated request data
        } catch (error) {
            console.error('Error accepting flatmate request:', error);
        }
    };

    const handleReject = async (messageId) => {
        try {
            const response = await axios.put(`/flatmate/requests/${id}/reject`, { messageId });
            setRequests(response.data); // Update the state with the updated request data
        } catch (error) {
            console.error('Error rejecting flatmate request:', error);
        }
    };

    return (
        <>
            <AccountNav />
            <div className='mt-5'>
                <Link to={'/account/manageflatmates'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                </Link>
            </div>
            <div className='mt-5'>
                {requests.length === 0 ? (
                    <p>No requests found.</p>
                ) : (
                    requests.map((message) => (
                        <div key={message._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                            <h2 className="text-xl font-bold">{message.user_name}</h2>
                            <p className="text-gray-700 mt-2">{message.message}</p>
                            <p className="text-gray-600 mt-1">Phone: {message.connectionStatus === 1 ? (
                                <span className=''>
                                    {message.phone}
                                    <span className='flex bg-yellow-200 text-red-600 w-fit px-2'>As you accepted - Contact the person within 24hr</span>
                                </span>
                            ) : 'Hidden'}</p>
                            <div className="mt-4">
                                <button
                                    onClick={() => handleAccept(message._id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                                >
                                    {message.connectionStatus === 1 ? "Accepted" :
                                        "Accept"}
                                </button>
                                <button
                                    onClick={() => handleReject(message._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default CheckRequest;
