import { Link, Outlet } from "react-router-dom";

import NavbarAccount from "./components/NavbarAccount/NavbarAccount";
import "./Navbar.css";

export default function Navbar() {
  return (
    <>
      <header className="navbar-header">
        <nav className="navbar">
          <Link to="/" className="">
            Logo
          </Link>
          <div>
            <NavbarAccount />
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
