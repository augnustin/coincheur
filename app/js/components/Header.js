import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../scss/components/header.scss';

const Header = () => (
  <nav className="navbar is-fixed-top is-spaced" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <Link to="/" className="navbar-item">
        <h1>Le coincheur confiné</h1>
      </Link>

      <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div className="navbar-menu">
      <div className="navbar-end">
        <div className="navbar-item has-dropdown">
          <a className="navbar-link">
            Paramètres
          </a>

          <div className="navbar-dropdown">
            <a className="navbar-item">
              Overview
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
)

export default Header;