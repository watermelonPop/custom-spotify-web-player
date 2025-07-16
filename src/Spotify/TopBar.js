import { useState, useEffect } from 'react';
import './TopContent.css';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function TopBar({accessToken, search, setSearch, debouncedSearchInput, user, setSelectedPanel}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);
        

    return (
        <>
        <div className='topBarOuter'>
                <p className='spotifyTitle' onClick={()=>setSelectedPanel("Home")}>
                        <FontAwesomeIcon icon={faSpotify}></FontAwesomeIcon>
                        Spotify
                </p>
                <div className='searchBarOuter'>
                        <p><FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>Search</p><input value={search} onChange={(e) => {
                                setSearch(e.target.value);
                                debouncedSearchInput(e.target.value);
                                }}></input>
                        <button onClick={()=> setSearch("")}>x</button>
                </div>
                <div className='userInfo' onClick={()=>setSelectedPanel("Profile")}>
                        {user?.images?.length > 0 ? (
                                <>
                                <div className='userInfoImgDiv'>
                                        <img src={user.images[0].url}></img>
                                </div>
                                </>
                        ):(
                                <>
                                <div className='guestInfoImgDiv'>
                                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                                </div>
                                </>
                        )}
                        <p>{user ? user.display_name : ""}</p>
                </div>
        </div>
        </>
    );
}

export default TopBar;