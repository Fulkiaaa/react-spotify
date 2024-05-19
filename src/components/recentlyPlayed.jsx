import React, { Component } from "react";
import axios from "axios";
import { Button, Table, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { ThreeDots } from "react-loader-spinner";

const CLIENT_ID = "7c26d439ea214815bc4a613af0331b1c";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-read-recently-played";
const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

export default class RecentlyPlayedTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      token: window.localStorage.getItem("token"),
      isLoggedIn: !!window.localStorage.getItem("token"),
      loading: false,
    };
  }

  componentDidMount() {
    const { token } = this.state;
    this.setState({ loading: true });

    if (token) {
      this.fetchRecentlyPlayedTracks();
    } else {
      this.checkForTokenInUrl();
    }
  }

  checkForTokenInUrl = () => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      const parsedHash = new URLSearchParams(hash.substring(1));
      token = parsedHash.get("access_token");

      if (token) {
        window.localStorage.setItem("token", token);
        this.setState({ token, isLoggedIn: true }, () => {
          this.fetchRecentlyPlayedTracks();
        });
      }
      window.location.hash = "";
    }
  };

  fetchRecentlyPlayedTracks = () => {
    const { token } = this.state;
    this.setState({ loading: true });

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
        setTimeout(() => {
          this.setState({ tracks: response.data.items, loading: false });
        }, 300);
      })
      .catch((error) => {
        console.error("Error fetching recently played tracks:", error);
        if (error.response && error.response.status === 403) {
          this.setState({ isLoggedIn: false });
          window.localStorage.removeItem("token");
        }
        setTimeout(() => {
          this.setState({ loading: false });
        }, 300);
      });
  };

  openSpotifyTrack = (url) => {
    window.open(url, "_blank");
  };

  render() {
    const { tracks, isLoggedIn, loading } = this.state;

    if (!isLoggedIn) {
      return (
        <Container className="my-4">
          <h2>Please log in to view your recently played tracks</h2>
          <Button
            className="m-3"
            style={{ backgroundColor: "#34B954", borderColor: "#34B954" }}
            href={AUTH_URL}
          >
            Login to Spotify
          </Button>
        </Container>
      );
    }

    return (
      <Container style={{ maxWidth: "80%" }}>
        <h2 className="my-4">Recently Played Tracks</h2>
        {loading ? (
          <div className="text-center">
            <ThreeDots
              visible={true}
              height="50"
              width="50"
              color="#0B5ED7"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        ) : (
          <Table className="my-4" striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Track Name</th>
                <th>Artists</th>
                <th>Album</th>
                <th>Played At</th>
                <th>Preview</th>
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
                  <td>
                    <FontAwesomeIcon
                      icon={faSpotify}
                      style={{ cursor: "pointer", fontSize: "1.25rem" }}
                      onClick={() =>
                        this.openSpotifyTrack(
                          trackObj.track.external_urls.spotify
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    );
  }
}
