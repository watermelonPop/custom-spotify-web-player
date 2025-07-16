import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import './Content.css';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function SongDropdownMenu({accessToken, track, showPlaylistDropDown, setSelectedArtistId, setSelectedPanel, setSelectedAlbum, playlists, setSearch, debouncedSearchInput, setPlaylists, user}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);


        const handleAddToPlaylist = async (playlistId, trackUri, trackId) => {
                console.log("PLAYLIST: " + playlistId + ", URI: " + trackUri + ", ID: " + trackId);
                try {     
                        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                            method: "POST",
                            headers: { Authorization: `Bearer ${accessToken}` },
                            body: JSON.stringify({
                                "uris": [trackUri]
                            })
                        });
                
                        if (!response.ok) {
                                const errorData = await response.json();
                                console.error('API Error:', errorData);
                                throw new Error(`Failed to add to playlist: ${errorData.error.message}`);
                        }else{
                                spotifyApi.getUserPlaylists(user.id)
                                .then(function(data) {
                                        let idName = `playlistDropdown-${trackId}`;
                                        let dropdown = document.getElementById(idName);
                                        if(dropdown){
                                                dropdown.classList.toggle("show");
                                        }
                                        console.log('Retrieved playlists', data.body);
                                        //alert(data.body.items);
                                        setPlaylists(data.body.items);
                                },function(err) {
                                        console.log('Something went wrong!', err);
                                });
                        }
                } catch (err) {
                        console.error('Failed to add to playlist: ', err);
                }
        };
        

    return (
        <>
        <div id={`myDropdown-${track.id}`} className="dropdown-content">
                <a onClick={(e)=>showPlaylistDropDown(track.id, e)}>add to playlist</a>
                <a onClick={async (e) => {
                        e.stopPropagation();
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
                <a onClick={async (e) => {
                        e.stopPropagation();
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
        <div id={`playlistDropdown-${track.id}`} className="dropdown-content">
                <p>Select Playlist: </p>
                {playlists.map((plist, idx) => (
                <>
                        <a onClick={(e)=>{
                                e.stopPropagation();
                                handleAddToPlaylist(plist.id, track.uri, track.id);
                                }}>{plist.name}</a>
                </>
                ))}
        </div>
        </>
    );
}

export default SongDropdownMenu;