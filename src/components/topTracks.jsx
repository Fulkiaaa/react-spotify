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
const SCOPES = "user-top-read";
const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

export default class TopTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTracks: [],
      token: window.localStorage.getItem("token"),
      isLoggedIn: !!window.localStorage.getItem("token"),
      loading: false,
    };
  }

  componentDidMount() {
    const { token } = this.state;

    if (token) {
      this.fetchTopTracks();
    }
  }

  fetchTopTracks = () => {
    const { token } = this.state;

    this.setState({ loading: true });

    axios
      .get("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 50,
        },
      })
      .then((response) => {
        this.setState({ topTracks: response.data.items, loading: false });
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching top tracks:", error);
        this.setState({ loading: false });
      });
  };

  openSpotifyTrack = (url) => {
    window.open(url, "_blank");
  };

  render() {
    const { topTracks, isLoggedIn, loading } = this.state;

    if (!isLoggedIn) {
      return (
        <Container className="text-center mt-5">
          <h2>Please log in to view your top tracks</h2>
          <Button variant="success" href={AUTH_URL}>
            Login to Spotify
          </Button>
        </Container>
      );
    }

    return (
      <Container>
        <h2 className="my-4">Your Top Tracks</h2>
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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Track</th>
                <th>Artist</th>
                <th>Album</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              {topTracks.map((topTrack, index) => (
                <tr key={topTrack.id}>
                  <td>{index + 1}</td>
                  <td>{topTrack.name}</td>
                  <td>
                    {topTrack.artists.map((artist) => artist.name).join(", ")}
                  </td>
                  <td>{topTrack.album.name}</td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() =>
                        this.openSpotifyTrack(topTrack.external_urls.spotify)
                      }
                    >
                      <FontAwesomeIcon icon={faSpotify} />
                    </Button>
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
