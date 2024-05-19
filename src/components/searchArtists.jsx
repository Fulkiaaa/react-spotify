import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  Alert,
  Col,
} from "react-bootstrap";
import { ThreeDots } from "react-loader-spinner";
import "../assets/SearchArtists.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

const CLIENT_ID = "7c26d439ea214815bc4a613af0331b1c";
const CLIENT_SECRET = "f70e8a9e4bdb441e813841c796dbfb52";

function SearchArtists() {
  const [artists, setArtists] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [artistNotFound, setArtistNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [artistInfo, setArtistInfo] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchAccessToken();
  }, []);

  const search = async () => {
    setLoading(true);
    setArtistNotFound(false);
    setError(null);

    if (!accessToken) {
      setError("Access token not available.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${artists}&type=artist`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.artists.items.length === 0) {
        setArtistNotFound(true);
        setLoading(false);
        return;
      }

      const artist = response.data.artists.items[0];
      setArtistInfo(artist);

      const albumsResponse = await axios.get(
        `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setAlbums(albumsResponse.data.items);

      setTimeout(() => {
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const openSpotify = (url) => {
    window.open(url, "_blank");
  };

  return (
    <Container>
      <InputGroup className="my-4" size="lg">
        <FormControl
          placeholder="Search For Artists..."
          type="input"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              search();
            }
          }}
          onChange={(event) => setArtists(event.target.value)}
        />
        <Button onClick={search}>Search</Button>
      </InputGroup>
      <Container>
        {loading ? (
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
        ) : (
          <Row>
            <Col lg={9}>
              <Row className="mx-auto row row-cols-4 gap-4 justify-content-center">
                {artistNotFound && (
                  <Alert variant="danger">
                    Artist not found. Please try again with a different search
                    term.
                  </Alert>
                )}
                {error && <Alert variant="danger">{error}</Alert>}
                {albums.map((album) => (
                  <Card key={album.id} className="border-0">
                    <Card.Img src={album.images[0].url} alt={album.name} />
                    <Card.Body>
                      <Card.Title style={{ fontSize: "1rem" }}>
                        {album.name}
                      </Card.Title>
                      <FontAwesomeIcon
                        icon={faSpotify}
                        style={{ cursor: "pointer", fontSize: "1.50rem" }}
                        onClick={() => openSpotify(album.external_urls.spotify)}
                      />
                    </Card.Body>
                  </Card>
                ))}
              </Row>
            </Col>
            <Col lg={3}>
              {artistInfo && (
                <Card className="mb-2 mx-auto" style={{ maxWidth: "300px" }}>
                  <Card.Img
                    variant="top"
                    src={artistInfo.images[0]?.url}
                    alt={artistInfo.name}
                    style={{
                      height: "auto",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body>
                    <Card.Title style={{ fontSize: "1.75rem" }}>
                      {artistInfo.name}
                    </Card.Title>
                    <Card.Text style={{ fontSize: "1rem" }}>
                      Followers: {artistInfo.followers.total.toLocaleString()}
                    </Card.Text>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        openSpotify(artistInfo.external_urls.spotify)
                      }
                    >
                      View on Spotify
                    </Button>{" "}
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        )}
      </Container>
    </Container>
  );
}

export default SearchArtists;
