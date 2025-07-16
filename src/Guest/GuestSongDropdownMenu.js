import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function GuestSongDropdownMenu({accessToken, track,setSelectedArtistId, setSelectedPanel, setSelectedAlbum, setSearch, debouncedSearchInput}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);
        

    return (
        <>
        <div id={`myDropdown-${track.id}`} className="dropdown-content">
                <a onClick={async () => {
                try {
                        spotifyApi.setAccessToken(accessToken);
                        const data = await setSelectedArtistId(track.artists[0].id);
                        console.log("DATA: ", data);
                        setSelectedPanel("Artists");
                        
                        setSearch("");
                        debouncedSearchInput("");
                } catch (err) {
                        console.error("Error fetching album:", err);
                }
                }}>go to artist</a>
                <a onClick={async () => {
                try {
                        spotifyApi.setAccessToken(accessToken);
                        const data = await spotifyApi.getAlbum(track.album.id);
                        setSelectedAlbum(data.body); // set the full album with tracks
                        setSelectedPanel("Albums");

                        setSearch("");
                        debouncedSearchInput("");
                } catch (err) {
                        console.error("Error fetching album:", err);
                }
                }}>go to album</a>
        </div>
        </>
    );
}

export default GuestSongDropdownMenu;