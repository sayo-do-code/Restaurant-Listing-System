import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./style.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function UserView() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/getrestaurant")
      .then((response) => {
        setData(response.data.Result);
      })
      .catch((error) => {
        console.error("Error fetching restaurant details:", error);
      });
  }, []);

  const handleLogout = () => {
    confirmAlert({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .get("http://localhost:5000/logout")
              .then((res) => {
                navigate("/");
              })
              .catch((err) => console.log(err));
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div className="container mt-5">
      <div style={{ float: "right" }}>
        <button className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="DiscoverTitle">
        <h2>Discover the restaurants.</h2>
      </div>
      <div className="row">
        {data.map((restaurant, index) => {
          return (
            <div key={index} className="col-md-3 mb-4">
              <div className="card" style={{ maxWidth: "18rem" }}>
                <img
                  src={`http://localhost:5000/images/` + restaurant.image}
                  alt={restaurant.name}
                  className="card-img-top"
                  style={{
                    height: "220px",

                    objectFit: "cover",
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <Link
                    to={`/userviewdetail/` + restaurant.id}
                    className="btn btn-primary"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserView;
