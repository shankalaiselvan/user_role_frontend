import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const AuthJs = ({ onLogin }) => {
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
          "https://192.168.0.19:3000/user/login",
          values
        );
        setResponse(response.data);
        console.log("response:", response);
      } catch (error) {
        setLoader(false);
        console.error("Error fetching data:", error);
      }
    },
  });

  useEffect(() => {
    if (loader) {
      sessionStorage.setItem("useData", response);
      onLogin();
      setLoader(false);
    }
  }, [response]);

  //   console.log("error:", error);
  //   console.log("response:", response);
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

      {error && (
        <div className="position-fixed bottom-0 end-0 p-3">
          <div
            id="error-toast"
            className="toast align-items-center text-white bg-danger border-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">{error}</div>
              <button
                type="button"
                className="btn-close me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => setError(null)}
              ></button>
            </div>
          </div>
        </div>
      )}

      {response && (
        <div className="mt-3">
          <strong>Response:</strong> {JSON.stringify(response)}
        </div>
      )}
    </div>
  );
};

export default AuthJs;
