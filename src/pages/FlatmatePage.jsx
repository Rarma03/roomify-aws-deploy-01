import React, { useState, useEffect } from 'react';
import IndexNav from '../IndexNav';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { Link } from 'react-router-dom';

const FlatmatePage = () => {
    const [requests, setRequests] = useState([]);
    const [interestedRequestId, setInterestedRequestId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        message: ''
    });

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.post('/fetchallflatmate'); // Adjust the endpoint if needed
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);

    const handleInterestedClick = (requestId) => {
        setInterestedRequestId(requestId);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`/flatmate/requests/${interestedRequestId}/interest`, formData);
            setInterestedRequestId(null); // Hide the form after submission
            setFormData({
                name: '',
                contact: '',
                message: ''
            });
            // Optionally, refresh the request list or handle the response
        } catch (error) {
            console.error('Error submitting interest:', error);
        }
    };

    const masonryBreakpointColumns = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div>
            <IndexNav />
            <div className="border my-2"></div>
            <div className="mt-5">
                {requests.length === 0 ? (
                    <p>No flatmate requests available.</p>
                ) : (
                    <Masonry
                        breakpointCols={masonryBreakpointColumns}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {requests.map((request) => (
                            <div key={request._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <Link to={'/place/' + request.place._id}>
                                    <img
                                        src={request.place.photos?.[0]}
                                        alt="Flatmate Photo"
                                        className="w-full h-auto object-cover rounded-t-md"
                                    />
                                </Link>
                                <h2 className="text-xl font-bold">{request.name}</h2>
                                <p className="text-gray-700 mt-2 break-words">{request.introduction}</p>
                                <p className="text-gray-700 mt-2"><b>Preferred Gender: </b>{request.gender}</p>
                                <p className="text-gray-700 mt-2 break-words"><b>Qualities I am looking for: </b>{request.preferenceType}</p>
                                <button
                                    onClick={() => handleInterestedClick(request._id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
                                >
                                    Interested
                                </button>

                                {interestedRequestId === request._id && (
                                    <form onSubmit={handleSubmit} className="mt-4">
                                        <div className="mb-4">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                                            <input
                                                type="text"
                                                id="contact"
                                                name="contact"
                                                value={formData.contact}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                rows="4"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Submit
                                        </button>
                                    </form>
                                )}
                            </div>
                        ))}
                    </Masonry>
                )}
            </div>
        </div>
    );
};

export default FlatmatePage;
