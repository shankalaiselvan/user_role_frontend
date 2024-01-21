import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons from react-icons

const UserList = () => {
  const [userList, setUserList] = useState({ responseData: [] });
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      const accessToken = JSON.parse(
        sessionStorage.getItem("useData")
      )?.accessToken;

      try {
        const response = await axios.get("http://localhost:3000/user/list", {
          headers: {
            Authorization: `${accessToken}`,
          },
        });
        setUserList(response.data);
      } catch (error) {
        setLoader(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userList) {
      setLoader(false);
    }
  }, [userList]);

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            setLoader(true);
            const accessToken = JSON.parse(
              sessionStorage.getItem("useData")
            )?.accessToken;
  
            try {
              const response = await axios.post(
                `http://localhost:3000/user/delete/`,
                {
                  userId: id,
                },
                {
                  headers: {
                    Authorization: `${accessToken}`,
                  },
                }
              );
              setUserList(response.data);
              toast("Deleted Successfully!");
            } catch (error) {
              setLoader(false);
              toast.error(`${error?.response?.data?.message}`);
              console.error("Error deleting data:", error);
            } finally {
              setLoader(false);
            }
  
            const fetchUserList = async () => {
              setLoader(true);
              try {
                const response = await axios.get("http://localhost:3000/user/list", {
                  headers: {
                    Authorization: `${accessToken}`,
                  },
                });
                setUserList(response.data);
              } catch (error) {
                setLoader(false);
                console.error("Error fetching data:", error);
              }
            };
  
            fetchUserList();
          },
        },
        {
          label: 'No',
          onClick: () => {
            // Do nothing if "No" is clicked
          },
        },
      ],
    });
  };

  const [role, setRole] = useState("");
  useEffect(() => {
    const role = JSON.parse(sessionStorage.getItem("useData"))?.role;
    setRole(role);
  }, []);

  // Logic for Pagination
  const responseData = userList.responseData || []; // Check for existence of responseData
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = responseData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="d-flex justify-content-between m-2">
        <div>
          <h2>User Details:</h2>
        </div>
        {role !== "supervisor" ? (
          <Link to="/add">
            <button className="btn btn-primary ml-auto">Add</button>
          </Link>
        ) : null}
      </div>

      {loader ? (
        "Loading..."
      ) : (
        <>
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Mobile</th>
                {role !== "supervisor" ? (
                  <>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={user._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{`${user.countryCode} ${user.mobile}`} </td>
                  {role !== "supervisor" ? (
                    <>
                       <td>
                        <Link to={`/edit/${user._id}`}>
                          <button className="btn btn-default">
                            <FaEdit /> {/* Edit Icon */}
                          </button>
                        </Link>
                      </td>
                      <td>
                        <button
                          className="btn btn-default"
                          onClick={() => handleDelete(user._id)}
                        >
                          <FaTrashAlt /> {/* Delete Icon */}
                        </button>
                      </td>
                    </>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(responseData.length / itemsPerPage) }, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginate(i + 1)} className="page-link">
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default UserList;
