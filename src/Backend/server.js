require('dotenv').config()

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
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


app.post("/loginPage", async (req, res) => {
    const loginUsername = req.body.username;
    const loginPassword = req.body.password
    
    const search = 'SELECT * FROM users WHERE Username = ?'

    try{
    db.query(search, [loginUsername], async (err, results) => {
            if(err) {
                console.error(err);
                res.status(500).send('error during login')
                return;
             } 

             if(results.length  === 0) {
                return res.status(401).json({ success: false, message: "Invalid username" })
             }

             const storedHashedPassword = results[0].password;
             const storedUser = results[0].Username;

             const passwordMatch = await bcrypt.compare(loginPassword, storedHashedPassword);

            if (passwordMatch) {
                const payload = {
                    Username: storedUser,
                }

                const token = jwt.sign(payload, { expiresIn: '1h' });

            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
            } 
        });   
    } catch (error) {
        console.log("Error:", error)
        return res.status(500).json({success: "False", message: "Server error"})
    }
    
app.post("/NewAccount", async (req, res) => {
    const newUsername = req.body.newUserName;
    const newUserPassword = req.body.newUserPassword
    const newUserEmail = req.body.newUserEmail
    const newFirstName = req.body.firstName
    const newLastName = req.body.lastName

    try{
        const search = 'SELECT * FROM users WHERE username = ?'
        const createUser = 'INSERT INTO users (Username, password, email, FirstName, LastName) VALUES (?, ?, ?, ?, ?)'

        db.query(search, [newUsername], async (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).send('error creating account')
             } 

             if(results.length !== 0) {
                return res.status(409).json({ success: false, message: "Username already exists" })
             } 

            if (results.length === 0) {
                const hashedPassword = await bcrypt.hash(newUserPassword, 10);

                db.query(createUser, [newUsername, hashedPassword, newUserEmail, newFirstName, newLastName], async (err, createResults) => {
                  if(err) {
                    console.error(err);
                    return res.status(500).json({success: false, message: 'Error creating account'})
                  }

                if (createResults.affectedRows >  0) {
                    return res.status(201).json({success: true, message: "Account created"});
                 } else {
                    console.error("Account not created")
                    return res.status(500).json({ success: false, message: 'Error Creating account, no rows effected'});
                  }
                });
            }
        });
    } catch (error) {
    console.error("Account not created", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
