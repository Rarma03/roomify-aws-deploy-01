import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuest, setNumberOfGuest] = useState(1);
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [redirect, setRedirect] = useState('');
    const [status, setStatus] = useState(1);

    const calculateDays = () => {
        if (checkIn.length > 0 && checkOut.length > 0) {
            const diff = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
            return diff > 0 ? diff : 0; // Ensure positive day difference
        }
        return 0;
    };

    async function bookThisPlace() {
        try {

            const data = {
                checkIn, checkOut, numberOfGuest, fullName, phone, place: place._id, status,
                price: calculateDays() * place.price * numberOfGuest, email,
            };
            const res = await axios.post('/bookings', data);

            const bookingId = res.data._id;
            setRedirect(`/account/bookings`);
        }
        catch (err) {
            alert("Please Login to continue Booking");
            throw err;
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white p-4 rounded-2xl shadow mt-8 h-fit">
            <div className="text-center font-semibold">
                Price: &#8377; {place.price} / per month
            </div>
            <div className="border rounded-2xl mt-4 text-xs md:text-base">
                <div className="flex ">
                    <div className="px-4 py-3">
                        <label>Check-In: </label>
                        <input type="date"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="px-4 py-3 border-l">
                        <label>Check-Out: </label>
                        <input type="date"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                </div>
                <div className="px-4 py-3 border-t">
                    <label>Guest Count : </label>
                    <input type="number" placeholder="1"
                        value={numberOfGuest}
                        onChange={ev => setNumberOfGuest(ev.target.value)} />
                </div>
                {checkIn.length > 0 && checkOut.length > 0 && (
                    <div className="px-4 py-3 border-t flex flex-col gap-2">
                        <div>
                            <label>Full Name : </label>
                            <input type="string" placeholder="e.g. Raj Verma"
                                value={fullName}
                                onChange={ev => setFullName(ev.target.value)} />
                        </div>
                        <div>
                            <label>Phone No. : </label>
                            <input type="string" placeholder="e.g. +91 98765 43210"
                                value={phone}
                                onChange={ev => setPhone(ev.target.value)} />
                        </div>
                        <div>
                            <label>Email : </label>
                            <input type="string" placeholder="e.g. tmp@gmail.com"
                                value={email}
                                onChange={ev => setEmail(ev.target.value)} />
                        </div>
                    </div>
                )}
            </div>
            <button className="mt-4 bg-primary p-2 w-full text-white rounded-2xl hover:bg-sky-700 hover:shadow-xl cursor-pointer" onClick={bookThisPlace}>
                Send Booking Request
                {checkIn.length > 0 && checkOut.length > 0 && (
                    <span>
                        &nbsp;for {calculateDays()} days
                    </span>
                )}
            </button>
            <h2>
                {checkIn.length > 0 && checkOut.length > 0 && (
                    <span>
                        Total Amount : {calculateDays() * place.price * numberOfGuest} &#8377;
                    </span>
                )}
            </h2>
        </div>
    );
}
