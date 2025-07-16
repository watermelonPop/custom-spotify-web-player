import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import './Content.css';
import SelectedPlaylist from './SelectedPlaylist';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function Playlists({accessToken, user, playlists, setPlaylists, showPlaylistDropDown, setSelectedArtistId, setSelectedPanel, setSelectedAlbum, showDropDown, setSearch, debouncedSearchInput, checkIfLiked, handleLikeSong, handleUnlikeSong, likedSongs, setLikedSongs, handlePlayTrack, selectedPlaylistId, setSelectedPlaylistId, setLoading}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);
        

    return (
        <>
        <div className='playlistsContentOuter'>
        {selectedPlaylistId === null ? (
                <>
                <p className='contentTitle'>Playlists</p>
                {playlists.map((plist, idx) => (
                        <>
                        <div className='playlistSongDiv' onClick={()=>setSelectedPlaylistId(plist.id)}>
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
        ): (
                <SelectedPlaylist selectedPlaylistId={selectedPlaylistId} accessToken={accessToken} user={user} setSelectedPlaylistId={setSelectedPlaylistId} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} showDropDown={showDropDown} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} checkIfLiked={checkIfLiked} handleLikeSong={handleLikeSong} handleUnlikeSong={handleUnlikeSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} setPlaylists={setPlaylists} handlePlayTrack={handlePlayTrack} setLoading={setLoading}/>
        )}
        </div>
        </>
    );
}

export default Playlists;