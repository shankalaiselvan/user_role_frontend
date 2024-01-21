// App.js

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./Auth/Auth";
import Dashboard from "./Pages/Dashboard";
import Add from "./Pages/Add";
import Edit from "./Pages/Edit";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  useEffect(() => {
    const accessToken = JSON.parse(
      sessionStorage.getItem("useData")
    )?.accessToken;
    console.log("accessToken:", accessToken);
    if (accessToken) {
      setLoggedIn(true);
    } else {
      handleLogout();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={<Auth onLogin={handleLogin} isLoggedIn={isLoggedIn} />}
        />
        {isLoggedIn ? (
          <>
            <Route
              path="/dashboard"
              element={<Dashboard onLogout={handleLogout} />}
            />
            <Route path="/add" element={<Add onLogout ={handleLogout} />} />
            <Route path="/edit/:id" element={<Edit onLogout ={handleLogout} />} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/auth" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
