import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';

const CLIENT_ID = "7c26d439ea214815bc4a613af0331b1c";
const CLIENT_SECRET = "f70e8a9e4bdb441e813841c796dbfb52";

function App() {
  const [artists, setArtists] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //API ACCES TOKEN
    var authorization = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authorization)
      .then(result => result.json())
      // .then(data => console.log(data.access_token))
      .then(data => setAccessToken(data.access_token))
  },[])

  async function search(){
    setLoading(true);
    console.log("Search for " + artists); // Taylor Swift
    if (!accessToken) {
      console.error('Access token not available.');
      setLoading(false);
      return;
    }
    try {
      // Get request using search to get the Artist ID
      var artistParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ accessToken
        }
      }
      const response = await fetch('https://api.spotify.com/v1/search?q=' + artists + '&type=artist', artistParameters);
      if (!response.ok) {
        throw new Error('Failed to fetch artist ID: ' + response.status);
      }
      const data = await response.json();
      const artistID = data.artists.items[0].id;

      console.log("Artist ID is " + artistID);
      // Get request with Artist ID grab all the albums from that artist
      const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      if (!albumsResponse.ok) {
        throw new Error('Failed to fetch albums: ' + albumsResponse.status);
      }
      const albumsData = await albumsResponse.json();
      setAlbums(albumsData.items);
      // setLoading(false);
      setTimeout(() => {
        setLoading(false);
      }, 500);

    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }

  function openSpotify(url) {
    window.open(url, "_blank");
  }

  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder='Search For Artists...'
            type='input'
            onKeyPress={event => {
              if (event.key === 'Enter') {
                search();
              }
            }}
            onChange={event => setArtists(event.target.value)} 
            />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        {loading ? (
          <ThreeDots
            visible={true}
            height="50"
            width="50"
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <Row className='mx-2 row row-cols-4'>
            {albums.map( (album, i) => {
              return (
                <Card key={album.id} onClick={() => openSpotify(album.external_urls.spotify)} style={{ cursor: 'pointer' }}>
                  <Card.Img src={album.images[0].url} alt={album.name}/>
                  <Card.Body>
                    <Card.Title>{album.name}</Card.Title>
                  </Card.Body>
                </Card>
              )
            })}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default App;
