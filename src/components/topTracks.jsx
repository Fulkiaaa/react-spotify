import React, { Component } from "react";
import axios from "axios";
import { Button, Table, Container } from "react-bootstrap";

const CLIENT_ID = "7c26d439ea214815bc4a613af0331b1c";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-read-recently-played";
const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

export default class TopTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      token: window.localStorage.getItem("token"),
      isLoggedIn: !!window.localStorage.getItem("token"),
    };
  }

  componentDidMount() {
    const { token } = this.state;

    if (token) {
      this.fetchRecentlyPlayedTracks();
    }
  }

  fetchRecentlyPlayedTracks = () => {
    const { token } = this.state;

    axios
      .get("https://api.spotify.com/v1/me/player/recently-played", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 50,
        },
      })
      .then((response) => {
        this.setState({ tracks: response.data.items });
      })
      .catch((error) => {
        console.error("Error fetching recently played tracks:", error);
      });
  };

  render() {
    const { tracks, isLoggedIn } = this.state;

    if (!isLoggedIn) {
      return (
        <div>
          <h2>Please log in to view your recently played tracks</h2>
          <Button variant="success" href={AUTH_URL}>
            Login to Spotify
          </Button>
        </div>
      );
    }

    return (
      <Container className="my-4" style={{ maxWidth: "80%" }}>
        <h2>Recently Played Tracks</h2>
        <Table className="my-4" striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2}>Track Name</th>
              <th>Artists</th>
              <th>Album</th>
              <th>Played At</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((trackObj, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{trackObj.track.name}</td>
                <td>
                  {trackObj.track.artists
                    .map((artist) => artist.name)
                    .join(", ")}
                </td>
                <td>{trackObj.track.album.name}</td>
                <td>{new Date(trackObj.played_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}
