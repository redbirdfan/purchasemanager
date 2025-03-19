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
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
}

app.options('/parts', cors(corsOptions));
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

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

                res.cookie('authToken', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 60* 60 * 1000,
                })

            res.json({message: "log in successful", token: token})
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
            }      
    } catch (error) {
        console.log("Error:", error)
        return res.status(500).json({success: "False", message: "Server error"})
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('authToken', { httpOnly: true, path: '/' });
    res.sendStatus(200);
  });
  
app.get('/profile', async (req, res) => {

    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
        console.log(jwt.verify(token, process.env.JWT_SECRET));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("I am decoded: " + decoded);
      const [user] = await app.db.query('SELECT FirstName, LastName FROM users WHERE Username = ?', [Username])
      console.log("query results:" +[user])
      if (user.length > 0) {
        res.json({success: true, user: user[0]})
      } else {
        res.status(404).json({success: false, message: 'User not found'
        })
      }
    } catch (error) {
        console.error("JWT Ver. Error:", error)
      return res.status(401).json({ message: 'Invalid token' });
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
            let search = 'SELECT * FROM vendor WHERE 1=1'
            
            const params = [];

            if (VendorName) {
              search += ' AND TRIM(LOWER(VendorName)) LIKE TRIM(LOWER(?))'
              params.push(VendorName);
            }
            if (Address) {
              search += ' AND TRIM(LOWER(Address)) = TRIM(LOWER(?))'
              params.push(Address);
            }
            if (phone) {
              search += ' AND TRIM(phone) = TRIM(?)'
              params.push(phone);
            }
            if (account) {
              search += ' AND TRIM(account) = TRIM(?)'
              params.push(account);
            }
        
            const [results] = await app.db.query(search, params)

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
    console.log("Vendor Request:", req.query)

    try { 
        let search = 'SELECT * FROM parts WHERE 1=1'
            
        const params = [];

            if (vendor) {
              search += ' AND TRIM(LOWER(vendor)) = TRIM(LOWER(?))';
              params.push(vendor);
            }
            if (partno) {
              search += ' AND TRIM(partno) = TRIM(?)';
              params.push(partno);
            }
            if (partdesc) {
              search += ' AND TRIM(partdesc) = TRIM(?)';
              params.push(partdesc);
            }
            if (cost) {
              search += ' AND cost = ?';
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


app.post("/parts", async(req, res) => {
        const vendor = req.body.vendor;
        const partNo = req.body.partNo;
        const partDesc = req.body.partDesc
        const cost = parseFloat(req.body.cost)

        console.log("From the frontend: " + req.body)
        try{
            const search = 'SELECT * FROM parts WHERE partno = ?'
            const newPart = 'INSERT INTO parts (vendor, partno, partdesc, cost) VALUES (?, ?, ?, ?)'
    
            const [results] = await app.db.query(search, [partNo]);

            console.log("Returned from search: " + results)
                 if(results.length > 0) {
                    return res.status(409).json({ success: false, message: "Part already exists" })
                 } 
    
                if (results.length === 0) {
                    
                    const createPart = await db.query(newPart, [vendor, partNo, partDesc, cost]);
    
                    if (createPart.affectedRows >  0) {
                        return res.status(201).json({success: true, message: "Part created"});
    
                    } else {
                        console.error("Part not created")
                        return res.status(500).json({ success: false, message: 'Error Creating new part, no rows effected'});
                    }
                };
            } catch (error) {
                console.error("Part not created", error);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
                }
        }) 
        


}

startServer();
    