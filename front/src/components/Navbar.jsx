import React from "react";
//import { NavLink } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

export const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container">
          <NavLink className="navbar-brand" ti="/">
            Navbar
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-togggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to={"/"}></NavLink>
              </li>

              {/* BORRAR ANTES DE INICIAR GRABACION */}

              <li className="nav-item">
                <NavLink className="nav-link" to={"/categories"}>
                  Categorias
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to={"/"}>
                  Productos
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to={"/inventories"}>
                  Inventario
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to={"/clients"}>
                  Clientes
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to={"/sales"}>
                  Ventas
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};
