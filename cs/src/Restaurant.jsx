import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./style.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Restaurant() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const navigate = useNavigate(); // Use the useNavigate hook
  const showNotification = (message, type) => {
    toast(message, { type });
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete("http://localhost:5000/delete/" + id)
              .then((res) => {
                setData(data.filter((restaurant) => restaurant.id !== id));
                showNotification("Restaurant deleted successfully!", "success");
              })
              .catch((err) => {
                console.log(err);
                showNotification(
                  "Failed to delete restaurant. Please try again.",
                  "error"
                );
              });
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const formatTime = (time) => {
    if (time) {
      let [hour, minute] = time.split(":");
      let AM_PM = hour < 12 ? "AM" : "PM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${AM_PM}`;
    }
    return "";
  };

  const exportToExcel = () => {
    const excelData = data.map((restaurant, index) => ({
      "S.N": index + 1,
      Name: restaurant.name,
      Email: restaurant.email,
      Location: restaurant.location,
      Contact: restaurant.phone,
      OpeningTime: formatTime(restaurant.openingTime), // Use the formatTime function
      ClosingTime: formatTime(restaurant.closingTime), // Use the formatTime function
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Restaurant List");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveExcelFile(excelBuffer, "RestaurantList.xlsx");
  };

  const saveExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(data);
    link.download = fileName;
    // Removed 'rfv'
    link.click();
  };

  const filteredData = data.filter((restaurant) =>
    restaurant.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="px-5 py-3">
      <div className="d-flex justify-content-between mt-2 ">
        <h5 className="titleRL">Restaurant Lists</h5>
      </div>
      <div className="row mt-3">
        <div className="col-md-3">
          <div className="d-flex justify-content-between my-5">
            <Link to="/dashboard/create" className="btn btn-success btnCustom">
              Add Restaurant
            </Link>
          </div>
        </div>
        <div className="col-md-6"></div>
        <div className="col-md-3">
          <div className="row">
            <div className="col-md-3">
              <div>
                <button className="btn btn-success" onClick={exportToExcel}>
                  Excel
                </button>
              </div>
            </div>
            <div className="col-md-9">
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <table className="table my-3">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Opens</th>
              <th>Closes</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((restaurant, index) => {
              return (
                <tr key={index}>
                  <td>
                    {
                      <img
                        src={`http://localhost:5000/images/` + restaurant.image}
                        alt=""
                        className="restaurant_image"
                      ></img>
                    }
                  </td>
                  <td className="align-middle">{restaurant.name}</td>
                  <td className="align-middle">{restaurant.email}</td>
                  <td className="align-middle">{restaurant.location}</td>
                  <td className="align-middle">{restaurant.phone}</td>
                  <td className="align-middle">
                    {formatTime(restaurant.openingTime)}
                  </td>
                  <td className="align-middle">
                    {formatTime(restaurant.closingTime)}
                  </td>
                  <td className="align-middle">
                    <Link
                      to={`/dashboard/restaurantEdit/` + restaurant.id}
                      className="btn btn-primary btn-sm mx-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => handleDelete(restaurant.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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

export default Restaurant;
