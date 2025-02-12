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
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect((err) => {
        if(err) {
                console.log("MySQL connection not made: ", err);
            return;
        }
        console.log("Connected to MySQL");
})


app.listen(5000, () => {
    console.log("Listening on port 5000")
});


app.post("/loginPage", (req, res) => {
    const loginUsername = req.body.username;
    const loginPassword = req.body.password
    
    const search = 'SELECT * FROM users WHERE Username = ? AND password = ?'

    db.query(search, [loginUsername, loginPassword], (err, results) => {
            if(err) {
                console.error(err);
                res.status(500).send('error during login')
                return;
             } 

             if(results.length  === 0) {
                return res.status(401).json({ success: false, message: "Invalid username or password" })
             }

             const storedPassword = results[0].password;
             const storedUser = results[0].Username;

            if (loginPassword === storedPassword && loginUsername === storedUser) {
                res.json({ success: true, message: "Verified login"});
            } else {
                res.status(401).json({ success: false, message: "Username or password incorrect"})
            }
            })

        });   
    