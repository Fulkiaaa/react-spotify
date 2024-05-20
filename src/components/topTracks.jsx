import React, { Component } from "react";
import axios from "axios";
import { Button, Tab, Tabs, Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { ThreeDots } from "react-loader-spinner";

const CLIENT_ID = "7c26d439ea214815bc4a613af0331b1c";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-read-recently-played user-top-read";
const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

export default class TopTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTracks4Months: [],
      topTracks6Months: [],
      topTracks12Months: [],
      activeTab: "topTracks4Months",
      token: window.localStorage.getItem("token"),
      isLoggedIn: !!window.localStorage.getItem("token"),
      loading: false,
    };
  }

  componentDidMount() {
    const { token } = this.state;
    this.setState({ loading: true });

    if (token) {
      this.fetchTopTracks("short_term");
      this.fetchTopTracks("medium_term");
      this.fetchTopTracks("long_term");
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
          this.fetchTopTracks("short_term");
          this.fetchTopTracks("medium_term");
          this.fetchTopTracks("long_term");
        });
      }
      window.location.hash = "";
    }
  };

  fetchTopTracks = (timeRange) => {
    const { token } = this.state;
    this.setState({ loading: true });

    axios
      .get(`https://api.spotify.com/v1/me/top/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          time_range: timeRange,
          limit: 50,
        },
      })
      .then((response) => {
        setTimeout(() => {
          switch (timeRange) {
            case "short_term":
              this.setState({
                topTracks4Months: response.data.items,
                loading: false,
              });
              break;
            case "medium_term":
              this.setState({
                topTracks6Months: response.data.items,
                loading: false,
              });
              break;
            case "long_term":
              this.setState({
                topTracks12Months: response.data.items,
                loading: false,
              });
              break;
            default:
              break;
          }
        }, 300);
      })
      .catch((error) => {
        console.error("Error fetching top tracks:", error);
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

  renderTopTracksTable = (tracks) => {
    return (
      <Table className="my-4" striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Track Name</th>
            <th>Artists</th>
            <th colSpan={2}>Album</th>
            <th>Go To Spotify</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((trackObj, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{trackObj.name}</td>
              <td>
                {trackObj.artists.map((artist) => artist.name).join(", ")}
              </td>
              <td>{trackObj.album.name}</td>
              <td>
                <img
                  src={trackObj.album.images[2].url}
                  style={{ height: "46px" }}
                  alt="Album Art"
                />
              </td>
              <td>
                <FontAwesomeIcon
                  icon={faSpotify}
                  style={{ cursor: "pointer", fontSize: "1.25rem" }}
                  onClick={() =>
                    this.openSpotifyTrack(trackObj.external_urls.spotify)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  render() {
    const {
      topTracks4Months,
      topTracks6Months,
      topTracks12Months,
      isLoggedIn,
      loading,
    } = this.state;

    if (!isLoggedIn) {
      return (
        <Container className="my-4">
          <h2>Please log in to view your top tracks</h2>
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
        <h2 className="my-4">Top Tracks</h2>
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
          <Tabs defaultActiveKey="topTracks4Months" id="topTracksTabs">
            <Tab eventKey="topTracks4Months" title="4 Months">
              {this.renderTopTracksTable(topTracks4Months)}
            </Tab>
            <Tab eventKey="topTracks6Months" title="6 Months">
              {this.renderTopTracksTable(topTracks6Months)}
            </Tab>
            <Tab eventKey="topTracks12Months" title="12 Months">
              {this.renderTopTracksTable(topTracks12Months)}
            </Tab>
          </Tabs>
        )}
      </Container>
    );
  }
}
