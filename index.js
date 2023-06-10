if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db");
const passport = require("passport");
const schedule = require("node-schedule");


const sendMail = require("./mailsender");
const getSWforMail = require("./controllers/Email");

/* DATABASE CONNECTION */
connectDB();

/* CONFIGURATION */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(passport.initialize());
require("./passport");

/* ROUTES IMPORT */
const authRoutes = require("./routes/Auth");
const childRoutes = require("./routes/Child");
const operatorRoutes = require("./routes/Operator");

/* SETTING UP ROUTES */
app.use("/auth", authRoutes);
app.use("/child", childRoutes);
app.use("/operator", operatorRoutes);

/* DAILY MIDNIGHT SCHEDULE */
// change to 0 0 * * * *
schedule.scheduleJob("0 0 0 * * *", async () => {
    const resp = await getSWforMail();
    
    resp.forEach(async (obj) => {
        const mailObj = {
            to_mail: obj.workerEmail[0],
            name: obj.workerName[0],
            taskName: obj.firstIncompleteSubtask[0],
        }
        console.log(mailObj);
        await sendMail(mailObj)
    });
});



const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`LISTENNG ON PORT ${PORT}`);
});
