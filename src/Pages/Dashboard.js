import React from 'react'
import Navbar from '../Components/Navbar'
import UserList from '../Components/UserList'

const Dashboard = ({onLogout}) => {
  return (
    <>
      <Navbar name={"Dashboard"} onLogout={onLogout} />
      <UserList />
    </>
  )
}

export default Dashboard