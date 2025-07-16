import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser, faGear, faList, faCompactDisc, faPalette } from '@fortawesome/free-solid-svg-icons';

const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function FreeHome({accessToken, setSelectedPanel}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);
        

    return (
        <>
        <div className='homeContentOuter'>
                <div className="onTopHomeDiv">
                        <div className="innerHomeDiv">
                                <div className="flip-card-inner" onClick={()=> setSelectedPanel("Liked")}>
                                        <div className="flip-card-front">
                                                <p><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></p>
                                        </div>
                                        <div className="flip-card-back">
                                                <p>liked<br/>songs</p>
                                        </div>
                                </div>
                        </div>
                        <div className="innerHomeDiv">
                                <div className="flip-card-inner" onClick={()=> setSelectedPanel("Profile")}>
                                        <div className="flip-card-front">
                                                <p><FontAwesomeIcon icon={faUser}></FontAwesomeIcon></p>
                                        </div>
                                        <div className="flip-card-back">
                                                <p>profile</p>
                                        </div>
                                </div>
                        </div>
                        <div className="innerHomeDiv">
                                <div className="flip-card-inner" onClick={()=> setSelectedPanel("Settings")}>
                                        <div className="flip-card-front">
                                                <p><FontAwesomeIcon icon={faGear}></FontAwesomeIcon></p>
                                        </div>
                                        <div className="flip-card-back">
                                                <p>settings</p>
                                        </div>
                                </div>
                        </div>
                </div>
                <div className="onTopHomeDiv">
                        <div className="innerHomeDiv">
                                <div className="flip-card-inner" onClick={()=> setSelectedPanel("Playlists")}>
                                        <div className="flip-card-front">
                                                <p><FontAwesomeIcon icon={faList}></FontAwesomeIcon></p>
                                        </div>
                                        <div className="flip-card-back">
                                                <p>playlists</p>
                                        </div>
                                </div>
                        </div>
                        <div className="innerHomeDiv">
                                <div className="flip-card-inner" onClick={()=> setSelectedPanel("Albums")}>
                                        <div className="flip-card-front">
                                                <p><FontAwesomeIcon icon={faCompactDisc}></FontAwesomeIcon></p>
                                        </div>
                                        <div className="flip-card-back">
                                                <p>albums</p>
                                        </div>
                                </div>
                        </div>
                        <div className="innerHomeDiv">
                                <div className="flip-card-inner" onClick={()=> setSelectedPanel("Artists")}>
                                        <div className="flip-card-front">
                                                <p><FontAwesomeIcon icon={faPalette}></FontAwesomeIcon></p>
                                        </div>
                                        <div className="flip-card-back">
                                                <p>artists</p>
                                        </div>
                                </div>
                        </div>
                </div>
                <div className="onTopHomeDiv">   
                </div>
        </div>
        </>
    );
}

export default FreeHome;