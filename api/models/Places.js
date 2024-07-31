// import mongoose from "mongoose";

// const placeSchema = new mongoose.Schema({
//     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     title: String,
//     address: String,
//     photos: [String],
//     description: String,
//     perks: [String],
//     extraInfo: String,
//     checkIn: Number,
//     checkOut: Number,
//     maxGuests: Number,
//     price: Number
// })
// const PlaceModel = mongoose.model('Places', placeSchema);
// // module.exports = UserModel; // old way
// export default PlaceModel;

import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    address: String,
    photos: [String],
    description: String,
    extraInfo: String,
    maxGuests: Number,
    price: Number,
    location: String,
    amenities: {
        wifi: Boolean,
        parking: Boolean,
        kitchen: Boolean,
        airConditioning: Boolean,
        petFriendly: Boolean,
        smokingAllowed: Boolean,
    },
    roomType: String,
    bedrooms: Number,
    bathrooms: Number,
    rating: { type: Number, min: 0, max: 5 },
    reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, comment: String, rating: Number }],
});


// Add text index to title and address fields - it is add to make sorting based on textScore
placeSchema.index({ title: 'text', address: 'text' });

const PlaceModel = mongoose.model('Places', placeSchema);

export default PlaceModel;
