import React from "react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css"; // Importing the theme for Flatpickr
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./addrestaurant.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function GetStarted() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phone: "",
    openingTime: "",
    closingTime: "",
    image: "",
    menuImages: [], // New field for menu images
    description: "",
    latitude: 27.7172,
    longitude: 85.324,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
    phone: "",
    openingTime: "", // New
    closingTime: "", // New
    image: "", // New
    menuImages: "", // New
    description: "",
  });

  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let map;
    let marker;

    const initializeMap = () => {
      if (!map) {
        map = L.map(mapContainerRef.current).setView(
          [data.latitude, data.longitude],
          12
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        map.on("click", handleMapClick);
        mapRef.current = map;

        // Show the marker if latitude and longitude are not the default values
        if (data.latitude !== 27.7172 && data.longitude !== 85.324) {
          marker = L.marker([data.latitude, data.longitude]).addTo(map);
          marker.bindPopup("Your restaurant location").openPopup();
          markerRef.current = marker;
        }
      }
    };

    const handleMapClick = (event) => {
      const { lat, lng } = event.latlng;

      setData({
        ...data,
        latitude: lat,
        longitude: lng,
      });

      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Add a marker to the map at the clicked location
      marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup("Your restaurant location").openPopup();

      // Update the marker reference
      markerRef.current = marker;
    };

    initializeMap();

    return () => {
      if (map) {
        map.off();
        map.remove();
      }
    };
  }, [data]);

  const showNotification = (message, type) => {
    toast(message, { type });
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    return regex.test(email);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name) && name.length >= 3;
  };

  const validatePassword = (password) => {
    // Password should have at least one digit
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return regex.test(password);
  };

  const validatePhone = (phone) => {
    const regex = /^98\d{8}$/; // 10-digit phone number
    return regex.test(phone);
  };

  const validateDescription = (description) => {
    // Description should be less than 1000 characters
    return description.length <= 1000;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "name") {
      const isValid = validateName(value);
      setErrors({
        ...errors,
        name: isValid ? "" : "Invalid name format or too short.",
      });
    } else if (name === "email") {
      const isValid = validateEmail(value);
      setErrors({ ...errors, email: isValid ? "" : "Invalid email format." });
    } else if (name === "location") {
      const isValid = value.length >= 3;
      setErrors({
        ...errors,
        location: isValid ? "" : "Location is too short.",
      });
    } else if (name === "password") {
      const isValid = validatePassword(value);
      setErrors({
        ...errors,
        password: isValid
          ? ""
          : "At least one number, one capital and one small letter is required.",
      });
    } else if (name === "phone") {
      const isValid = validatePhone(value);
      setErrors({
        ...errors,
        phone: isValid ? "" : "Invalid phone number format (10 digits).",
      });
    } else if (name === "description") {
      const isValid = validateDescription(value);
      setErrors({
        ...errors,
        description: isValid
          ? ""
          : "Description is too long (max 1000 characters).",
      });
    }

    setData({ ...data, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const restaurantData = {
      name: data.name,
      email: data.email,
      password: data.password,
      location: data.location,
      phone: data.phone,
      openingTime: data.openingTime,
      closingTime: data.closingTime,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    const validationErrors = {};

    if (!validateName(data.name)) {
      validationErrors.name = "Invalid name format or too short.";
    }

    if (!validateEmail(data.email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (data.location.length < 3) {
      validationErrors.location = "Invalid location format or too short.";
    }

    if (!validatePassword(data.password)) {
      validationErrors.password =
        "At least one number, one capital and one small letter is required.";
    }

    if (!validatePhone(data.phone)) {
      validationErrors.phone = "Invalid phone number format (10 digits).";
    }

    // New validations
    if (!data.openingTime) {
      validationErrors.openingTime = "Opening time is required.";
    }

    if (!data.closingTime) {
      validationErrors.closingTime = "Closing time is required.";
    }

    if (!data.image) {
      validationErrors.image = "Profile image is required.";
    }

    if (data.menuImages.length === 0) {
      validationErrors.menuImages = "Menu images are required.";
    }

    // Validation for Leaflet map
    if (data.latitude === 27.7172 && data.longitude === 85.324) {
      validationErrors.map = "Please select a location on the map.";
    }

    if (data.description.length === 0) {
      validationErrors.description = "Description is required.";
    } else if (data.description.length > 1000) {
      validationErrors.description =
        "Description is too long (max 1000 characters).";
    }

    setErrors(validationErrors);
    // If there are validation errors, display a notification and return
    if (Object.keys(validationErrors).length > 0) {
      showNotification(
        "Some fields are blank or invalid data is entered.",
        "warning"
      );
      return;
    }

    const formdata = new FormData();
    formdata.append("image", data.image);

    for (let i = 0; i < data.menuImages.length; i++) {
      formdata.append("menuImages", data.menuImages[i]);
    }

    axios
      .post("http://localhost:5000/uploadImage", formdata)
      .then((res) => {
        restaurantData.image = res.data.filename; // Assuming the server returns the filename
        restaurantData.menu = res.data.menuFilenames;
        return axios.post("http://localhost:5000/getstarted", restaurantData); // Updated endpoint for registration
      })
      .then((res) => {
        // Display success message after a delay
        showNotification("Request sent successfully!", "success");

        // Delay navigation to the dashboard
        setTimeout(() => {
          navigate("/");
        }, 3500); // Delay for 1 second (adjust as needed)
      })
      .catch((err) => {
        console.log(err);
        showNotification(
          "Failed to request registration. Please try again.",
          "error"
        );
      });
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h5>Register Restaurant</h5>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            id="inputName"
            placeholder="Enter Name"
            autoComplete="off"
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="col-12">
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="inputEmail4"
            placeholder="Enter Email"
            autoComplete="off"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="col-12">
          <label htmlFor="inputPassword4" className="form-label">
            Password
          </label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="inputPassword4"
            placeholder="Enter Password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <div className="col-12">
          <label htmlFor="inputLocation" className="form-label">
            Location
          </label>
          <input
            type="text"
            className={`form-control ${errors.location ? "is-invalid" : ""}`}
            id="Location"
            placeholder="Enter Location"
            autoComplete="off"
            onChange={(e) => setData({ ...data, location: e.target.value })}
          />
          {errors.location && (
            <div className="invalid-feedback">{errors.location}</div>
          )}
        </div>
        <div className="col-12">
          <label htmlFor="inputPhoneNumber" className="form-label">
            Phone Number
          </label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            id="inputPhoneNumber"
            placeholder="Enter Phone Number"
            autoComplete="off"
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone}</div>
          )}
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col">
              <label htmlFor="inputTime" className="form-label">
                Opening Time
              </label>
              <Flatpickr
                className={`form-control ${
                  errors.openingTime ? "is-invalid" : ""
                }`}
                value={data.openingTime}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                }}
                onChange={(newValue) =>
                  setData({
                    ...data,
                    openingTime: newValue[0].toLocaleTimeString("en-US", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  })
                }
              />
              {errors.openingTime && (
                <div className="invalid-feedback">{errors.openingTime}</div>
              )}
            </div>

            <div className="col">
              <label htmlFor="inputClosingTime" className="form-label">
                Closing Time
              </label>
              <Flatpickr
                className={`form-control ${
                  errors.closingTime ? "is-invalid" : ""
                }`}
                value={data.closingTime}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                }}
                onChange={(newValue) =>
                  setData({
                    ...data,
                    closingTime: newValue[0].toLocaleTimeString("en-US", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  })
                }
              />
              {errors.closingTime && (
                <div className="invalid-feedback">{errors.closingTime}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-12 mb-3">
          <label className="form-label" htmlFor="inputGroupFile01">
            Select Profile Image
          </label>
          <input
            type="file"
            className={`form-control ${errors.image ? "is-invalid" : ""}`}
            id="inputGroupFile01"
            onChange={(e) => setData({ ...data, image: e.target.files[0] })}
          />
          {errors.image && (
            <div className="invalid-feedback">{errors.image}</div>
          )}
        </div>
        <div className="col-12 mb-3">
          <label className="form-label" htmlFor="inputMenuImages">
            Upload Menu Images (Less than 7 images)
          </label>
          <input
            type="file"
            multiple
            className={`form-control ${errors.menuImages ? "is-invalid" : ""}`}
            id="inputMenuImages"
            onChange={(e) => setData({ ...data, menuImages: e.target.files })}
          />
          {errors.menuImages && (
            <div className="invalid-feedback">{errors.menuImages}</div>
          )}
        </div>
        <div className="col-12">
          <label htmlFor="inputDescription" className="form-label">
            Description
          </label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            id="inputDescription"
            placeholder="Enter Description"
            rows="8" // Adjust the number of rows as needed
            autoComplete="off"
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>
        <div className="col-12">
          <p className="pinRestroPg" style={{ marginTop: "20px" }}>
            Pin location:
          </p>
          <div
            // className={`form-control ${errors.map ? "is-invalid" : ""}`}
            id="leaflet-map"
            ref={mapContainerRef}
            style={{
              width: "100%",
              height: "300px",
              marginTop: "10px",
              border: "1px solid #025b6b",
              borderRadius: "10px",
            }}
            required
          />
          {/* {errors.map && <div className="invalid-feedback">{errors.map}</div>} */}
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary mb-4">
            Register
          </button>
        </div>
      </form>
      {/* Toast Container for Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default GetStarted;

// import React from "react";
// import axios from "axios";
// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/light.css"; // Importing the theme for Flatpickr
// import "./style.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./addrestaurant.css";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import {
//   validateName,
//   validateEmail,
//   validatePhoneNumber,
// } from "./formvalidation";

// function GetStarted() {
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     location: "",
//     phone: "",
//     openingTime: "",
//     closingTime: "",
//     image: "",
//     menuImages: [], // New field for menu images
//     description: "",
//   });
//   const navigate = useNavigate();

//   const showNotification = (message, type) => {
//     toast(message, { type });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     if (!validateName(data.name)) {
//       showNotification("Name must contain only alphabets and spaces.", "error");
//       return;
//     }

//     if (!validateEmail(data.email)) {
//       showNotification("Please enter a valid email address.", "error");
//       return;
//     }

//     if (!validatePhoneNumber(data.phone)) {
//       showNotification(
//         'Phone number must start with "98" and contain exactly 10 digits.',
//         "error"
//       );
//       return;
//     }

//     // Create restaurant data object
//     const restaurantData = {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//       location: data.location,
//       phone: data.phone,
//       openingTime: data.openingTime,
//       closingTime: data.closingTime,
//       description: data.description,
//     };

//     // Handle file upload separately
//     const formdata = new FormData();
//     formdata.append("image", data.image);

//     for (let i = 0; i < data.menuImages.length; i++) {
//       formdata.append("menuImages", data.menuImages[i]);
//     }

//   axios
//     .post("http://localhost:5000/uploadImage", formdata)
//     .then((res) => {
//       restaurantData.image = res.data.filename; // Assuming the server returns the filename
//       restaurantData.menu = res.data.menuFilenames;
//       return axios.post("http://localhost:5000/getstarted", restaurantData); // Updated endpoint for registration
//     })
//     .then((res) => {
//       // Display success message after a delay
//       showNotification("Request sent successfully!", "success");

//       // Delay navigation to the dashboard
//       setTimeout(() => {
//         navigate("/");
//       }, 3500); // Delay for 1 second (adjust as needed)
//     })
//     .catch((err) => {
//       console.log(err);
//       showNotification("Failed to request. Please try again.", "error");
//     });
// };
//   return (
//     <div className="d-flex flex-column align-items-center pt-4">
//       <h5>Register Restaurant</h5>
//       <form className="row g-3 w-50" onSubmit={handleSubmit}>
//         <div className="col-12">
//           <label htmlFor="inputName" className="form-label">
//             Name
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="inputName"
//             placeholder="Enter Name"
//             autoComplete="off"
//             required
//             onChange={(e) => setData({ ...data, name: e.target.value })}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputEmail4" className="form-label">
//             Email
//           </label>
//           <input
//             type="email"
//             className="form-control"
//             id="inputEmail4"
//             placeholder="Enter Email"
//             autoComplete="off"
//             required
//             onChange={(e) => setData({ ...data, email: e.target.value })}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputPassword4" className="form-label">
//             Password
//           </label>
//           <input
//             type="password"
//             className="form-control"
//             id="inputPassword4"
//             placeholder="Enter Password"
//             required
//             onChange={(e) => setData({ ...data, password: e.target.value })}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputLocation" className="form-label">
//             Location
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="Location"
//             placeholder="Enter Location"
//             autoComplete="off"
//             required
//             onChange={(e) => setData({ ...data, location: e.target.value })}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputPhoneNumber" className="form-label">
//             Phone Number
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="inputPhoneNumber"
//             placeholder="Enter Phone Number"
//             autoComplete="off"
//             required
//             onChange={(e) => setData({ ...data, phone: e.target.value })}
//           />
//         </div>
//         <div className="col-12">
//           <div className="row">
//             <div className="col">
//               <label htmlFor="inputTime" className="form-label">
//                 Opening Time
//               </label>
//               <Flatpickr
//                 className="mx-2"
//                 value={data.openingTime}
//                 options={{
//                   enableTime: true,
//                   noCalendar: true,
//                   dateFormat: "H:i",
//                 }}
//                 onChange={(newValue) =>
//                   setData({
//                     ...data,
//                     openingTime: newValue[0].toLocaleTimeString("en-US", {
//                       hour12: false,
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     }),
//                   })
//                 }
//                 required
//               />
//             </div>

//             <div className="col">
//               <label htmlFor="inputClosingTime" className="form-label">
//                 Closing Time
//               </label>
//               <Flatpickr
//                 className="mx-2"
//                 value={data.closingTime}
//                 options={{
//                   enableTime: true,
//                   noCalendar: true,
//                   dateFormat: "H:i",
//                 }}
//                 onChange={(newValue) =>
//                   setData({
//                     ...data,
//                     closingTime: newValue[0].toLocaleTimeString("en-US", {
//                       hour12: false,
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     }),
//                   })
//                 }
//                 required
//               />
//             </div>
//           </div>
//         </div>
//         <div className="col-12 mb-3">
//           <label className="form-label" htmlFor="inputGroupFile01">
//             Select Profile Image
//           </label>
//           <input
//             type="file"
//             className="form-control"
//             id="inputGroupFile01"
//             onChange={(e) => setData({ ...data, image: e.target.files[0] })}
//           />
//         </div>
//         <div className="col-12 mb-3">
//           <label className="form-label" htmlFor="inputMenuImages">
//             Upload Menu Images (Less than 7 images)
//           </label>
//           <input
//             type="file"
//             multiple
//             className="form-control"
//             id="inputMenuImages"
//             onChange={(e) => setData({ ...data, menuImages: e.target.files })}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputDescription" className="form-label">
//             Description
//           </label>
//           <textarea
//             className="form-control"
//             id="inputDescription"
//             placeholder="Enter Description"
//             rows="8" // Adjust the number of rows as needed
//             autoComplete="off"
//             required
//             onChange={(e) => setData({ ...data, description: e.target.value })}
//           />
//         </div>
//         <div className="col-12">
//           <button type="submit" className="btn btn-primary mb-4">
//             Register
//           </button>
//         </div>
//       </form>
//       {/* Toast Container for Notifications */}
//       <ToastContainer
//         position="top-center"
//         autoClose={2000}
//         hideProgressBar={true}
//         newestOnTop={true}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// }

// export default GetStarted;
