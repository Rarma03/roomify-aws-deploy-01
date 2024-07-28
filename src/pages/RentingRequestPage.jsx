import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import Image from "../Image";
import AllotDeallotWidget from "../AllotDeallotWidget";

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
            <div className="container mx-auto mt-10 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-5">Renting Requests</h1>
                {requests.length > 0 ? (
                    requests.map(request => (
                        <div key={request._id} className="border rounded-lg p-4 mb-4 max-w-[900px] bg-white">
                            <AllotDeallotWidget request={request} />
                        </div>
                    ))
                ) : (
                    <p>No booking requests available.</p>
                )}
            </div>
        </div>
    );
}
