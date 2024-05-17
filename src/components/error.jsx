import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class ErrorPage extends Component {
  render() {
    return (
      <div>
        <h1>Erreur 404</h1>
        <p>Désolé, la page que vous recherchez est introuvable.</p>
        <Link to="/">Retour à la page d'accueil</Link>
      </div>
    );
  }
}
