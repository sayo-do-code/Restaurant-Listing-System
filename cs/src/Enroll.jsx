import React, { useEffect, useState } from "react";
import axios from "axios";
import "./enroll.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Enroll() {
  const [registrations, setRegistrations] = useState([]);

  const showNotification = (message, type) => {
    toast(message, { type });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/getPendingRegistrations")
      .then((res) => {
        if (res.data.Status === "Success") {
          setRegistrations(res.data.Result);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleApprove = (id) => {
    axios
      .put("http://localhost:5000/approve/" + id)
      .then((res) => {
        showNotification("Request approved!", "success");
        setTimeout(() => {
          window.location.reload(true);
        }, 3500);
      })
      .catch((err) => {
        console.log(err);
        showNotification("Something went wrong.", "error");
      });
  };

  const handleReject = (id) => {
    axios
      .put("http://localhost:5000/reject/" + id)
      .then((res) => {
        showNotification("Request rejected!", "info");
        setTimeout(() => {
          window.location.reload(true);
        }, 3500);
      })
      .catch((err) => {
        console.log(err);
        showNotification("Something went wrong.", "error");
      });
  };

  return (
    <div className="enr_container">
      {registrations.length > 0 ? (
        registrations.map((registration, index) => (
          <div key={index} className="enr_card">
            <h5>{registration.name}</h5>
            <p>{registration.email}</p>
            <p>{registration.location}</p>
            <p>{registration.phone}</p>
            <button
              className="btn btn-success enr_btn"
              onClick={() => handleApprove(registration.id)}
            >
              Approve
            </button>
            <button
              className="btn btn-danger enr_btn"
              onClick={() => handleReject(registration.id)}
            >
              Reject
            </button>
          </div>
        ))
      ) : (
        <div className="enr_no-request">No requests</div>
      )}
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

export default Enroll;
