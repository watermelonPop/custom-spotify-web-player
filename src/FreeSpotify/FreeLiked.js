import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faHeart } from '@fortawesome/free-solid-svg-icons';
import FreeSongDropdownMenu from './FreeSongDropdownMenu';
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

function FreeLiked({accessToken, setSelectedAlbum, setSelectedPanel, playlists, handleUnlikeSong, likedSongs, setLikedSongs, showPlaylistDropDown, setSelectedArtistId, setSearch, debouncedSearchInput, setPlaylists, user, showDropDown, setLoading}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);

        useEffect(() => {
                if (!accessToken) return;

                if (!spotifyApi.getAccessToken()) {
                        console.warn("Spotify access token is missing");
                        return;
                }
                
                const fetchLikedSongs = async () => {
                        setLoading(true);
                        try {
                                const response = await fetch("https://api.spotify.com/v1/me/tracks?limit=50", {
                                    method: "GET",
                                    headers: { Authorization: `Bearer ${accessToken}` },
                                });
                    
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                    
                                const data = await response.json();
                                //alert(data.display_name); // Process the user data as needed
                                if (data && data.items) {
                                        //alert(data.items);
                                        console.log("LIKED: ", data.items);
                                        setLikedSongs(data.items);
                                } 
                            } catch (err) {
                                console.error('Error fetching user data:', err);
                            }finally{
                                setLoading(false);
                            }
                };
                
                fetchLikedSongs();
        }, [accessToken]);


            
        

    return (
        <>
        <div className='likedContentOuter'>
                <p className='contentTitle'>Liked Songs ({likedSongs.length})</p>
                {likedSongs.map((track, idx) => (
                        <>
                        <div className='songDiv'>
                        <img src={track?.track?.album?.images ? track.track.album.images[0].url : null}></img>
                        <div className='trackMainInfo'>
                                <p>{track?.track?.name}</p>
                                <p>{track?.track?.artists.length > 0 ? track.track.artists[0].name : ""}</p>
                        </div>
                        <div className='trackAlbumName'>
                                <p>{track?.track?.album?.name}</p>
                        </div>
                        <div className='trackLikeBtn'>
                                <button className='trackLiked' onClick={()=>handleUnlikeSong(track?.track)}><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></button>
                        </div>
                        <div className='trackDuration'>
                                <p>{msToMinutesAndSeconds(track?.track?.duration_ms)}</p>
                        </div>
                        <div className='trackMoreBtn'>
                                <button onClick={(e) => {
                                        e.stopPropagation();
                                       showDropDown(track?.track?.id, e);
                                }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                <FreeSongDropdownMenu accessToken={accessToken} track={track.track} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setPlaylists={setPlaylists} user={user} />
                        </div>
                        </div>
                        </>
                ))
                }
        </div>
        </>
    );
}

export default FreeLiked;