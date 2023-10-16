import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./RestaurantDescription.css";

function RestaurantDescription() {
  const [data, setData] = useState([]);

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
      .get("http://localhost:5000/getrestaurant")
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        {data.map((restaurant, index) => {
          return (
            <div key={index} className="col-md-3 mb-4 mt-3">
              <div
                className="card"
                style={{ maxHeight: "", maxWidth: "20rem" }}
              >
                <div>
                  <img
                    src={`http://localhost:5000/images/` + restaurant.image}
                    alt={restaurant.name}
                    className="card-img-top"
                    style={{
                      // alignContent: "center",
                      marginLeft: "34px",
                      height: "150px",
                      width: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="card-body">
                  <h6 className="card-title">Name: {restaurant.name}</h6>
                  <h6 className="card-title">Email: {restaurant.email}</h6>
                  <h6 className="card-title">
                    Location: {restaurant.location}
                  </h6>
                  <h6 className="card-title">Phone no.: {restaurant.phone}</h6>
                  <h6 className="card-title">
                    Opens at:
                    {formatTime(restaurant.openingTime)}
                  </h6>
                  <h6 className="card-title">
                    Closes at:
                    {formatTime(restaurant.closingTime)}
                  </h6>
                  {/* <Link
                    to={`/userviewdetail/` + restaurant.id}
                    className="btn btn-primary"
                  >
                    View
                  </Link> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RestaurantDescription;
