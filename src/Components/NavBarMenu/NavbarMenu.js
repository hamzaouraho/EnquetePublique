/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./NavbarMenu.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function NavbarMenu() {
  const styleBotton = {
    textDecoration: "none",
    color: "#fff",
  };
  function NavbarMenuItem() {
    const numbers = [
      { key: 1, name: "Agences Urbaines", href: "#" },
      { key: 2, name: "Documents D'Urbanisme", href: "#" },
      { key: 3, name: "Enquete Publique", href: "enquete-pub" },
      { key: 4, name: "Contact", href: "#" },
    ];
    const listItems = numbers.map((number) => (
      <div className="box-header" key={number.key}>
        <li className="nav-item">
          <a className="nav-link" aria-current="page">
            <Link style={styleBotton} to={number.href}>
              {number.name}
            </Link>
          </a>
        </li>
      </div>
    ));
    return <ul className="navbar-nav me-auto">{listItems}</ul>;
  }

  return (
    <nav className="navhaut navbar navbar-expand-lg">
      <ul className="navbar-nav me-auto">
        <div className="box-header">
          <li className="nav-item">
            <a className="nav-link" aria-current="page">
              <Link style={styleBotton} to="/">
                Accueil
              </Link>
            </a>
          </li>
        </div>
        <div className="box-header">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Géo-Services
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a className="dropdown-item" href="/carte-consolidee">
                  Géoportail Consolidé
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Géoportail Investissement
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Géoportail Note Urbanistique Indicative
                </a>
              </li>
            </ul>
          </li>
        </div>
        <NavbarMenuItem />
      </ul>
      <div className="d-flex">
        <div className="box-header">
          <div className="iconstyle">
            <FaFacebookF color="white" size="1.2rem" />
          </div>
        </div>
        <div className="box-header">
          <div className="iconstyle">
            <FaTwitter color="white" size="1.2rem" />
          </div>
        </div>
        <div className="box-header">
          <div className="iconstyle">
            <FaLinkedinIn color="white" size="1.2rem" />
          </div>
        </div>
        <div className="box-header">
          <div className="iconstyle">
            <FaYoutube color="white" size="1.2rem" />
          </div>
        </div>
      </div>
    </nav>
  );
}
