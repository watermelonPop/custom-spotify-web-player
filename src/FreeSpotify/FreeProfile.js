import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function FreeProfile({accessToken, user}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);
        
        

        return (
                <>
                <div className='profileContentOuter'>
                        <p className='contentTitle'>Profile</p>
                        <div className="profileHeader">
                                <div className='profileHeaderImgDiv'>
                                        {user?.images?.length > 0 ? (
                                                <>
                                                <img src={user.images[0].url} />
                                                </>
                                        ):(
                                                <>
                                                <p className='guestProfileImg'>
                                                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                                                </p>
                                                </>
                                        )
                                        }
                                </div>
                                <div className="profileInfo">
                                        <p className="title">{user.display_name}</p>
                                        <p className="subtitle">{user.followers.total} followers</p>
                                </div>
                        </div>
                        
                </div>
                </>
            );
}

export default FreeProfile;