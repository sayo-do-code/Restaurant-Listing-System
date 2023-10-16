import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const [adminCount, setAdminCount] = useState();
  const [restaurantCount, setRestaurantCount] = useState();
  const [requestApproved, setRequestApproved] = useState();
  const [requestPending, setRequestPending] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:5000/adminCount")
      .then((res) => {
        setAdminCount(res.data[0].admin);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/restaurantCount")
      .then((res) => {
        setRestaurantCount(res.data[0].restaurant);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/requestApproved")
      .then((res) => {
        setRequestApproved(res.data[0].approved);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/requestPending")
      .then((res) => {
        setRequestPending(res.data[0].pending);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container custom-container">
      <div className="p-3 d-flex flex-column justify-content-around mt-5">
        {" "}
        {/* Changed from 'd-flex' to 'd-flex flex-column' */}
        <div className="CountBoard">
          <h2>Count Board</h2>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="px-3 pt-2 pb-3  shadow-sm w-100 mb-5 box-style">
              {" "}
              {/* Changed from 'w-25' to 'w-100' and added 'mb-3' for margin-bottom */}
              <div className="text-center">
                <h4 className="mt-4">Admin</h4>
              </div>
              <hr />
              <div className="">
                <h5 className="text-center mt-2">Count: {adminCount}</h5>
              </div>
            </div>
            <div className="px-3 pt-2 pb-3  shadow-sm w-100 mb-5 box-style">
              {" "}
              {/* Changed from 'w-25' to 'w-100' and added 'mb-3' for margin-bottom */}
              <div className="text-center">
                <h4 className="mt-4">Restaurant</h4>
              </div>
              <hr />
              <div className="">
                <h5 className="text-center">Count: {restaurantCount}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="px-3 pt-2 pb-3  shadow-sm w-100 mb-5 mx-4 box-style">
              {" "}
              {/* Changed from 'w-25' to 'w-100' and added 'mb-3' for margin-bottom */}
              <div className="text-center">
                <h4 className="mt-4">Restaurants Approved</h4>
              </div>
              <hr />
              <div className="">
                <h5 className="text-center">Count: {requestApproved}</h5>
              </div>
            </div>
            <div className="px-3 pt-2 pb-3 shadow-sm w-100 mx-4 box-style">
              {" "}
              {/* Changed from 'w-25' to 'w-100' */}
              <div className="text-center">
                <h4 className="mt-4">Pending Requests</h4>
              </div>
              <hr />
              <div className="">
                <h5 className="text-center">Count: {requestPending}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
