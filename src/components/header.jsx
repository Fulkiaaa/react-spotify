import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import axios from "axios";

const CLIENT_ID = "7c26d439ea214815bc4a613af0331b1c";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-read-recently-played";
const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
    };
  }

  componentDidMount() {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    this.setState({ token });
  }

  logout = () => {
    this.setState({ token: null });
    window.localStorage.removeItem("token");
  };

  render() {
    return (
      <Navbar bg="secondary" variant="secondary" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="/" className="text-white">
            Logo
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto p-2 gap-4">
              <Nav.Link className="text-white" href="/top-tracks">
                My Top Tracks
              </Nav.Link>
              <Nav.Link className="text-white" href="/top-artists">
                My Top Artists
              </Nav.Link>
              <Nav.Link className="text-white" href="/top-genres">
                My Top Genres
              </Nav.Link>
              <Nav.Link className="text-white" href="/search-artists">
                Search Albums Of An Artist
              </Nav.Link>
            </Nav>
            <Nav className="ms-3">
              {this.state.token ? (
                <Button variant="danger" onClick={this.logout}>
                  Logout
                </Button>
              ) : (
                <Button variant="success" href={AUTH_URL}>
                  Login to Spotify
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
