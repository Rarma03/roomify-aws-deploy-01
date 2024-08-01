import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import imageDownloader from 'image-downloader';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import fs from 'fs';
import Place from './models/Places.js';
import axios from 'axios';
import Booking from './models/Booking.js';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import mime from 'mime-types';
import FlatmateModel from './models/FlatmateRequest.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// basically the secret means key through which key password is hashed  
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "ajlj3342nowpqpn453908";
const bucket = 'raj-booking-app';

app.use(express.json());
app.use(cookieParser());

// this is done to make photo visible at placeForm page
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}));



// mimetype means type of file image, pdf, etc..
async function uploadToS3(path, originalFilename, mimetype) {
    mongoose.connect(process.env.MONGO_URL);
    path = path.replace(/\\/g, '/'); // convert \\ to /
    const client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    })
    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1]; // extension of file

    const newFilename = Date.now() + '.' + ext;
    console.log({ path, mimetype, newFilename, ext });

    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read'
    }));

    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

app.get('/api/', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json('test okay');
});

app.post('/api/register', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        });

        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post('/api/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({ email });
        if (userDoc) {
            const isPasswordValid = bcrypt.compareSync(password, userDoc.password);
            if (isPasswordValid) {
                jwt.sign({ email: userDoc.email, name: userDoc.name, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, {}).json(userDoc);
                });
            } else {
                res.status(400).json({ error: "Invalid password" });
            }
        } else {
            res.status(400).json({ error: "User not found" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

app.get('/api/profile', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        })
    }
    else {
        res.json(null);
    }
    // res.json({ token });
})


app.post('/api/logout', (req, res) => {
    // mongoose.connect(process.env.MONGO_URL);
    res.cookie('token', '').json(true);
})

// console.log({ __dirname });
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

app.post('/api/upload-by-link', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { link } = req.body;

    if (!link || !isValidUrl(link)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const newName = Date.now() + '.jpg';
    const destPath = '/tmp/' + newName; // Fixed path concatenation

    try {
        await imageDownloader.image({
            url: link,
            dest: destPath
        });

        const url = await uploadToS3('/tmp/' + newName, newName, mime.lookup('/tmp/' + newName));

        res.json(url); // Sending just the filename back to the client
    } catch (error) {
        console.error('Error downloading image:', error);
        res.status(500).json({ error: 'Failed to download image' });
    }
});

const photosMiddleware = multer({ dest: '/tmp' });
app.post('/api/upload', photosMiddleware.array('photos', 100), async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname, mimetype } = req.files[i];
        const url = await uploadToS3(path, originalname, mimetype);
        uploadedFiles.push(url);
    }
    res.json(uploadedFiles);
});


// app.post('/api/places', (req, res) => {
//     mongoose.connect(process.env.MONGO_URL);
//     const { token } = req.cookies;

//     jwt.verify(token, jwtSecret, {}, async (err, user) => {
//         if (err) {
//             console.error('JWT verification failed:', err);
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;

//         if (!title || !address || !description) {
//             alert('required field missing !!');
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         try {
//             const placeDoc = await Place.create({
//                 owner: user.id,
//                 title,
//                 address,
//                 photos: addedPhotos,
//                 description,
//                 perks,
//                 extraInfo,
//                 checkIn,
//                 checkOut,
//                 maxGuests,
//                 price
//             });
//             res.json(placeDoc);
//         } catch (error) {
//             console.error('Error creating place:', error);
//             res.status(500).json({ error: 'Internal server error' });
//         }
//     });
// });
app.post('/api/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { title, address, addedPhotos, description, amenities, extraInfo, maxGuests, price, location, roomType, bedrooms, bathrooms } = req.body;

        if (!title || !address || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const placeDoc = await Place.create({
                owner: user.id,
                title,
                address,
                photos: addedPhotos,
                description,
                amenities, // Changed from perks to amenities
                extraInfo,
                maxGuests,
                price,
                location,
                roomType,
                bedrooms,
                bathrooms,
            });
            res.json(placeDoc);
        } catch (error) {
            console.error('Error creating place:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});


app.get('/api/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json(await Place.find());
})

app.get('/api/user-places', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = user;

        try {
            const places = await Place.find({ owner: id });
            res.json(places);
        } catch (error) {
            console.error('Error fetching places:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.get('/api/places/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    res.json(await Place.findById(id));
})



// app.put('/api/places/:id', async (req, res) => {
//     mongoose.connect(process.env.MONGO_URL);
//     const { token } = req.cookies;
//     const { id } = req.params;
//     const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;

//     jwt.verify(token, jwtSecret, {}, async (err, user) => {
//         if (err) {
//             console.error('JWT verification failed:', err);
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         try {
//             const placeDoc = await Place.findById(id);

//             if (!placeDoc) {
//                 return res.status(404).json({ error: 'Place not found' });
//             }

//             if (user.id !== placeDoc.owner.toString()) {
//                 return res.status(403).json({ error: 'Forbidden' });
//             }

//             placeDoc.set({
//                 title,
//                 address,
//                 photos: addedPhotos,
//                 description,
//                 perks,
//                 extraInfo,
//                 checkIn,
//                 checkOut,
//                 maxGuests,
//                 price
//             });

//             await placeDoc.save();
//             res.json('okay');
//         } catch (error) {
//             console.error('Error updating place:', error);
//             res.status(500).json({ error: 'Internal server error' });
//         }
//     });
// });
app.put('/api/places/:id', async (req, res) => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        const { token } = req.cookies;
        const { id } = req.params;
        const { title, address, addedPhotos, description, amenities, extraInfo, maxGuests, price, roomType, bedrooms, bathrooms, location } = req.body;

        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) {
                console.error('JWT verification failed:', err);
                return res.status(401).json({ error: 'Unauthorized' });
            }

            try {
                const placeDoc = await Place.findById(id);

                if (!placeDoc) {
                    return res.status(404).json({ error: 'Place not found' });
                }

                if (user.id !== placeDoc.owner.toString()) {
                    return res.status(403).json({ error: 'Forbidden' });
                }

                placeDoc.set({
                    title,
                    address,
                    photos: addedPhotos,
                    description,
                    amenities,
                    extraInfo,
                    maxGuests,
                    price,
                    roomType,
                    bedrooms,
                    bathrooms,
                    location
                });

                await placeDoc.save();
                res.json('okay');
            } catch (error) {
                console.error('Error updating place:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    } catch (error) {
        console.error('Error in PUT request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, (err, user) => {
            if (err) return reject(err);  // Correctly reject on error
            resolve(user);
        });
    });
}

app.post('/api/bookings', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { checkIn, checkOut, numberOfGuest, fullName, phone, price, place, email, status } = req.body; // Destructure the necessary fields

    try {
        const userData = await getUserDataFromReq(req); // Assuming getUserDataFromReq should be getUserDataFromToken

        const booking = await Booking.create({
            checkIn, checkOut, numberOfGuest, fullName, phone, price, place, email, status,
            user: userData.id
        });

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create booking', details: err.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({ user: userData.id }).populate('place'))
})


app.get('/api/rentingrequests', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const bookings = await Booking.find()
                .populate('place')
                .populate('user', 'name email');

            // Filter bookings where the owner is the logged-in user
            const ownerBookings = bookings.filter(booking => booking.place.owner.toString() === user.id);

            res.json(ownerBookings);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.post('/api/updateBookingStatus', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) {
                console.error('JWT verification failed:', err);
                return res.status(401).json({ error: 'Unauthorized' });
            }

            try {
                const { id, cur_status } = req.body;
                const booking = await Booking.findById(id);

                if (!booking) {
                    return res.status(404).json({ error: 'Booking not found' });
                }

                booking.status = cur_status;
                await booking.save();

                res.status(200).json({ message: 'Booking status updated successfully' });
            } catch (error) {
                console.error('Error fetching booking requests:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Database connection error' });
    }
});

app.post('/api/deleteBooking', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const { id } = req.body;
            const booking = await Booking.findById(id);

            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            // Ensure the user is authorized to delete this booking
            // console.log(booking.user.toString());
            // console.log(user.id);
            if (booking.user.toString() !== user.id) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            await Booking.findByIdAndDelete(id);

            res.status(200).json({ message: 'Booking deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting booking:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// app.get('/api/search', async (req, res) => {
//     try {
//         const { search, price, wifi, parking, kitchen, airConditioning, petFriendly, smokingAllowed, roomType, bedrooms, bathrooms } = req.query;

//         // Convert price to an array of numbers
//         const priceRange = price ? price.split(',').map(Number) : [0, 100000];

//         // Create a filter object
//         const filters = {
//             price: { $gte: priceRange[0], $lte: priceRange[1] },
//             'amenities.wifi': wifi === 'true',
//             'amenities.parking': parking === 'true',
//             'amenities.kitchen': kitchen === 'true',
//             'amenities.airConditioning': airConditioning === 'true',
//             'amenities.petFriendly': petFriendly === 'true',
//             'amenities.smokingAllowed': smokingAllowed === 'true',
//             roomType: roomType ? { $regex: roomType, $options: 'i' } : undefined,
//             bedrooms: { $gte: Number(bedrooms) },
//             bathrooms: { $gte: Number(bathrooms) },
//         };

//         // Add regex search for title and address
//         if (search) {
//             filters.$or = [
//                 { title: { $regex: search, $options: 'i' } },
//                 { address: { $regex: search, $options: 'i' } }
//             ];
//         }

//         // Remove undefined or false filters
//         Object.keys(filters).forEach(key => {
//             if (filters[key] === undefined || filters[key] === false) {
//                 delete filters[key];
//             }
//         });

//         const places = await Place.find(filters);

//         res.json(places);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// });
app.get('/api/search', async (req, res) => {
    try {
        const { search, price, wifi, parking, kitchen, airConditioning, petFriendly, smokingAllowed, roomType, bedrooms, bathrooms } = req.query;

        // Convert price to an array of numbers
        const priceRange = price ? price.split(',').map(Number) : [0, 100000];

        // Create a filter object
        const filters = {
            price: { $gte: priceRange[0], $lte: priceRange[1] },
            'amenities.wifi': wifi === 'true',
            'amenities.parking': parking === 'true',
            'amenities.kitchen': kitchen === 'true',
            'amenities.airConditioning': airConditioning === 'true',
            'amenities.petFriendly': petFriendly === 'true',
            'amenities.smokingAllowed': smokingAllowed === 'true',
            roomType: roomType ? { $regex: roomType, $options: 'i' } : undefined,
            bedrooms: { $gte: Number(bedrooms) },
            bathrooms: { $gte: Number(bathrooms) },
        };

        // Add text search if search query is provided
        if (search) {
            filters.$text = { $search: search };
        }

        // Remove undefined or false filters
        Object.keys(filters).forEach(key => {
            if (filters[key] === undefined || filters[key] === false) {
                delete filters[key];
            }
        });

        // Find places with the applied filters
        let places;
        if (search) {
            // If search query is present, sort by text score
            places = await Place.find(filters, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
        } else {
            // If no search query, just find with filters
            places = await Place.find(filters);
        }

        res.json(places);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// FLATEMATE SECTION
app.post('/api/flatmate', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;
    const {
        name,
        introduction,
        preferenceType,
        gender,
        place,
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const flatmateDoc = await FlatmateModel.create({
                name,
                introduction,
                preferenceType,
                gender,
                place,
                owner: user.id,
            });
            res.json(flatmateDoc);
        } catch (error) {
            console.error('Error creating Flatmate Request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.get('/api/flatmate/requests', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, {}, async (err, user) => { // Make sure to replace jwtSecret with process.env.JWT_SECRET if you use environment variables
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const flatmateRequests = await FlatmateModel.find({ owner: user.id }).populate('place');
            res.json(flatmateRequests);
        } catch (error) {
            console.error('Error fetching flatmate requests:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.delete('/api/flatmate/requests/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, async (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const requestId = req.params.id;
            const flatmateRequest = await FlatmateModel.findOneAndDelete({ _id: requestId, owner: user.id });

            if (!flatmateRequest) {
                return res.status(404).json({ error: 'Request not found' });
            }

            res.json({ message: 'Request deleted successfully' });
        } catch (error) {
            console.error('Error deleting flatmate request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.get('/api/flatmate/requests/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const { id } = req.params;

            // Find the request with the specific ID and populate requestMessage
            const request = await FlatmateModel.findOne({ _id: id }).populate('requestMessage');

            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }

            res.json(request.requestMessage); // Send only the requestMessage
        } catch (error) {
            console.error('Error fetching flatmate requests:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.put('/api/flatmate/requests/:id/accept', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const { id } = req.params;
            const { messageId } = req.body;

            // Use findOneAndUpdate with the positional $ operator to update the specific requestMessage
            const request = await FlatmateModel.findOneAndUpdate(
                { _id: id, owner: user.id, 'requestMessage._id': messageId },
                { $set: { 'requestMessage.$.connectionStatus': 1 } },
                { new: true, runValidators: true }
            );

            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }

            res.json(request.requestMessage); // Send the updated requestMessage array
        } catch (error) {
            console.error('Error accepting flatmate request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});


app.put('/api/flatmate/requests/:id/reject', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const { id } = req.params;
            const { messageId } = req.body;

            const request = await FlatmateModel.findOneAndUpdate(
                { _id: id, owner: user.id },
                { $pull: { requestMessage: { _id: messageId } } },
                { new: true }
            );

            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }

            res.json(request.requestMessage); // Send only the updated requestMessage
        } catch (error) {
            console.error('Error rejecting flatmate request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.post('/api/fetchallflatmate', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json(await FlatmateModel.find().populate('place'));
})

app.post('/api/flatmate/requests/:id/interest', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    const { name, message, contact } = req.body;
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const flatmateRequest = await FlatmateModel.findById(id);
            if (!flatmateRequest) {
                return res.status(404).json({ error: 'Flatmate request not found' });
            }

            const requestIndex = flatmateRequest.requestMessage.findIndex(
                (req) => req.requestSender.toString() === user.id
            );

            if (requestIndex !== -1) {
                // Update the existing request message
                flatmateRequest.requestMessage[requestIndex] = {
                    requestSender: user.id,
                    user_name: name,
                    message,
                    phone: contact,
                    connectionStatus: 0
                };
            } else {
                // Add a new request message if it doesn't exist
                flatmateRequest.requestMessage.push({
                    requestSender: user.id,
                    user_name: name,
                    message,
                    phone: contact,
                    connectionStatus: 0
                });
            }

            await flatmateRequest.save();
            res.status(200).json(flatmateRequest);
        } catch (error) {
            console.error('Error updating flatmate request with interest:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
