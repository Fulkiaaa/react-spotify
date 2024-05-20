import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Tab,
  Tabs,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { ThreeDots } from "react-loader-spinner";

const CLIENT_ID = "7c26d439ea214815bc4a613af0331b1c";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-read-recently-played user-top-read";
const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

export default class TopArtists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topArtists4Months: [],
      topArtists6Months: [],
      topArtists12Months: [],
      activeTab: "topArtists4Months",
      token: window.localStorage.getItem("token"),
      isLoggedIn: !!window.localStorage.getItem("token"),
      loading: false,
    };
  }

  componentDidMount() {
    const { token } = this.state;

    if (token) {
      this.fetchTopArtists("short_term", "topArtists4Months");
      this.fetchTopArtists("medium_term", "topArtists6Months");
      this.fetchTopArtists("long_term", "topArtists12Months");
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
          this.fetchTopArtists("short_term", "topArtists4Months");
          this.fetchTopArtists("medium_term", "topArtists6Months");
          this.fetchTopArtists("long_term", "topArtists12Months");
        });
      }
      window.location.hash = "";
    }
  };

  fetchTopArtists = (timeRange, stateKey) => {
    const { token } = this.state;
    this.setState({ loading: true });

    axios
      .get(`https://api.spotify.com/v1/me/top/artists`, {
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
          this.setState({
            [stateKey]: response.data.items,
            loading: false,
          });
        }, 300);
      })
      .catch((error) => {
        console.error("Error fetching top artists:", error);
        if (error.response && error.response.status === 403) {
          this.setState({ isLoggedIn: false });
          window.localStorage.removeItem("token");
        }
        setTimeout(() => {
          this.setState({ loading: false });
        }, 300);
      });
  };

  openSpotifyArtist = (url) => {
    window.open(url, "_blank");
  };

  renderTopArtistsCards = (artists) => {
    return (
      <Row className="my-4">
        {artists.map((artist, index) => (
          <Col key={index} sm={12} md={6} lg={3} className="mb-4">
            <Card className="mb-2 mx-auto">
              <Card.Img
                variant="top"
                src={artist.images[0]?.url}
                alt={artist.name}
              />
              <Card.Body>
                <Card.Title>{artist.name}</Card.Title>
                <Card.Text>Popularity: {artist.popularity}</Card.Text>
                <FontAwesomeIcon
                  icon={faSpotify}
                  style={{ cursor: "pointer", fontSize: "1.50rem" }}
                  onClick={() =>
                    this.openSpotifyArtist(artist.external_urls.spotify)
                  }
                />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  render() {
    const {
      topArtists4Months,
      topArtists6Months,
      topArtists12Months,
      isLoggedIn,
      loading,
    } = this.state;

    if (!isLoggedIn) {
      return (
        <Container className="my-4">
          <h2>Please log in to view your top artists</h2>
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
        <h2 className="my-4">Top Artists</h2>
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
          <Tabs defaultActiveKey="topArtists4Months" id="topArtistsTabs">
            <Tab eventKey="topArtists4Months" title="4 Months">
              {this.renderTopArtistsCards(topArtists4Months)}
            </Tab>
            <Tab eventKey="topArtists6Months" title="6 Months">
              {this.renderTopArtistsCards(topArtists6Months)}
            </Tab>
            <Tab eventKey="topArtists12Months" title="12 Months">
              {this.renderTopArtistsCards(topArtists12Months)}
            </Tab>
          </Tabs>
        )}
      </Container>
    );
  }
}
