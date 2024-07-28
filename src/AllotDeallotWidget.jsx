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
            {status === 4 && (
                <div className="text-red-600 bg-yellow-300 text-center">Re-Requested</div>
            )}

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
                        <h1 className="flex items-center justify-center gap-2">
                            Phone:
                            <a href={`tel:${request.phone}`} className="text-white underline flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
                                </svg>
                                {request.phone}
                            </a>
                        </h1>
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

            <div>
                {(status === 1 || status === 4) ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <button className="bg-green-600 hover:bg-green-400 text-white py-2 rounded-md" onClick={allocate}>Allot the place</button>
                            <button className="bg-red-600 hover:bg-red-400 text-white py-2 rounded-md" onClick={de_allocate}>Reject Request</button>
                        </div>
                    </>
                ) : status === 2 ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <button className="bg-green-600 hover:bg-green-400 text-white py-2 rounded-md cursor-not-allowed flex justify-center" disabled={true}>Place Allocated<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                            </button>
                            <button className="bg-red-600 hover:bg-red-400 text-white py-2 rounded-md" onClick={de_allocate}>Reject Allocation</button>
                        </div>
                    </>
                ) : (
                    <>
                        <button className="bg-red-600 hover:bg-red-400 text-white py-2 rounded-md w-full cursor-not-allowed" onClick={de_allocate}>Request is Rejected</button>
                    </>
                )
                }
            </div>
        </div>
    );
}
