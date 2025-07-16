import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import './Content.css';
import SelectedArtist from './SelectedArtist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faHeart } from '@fortawesome/free-solid-svg-icons';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

        function formatNumber(num) {
                if (num >= 1_000_000) {
                  return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
                } else if (num >= 1_000) {
                  return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
                } else {
                  return num.toString();
                }
              }

function Artists({accessToken, setSelectedPanel, setSelectedAlbum, selectedArtistId, setSelectedArtistId, showPlaylistDropDown, playlists, showDropDown, setSearch, debouncedSearchInput, checkIfLiked, checkIfArtistLiked, handleLikeSong, setLikedSongs, likedSongs, handleUnlikeSong, artists, setArtists, handleFollowArtist, handleUnfollowArtist, setPlaylists, user, handlePlayTrack, checkIfAlbumLiked, handleUnfollowAlbum, handleFollowAlbum, setLoading}) {
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
                
                const fetchArtists = async () => {
                        setLoading(true);
                        try {
                                const data = await spotifyApi.getFollowedArtists({ limit : 50 });
                                console.log('Retrieved artists', data.body.artists.items);
                                setArtists(data.body.artists.items);
                              } catch (err) {
                                console.log('Something went wrong!', err);
                              } finally {
                                setLoading(false); // End loading (success or error)
                              }
                };
                
                fetchArtists();
        }, [accessToken]);
        

    return (
        <>
        <div className='artistsContentOuter'>
                {selectedArtistId === null ? (
                        <>
                        <p className='contentTitle'>Artists</p>
                        {artists.map(item => ( // Correctly wrap the map function
                        <div className="artistDiv" key={item.id} onClick={()=>setSelectedArtistId(item.id)}>
                                <img src={item.images.length > 0 ? item.images[0].url : ""} />
                                <div className="artistInfo">
                                        <p>{item.name}</p>
                                </div>
                                <div className="artistFollowers">
                                        <p>{formatNumber(parseInt(item?.followers?.total))} followers</p>
                                </div>
                                <div className="artistLikeBtn">
                                        <button className='trackLiked' onClick={(e)=>handleUnfollowArtist(item, e)}>
                                                <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                                        </button>
                                </div>
                        </div>))}
                        </>
                ): (
                        <SelectedArtist accessToken={accessToken} selectedArtistId={selectedArtistId} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} showPlaylistDropDown={showPlaylistDropDown} playlists={playlists} showDropDown={showDropDown} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} checkIfLiked={checkIfLiked} checkIfArtistLiked={checkIfArtistLiked} handleLikeSong={handleLikeSong} setLikedSongs={setLikedSongs} likedSongs={likedSongs} handleUnlikeSong={handleUnlikeSong} setPlaylists={setPlaylists} user={user} handlePlayTrack={handlePlayTrack} checkIfAlbumLiked={checkIfAlbumLiked} handleUnfollowAlbum={handleUnfollowAlbum} handleFollowAlbum={handleFollowAlbum} setLoading={setLoading} handleUnfollowArtist={handleUnfollowArtist} handleFollowArtist={handleFollowArtist}/>
                )}
        </div>
        </>
    );
}

export default Artists;