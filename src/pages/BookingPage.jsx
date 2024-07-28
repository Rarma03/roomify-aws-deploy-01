import { useEffect, useState } from 'react';
import AccountNav from '../AccountNav';
import axios from 'axios';
import BookingDates from '../BookingDates';
import { Link, useNavigate } from 'react-router-dom';
import Image from '../Image';
import RejectOptionWidget from '../RejectOptionWidget';

export default function BookingPage() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/bookings').then(res => {
            setBookings(res.data);
        });
    }, []);

    return (
        <div className='px-4 md:px-8 lg:px-16'>
            <AccountNav />
            <div className='mt-6'>
                {bookings?.length > 0 && bookings.map(booking => (
                    <div
                        // to={`/account/bookings/${booking._id}`}
                        className='flex flex-col md:flex-row gap-4 bg-gray-200 rounded-2xl overflow-hidden mt-5'
                        key={booking._id}
                    >
                        <div className='flex-shrink-0 w-full md:w-1/3 lg:w-1/4'>
                            {booking.place.photos.length > 0 && (
                                <Image
                                    className='w-full h-48 md:h-full object-cover'
                                    src={booking.place.photos[0]}
                                    alt='no image'
                                />
                            )}
                        </div>
                        <div className='flex flex-col justify-between p-4 flex-grow'>
                            <div>
                                <h2 className='font-semibold text-lg md:text-2xl'>{booking.place.title}</h2>
                                <BookingDates booking={booking} className='mt-2 md:mt-3' />
                                <div className="flex items-center gap-1 mt-2 md:mt-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                    </svg>
                                    <div className='text-sm md:text-base'>Total price:
                                        <span className='bg-primary bg-opacity-80 rounded-lg p-1 text-white ml-1'>
                                            &#8377; {booking.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-2 md:mt-3'>
                                Your Booking Status Confirmation:
                                {(booking.status === 1 || booking.status === 4) ? (
                                    <span className='text-blue-600 ml-1'>Pending</span>
                                ) : booking.status === 2 ? (
                                    <span className='text-green-600 ml-1'>Request Accepted</span>
                                ) : (
                                    <div className='flex flex-col mt-1'>
                                        <span className='text-red-600'>Request Rejected</span>
                                        <RejectOptionWidget bookedplace={booking} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
