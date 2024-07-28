import axios from "axios";
import Image from "./Image";
import { useState } from "react";

export default function AllotDeallotWidget({ request }) {

    const [status, setStatus] = useState(request.status);

    async function allocate(ev) {
        ev.preventDefault();
        try {
            const res = await axios.post('/updateBookingStatus', {
                id: request._id,
                cur_status: 2
            });
            setStatus(2);
        }
        catch (err) {
            throw new err;
        }

    }
    async function de_allocate(ev) {
        ev.preventDefault();
        try {
            const res = await axios.post('/updateBookingStatus', {
                id: request._id,
                cur_status: 3
            });
            setStatus(3);
        }
        catch (err) {
            throw new err;
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1>Booking Id : {request._id}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border border-dashed py-2 px-3 rounded-lg">
                <div className="flex flex-col items-center gap-2">
                    <Image src={request.place.photos[0]} className="aspect-square object-cover max-h-[200px] max-w-[200px] rounded-md" />
                    <div className="text-center">Request By: {request.fullName}</div>
                </div>
                <div className="flex flex-col gap-2 sm:border-l-2 border-dashed p-2">
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>From: {new Date(request.checkIn).toLocaleDateString()}</h1>
                    </div>
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>Total Guest: {request.numberOfGuest}</h1>
                    </div>
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>Phone: {request.phone}</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-2 p-2">
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>To: {new Date(request.checkOut).toLocaleDateString()}</h1>
                    </div>
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>Total Days: {(new Date(request.checkOut) - new Date(request.checkIn)) / (1000 * 60 * 60 * 24)}</h1>
                    </div>
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>Email: {request.email}</h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                {(status === 1 || status === 3) ? (
                    <>
                        <button className="bg-green-600 hover:bg-green-400 text-white py-2 rounded-md" onClick={allocate}>Allot the place</button>
                        <button className="bg-red-600 hover:bg-red-400 text-white py-2 rounded-md" onClick={de_allocate}>Reject Request</button>
                    </>
                ) : (
                    <>
                        <button className="bg-green-600 hover:bg-green-400 text-white py-2 rounded-md cursor-not-allowed" disabled={true}>Place Allocated</button>
                        <button className="bg-red-600 hover:bg-red-400 text-white py-2 rounded-md" onClick={de_allocate}>Reject Allocation</button>
                    </>
                )}
            </div>
        </div>
    );
}
