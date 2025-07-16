
import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import GuestSelectedPlaylist from './GuestSelectedPlaylist';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function GuestPlaylists({accessToken, playlists, setPlaylists, showDropDown, setSelectedArtistId, setSelectedPanel, setSelectedAlbum, setSearch, debouncedSearchInput, selectedPlaylist, setSelectedPlaylist}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);
        

    return (
        <>
        <div className='playlistCategoriesContentOuter'>
                {selectedPlaylist === null ? (
                        <>
                        <p className='contentTitle'>Simone's Playlists</p>
                        {playlists.map((plist, idx) => (
                                <>
                                <div className='playlistSongDiv' onClick={()=>setSelectedPlaylist(plist)}>
                                        <div className='playlistImgDiv'>
                                        <img src={plist.images[0].url}></img>
                                        </div>
                                        <div className='playlistName'>
                                        <p>{plist.name}</p>
                                        </div>
                                        <div className='playlistTracks'>
                                        <p>({plist.tracks.total} tracks)</p>
                                        </div>
                                </div>
                                </>
                        ))}
                        </>
                ):(
                        <GuestSelectedPlaylist accessToken={accessToken} selectedPlaylist={selectedPlaylist} setSelectedPlaylist={setSelectedPlaylist} showDropDown={showDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput}/>
                )
                }
        </div>
        </>
    );
}

export default GuestPlaylists;