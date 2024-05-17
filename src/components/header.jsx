import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";

export default class Header extends Component {
  render() {
    return (
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Logo</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/top-tracks">Top tracks</Nav.Link>
              <Nav.Link href="/top-artists">Top Artists</Nav.Link>
              <Nav.Link href="/top-genre">Top Genre</Nav.Link>
              <Nav.Link href="/search-artists">
                Search Albums Of An Artists
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
