import React from "react";
import Login from "./Login.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Restaurant from "./Restaurant.jsx";
import Home from "./Home.jsx";
import AddRestaurant from "./AddRestaurant.jsx";
import RestauranteEdit from "./EditRestaurant.jsx";
import Start from "./Start.jsx";
import RestaurantDetail from "./RestaurantDetail.jsx";
import RestaurantLogin from "./RestaurantLogin.jsx";
import PageNotFound from "./PageNotFound.jsx";
import GetStarted from "./GetStarted.jsx";
import UserView from "./UserView.jsx";
import UserViewDetail from "./UserViewDetail.jsx";
import UserLogin from "./UserLogin.jsx";
import RestaurantDescription from "./RestaurantDescription.jsx";
import Enroll from "./Enroll.jsx";
// Import Modal and set the app element
import Modal from "react-modal";
import CustomerLogin from "./CustomerLogin.jsx";
import CustomerRegister from "./CustomerRegister.jsx";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
Modal.setAppElement("#root");

function RestaurantProtectedRoute({ children }) {
  const { id } = useParams(); // Get the employee ID from the URL
  const token = Cookies.get("restaurant_token");
  if (!token) return <Navigate to="/restaurantLogin" />;

  // Decode the token to get the employee ID
  const decodedToken = jwt_decode(token);
  const tokenRestaurantId = decodedToken.id;

  // Check if the employee ID in the token matches the employee ID in the URL
  if (tokenRestaurantId.toString() === id) {
    return children;
  } else {
    return <Navigate to="/restaurantLogin" />;
  }
}

function CustomerProtectedRoute({ children }) {
  const { id } = useParams();
  const token = Cookies.get("customer_token");
  if (!token) return <Navigate to="/customerlogin" />;

  const decodedToken = jwt_decode(token);
  const tokenCustomerId = decodedToken.id;

  if (tokenCustomerId.toString() === id) {
    return children;
  } else {
    return <Navigate to="/customerlogin" />;
  }
}

function App() {
  const token = document.cookie;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={token ? `/dashboard` : `/`}
          element={token ? <Dashboard /> : <Start />}
        >
          <Route path="/dashboard" element={<Home />}></Route>
          <Route path="/dashboard/restaurant" element={<Restaurant />}></Route>
          <Route
            path="/dashboard/restaurantdescription"
            element={<RestaurantDescription />}
          ></Route>
          <Route path="/dashboard/enroll" element={<Enroll />}></Route>
          <Route path="/dashboard/create" element={<AddRestaurant />}></Route>
          <Route
            path="/dashboard/restaurantEdit/:id"
            element={<RestauranteEdit />}
          ></Route>
        </Route>
        <Route path="/" element={<Start />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/getstarted" element={<GetStarted />}></Route>
        <Route path="/customerregister" element={<CustomerRegister />}></Route>
        <Route path="/restaurantLogin" element={<RestaurantLogin />}></Route>
        <Route path="/userLogin" element={<UserLogin />}></Route>
        <Route path="/customerlogin" element={<CustomerLogin />}></Route>
        {/* <Route path="/userview/:id" element={<UserView />}></Route> */}
        <Route path="/userviewdetail/:id" element={<UserViewDetail />}></Route>
        <Route
          path="/userview/:id"
          element={
            <CustomerProtectedRoute>
              <UserView />
            </CustomerProtectedRoute>
          }
        ></Route>
        <Route
          path="/restaurantdetail/:id"
          element={
            <RestaurantProtectedRoute>
              <RestaurantDetail />
            </RestaurantProtectedRoute>
          }
        ></Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
