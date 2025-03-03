require('dotenv').config()

const express = require("express");
const mysql = require("mysql2/promise");
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

async function createDbConnection() {
    try {
        const db = await mysql.createConnection({ 
            host: "localhost",
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });     
        console.log("Connected to mySQL");
        return db;
    }catch (err) {
        console.log("Connection not successful:", err);
        throw err;
    }
}

async function startServer(){
    try {
        const db = await createDbConnection();
        app.db = db;
        app.listen(5000, () => {
        console.log("Listening on port 5000")
    });


app.post("/loginPage", async (req, res) => {
    const loginUsername = req.body.username;
    const loginPassword = req.body.password
    
    const search = 'SELECT * FROM users WHERE Username = ?';

    try{

    const [results]=await db.query(search, [loginUsername]);

             if(results.length  === 0) {
                return res.status(401).json({ success: false, message: "Invalid username" })
             }

             const storedHashedPassword = results[0].password;
             const storedUser = results[0].Username;

             const passwordMatch = await bcrypt.compare(loginPassword, storedHashedPassword);

            if (passwordMatch) {
                const payload = {
                    Username: storedUser,
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
            }      
    } catch (error) {
        console.log("Error:", error)
        return res.status(500).json({success: "False", message: "Server error"})
    }
});


app.post("/NewAccount", async (req, res) => {
    const newUsername = req.body.newUserName;
    const newUserPassword = req.body.newUserPassword
    const newUserEmail = req.body.newUserEmail
    const newFirstName = req.body.firstName
    const newLastName = req.body.lastName

    try{
        const search = 'SELECT * FROM users WHERE username = ?'
        const createUser = 'INSERT INTO users (Username, password, email, FirstName, LastName) VALUES (?, ?, ?, ?, ?)'

        const [results] = await db.query(search, [newUsername]);

             if(results.length !== 0) {
                return res.status(409).json({ success: false, message: "Username already exists" })
             } 

            if (results.length === 0) {
                const hashedPassword = await bcrypt.hash(newUserPassword, 10);
                const createResults = await db.query(createUser, [newUsername, hashedPassword, newUserEmail, newFirstName, newLastName]);

                if (createResults.affectedRows >  0) {
                    return res.status(201).json({success: true, message: "Account created"});

                } else {
                    console.error("Account not created")
                    return res.status(500).json({ success: false, message: 'Error Creating account, no rows effected'});
                }
            };
        } catch (error) {
            console.error("Account not created", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });
    }   catch(err){
        console.error("Server startup error:", err);
    }


app.get('/vendor', async (req, res) => {
    const {VendorName, Address, phone, account} = req.query;
         
        try{
            const search = 'SELECT * FROM vendor WHERE 1=1'
            
            const params = [];

            if (VendorName) {
              query += ' AND TRIM(LOWER(VendorName)) = TRIM(LOWER(?))';
              params.push(VendorName);
            }
            if (Address) {
              query += ' AND TRIM(Address) = TRIM(?)';
              params.push(address);
            }
            if (phone) {
              query += ' AND TRIM(phone) = TRIM(?)';
              params.push(phone);
            }
            if (account) {
              query += ' AND TRIM(account) = TRIM(?)';
              params.push(account);
            }
        
            const [results] = await app.db.query(query, params)

            if (results.length > 0) {
                return res.status(200).json({success: true, message: "Vendor found", data: results});
        } else {
            console.error("Vendor not found");
            return res.status(404).json({ success: false, message: "Vendor not found"})
            }
        } catch (err) {
            console.error("Issue Seaching:", err)
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    })


app.get("/parts", async (req, res) => {
    const {vendor, partno, partdesc, cost} = req.query;

    try { 
        const search = 'SELECT * FROM vendor WHERE 1=1'
            
        const params = [];

            if (vendor) {
              query += ' AND TRIM(LOWER((vendor))) = TRIM(LOWER(?))';
              params.push(vendor);
            }
            if (partno) {
              query += ' AND TRIM(partno) = TRIM(?)';
              params.push(partno);
            }
            if (partdesc) {
              query += ' AND TRIM(partdesc) = TRIM(?)';
              params.push(partdesc);
            }
            if (cost) {
              query += ' AND cost = ?';
              params.push(cost);
            }
        
        const [results] = await app.db.query(search, params)

        if(results.length > 0) {
            return res.status(200).json({success: true, message: "Part found", data: results});
    } else {
        console.error("Part not found");
        return res.status(404).json({ success: false, message: "Part not found"})
        }
    } catch (err) {
        console.error("Issue Searching:", err)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
})

}
startServer();
    