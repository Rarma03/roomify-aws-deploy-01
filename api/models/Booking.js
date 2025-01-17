import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Places' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    numberOfGuest: { type: String, required: true },
    price: Number,
    status: { type: Number, Default: 1 }
});

const BookingModel = mongoose.model('Booking', bookingSchema);

export default BookingModel;