import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AuthJs = ({ onLogin, isLoggedIn }) => {

    const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const [loader, setLoader] = useState(false);



  const validationSchema = Yup.object({
    username: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoader(true);
      console.log("values:", values);
      try {
        const response = await axios.post(
          "http://localhost:3000/user/login",
          values
        );
        setResponse(response.data);
      } catch (error) {
        setLoader(false);
        console.error("Error fetching data:", error);
      }
    },
  });

  useEffect(() => {
    if (loader) {
      console.log("Check", response);
      sessionStorage.setItem("useData", JSON.stringify(response));
      onLogin();
      setLoader(false);
    }
  }, [response]);

  useEffect(() => {
    if (isLoggedIn) {
        console.log("isLoggedIn", isLoggedIn);
      navigate("/dashboard");
      toast('Logged in Successfully!')
    }
  }, [isLoggedIn]);

  //   console.log("error:", error);
  console.log("response:", response);
  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={formik.handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className={`form-control mt-1 ${
                formik.touched.username && formik.errors.username
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="Enter username"
              {...formik.getFieldProps("username")}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="invalid-feedback">{formik.errors.username}</div>
            ) : null}
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className={`form-control mt-1 ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="Enter password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="invalid-feedback">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AuthJs;
