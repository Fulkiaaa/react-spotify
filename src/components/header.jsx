import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";

export default class Header extends Component {
  render() {
    return (
      <Navbar bg="secondary" variant="secondary" expand="lg">
        <Container>
          <Navbar.Brand href="/" className="text-white">
            Logo
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto p-2 gap-4">
              {/* <Nav.Link className="text-white" href="/">
                Home
              </Nav.Link> */}
              <Nav.Link className="text-white" href="/top-tracks">
                Top tracks
              </Nav.Link>
              <Nav.Link className="text-white" href="/top-artists">
                Top Artists
              </Nav.Link>
              <Nav.Link className="text-white" href="/top-genres">
                Top Genres
              </Nav.Link>
              <Nav.Link className="text-white" href="/search-artists">
                Search Albums Of An Artists
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
