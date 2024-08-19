const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const userRoute = require('./routes/user.routes');
const signup = require('./routes/auth.route');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const listing = require('./routes/listingRoute');
const path = require('path');
require('dotenv').config();
app.use(cors({
    origin:[]
}))

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log(err);
});

app.use(cors({
    origin: ['https://mern-state-client.vercel.app/'],
    methods:[
        'GET',
        'POST',
        'PUT',
        'DELETE',
    ],
    credentials: true

}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/user', userRoute);
app.use('/api/auth', signup);
app.use('/api/listing', listing);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// The "catchall" handler: for any request that doesn't match the above routes, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});


// actually i have created my githu repository in client folder i want tomaove it in root folder:  mv .git ../