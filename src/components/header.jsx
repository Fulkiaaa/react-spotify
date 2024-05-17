import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Header extends Component {
  render() {
    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">Logo</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/top-tracks">Top tracks</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/top-artists">Top Artists</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/top-genre">Top Genre</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/search-artists">Search Artists</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
