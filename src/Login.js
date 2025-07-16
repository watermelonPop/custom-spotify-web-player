import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        const BASE_URL = process.env.NODE_ENV === 'development'
  ? "http://127.0.0.1:4000"
  : "https://custom-spotify-web-player.vercel.app";

        var spotify_redirect_uri = "http://127.0.0.1:3000";
function Login({setGuestPlayerOpen}) {
        const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${spotify_client_id}&response_type=code&redirect_uri=${BASE_URL}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played%20user-follow-read%20playlist-read-private%20playlist-modify-public%20playlist-modify-private%20user-follow-modify`;
    return (
        <>
        <div className="loginOuter">
                <p className='loginTitle'><FontAwesomeIcon icon={faSpotify}></FontAwesomeIcon>Custom Spotify Web Player</p>
                <a className="loginBtn" href={AUTH_URL}>
                    Login with Spotify 
                </a>
                <a className="loginBtn" onClick={()=>setGuestPlayerOpen(true)}>
                    Use as Guest
                </a>
        </div>
        </>
    );
}

export default Login;