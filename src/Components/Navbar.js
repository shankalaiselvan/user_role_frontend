import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Navbar = (props) => {
  const handleLogout = () => {
    sessionStorage.clear();
    props.onLogout();
    toast("Logout Successfully!")
  };

  const useData = JSON.parse(sessionStorage.getItem("useData"));

  return (
    <>
      <nav className="navbar navbar-light bg-light justify-content-between  p-2 ">
        <a className="navbar-brand">{props.name}</a>
        <div className="d-flex align-items-center">
          <h4 className="text-capitalize px-4 m-0 ">{useData.role}</h4>

          <form className="form-inline">
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
              onClick={handleLogout}
            >
              Logout
            </button>
          </form>
          <ToastContainer />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
