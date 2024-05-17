import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Routeur, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/header";
import Home from "./components/home";
import SearchArtists from "./components/searchArtists";
import Error from "./components/error";

function App() {
  return (
    <>
      <Header />
      <div className="App">
        <Routeur>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search-artists" element={<SearchArtists />} />
            <Route path="/*" element={<Error />} />
          </Routes>
        </Routeur>
      </div>
    </>
  );
}

export default App;
