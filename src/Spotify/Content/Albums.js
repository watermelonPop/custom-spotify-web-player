import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import './Content.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faHeart } from '@fortawesome/free-solid-svg-icons';
import SelectedAlbum from './SelectedAlbum';
import AlbumDropdownMenu from './AlbumDropdownMenu';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function Albums({accessToken, selectedAlbum, setSelectedAlbum, showPlaylistDropDown, setSelectedArtistId, setSelectedPanel, playlists, showDropDown, setSearch, debouncedSearchInput, checkIfLiked, checkIfAlbumLiked,handleLikeSong, setLikedSongs, likedSongs, setSelectedPlaylist, handleUnlikeSong, albums, setAlbums, handleUnfollowAlbum, setPlaylists, user, handlePlayTrack, setLoading, handleFollowAlbum}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);



        useEffect(() => {
                if (!accessToken) return;
                
                const fetchAlbums = async () => {
                        setLoading(true);
                              try {
                                const data = await spotifyApi.getMySavedAlbums({
                                        limit : 50
                                });
                                console.log('Retrieved albums', data.body.items);
                                setAlbums(data.body.items);
                              } catch (err) {
                                console.log('Something went wrong!', err);
                              } finally {
                                setLoading(false); // End loading (success or error)
                              }

                };
                
                fetchAlbums();
        }, [accessToken]);
        

    return (
        <>
        <div className='albumsContentOuter'>
                {selectedAlbum === null ? (
                        <>
                        <p className='contentTitle'>Albums</p>
                        {albums.map(item => ( // Correctly wrap the map function
                                <div className="albumDiv" key={item.album.id} onClick={()=>setSelectedAlbum(item.album)}>
                                        <img src={item.album.images.length > 0 ? item.album.images[0].url : ""} />
                                        <div className="albumInfo">
                                                <p>{item.album.name}</p>
                                                <p>{item.album.artists[0].name}</p>
                                        </div>
                                        <div className="albumLikeBtn">
                                                <button className='trackLiked' onClick={(e)=>handleUnfollowAlbum(item.album, e)}><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></button>
                                        </div>
                                        <div className="albumMore">
                                                <button onClick={(e) => {
                                                e.stopPropagation();
                                                showDropDown(item.album.id, e);
                                                }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                <AlbumDropdownMenu accessToken={accessToken} album={item.album} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput}  user={user} setPlaylists={setPlaylists}/>
                                        </div>
                                </div>
                        ))}
                        </>
                ):(
                        <SelectedAlbum accessToken={accessToken} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} playlists={playlists} showDropDown={showDropDown} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} checkIfLiked={checkIfLiked} checkIfAlbumLiked={checkIfAlbumLiked} setLikedSongs={setLikedSongs} likedSongs={likedSongs} setSelectedPlaylist={setSelectedPlaylist} handleLikeSong={handleLikeSong} handleUnlikeSong={handleUnlikeSong} setPlaylists={setPlaylists} user={user} handlePlayTrack={handlePlayTrack} setLoading={setLoading} handleFollowAlbum={handleFollowAlbum} handleUnfollowAlbum={handleUnfollowAlbum}/>
                )}
        </div>
        </>
    );
}

export default Albums;