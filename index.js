if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

/* PACKAGES IMPORT */

const express = require('express');
const path = require('path');
const connectDB = require('./db');
const mongoose = require('mongoose');

/* DATABASE CONNECTION */
connectDB();

/* PACKAGES IMPORT END */

const app = express();


/* ROUTES IMPORT */

/* ROUTES IMPORT END */


const PORT = process.env.PORT || 8080;



app.listen(PORT, ()=> {
    console.log(`LISTENNG ON PORT ${PORT}`);
})