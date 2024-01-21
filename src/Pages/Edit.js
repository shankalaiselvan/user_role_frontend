import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const EditJs = ({ onLogin, isLoggedIn }) => {
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [loader, setLoader] = useState(false);

  const [datas, setDatas] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    countryCode: "",
    mobile: "",
  });

  const param = useParams();

  console.log("param:", param);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = JSON.parse(
        sessionStorage.getItem("useData")
      )?.accessToken;

      try {
        const response = await axios.post(
          "http://localhost:3000/user/getById",
          {
            userId: param?.id,
          },
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );
        if (response.data && response.data !== null) {
          console.log("response:", response.data.responseData);
          formik.setValues({
            ...response.data.responseData,
            confirmPassword: "",
          });
        }
      } catch (error) {
        toast.error(`${error?.response?.data?.message}`);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("datas:", datas.firstName);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    role: Yup.string().required("Role is required"),
    countryCode: Yup.string().required("Country Code is required"),
    mobile: Yup.string().required("Mobile number is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      countryCode: "",
      mobile: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values", values);
      setLoader(true);
      const accessToken = JSON.parse(
        sessionStorage.getItem("useData")
      )?.accessToken;
      try {
        const response = await axios.post(
          "http://localhost:3000/user/update",
          values,
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );
        console.log("response.data", response.data);
        setResponse(response.data);
      } catch (error) {
        setLoader(false);
        toast.error(`${error?.response?.data?.message}`);
        console.error("Error fetching data:", error);
      }
    },
  });

  useEffect(() => {
    if (loader) {
      if (response) {
        setLoader(false);
        toast("updated Successfully!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setLoader(false);
      }
    }
  }, [response]);

  console.log("values", formik.values);

  return (
    <div className="Auth-form-container">
      <ToastContainer />
      <form className="login-form" onSubmit={formik.handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Edit User</h3>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group mt-3">
                <label>First Name</label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.firstName && formik.errors.firstName
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter first name"
                  {...formik.getFieldProps("firstName")}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="invalid-feedback">
                    {formik.errors.firstName}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-3">
                <label>Last Name</label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.lastName && formik.errors.lastName
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter last name"
                  {...formik.getFieldProps("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="invalid-feedback">
                    {formik.errors.lastName}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              placeholder="Enter email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="form-group mt-3">
            <label>Role</label>
            <select
              className={`form-control ${
                formik.touched.role && formik.errors.role ? "is-invalid" : ""
              }`}
              {...formik.getFieldProps("role")}
            >
              <option value="" label="Select a role" />
              <option value="admin" label="Admin" />
              <option value="manager" label="Manager" />
              <option value="supervisor" label="Supervisor" />
            </select>
            {formik.touched.role && formik.errors.role ? (
              <div className="invalid-feedback">{formik.errors.role}</div>
            ) : null}
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group mt-3">
                <label>Country Code</label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.countryCode && formik.errors.countryCode
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter country code"
                  {...formik.getFieldProps("countryCode")}
                />
                {formik.touched.countryCode && formik.errors.countryCode ? (
                  <div className="invalid-feedback">
                    {formik.errors.countryCode}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-3">
                <label>Mobile</label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.mobile && formik.errors.mobile
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter mobile number"
                  {...formik.getFieldProps("mobile")}
                />
                {formik.touched.mobile && formik.errors.mobile ? (
                  <div className="invalid-feedback">{formik.errors.mobile}</div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter password"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="invalid-feedback">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-3">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Confirm password"
                  {...formik.getFieldProps("confirmPassword")}
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div className="invalid-feedback">
                    {formik.errors.confirmPassword}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              {loader ? (
                <div class="spinner-border text-light" role="status">
                  <span class="sr-only"></span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </form>

    </div>
  );
};

export default EditJs;
