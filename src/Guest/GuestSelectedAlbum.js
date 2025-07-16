import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsisVertical, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GuestSongDropdownMenu from './GuestSongDropdownMenu';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";


        function msToMinutesAndSeconds(ms) {
                const minutes = Math.floor(ms / 60000);
                const seconds = Math.floor((ms % 60000) / 1000);
                return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
            }

function GuestSelectedAlbum({accessToken, selectedAlbum, setSelectedAlbum, showDropDown, setSelectedArtistId, setSelectedPanel, setSearch, debouncedSearchInput, setLoading}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }

                                console.log(selectedAlbum);
        }, [accessToken]);
              
    return (
        <>
        <div className='selectedAlbumContentOuter'>
        {selectedAlbum && selectedAlbum.tracks ? ( // Check if results array has items
        <>
        <div className='selectedAlbumHeader'>
        <button onClick={()=>setSelectedAlbum(null)}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
                <img src={selectedAlbum.images.length > 0 ? selectedAlbum.images[0].url : ""} />
                <div className='selectedAlbumInfo'>
                <p className="title">{selectedAlbum.name}</p>
                                        <p className="subtitle">
                                        {selectedAlbum.artists.length === 1
                                                ? selectedAlbum.artists[0].name
                                                : selectedAlbum.artists.length > 1
                                                ? selectedAlbum.artists.map((artist, index) => {
                                                        // Join artist names with & symbol
                                                        return (
                                                        <span key={artist.id}>
                                                        {artist.name}
                                                        {index < selectedAlbum.artists.length - 1 && ' & '}
                                                        </span>
                                                        );
                                                })
                                                : ""}
                                        </p>
                                        <p className="subtitle">{new Date(selectedAlbum.release_date).getFullYear()}</p>
                                        <p className="subtitle">{selectedAlbum.total_tracks} songs</p>
                </div>
        </div>
                        {selectedAlbum.tracks.items.map(track => ( // Correctly wrap the map function
                                <div className='songDiv'>
                                        <img src={selectedAlbum.images[0].url}></img>
                                        <div className='trackMainInfo'>
                                                <p>{track.name}</p>
                                                <p>{track.artists[0].name}</p>
                                        </div>
                                        <div className='trackAlbumName'>
                                                <p>{selectedAlbum.name}</p>
                                        </div>
                                        <div className='trackDuration'>
                                                <p>{msToMinutesAndSeconds(track.duration_ms)}</p>
                                        </div>
                                        <div className='trackMoreBtn'>
                                                <button onClick={(e) => {
                                                e.stopPropagation();
                                                showDropDown(track.id, e);
                                                }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                <GuestSongDropdownMenu accessToken={accessToken} track={track} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} />
                                        </div>
                                </div>
                        ))}
                </>
        ) : (
                <div></div>
        )}
        </div>
        </>
    );
}

export default GuestSelectedAlbum;