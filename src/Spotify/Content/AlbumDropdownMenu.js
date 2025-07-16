import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import './Content.css';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function AlbumDropdownMenu({accessToken, album, showPlaylistDropDown, setSelectedArtistId, setSelectedPanel, setSelectedAlbum, playlists, setSearch, debouncedSearchInput, user, setPlaylists}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);


        const handleAddAlbumToPlaylist = async (playlistId, album,e) => {
                e.stopPropagation();
                const uris = album.tracks.items.map(item => item.uri);

                try {     
                        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                            method: "POST",
                            headers: { Authorization: `Bearer ${accessToken}` },
                            body: JSON.stringify({
                                "uris": uris
                            })
                        });
                
                        if (!response.ok) {
                                const errorData = await response.json();
                                console.error('API Error:', errorData);
                                throw new Error(`Failed to add to playlist: ${errorData.error.message}`);
                        }else{
                                spotifyApi.getUserPlaylists(user.id)
                                .then(function(data) {
                                        let idName = `playlistDropdown-${album.id}`;
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
        <div id={`myDropdown-${album.id}`} className="dropdown-content">
                <a onClick={(e)=>showPlaylistDropDown(album.id, e)}>add to playlist</a>
                <a onClick={async (e) => {
                try {
                        e.stopPropagation();
                        spotifyApi.setAccessToken(accessToken);
                        const data = await setSelectedArtistId(album.artists[0].id);
                        console.log("DATA: ", data);
                        setSelectedPanel("Artists");
                        
                        setSearch("");
                        debouncedSearchInput("");
                } catch (err) {
                        console.error("Error fetching album:", err);
                }
                }}>go to artist</a>
        </div>
        <div id={`playlistDropdown-${album.id}`} className="dropdown-content">
                <button>x</button>
                <p>Select Playlist</p>
                {playlists.map((plist, idx) => (
                <>
                        <a onClick={(e)=>handleAddAlbumToPlaylist(plist.id, album, e)}>{plist.name}</a>
                </>
                ))}
        </div>
        </>
    );
}

export default AlbumDropdownMenu;