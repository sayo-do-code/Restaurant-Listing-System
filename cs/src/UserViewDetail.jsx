import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import L from "leaflet"; // Import Leaflet library
import "leaflet/dist/leaflet.css";
import "./style.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Button from "react-bootstrap/Button";

function UserViewDetail() {
  // const history = useHistory();
  // const navigate = useNavigate();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [map, setMap] = useState(null);

  const formatTime = (time) => {
    if (time) {
      let [hour, minute] = time.split(":");
      let AM_PM = hour < 12 ? "AM" : "PM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${AM_PM}`;
    }
    return "";
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/get/" + id)
      .then((res) => {
        setRestaurant(res.data.Result[0]);
        // Initialize the Leaflet map when restaurant data is available
        if (
          !map &&
          res.data.Result[0].latitude &&
          res.data.Result[0].longitude
        ) {
          const leafletMap = L.map("leaflet-map").setView(
            [res.data.Result[0].latitude, res.data.Result[0].longitude],
            12
          );
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(leafletMap);
          L.marker([res.data.Result[0].latitude, res.data.Result[0].longitude])
            .addTo(leafletMap)
            .bindPopup("Restaurant Location")
            .openPopup();
          setMap(leafletMap);
        }
      })
      .catch((err) => console.log(err));
  }, [id, map]);

  const menuImages = restaurant.menu ? JSON.parse(restaurant.menu) : [];
  const menuImageUrls = menuImages.map(
    (image) => `http://localhost:5000/images/${image}`
  );

  // Handle the "See other restaurants" button click
  const handleSeeOtherRestaurants = () => {
    // Go back to the previous page with the same user ID
    // history.goBack();
    window.history.back();
  };

  return (
    <div className="restaurant-profile">
      <div className="navRestaurant">
        <div className="navLogoRestro">RLS</div>
        {/* Sticky button at bottom right */}
        <div
          className="sticky-button"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "0px",
            zIndex: 999, // Ensure it appears on top of other content
          }}
        >
          <Button
            className="btn btn-success"
            onClick={handleSeeOtherRestaurants}
          >
            See other
          </Button>
        </div>
      </div>
      <div className="restaurantBody"></div>
      <div className="restaurantDetailsList">
        <div className="restroImage">
          {restaurant.image && (
            <img
              src={`http://localhost:5000/images/${restaurant.image}`}
              alt={restaurant.name}
              className="restro"
            />
          )}
        </div>
        <div className="restroName">
          <h3> {restaurant.name}</h3>
          <div className="restroOtherDetails">
            <h3>Email: {restaurant.email}</h3>
            <h3>Location: {restaurant.location}</h3>
            <h3>Phone: {restaurant.phone}</h3>
            <h3>Opens at: {formatTime(restaurant.openingTime)}</h3>
            <h3>Closes at: {formatTime(restaurant.closingTime)}</h3>
          </div>
        </div>
      </div>
      <div className="restaurantDescription">
        <h3 className="DescriptionTitle">Description</h3>
        <div className="descriptionBox">{restaurant.description}</div>
      </div>
      <h3 className="MenuTitle">Menu</h3>
      <div className="menuImages mb-5">
        {menuImageUrls.map((url, index) => (
          <div
            key={index}
            className="menu-image-container"
            onClick={() => setCurrentImage(url)}
          >
            <img
              src={url}
              alt={`Menu item ${index + 1}`}
              className="menu-image"
            />
          </div>
        ))}
      </div>
      <div>
        <h3 className="MapTitle">Location on Map</h3>
      </div>
      {currentImage && (
        <div className="lightbox">
          <span className="close" onClick={() => setCurrentImage(null)}>
            &times;
          </span>
          <img src={currentImage} alt="Current Menu Item" />
        </div>
      )}
      <div
        id="leaflet-map"
        style={{
          width: "84%",
          height: "400px",
          marginTop: "20px",
          marginBottom: "100px",
          border: "1px solid #025b6b",
          borderRadius: "10px",
        }}
      />
    </div>
  );
}

export default UserViewDetail;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./style.css";
// import { useNavigate, Link } from "react-router-dom";
// import Button from "react-bootstrap/Button";
// import Lightbox from "react-spring-lightbox";

// function UserViewDetail() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [restaurant, setRestaurant] = useState([]);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const formatTime = (time) => {
//     if (time) {
//       let [hour, minute] = time.split(":");
//       let AM_PM = hour < 12 ? "AM" : "PM";
//       hour = hour % 12 || 12;
//       return `${hour}:${minute} ${AM_PM}`;
//     }
//     return "";
//   };

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/get/" + id)
//       .then((res) => {
//         setRestaurant(res.data.Result[0]);
//       })
//       .catch((err) => console.log(err));
//   }, [id]);

//   const menuImages = restaurant.menu ? JSON.parse(restaurant.menu) : [];

//   // Function to open the lightbox
//   const openLightbox = (index) => {
//     console.log("Opening lightbox with index:", index); // Add this line for debugging
//     setCurrentImageIndex(index);
//     setLightboxOpen(true);
//   };

//   // Function to close the lightbox
//   const closeLightbox = () => {
//     setLightboxOpen(false);
//   };

//   return (
//     <div className="restaurant-profile">
//       <div className="navRestaurant">
//         <div className="navLogoRestro">RLS</div>
//         {/* <div>
//           <Button
//             className="btn btn-success"
//             onClick={(e) => navigate("/userview")}
//           >
//             See other restuarants
//           </Button>
//         </div> */}
//       </div>
//       <div className="restaurantBody"></div>
//       <div className="restaurantDetailsList">
//         <div className="restroImage">
//           {restaurant.image && (
//             <img
//               src={`http://localhost:5000/images/${restaurant.image}`}
//               alt={restaurant.name}
//               className="restro"
//             />
//           )}
//         </div>
//         <div className="restroName">
//           <h3> {restaurant.name}</h3>
//           <div className="restroOtherDetails">
//             <h3>Email: {restaurant.email}</h3>
//             <h3>Location: {restaurant.location}</h3>
//             <h3>Phone: {restaurant.phone}</h3>
//             <h3>Opens at: {formatTime(restaurant.openingTime)}</h3>
//             <h3>Closes at: {formatTime(restaurant.closingTime)}</h3>
//           </div>
//         </div>
//       </div>
//       <div className="restaurantDescription">
//         <h3 className="DescriptionTitle">Description</h3>
//         <div className="descriptionBox">{restaurant.description}</div>
//       </div>
//       <h3 className="MenuTitle">Menu</h3>
//       <div className="menuImages mb-5">
//         {menuImages.map((image, index) => (
//           <div
//             key={index}
//             className="menu-image-container"
//             onClick={() => {
//               console.log(`Clicked on image at index ${index}`);
//               openLightbox(index);
//             }} // Open lightbox on image click
//           >
//             <img
//               src={`http://localhost:5000/images/${image}`}
//               alt={`Menu item ${index + 1}`}
//               className="menu-image"
//             />
//           </div>
//         ))}
//       </div>
//       {/* React Spring Lightbox */}
//       {lightboxOpen && (
//         <Lightbox
//           images={menuImages.map((image) => ({
//             src: `http://localhost:5000/images/${image}`,
//           }))}
//           currentIndex={currentImageIndex}
//           onClose={closeLightbox}
//           style={{
//             /* Customize lightbox styles here */
//             backgroundColor: "rgba(0, 0, 0, 0.8)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//           }}
//           contentStyle={{
//             /* Customize lightbox content styles here */
//             maxWidth: "90%",
//             maxHeight: "90%",
//             overflow: "auto",
//           }}
//           imageStyle={{
//             /* Customize lightbox image styles here */
//             maxWidth: "100%",
//             maxHeight: "100%",
//             display: "block",
//             margin: "0 auto",
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export default UserViewDetail;
