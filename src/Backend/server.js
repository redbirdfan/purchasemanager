require('dotenv').config()

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("bcrypt");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


const db =mysql.createConnection({ 
    host: "",
    user: '',
    password: '',
    database: ''
});

db.connect((err) => {
        if(err) {
                console.log("MySQL connection not made: ", err);
            return;
        }
        console.log("Connect to MySQL");
})


app.listen(5000, () => {
    console.log("Listening on port 5000")
});


app.post("/loginpage", (req, res) => {
    console.log("Server route functioning")
    res.send("Post request functioning")

})

