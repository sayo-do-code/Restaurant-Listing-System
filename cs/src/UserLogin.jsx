import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function UserLogin() {
  const [values, setValues] = useState({
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
      .post("http://localhost:5000/userlogin", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          const id = res.data.id;
          Cookies.set("customer_token", res.data.token);
          navigate("/userview/" + id);
          // navigate("/restaurantdetail/${id}");
        } else {
          setError(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 userLoginPage">
      <div className="p-3  w-25  loginForm">
        <div className="text-danger">{error && error}</div>
        <center>
          <h2>Login</h2>
        </center>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 my-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
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
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-3 my-2"
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-3 my-2 colorOrange"
          >
            {" "}
            Log in
          </button>
          <Link
            to={`/restaurantdescription/` + restaurant.id}
            className="btn btn-primary"
          >
            View
          </Link>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
