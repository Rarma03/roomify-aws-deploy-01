import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";

export default function RentingRequestPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('/requests');
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);

    return (
        <div>
            <AccountNav />
            <div className="container mx-auto mt-10">
                <h1 className="text-2xl font-bold mb-5">Renting Requests</h1>
                {requests.length > 0 ? (
                    requests.map(request => (
                        <div key={request._id} className="border rounded-lg p-4 mb-4">
                            <h2 className="text-xl font-semibold">{request.place.title}</h2>
                            <p><strong>Booked by:</strong> {request.fullName}</p>
                            <p><strong>Email:</strong> {request.email}</p>
                            <p><strong>Phone:</strong> {request.phone}</p>
                            <p><strong>Number of Guests:</strong> {request.numberOfGuest}</p>
                            <p><strong>Check-in:</strong> {new Date(request.checkIn).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> {new Date(request.checkOut).toLocaleDateString()}</p>
                            <p><strong>Total Days:</strong> {(new Date(request.checkOut) - new Date(request.checkIn)) / (1000 * 60 * 60 * 24)}</p>
                            <p><strong>Total Price:</strong> &#8377;{request.price}</p>
                        </div>
                    ))
                ) : (
                    <p>No booking requests available.</p>
                )}
            </div>
        </div>
    );
}
