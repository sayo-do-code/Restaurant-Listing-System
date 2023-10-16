import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import "./addrestaurant.css";

function EditRestaurant() {
  const [data, setData] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
    openingTime: "",
    closingTime: "",
    description: "",
    latitude: 27.7172, // Initialize latitude with default values
    longitude: 85.324, // Initialize longitude with default values
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    location: "",
    // password: "",
    phone: "",
    openingTime: "", // New
    closingTime: "", // New
    // image: "", // New
    // menuImages: "", // New
    description: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

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

  // const validatePassword = (password) => {
  //   // Password should have at least one digit
  //   const regex = /^(?=.*\d).+$/;
  //   return regex.test(password);
  // };

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
    }
    // else if (name === "password") {
    //   const isValid = validatePassword(value);
    //   setErrors({
    //     ...errors,
    //     password: isValid ? "" : "Password must contain at least one digit.",
    //   });
    // }
    else if (name === "phone") {
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

  useEffect(() => {
    axios
      .get("http://localhost:5000/get/" + id)
      .then((res) => {
        const restaurantData = res.data.Result[0];
        setData({
          ...data,
          name: restaurantData.name,
          email: restaurantData.email,
          location: restaurantData.location,
          phone: restaurantData.phone,
          openingTime: restaurantData.openingTime,
          closingTime: restaurantData.closingTime,
          description: restaurantData.description,
          latitude: restaurantData.latitude, // Set latitude from fetched data
          longitude: restaurantData.longitude, // Set longitude from fetched data
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

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
          marker.bindPopup("Restaurant location").openPopup();
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
      marker.bindPopup("Restaurant location").openPopup();

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

  const handleSubmit = (event) => {
    event.preventDefault();

    const restaurantData = {
      name: data.name,
      email: data.email,
      location: data.location,
      phone: data.phone,
      openingTime: data.openingTime,
      closingTime: data.closingTime,
      description: data.description,
      latitude: data.latitude, // Include updated latitude
      longitude: data.longitude, // Include updated longitude
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

    axios
      .put("http://localhost:5000/update/" + id, restaurantData)
      .then((res) => {
        showNotification("Restaurant updated successfully!", "success");
        setTimeout(() => {
          navigate("/dashboard/restaurant");
        }, 3500);
      })
      .catch((err) => {
        console.log(err);
        showNotification(
          "Failed to update restaurant. Please try again.",
          "error"
        );
      });
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Update Restaurant</h2>
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
            value={data.name}
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
            value={data.email}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="col-12">
          <label htmlFor="inputLocation" className="form-label">
            Location
          </label>
          <input
            type="text"
            className={`form-control ${errors.location ? "is-invalid" : ""}`}
            id="inputLocation"
            placeholder="Enter Location"
            autoComplete="off"
            onChange={(e) => setData({ ...data, location: e.target.value })}
            value={data.location}
          />
          {errors.location && (
            <div className="invalid-feedback">{errors.location}</div>
          )}
        </div>
        <div className="col-12">
          <label htmlFor="inputphone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            id="inputphone"
            placeholder="Enter phone"
            autoComplete="off"
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            value={data.phone}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone}</div>
          )}
        </div>
        <div className="col-12">
          <label htmlFor="inputOpeningTime" className="form-label">
            Opening Time
          </label>
          <Flatpickr
            // className="mx-3"
            className={`form-control ${errors.openingTime ? "is-invalid" : ""}`}
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
        <div className="col-12">
          <label htmlFor="inputClosingTime" className="form-label">
            Closing Time
          </label>
          <Flatpickr
            // className="mx-4"
            className={`form-control ${errors.closingTime ? "is-invalid" : ""}`}
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
            value={data.description}
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
            id="leaflet-map"
            ref={mapContainerRef}
            style={{
              width: "100%",
              height: "300px",
              marginTop: "20px",
              border: "1px solid #025b6b",
              borderRadius: "10px",
            }}
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary mb-5">
            Update
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

export default EditRestaurant;

//backup

// import axios from "axios";
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/light.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// function EditRestaurant() {
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     location: "",
//     phone: "",
//     openingTime: "",
//     closingTime: "",
//     description: "",
//     latitude: 27.7172, // Initialize latitude with default values
//     longitude: 85.324, // Initialize longitude with default values
//   });

//   const navigate = useNavigate();
//   const { id } = useParams();
//   const mapContainerRef = useRef(null);
//   const markerRef = useRef(null);
//   const mapRef = useRef(null);

//   const showNotification = (message, type) => {
//     toast(message, { type });
//   };

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/get/" + id)
//       .then((res) => {
//         const restaurantData = res.data.Result[0];
//         setData({
//           ...data,
//           name: restaurantData.name,
//           email: restaurantData.email,
//           location: restaurantData.location,
//           phone: restaurantData.phone,
//           openingTime: restaurantData.openingTime,
//           closingTime: restaurantData.closingTime,
//           description: restaurantData.description,
//           latitude: restaurantData.latitude, // Set latitude from fetched data
//           longitude: restaurantData.longitude, // Set longitude from fetched data
//         });
//       })
//       .catch((err) => console.log(err));
//   }, [id]);

//   useEffect(() => {
//     let map;
//     let marker;

//     const initializeMap = () => {
//       if (!map) {
//         map = L.map(mapContainerRef.current).setView(
//           [data.latitude, data.longitude],
//           12
//         );

//         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//           attribution: "&copy; OpenStreetMap contributors",
//         }).addTo(map);

//         map.on("click", handleMapClick);
//         mapRef.current = map;

//         // Show the marker if latitude and longitude are not the default values
//         if (data.latitude !== 27.7172 && data.longitude !== 85.324) {
//           marker = L.marker([data.latitude, data.longitude]).addTo(map);
//           marker.bindPopup("Restaurant location").openPopup();
//           markerRef.current = marker;
//         }
//       }
//     };

//     const handleMapClick = (event) => {
//       const { lat, lng } = event.latlng;

//       setData({
//         ...data,
//         latitude: lat,
//         longitude: lng,
//       });

//       if (markerRef.current) {
//         map.removeLayer(markerRef.current);
//       }

//       // Add a marker to the map at the clicked location
//       marker = L.marker([lat, lng]).addTo(map);
//       marker.bindPopup("Restaurant location").openPopup();

//       // Update the marker reference
//       markerRef.current = marker;
//     };

//     initializeMap();

//     return () => {
//       if (map) {
//         map.off();
//         map.remove();
//       }
//     };
//   }, [data]);

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const restaurantData = {
//       name: data.name,
//       email: data.email,
//       location: data.location,
//       phone: data.phone,
//       openingTime: data.openingTime,
//       closingTime: data.closingTime,
//       description: data.description,
//       latitude: data.latitude, // Include updated latitude
//       longitude: data.longitude, // Include updated longitude
//     };

//     axios
//       .put("http://localhost:5000/update/" + id, restaurantData)
//       .then((res) => {
//         showNotification("Restaurant updated successfully!", "success");
//         setTimeout(() => {
//           navigate("/dashboard/restaurant");
//         }, 3500);
//       })
//       .catch((err) => {
//         console.log(err);
//         showNotification(
//           "Failed to update restaurant. Please try again.",
//           "error"
//         );
//       });
//   };

//   return (
//     <div className="d-flex flex-column align-items-center pt-4">
//       <h2>Update Restaurant</h2>
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
//             onChange={(e) => setData({ ...data, name: e.target.value })}
//             value={data.name}
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
//             onChange={(e) => setData({ ...data, email: e.target.value })}
//             value={data.email}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputLocation" className="form-label">
//             Location
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="inputLocation"
//             placeholder="Enter Location"
//             autoComplete="off"
//             onChange={(e) => setData({ ...data, location: e.target.value })}
//             value={data.location}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputphone" className="form-label">
//             Phone
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="inputphone"
//             placeholder="Enter phone"
//             autoComplete="off"
//             onChange={(e) => setData({ ...data, phone: e.target.value })}
//             value={data.phone}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputOpeningTime" className="form-label">
//             Opening Time
//           </label>
//           <Flatpickr
//             className="mx-3"
//             value={data.openingTime}
//             options={{
//               enableTime: true,
//               noCalendar: true,
//               dateFormat: "H:i",
//             }}
//             onChange={(newValue) =>
//               setData({
//                 ...data,
//                 openingTime: newValue[0].toLocaleTimeString("en-US", {
//                   hour12: false,
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 }),
//               })
//             }
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputClosingTime" className="form-label">
//             Closing Time
//           </label>
//           <Flatpickr
//             className="mx-4"
//             value={data.closingTime}
//             options={{
//               enableTime: true,
//               noCalendar: true,
//               dateFormat: "H:i",
//             }}
//             onChange={(newValue) =>
//               setData({
//                 ...data,
//                 closingTime: newValue[0].toLocaleTimeString("en-US", {
//                   hour12: false,
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 }),
//               })
//             }
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
//             onChange={(e) => setData({ ...data, description: e.target.value })}
//             value={data.description}
//           />
//         </div>
//         <div className="col-12">
//           <div
//             id="leaflet-map"
//             ref={mapContainerRef}
//             style={{
//               width: "100%",
//               height: "300px",
//               marginTop: "20px",
//               border: "1px solid #025b6b",
//               borderRadius: "10px",
//             }}
//           />
//         </div>
//         <div className="col-12">
//           <button type="submit" className="btn btn-primary mb-5">
//             Update
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

// export default EditRestaurant;

//old ones

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/light.css"; // Import the theme you want
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   validateName,
//   validateEmail,
//   validatePhoneNumber,
// } from "./formvalidation";

// function EditRestaurant() {
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     location: "",
//     phone: "",
//     openingTime: "", // Add opening time
//     closingTime: "", // Add closing time
//     description: "", // Add description
//   });

//   const navigate = useNavigate();
//   const { id } = useParams();
//   const showNotification = (message, type) => {
//     toast(message, { type });
//   };

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/get/" + id)
//       .then((res) => {
//         setData({
//           ...data,
//           name: res.data.Result[0].name,
//           email: res.data.Result[0].email,
//           location: res.data.Result[0].location,
//           phone: res.data.Result[0].phone,
//           openingTime: res.data.Result[0].openingTime, // Fetch opening time
//           closingTime: res.data.Result[0].closingTime, // Fetch closing time
//           description: res.data.Result[0].description, // Fetch description
//         });
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const handleSubmit = (event) => {
//     // event.preventDefLocation
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

//     axios
//       .put("http://localhost:5000/update/" + id, data)
//       .then((res) => {
//         // if (res.data.Status === "Success") {
//         //   alert("Update Success");
//         //   // window.assign("/dashboard/restaurant");
//         //   navigate("/dashboard/restaurant");
//         // }
//         showNotification("Restaurant updated successfully!", "success");

//         // Delay navigation to the dashboard
//         setTimeout(() => {
//           navigate("/dashboard/restaurant");
//         }, 3500);
//       })
//       .catch((err) => {
//         console.log(err);
//         showNotification(
//           "Failed to update restaurant. Please try again.",
//           "error"
//         );
//       });
//   };

//   return (
//     <div className="d-flex flex-column align-items-center pt-4">
//       <h2>Update Restaurant</h2>
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
//             onChange={(e) => setData({ ...data, name: e.target.value })}
//             value={data.name}
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
//             onChange={(e) => setData({ ...data, email: e.target.value })}
//             value={data.email}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputLocation" className="form-label">
//             Location
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="inputLocation"
//             placeholder="Enter Location"
//             autoComplete="off"
//             onChange={(e) => setData({ ...data, location: e.target.value })}
//             value={data.location}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputphone" className="form-label">
//             Phone
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="inputphone"
//             placeholder="Enter phone"
//             autoComplete="off"
//             onChange={(e) => setData({ ...data, phone: e.target.value })}
//             value={data.phone}
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputOpeningTime" className="form-label">
//             Opening Time
//           </label>
//           <Flatpickr
//             className="mx-3"
//             value={data.openingTime}
//             options={{
//               enableTime: true,
//               noCalendar: true,
//               dateFormat: "H:i",
//             }}
//             onChange={(newValue) =>
//               setData({
//                 ...data,
//                 openingTime: newValue[0].toLocaleTimeString("en-US", {
//                   hour12: false,
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 }),
//               })
//             }
//           />
//         </div>
//         <div className="col-12">
//           <label htmlFor="inputClosingTime" className="form-label">
//             Closing Time
//           </label>
//           <Flatpickr
//             className="mx-4"
//             value={data.closingTime}
//             options={{
//               enableTime: true,
//               noCalendar: true,
//               dateFormat: "H:i",
//             }}
//             onChange={(newValue) =>
//               setData({
//                 ...data,
//                 closingTime: newValue[0].toLocaleTimeString("en-US", {
//                   hour12: false,
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 }),
//               })
//             }
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
//             onChange={(e) => setData({ ...data, description: e.target.value })}
//             value={data.description}
//           />
//         </div>
//         <div className="col-12">
//           <button type="submit" className="btn btn-primary mb-5">
//             Update
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

// export default EditRestaurant;
