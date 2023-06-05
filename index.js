if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const cors = require("cors");
const connectDB = require('./db');
const passport = require("passport");


/* DATABASE CONNECTION */
connectDB();

/* CONFIGURATION */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(passport.initialize());
require("./passport");


/* ROUTES IMPORT */
const authRoutes = require('./routes/Auth');
const childRoutes = require('./routes/Child');


/* SETTING UP ROUTES */
app.use('/auth', authRoutes);
app.use('/child', childRoutes);


const PORT = process.env.PORT || 8080;



app.listen(PORT, ()=> {
    console.log(`LISTENNG ON PORT ${PORT}`);
})