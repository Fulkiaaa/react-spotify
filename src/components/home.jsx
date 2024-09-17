import React, { Component } from 'react';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      token: '',
      user: {
        name: '',
        totalSongs: 0,
        topArtists: [],
        playlists: [],
      },
    };
  }

  componentDidMount() {
    // Vérifie si un token est déjà stocké dans localStorage
    const token = window.localStorage.getItem('token');
    if (!token) {
      // Si aucun token n'est trouvé, on vérifie s'il est dans l'URL
      const hash = window.location.hash;
      if (hash) {
        const tokenFromUrl = this.getTokenFromUrl();
        if (tokenFromUrl) {
          window.localStorage.setItem('token', tokenFromUrl);
          this.setState({ token: tokenFromUrl, isLoggedIn: true }, () => {
            this.fetchUserData(tokenFromUrl); // Récupérer les données de l'utilisateur après le login
          });
        }
      }
    } else {
      this.setState({ token: token, isLoggedIn: true }, () => {
        this.fetchUserData(token); // Récupérer les données si l'utilisateur est déjà connecté
      });
    }
  }

  // Fonction pour extraire le token de l'URL après la redirection de Spotify
  getTokenFromUrl() {
    return window.location.hash
      .substring(1)
      .split('&')
      .find(elem => elem.startsWith('access_token'))
      ?.split('=')[1];
  }

  // Fonction pour récupérer les données utilisateur via l'API Spotify
  async fetchUserData(token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Appel à l'API pour récupérer les informations utilisateur
    const userInfoResponse = await fetch('https://api.spotify.com/v1/me', { headers });
    const userData = await userInfoResponse.json();
    console.log(userData);
    // Mettre à jour l'état avec les informations utilisateur récupérées
    this.setState({
      user: {
        name: userData.display_name || '',
      },
      isLoggedIn: true,
    });
  }

  render() {
    const { isLoggedIn, user } = this.state;

    const CLIENT_ID = "7c26d439ea214815bc4a613af0331b1c";
    const REDIRECT_URI = "http://localhost:3000";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES = "user-read-recently-played user-top-read";
    const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

    return (
      <div style={styles.container}>
        {isLoggedIn ? (
          <>
            <h1 style={styles.title}>Bienvenue sur vos statistiques Spotify {user.name}!</h1>
            {/* <div style={styles.section}>
              <h2>Statistiques globales</h2>
              <p>Nombre total de chansons écoutées : {user.totalSongs}</p>
            </div> */}
          </>
        ) : (
          <div style={styles.section}>
            <h1 style={styles.title}>Bienvenue sur Spotify Statssssss</h1>
            <p>Veuillez vous connecter pour voir vos statistiques Spotify.</p>
            <a href={AUTH_URL} style={styles.button}>
              Se connecter à Spotify
            </a>
          </div>
        )}
      </div>
    );
  }
}

// Styles simples pour le composant
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  title: {
    color: '#1DB954', // Couleur de la marque Spotify
  },
  section: {
    margin: '20px 0',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#1DB954',
    color: '#fff',
    borderRadius: '5px',
    textDecoration: 'none',
  },
};
