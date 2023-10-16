import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const multer = require("multer");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "public/images")));
// In your server.js
app.use("/defaultImage", express.static("public/defaultImage"));

// for database connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  // port: 3306,
  // url:"http://127.0.0.1/",
  //url:"http://localhost/",
  database: "sanam_db",
});

app.use(
  cors({
    origin: "http://localhost:5173", // Make sure this matches your frontend URL
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

// middleware for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const uploadFields = [
  { name: "image", maxCount: 1 },
  { name: "menu", maxCount: 7 },
];

// app.post(
//   "/uploadImage",
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "menuImages", maxCount: 7 },
//     { name: "latitude", maxCount: 1 },
//     { name: "longitude", maxCount: 1 },
//   ]),
//   (req, res) => {
//     if (req.files["image"] && req.files["menuImages"]) {
//       res.json({
//         Status: "Success",
//         filename: req.files["image"][0].filename,
//         menuFilenames: req.files["menuImages"].map((file) => file.filename),
//         latitude: req.body.latitude,
//         longitude: req.body.longitude,
//       });
//     } else {
//       res.status(400).json({ Status: "Files not received" });
//     }
//   }
// );

app.post(
  "/uploadImage",
  upload.fields([
    { name: "image", maxCount: 1 }, // Single image for the restaurant
    { name: "menuImages", maxCount: 7 }, // Up to 7 images for the menu
  ]),
  (req, res) => {
    // console.log(req.files); // Debugging line

    if (req.files["image"] && req.files["menuImages"]) {
      res.json({
        Status: "Success",
        filename: req.files["image"][0].filename,
        menuFilenames: req.files["menuImages"].map((file) => file.filename), // Array of filenames
      });
    } else {
      res.status(400).json({ Status: "Files not received" });
    }
  }
);

con.connect(function (err) {
  if (err) {
    console.log("Error in connection", err); // Log the error object
  } else {
    console.log("Connected");
  }
});

// get api for restaurant
app.get("/getrestaurant", (req, res) => {
  const sql = "SELECT * FROM restaurant";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get restaurant error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

// get api for single restaurant
app.get("/get/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM restaurant where id =?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get restaurant error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

// Upate Restaurant Details update api

// Upate Restaurant Details update api
app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE restaurant set name=?,email=?,location=?,phone=?, openingTime=?, closingTime=?, description=?, latitude=?, longitude=? WHERE id = ?";
  con.query(
    sql,
    [
      req.body.name,
      req.body.email,
      req.body.location,
      req.body.phone,
      req.body.openingTime,
      req.body.closingTime,
      req.body.description,
      req.body.latitude,
      req.body.longitude,
      id,
    ],
    (err, result) => {
      if (err) return res.json({ Error: "Update restaurant error in sql" });
      return res.json({ Status: "Success" });
    }
  );
});

// delete restaurant delete api
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM restaurant WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Delete restaurant error in sql" });
    return res.json({ Status: "Success" });
  });
});

// middleware for authentication
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authorized" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json({ Error: "Token wrong" });
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    });
  }
};

// api for dashboard
// app.use("/dashboard", cors(), verifyUser, (req, res) => {
app.get("/dashboard", verifyUser, (req, res) => {
  return res.json({ Status: "Success", role: req.role, id: req.id });
});

// get api for admin count
app.get("/adminCount", (req, res) => {
  const sql = "SELECT count(id) as admin from users";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

//get api for restaurant count
app.get("/restaurantCount", (req, res) => {
  const sql = "SELECT count(id) as restaurant from restaurant";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

// get api for phone number count
app.get("/requestApproved", (req, res) => {
  const sql =
    "SELECT COUNT(*) as approved FROM registration WHERE reg_state = 'approved'";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

app.get("/requestPending", (req, res) => {
  const sql =
    "SELECT COUNT(*) as pending FROM registration WHERE reg_state = 'hold'";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

// api for admin login
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users Where email = ? AND password= ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in running query" });
    if (result.length > 0) {
      const id = result[0].id;
      const token = jwt.sign({ role: "admin" }, "jwt-secret-key", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
  });
});

// api for restaurant login with TOKEN ISSUE
app.post("/restaurantlogin", (req, res) => {
  // Check if email or password is empty
  if (!req.body.email || !req.body.password) {
    return res.json({ Status: "Error", Error: "Fill both form first" });
  }

  const sql = "SELECT * FROM restaurant WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in running query" });

    if (result.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        result[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "Password error" });
          if (response) {
            const token = jwt.sign(
              { role: "restaurant", id: result[0].id },
              "jwt-secret-key",
              { expiresIn: "1d" }
            );
            // Include the token in the JSON response
            return res.json({
              Status: "Success",
              token: token,
              id: result[0].id,
            });
          } else {
            return res.json({
              Status: "Error",
              Error: "Your password is incorrect. Try again.",
            });
          }
        }
      );
    } else {
      // If email not found in restaurant table, check in the registration table
      const sqlReg = "SELECT * FROM registration WHERE email = ?";
      con.query(sqlReg, [req.body.email], (err, regResult) => {
        if (err)
          return res.json({ Status: "Error", Error: "Error in running query" });

        if (regResult.length > 0) {
          if (regResult[0].reg_state === "denied") {
            return res.json({
              Status: "Error",
              Error: "Request was cancelled. Try again.",
            });
          } else if (regResult[0].reg_state === "hold") {
            return res.json({
              Status: "Error",
              Error: "Request is on hold. Wait some time. ",
            });
          }
        } else {
          return res.json({
            Status: "Error",
            Error: "Email not registered. Register first.",
          });
        }
      });
    }
  });
});

// api for restaurant login
// app.post("/restaurantlogin", (req, res) => {
//   // Check if email or password is empty
//   if (!req.body.email || !req.body.password) {
//     return res.json({ Status: "Error", Error: "Fill both form first" });
//   }

//   const sql = "SELECT * FROM restaurant WHERE email = ?";
//   con.query(sql, [req.body.email], (err, result) => {
//     if (err)
//       return res.json({ Status: "Error", Error: "Error in running query" });

//     if (result.length > 0) {
//       bcrypt.compare(
//         req.body.password.toString(),
//         result[0].password,
//         (err, response) => {
//           if (err) return res.json({ Error: "Password error" });
//           if (response) {
//             const token = jwt.sign(
//               { role: "restaurant", id: result[0].id },
//               "jwt-secret-key",
//               { expiresIn: "1d" }
//             );
//             res.cookie("token", token);
//             return res.json({ Status: "Success", id: result[0].id });
//           } else {
//             return res.json({
//               Status: "Error",
//               Error: "Your password is incorrect. Try again.",
//             });
//           }
//         }
//       );
//     } else {
//       // If email not found in restaurant table, check in the registration table
//       const sqlReg = "SELECT * FROM registration WHERE email = ?";
//       con.query(sqlReg, [req.body.email], (err, regResult) => {
//         if (err)
//           return res.json({ Status: "Error", Error: "Error in running query" });

//         if (regResult.length > 0) {
//           if (regResult[0].reg_state === "denied") {
//             return res.json({
//               Status: "Error",
//               Error: "Request was cancelled. Try again.",
//             });
//           } else if (regResult[0].reg_state === "hold") {
//             return res.json({
//               Status: "Error",
//               Error: "Request is on hold. Wait some time. ",
//             });
//           }
//         } else {
//           return res.json({
//             Status: "Error",
//             Error: "Email not registered. Register first.",
//           });
//         }
//       });
//     }
//   });
// });

// app.post("/customerlogin", (req, res) => {
//   const { email, password } = req.body;

//   // Check if email or password is empty
//   if (!email || !password) {
//     return res.json({
//       Status: "Error",
//       Error: "Fill both email and password.",
//     });
//   }

//   const sql = "SELECT * FROM customer WHERE email = ?";
//   con.query(sql, [email], (err, result) => {
//     if (err) {
//       return res.json({ Status: "Error", Error: "Error in running query" });
//     }

//     if (result.length === 0) {
//       return res.json({ Status: "Error", Error: "User not registered." });
//     }

//     const hashedPassword = result[0].password;
//     bcrypt.compare(password, hashedPassword, (err, passwordMatch) => {
//       if (err) {
//         return res.json({
//           Status: "Error",
//           Error: "Error comparing passwords",
//         });
//       }

//       if (passwordMatch) {
//         const id = result[0].id;
//         res.cookie("customer_token", token);
//         return res.json({ Status: "Success", id: id, token: token });
//       } else {
//         return res.json({ Status: "Error", Error: "Incorrect password" });
//       }
//     });
//   });
// });

app.post("/customerlogin", (req, res) => {
  // Check if email or password is empty
  if (!req.body.email || !req.body.password) {
    return res.json({ Status: "Error", Error: "Fill both form first" });
  }

  const sql = "SELECT * FROM customer WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in running query" });

    if (result.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        result[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "Password error" });
          if (response) {
            const token = jwt.sign(
              { role: "customer", id: result[0].id },
              "jwt-secret-key",
              { expiresIn: "1d" }
            );
            // Include the token in the JSON response
            return res.json({
              Status: "Success",
              token: token,
              id: result[0].id,
            });
          } else {
            return res.json({
              Status: "Error",
              Error: "Your password is incorrect. Try again.",
            });
          }
        }
      );
    }
  });
});

// api for logout
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

// Endpoint for creating restaurant
// app.post("/create", (req, res) => {
//   const sql =
//     "INSERT INTO restaurant (`name`, `email`, `password`, `location`, `phone`, `image`, `menu`, `openingTime`, `closingTime`, `description`, `latitude`, `longitude`) VALUES (?)";
//   bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
//     if (err) return res.json({ Error: "Error in hashing password" });

//     // Convert the array of menu filenames to a string
//     const menuFilenamesString = JSON.stringify(req.body.menu);

//     const values = [
//       req.body.name,
//       req.body.email,
//       hash,
//       req.body.location,
//       req.body.phone,
//       req.body.image,
//       menuFilenamesString, // Use the stringified array here
//       req.body.openingTime,
//       req.body.closingTime,
//       req.body.description,
//       req.body.latitude,
//       req.body.longitude,
//     ];

//     con.query(sql, [values], (err, result) => {
//       if (err) return res.json({ Error: "Inside signup query" });
//       return res.json({ Status: "Success" });
//     });
//   });
// });

// // Endpoint for creating restaurant
app.post("/create", (req, res) => {
  const sql =
    "INSERT INTO restaurant (`name`, `email`, `password`, `location`, `phone`, `image`, `menu`, `openingTime`, `closingTime`, `description`, `latitude`, `longitude`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Error: "Error in hashing password" });

    // Convert the array of menu filenames to a string
    const menuFilenamesString = JSON.stringify(req.body.menu);

    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.location,
      req.body.phone,
      req.body.image,
      menuFilenamesString, // Use the stringified array here
      req.body.openingTime,
      req.body.closingTime,
      req.body.description,
      req.body.latitude, // Include latitude
      req.body.longitude, // Include longitude
    ];

    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Inside signup query" });
      return res.json({ Status: "Success" });
    });
  });
});

//backend validation
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const nameRegex = /^[a-zA-Z\s]+$/;
// const phoneRegex = /^[0-9]+$/;

// app.post("/create", (req, res) => {
//   // Validate fields
//   if (!req.body.name.match(nameRegex)) {
//     return res.json({
//       Error: "Invalid name format. Only letters and spaces allowed.",
//     });
//   }

//   if (!req.body.email.match(emailRegex)) {
//     return res.json({ Error: "Invalid email format." });
//   }

//   if (!req.body.phone.match(phoneRegex)) {
//     return res.json({
//       Error: "Invalid phone number format. Only numbers allowed.",
//     });
//   }

//   // Check if other fields are filled
//   const requiredFields = [
//     "location",
//     "image",
//     "menu",
//     "openingTime",
//     "closingTime",
//     "description",
//     "latitude",
//     "longitude",
//   ];
//   for (const field of requiredFields) {
//     if (!req.body[field]) {
//       return res.json({ Error: `Field '${field}' is required.` });
//     }
//   }
//   const sql =
//     "INSERT INTO restaurant (`name`, `email`, `password`, `location`, `phone`, `image`, `menu`, `openingTime`, `closingTime`, `description`, `latitude`, `longitude`) VALUES (?)";
//   bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
//     if (err) return res.json({ Error: "Error in hashing password" });

//     // Convert the array of menu filenames to a string
//     const menuFilenamesString = JSON.stringify(req.body.menu);

//     const values = [
//       req.body.name,
//       req.body.email,
//       hash,
//       req.body.location,
//       req.body.phone,
//       req.body.image,
//       menuFilenamesString, // Use the stringified array here
//       req.body.openingTime,
//       req.body.closingTime,
//       req.body.description,
//       req.body.latitude, // Include latitude
//       req.body.longitude, // Include longitude
//     ];

//     con.query(sql, [values], (err, result) => {
//       if (err) return res.json({ Error: "Inside signup query" });
//       return res.json({ Status: "Success" });
//     });
//   });
// });

// Endpoint for creating registration
app.post("/getstarted", (req, res) => {
  const sql =
    "INSERT INTO registration (`name`, `email`, `password`, `location`, `phone`, `openingTime`, `closingTime`, `image`, `description`, `menu`, `latitude`, `longitude`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Error: "Error in hashing password" });

    // Convert the array of menu filenames to a string
    const menuFilenamesString = JSON.stringify(req.body.menu);

    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.location,
      req.body.phone,
      req.body.openingTime, // Use opening time from request body
      req.body.closingTime, // Use closing time from request body
      req.body.image, // Use image from request body
      req.body.description, // Use image from request body
      menuFilenamesString,
      req.body.latitude, // Include latitude
      req.body.longitude, // Include longitude
    ];
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Error in registration query" });
      return res.json({ Status: "Success" });
    });
  });
});

app.put("/approve/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE registration SET reg_state='approved' WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Error in approving registration" });

    // Fetch the registration data
    const fetchSql = "SELECT * FROM registration WHERE id = ?";
    con.query(fetchSql, [id], (err, result) => {
      if (err) return res.json({ Error: "Error in fetching registration" });

      const registration = result[0];

      // Insert the registration data into the restaurant table
      const insertSql =
        "INSERT INTO restaurant (`name`, `email`, `password`, `location`, `phone`, `openingTime`, `closingTime`, `image`, `menu`, `description`, `latitude`, `longitude`) VALUES (?)";
      const values = [
        registration.name,
        registration.email,
        registration.password, // You may need to handle the password differently if it's hashed
        registration.location,
        registration.phone,
        registration.openingtime,
        registration.closingtime,
        registration.image,
        registration.menu,
        registration.description,
        registration.latitude,
        registration.longitude,
      ];
      con.query(insertSql, [values], (err, result) => {
        if (err) return res.json({ Error: "Error in copying registration" });
        return res.json({ Status: "Success" });
      });
    });
  });
});

// Endpoint to reject registration
app.put("/reject/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE registration SET reg_state='denied' WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Error in rejecting registration" });
    return res.json({ Status: "Success" });
  });
});

// Endpoint to get all pending registrations
app.get("/getPendingRegistrations", (req, res) => {
  const sql = "SELECT * FROM registration WHERE reg_state='hold'";
  con.query(sql, (err, result) => {
    if (err)
      return res.json({ Error: "Error in getting pending registrations" });
    return res.json({ Status: "Success", Result: result });
  });
});

// app.post("/register", (req, res) => {
//   const { username, password } = req.body;

//   const sql = "INSERT INTO customer (username, password) VALUES (?, ?)";
//   connection.query(sql, [username, password], (err, result) => {
//     if (err) {
//       console.error("Error registering customer:", err);
//       res
//         .status(500)
//         .json({ success: false, message: "Error registering customer" });
//     } else {
//       console.log("Customer registered successfully:", result);
//       res
//         .status(200)
//         .json({ success: true, message: "Customer registered successfully" });
//     }
//   });
// });

app.post("/customerregister", (req, res) => {
  const { fullName, email, password } = req.body;

  // Check if any field is empty
  if (!fullName || !email || !password) {
    return res.json({ Status: "Error", Error: "Fill all the fields." });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.json({ Status: "Error", Error: "Error hashing password." });
    }

    const sql =
      "INSERT INTO customer (full_name, email, password) VALUES (?, ?, ?)";
    con.query(sql, [fullName, email, hashedPassword], (err, result) => {
      if (err) {
        return res.json({
          Status: "Error",
          Error: "Error inserting data into database.",
        });
      }
      return res.json({
        Status: "Success",
        Message: "Registration successful.",
      });
    });
  });
});

//remove below

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const sql = "INSERT INTO customer (username, password) VALUES (?, ?)";
  con.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error registering customer:", err); // Log the error
      res
        .status(500)
        .json({ success: false, message: "Error registering customer" });
    } else {
      // console.log("Customer registered successfully:", result);
      res
        .status(200)
        .json({ success: true, message: "Customer registered successfully" });
    }
  });
});

app.get("/checkUsername/:username", (req, res) => {
  const { username } = req.params;

  // Check if the username already exists in the database
  const sql = "SELECT COUNT(*) AS count FROM customer WHERE username = ?";
  con.query(sql, [username], (err, result) => {
    if (err) {
      console.error("Error checking username:", err);
      res.status(500).json({ exists: false });
    } else {
      const count = result[0].count;
      res.status(200).json({ exists: count > 0 });
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Modify this logic to check the username and password against your database
  const sql = "SELECT * FROM customer WHERE username = ? AND password = ?";
  con.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error during login:", err);
      res.status(500).json({ success: false, message: "Error during login" });
    } else {
      if (result.length > 0) {
        res.status(200).json({ success: true, message: "Login successful" });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    }
  });
});

// server listing
app.listen(5000, () => {
  console.log("Running on port 5000");
});
