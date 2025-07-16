import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login'
import Dashboard from "./Spotify/Dashboard";
import axios from "axios";
import GuestPlayer from './Guest/GuestPlayer';
import FreeDashboard from './FreeSpotify/FreeDashboard';
//returns anything return after the url
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const hasExchangedCodeRef = useRef(false);
  const [guestPlayerOpen, setGuestPlayerOpen] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
  
    if (code && !hasExchangedCodeRef.current) {
      hasExchangedCodeRef.current = true; // set to true immediately
      axios.post("https://your-vercel-deployment.vercel.app/api/login", { code })
        .then((res) => {
          console.log("SUCCESS");
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          setExpiresIn(res.data.expiresIn);
          axios.get("https://api.spotify.com/v1/me", {
            headers: {
              Authorization: `Bearer ${res.data.accessToken}`,
            },
          })
          .then((meRes) => {
            const accountType = meRes.data.product; // 'premium', 'free', or 'open'
            console.log("Spotify account type:", accountType);
            setUserType(accountType);
          })
          .catch((err) => console.error("Failed to fetch user profile", err));
          window.history.replaceState({}, document.title, "/");
          setLoggedIn(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);


  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post("https://your-vercel-deployment.vercel.app/api/refresh", {
          refreshToken,
        })
        .then((res) => {
          //alert("REFRESH");
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => {
          //window.location = "/";
          console.log("INSIDE CATCH");
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return (
    <div className="App" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {!loggedIn ? (
        !guestPlayerOpen ? <Login setGuestPlayerOpen={setGuestPlayerOpen} /> : <GuestPlayer />
      ) : (
        userType === "premium" ? 
        <Dashboard accessToken={accessToken}/>
        :
        <FreeDashboard accessToken={accessToken}/>
      )}
    </div>
  );
}

export default App;
