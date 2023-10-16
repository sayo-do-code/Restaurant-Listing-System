import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomerRegister() {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/customerregister", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/customerlogin");
        } else {
          setError(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 restroPage">
      <div className=" loginForm">
        <div
          className="text-danger"
          style={{ textAlign: "center", marginBottom: "10px" }}
        >
          {error && error}
        </div>
        <center>
          <h2>Sign Up</h2>
        </center>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 my-3">
            <label htmlFor="fullName">
              <strong>Full Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              className="form-control rounded-3 my-2"
            />
          </div>
          <div className="mb-3 my-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="form-control rounded-3 my-2"
            />
          </div>
          <div className="mb-3 my-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="form-control rounded-3 my-2"
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-3 my-2 colorOrange"
          >
            Register
          </button>
          <button
            type="button"
            className="btn btn-danger w-100 rounded-3 my-2"
            onClick={() => navigate("/")}
          >
            Go Back
          </button>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <span>Already have an account? </span>
            <span
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => navigate("/customerlogin")}
            >
              Sign in here.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerRegister;
