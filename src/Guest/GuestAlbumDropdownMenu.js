import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function GuestAlbumDropdownMenu({accessToken, album, setSelectedArtistId, setSelectedPanel, setSearch, debouncedSearchInput}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);
        

    return (
        <>
        <div id={`myDropdown-${album?.id}`} className="dropdown-content">
                <a onClick={async (e) => {
                try {
                        e.stopPropagation();
                        spotifyApi.setAccessToken(accessToken);
                        console.log("ALBUM: ", album);
                        const data = await setSelectedArtistId(album?.artists[0].id);
                        console.log("DATA: ", data);
                        setSelectedPanel("Artists");
                        
                        setSearch("");
                        debouncedSearchInput("");
                } catch (err) {
                        console.error("Error fetching album:", err);
                }
                }}>go to artist</a>
        </div>
        </>
    );
}

export default GuestAlbumDropdownMenu;