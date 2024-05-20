import React, { Component } from "react";
import axios from "axios";
import { Button, Tab, Tabs, Container, ProgressBar } from "react-bootstrap";
import { ThreeDots } from "react-loader-spinner";

const CLIENT_ID = "7c26d439ea214815bc4a613af0331b1c";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-read-recently-played user-top-read";
const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

export default class TopGenres extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topGenres4Months: [],
      topGenres6Months: [],
      topGenres12Months: [],
      token: window.localStorage.getItem("token"),
      isLoggedIn: !!window.localStorage.getItem("token"),
      loading: false,
    };
  }

  componentDidMount() {
    const { token } = this.state;

    if (token) {
      this.fetchTopGenres("short_term", "topGenres4Months");
      this.fetchTopGenres("medium_term", "topGenres6Months");
      this.fetchTopGenres("long_term", "topGenres12Months");
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
          this.fetchTopGenres("short_term", "topGenres4Months");
          this.fetchTopGenres("medium_term", "topGenres6Months");
          this.fetchTopGenres("long_term", "topGenres12Months");
        });
      }
      window.location.hash = "";
    }
  };

  fetchTopGenres = (timeRange, stateKey) => {
    const { token } = this.state;
    this.setState({ loading: true });

    axios
      .get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          time_range: timeRange,
          limit: 20,
        },
      })
      .then((response) => {
        const genres = response.data.items.flatMap((artist) => artist.genres);
        const genreCount = genres.reduce((acc, genre) => {
          acc[genre] = (acc[genre] || 0) + 1;
          return acc;
        }, {});

        const sortedGenres = Object.entries(genreCount)
          .sort((a, b) => b[1] - a[1])
          .map(([genre, count]) => ({ genre, count }));

        setTimeout(() => {
          this.setState({
            [stateKey]: sortedGenres,
            loading: false,
          });
        }, 300);
      })
      .catch((error) => {
        console.error("Error fetching top genres:", error);
        if (error.response && error.response.status === 403) {
          this.setState({ isLoggedIn: false });
          window.localStorage.removeItem("token");
        }
        setTimeout(() => {
          this.setState({ loading: false });
        }, 300);
      });
  };

  renderTopGenresProgressBar = (genres) => {
    const totalGenresCount = genres.reduce(
      (acc, genreObj) => acc + genreObj.count,
      0
    );
    return genres.map((genreObj, index) => {
      const percentage = ((genreObj.count / totalGenresCount) * 700).toFixed(2);
      return (
        <div key={index} className="my-2">
          <h5 style={{ textTransform: "uppercase" }}>{genreObj.genre}</h5>
          <ProgressBar style={{ height: "40px" }} now={percentage} />
        </div>
      );
    });
  };

  render() {
    const {
      topGenres4Months,
      topGenres6Months,
      topGenres12Months,
      isLoggedIn,
      loading,
    } = this.state;

    if (!isLoggedIn) {
      return (
        <Container className="my-4">
          <h2>Please log in to view your top genres</h2>
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
        <h2 className="my-4">Top Genres</h2>
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
          <Tabs defaultActiveKey="topGenres4Months" id="topGenresTabs">
            <Tab eventKey="topGenres4Months" title="4 Months">
              {this.renderTopGenresProgressBar(topGenres4Months)}
            </Tab>
            <Tab eventKey="topGenres6Months" title="6 Months">
              {this.renderTopGenresProgressBar(topGenres6Months)}
            </Tab>
            <Tab eventKey="topGenres12Months" title="12 Months">
              {this.renderTopGenresProgressBar(topGenres12Months)}
            </Tab>
          </Tabs>
        )}
      </Container>
    );
  }
}
