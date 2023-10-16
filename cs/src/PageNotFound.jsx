import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="pageNotFound">
      <h2>Error 404</h2>
      <p>Page Not Found</p>
      <button>
        <Link to="/">Go Back</Link>
      </button>
    </div>
  );
};

export default PageNotFound;
