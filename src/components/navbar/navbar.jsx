import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ background: "black", padding: "1rem", marginBottom: "1rem" }}>
      <ul style={{ listStyle: "none", display: "flex", justifyContent: "space-between" }}>
         <li>
          <Link to="/dashboard" style={{ color: "yellow", textDecoration: "none" }}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/add" style={{ color: "yellow", textDecoration: "none" }}>
            Add User
          </Link>
        </li>
        <li>
          <Link to="/attendance" style={{ color: "yellow", textDecoration: "none" }}>
            Mark Attendance
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
