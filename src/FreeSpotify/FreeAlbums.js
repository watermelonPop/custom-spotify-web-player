import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faHeart } from '@fortawesome/free-solid-svg-icons';
import FreeSelectedAlbum from './FreeSelectedAlbum';
import FreeAlbumDropdownMenu from './FreeAlbumDropdownMenu';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function FreeAlbums({accessToken, albums, setAlbums, handleUnfollowAlbum, checkIfLiked, checkIfAlbumLiked, handleLikeSong, handleUnlikeSong, selectedAlbum, setSelectedAlbum, showDropDown, showPlaylistDropDown, setSelectedArtistId, setSelectedPanel, playlists, setSearch, debouncedSearchInput, setPlaylists, user, setLoading, handleFollowAlbum}) {
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
                        try{
                                let data = await spotifyApi.getMySavedAlbums({
                                limit : 50
                              });
                                setAlbums(data.body.items);
                        }catch (err) {
                                console.error('Error:', err);
                        }finally{
                                setLoading(false);
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
                        {albums.filter(item => item?.album).map(item => ( // Correctly wrap the map function
                                <div className="albumDiv" key={item?.album?.id} onClick={()=>setSelectedAlbum(item?.album)}>
                                        <img src={item?.album?.images?.length > 0 ? item.album.images[0].url : ""} />
                                        <div className="albumInfo">
                                                <p>{item?.album?.name}</p>
                                                <p>{item?.album?.artists[0].name}</p>
                                        </div>
                                        <div className="albumLikeBtn">
                                                <button className='trackLiked' onClick={(e)=>{
                                                        handleUnfollowAlbum(item?.album, e);
                                                        setAlbums(albums.filter((item2) => item2?.album?.id !== item?.album?.id))
                                                }}><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></button>
                                        </div>
                                        <div className="albumMore">
                                                <button onClick={(e) => {
                                                e.stopPropagation();
                                                showDropDown(item?.album?.id, e);
                                                }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                <FreeAlbumDropdownMenu accessToken={accessToken} album={item?.album} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput}  user={user} setPlaylists={setPlaylists}/>
                                        </div>
                                </div>
                        ))}
                        </>
                ):(
                        <FreeSelectedAlbum accessToken={accessToken} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} checkIfLiked={checkIfLiked} checkIfAlbumLiked={checkIfAlbumLiked} handleLikeSong={handleLikeSong} handleUnlikeSong={handleUnlikeSong} showDropDown={showDropDown} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setPlaylists={setPlaylists} user={user} setLoading={setLoading} handleFollowAlbum={handleFollowAlbum} handleUnfollowAlbum={handleUnfollowAlbum}/>
                )}
        </div>
        </>
    );
}

export default FreeAlbums;