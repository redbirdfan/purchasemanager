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
        console.log("After backend username query: ", results[0])
             if(results.length  === 0) {
                return res.status(401).json({ success: false, message: "Invalid username" })
             }

             const storedHashedPassword = results[0].password;
             const storedUser = results[0].Username;
             const firstName = results[0].FirstName;
             const lastName = results[0].LastName
             const username = results[0].Username

             const passwordMatch = await bcrypt.compare(loginPassword, storedHashedPassword);

            if (passwordMatch) {
                const payload = {
                    Username: storedUser,
                    firstName: results[0].FirstName,
                    lastName: results[0].LastName
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

                res.cookie('authToken', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 60* 60 * 1000,
                })

            res.json({message: "log in successful", token: token, firstName: firstName, lastName: lastName, username: username})
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
    console.log("Calling /profile")
    const token = req.cookies.authToken;
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
        console.log(jwt.verify(token, process.env.JWT_SECRET));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.Username
      console.log("Username: ", username)
      const [user] = await app.db.query('SELECT FirstName, LastName FROM users WHERE Username = ?', [username])
      if (user.length > 0) {
        console.log("Username and password found")
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
            console.log("Result format: ", results)
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

        console.log("post for /parts called")
        const vendor = req.body.vendor;
        const partNo = req.body.partNo;
        const partDesc = req.body.partDesc
        const cost = req.body.cost;

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
                    
                    const createPart = await app.db.query(newPart, [vendor, partNo, partDesc, cost]);
    
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
        
        app.delete("/parts", async(req, res) => {
            console.log("Delete request received");
            console.log("Req body: ", req)
            
            const vendor = req.body.vendor;
            const partNo = req.body.partno;
            const partDesc = req.body.partdesc
            const cost = req.body.cost;

            try{
                const deletePart = 'DELETE FROM parts WHERE vendor = ? AND partno = ? AND partdesc = ? AND cost = ?'

                const [results] = await app.db.query(deletePart [vendor, partNo, partDesc, cost]);
                
                 console.log("Returned from search: " + results)
                 
                    if (deletePart.affectedRows >  0) {
                        return res.status(201).json({success: true, message: "Part deleted"});
    
                    } else {
                        console.error("Part not deleted")
                        return res.status(500).json({ success: false, message: 'Error deleting part, no rows effected'});
                    }
            } catch (error) {
                console.error("Part not deleted", error);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
                }

        });
        
        app.get("/orders", async (req, res) => {
            const {orderno, vendor, partno} = req.query;
            console.log("Order search: ", req.query)
        
            try { 
                let search = 'SELECT * FROM orders WHERE 1=1'
                    
                const params = [];
        
                    if (orderno) {
                      search += ' AND orderno = ?';
                      params.push(orderno);
                    }

                    if (vendor) {
                      search += ' AND LOWER(vendor) = TRIM(LOWER(?))';
                      params.push(vendor);
                    }

                    if (partno) {
                      search += ' AND partno = TRIM(?)';
                      params.push(partno);
                    }
                    

                    console.log("Searching: " + params)
                
                const [results] = await app.db.query(search, params)
                    console.log([results]);
                if(results.length > 0) {
                    return res.status(200).json({success: true, message: "Order found", data: results});
            } else {
                console.error("Order not found");
                return res.status(404).json({ success: false, message: "Order not found"})
                }
            } catch (err) {
                console.error("Issue Searching:", err)
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        })

    app.get("/vendorList", async(req, res) => {
        console.log("vendor list has been called by the frontend")
         try { 
                let search = 'SELECT DISTINCT TRIM(vendor) AS vending FROM parts'
                const results = await app.db.query(search)
                const vendorList = results[0]
                res.json(vendorList);
            }catch (err) {
                console.error("Issue Searching:", err)
                return res.status(500).json({ success: false, message: "Internal server error" });
                }
        });

    app.get("/partsList", async(req, res) => {
        const { vendor } = req.query
        console.log("PartsList search: " , req.query)
        console.log("part list backend called")
        try{ 
            let search = 'SELECT * FROM parts WHERE vendor = ?'
            const results = await app.db.query(search, [vendor])
            const partsList = results [0]
            res.json(partsList);
            console.log("Line 357: ", partsList)
            console.log("PartsList call has been made")
        } catch (err) {
        console.error("Issue searching: ", err)
        return res.status(500).json({success: false, message: "Internal server error"});
            }
        });

        app.get("/partsDesc", async(req, res) => {
            const { partno } = req.query
        
            console.log("PartsDesc search: " , req.query)
            console.log("part desc backend called")
            try{ 
                let search = 'SELECT partdesc, cost FROM parts WHERE partno = ?'
                const results = await app.db.query(search, [partno])
                const descSelected = results[0]
                
                res.json(descSelected);
                console.log("Line 373: ", descSelected)
                console.log("Desc call has been made")
            } catch (err) {
            console.error("Issue searching: ", err)
            return res.status(500).json({success: false, message: "Internal server error"});
                }
            });

        app.post("/newOrder", async(req, res) => {
            let errors = [];
            console.log("New Order being called")
            frontendData = req.body
            console.log("Trying to create order, Frontend sent: ", frontendData.newOrder)
            const orderData = frontendData.newOrder
            console.log("OrderData value: ", orderData)

            try{
                for (const line of orderData){
                const [orderno, vendor, partno, partdesc, cost, quantity, total, received] = line;   
                const post = 'INSERT INTO orders (orderno, vendor, partno, partdesc, cost, quantity, total, received) VALUES (?,?,?,?,?,?,?,?)'
            
                await new Promise((resolve, reject) => {
                app.db.query(post, [orderno, vendor, partno, partdesc, cost, quantity, total, received], (err, results) => {
                    if(err) {
                        console.err("Error creating order", err)
                        errors.push(err)
                        reject(err);
                    } else{
                        res.status(200).json({ message: "Orders created successfully" })
                        console.log("Order created successfully: ", results)
                        resolve(results)
                        }
                    });
                });
            }
            
            res.status(200).json({ message: "Orders created successfully" });
        } catch (error){
            console.log("Order could not be created")
        }
    });

        

        app.get("/checkOrderNo", async(req, res) => {
            const { orderno } = req.query
            console.log("Order searching: " , orderno)
            console.log("Check order backend called")
            try{ 
                let search = 'SELECT * FROM orders WHERE orderno = ?'
                const results = await app.db.query(search, [orderno])
                console.log("Query results: ", results)
                const orderSearch = results[0]
                res.json(orderSearch);
                console.log("Line 417: ", orderSearch)
                console.log("Search order call has been completed")
            } catch (err) {
            console.error("Issue searching: ", err)
            return res.status(500).json({success: false, message: "Internal server error"});
                }
            });

        app.post("/UpdateParts", async(req, res) => {
            let errors = [];
            console.log("edit part req body: ", req)
            console.log("Update parts being called")
            frontendData = req.body
            console.log("Trying to update order, Frontend sent: ", frontendData)
            const partData = frontendData
            console.log("OrderData value: ", partData)

            try{
                for (const line of partData){
                const [vendor, partno, partdesc, cost] = line;   
                const post = 'INSERT INTO parts (ovendor, partno, partdesc, cost) VALUES (?,?,?,?)'
            
                await new Promise((resolve, reject) => {
                app.db.query(post, [vendor, partno, partdesc, cost], (err, results) => {
                    if(err) {
                        console.err("Error editing part", err)
                        errors.push(err)
                        reject(err);
                    } else{
                        res.status(200).json({ message: "Part updated successfully" })
                        console.log("Part edited successfully: ", results)
                        resolve(results)
                        }
                    });
                });
            }
            
            res.status(200).json({ message: "Part edited successfully" });
        } catch (error){
            console.log("Order could not be created")
        }
    });



}

    
startServer();
    