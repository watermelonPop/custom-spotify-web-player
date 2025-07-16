import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsisVertical, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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

function FreeSelectedPlaylist({accessToken, selectedPlaylistId, setSelectedPlaylistId, checkIfLiked,handleLikeSong, handleUnlikeSong, likedSongs, setLikedSongs, showDropDown, showPlaylistDropDown, setSelectedArtistId, setSelectedPanel, setSelectedAlbum, playlists, setSearch, debouncedSearchInput, setPlaylists, user, setLoading}) {
        const [selectedPlaylist, setSelectedPlaylist] = useState(null);
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
        
                if(selectedPlaylistId === null){
                    setSelectedPlaylist(null);
                    return;
                }
                
                const fetchSelectedPlaylist = async () => {
                        setLoading(true);
                        try {
                                // 1. Fetch playlist metadata
                                const playlistMeta = await spotifyApi.getPlaylist(selectedPlaylistId);
                                const total = playlistMeta.body.tracks.total;
                                const limit = 100;
                                let offset = 0;
                                let allTracks = [];
                            
                                // 2. Fetch all tracks (pagination)
                                while (offset < total) {
                                  const trackPage = await spotifyApi.getPlaylistTracks(selectedPlaylistId, {
                                    offset,
                                    limit,
                                  });
                                  allTracks = allTracks.concat(trackPage.body.items);
                                  offset += limit;
                                }
                            
                                // 3. Gather all valid track IDs
                                const ids = allTracks.map(item => item.track?.id).filter(Boolean);
                            
                                // 4. Chunk IDs into batches of 50
                                const chunkedIds = [];
                                for (let i = 0; i < ids.length; i += 50) {
                                  chunkedIds.push(ids.slice(i, i + 50));
                                }
                            
                                // 5. Check liked status for each chunk (in parallel)
                                const likedStatusChunks = await Promise.all(
                                  chunkedIds.map(chunk => checkIfLiked(chunk))
                                );
                            
                                // 6. Flatten the liked statuses
                                const likedStatusArray = likedStatusChunks.flat();
                            
                                // 7. Update each track with its liked status
                                const allTracksWithLiked = allTracks.map((item, i) => ({
                                  ...item,
                                  liked: likedStatusArray[i],
                                }));
                            
                                // 8. Build the full playlist object
                                const fullPlaylist = {
                                  ...playlistMeta.body,
                                  tracks: {
                                    ...playlistMeta.body.tracks,
                                    items: allTracksWithLiked,
                                  },
                                };
                            
                                setSelectedPlaylist(fullPlaylist);
                              } catch (err) {
                                console.error('Error fetching full playlist with liked:', err);
                              }finally{
                                setLoading(false);
                              }
                    };
                    
                
                fetchSelectedPlaylist();
        }, [accessToken, selectedPlaylistId]);


        const handleToggleLike = async (track) => {
                console.log("TRACK: ", track);
                if(track.liked === false){
                        try{
                                const val = await handleLikeSong(track.track);
                                setLikedSongs([...likedSongs, { track }]);
                                setSelectedPlaylist(prevPlaylist => ({
                                        ...prevPlaylist,
                                        tracks: {
                                          ...prevPlaylist.tracks,
                                          items: prevPlaylist.tracks.items.map(item =>
                                            item.track.id === track.track.id
                                              ? { ...item, liked: true }
                                              : item
                                          )
                                        }
                                      }));
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }else if(track.liked === true){
                        try{
                                const val = await handleUnlikeSong(track.track);

                                const updatedLikedSongs = likedSongs.filter(
                                        item => item.track.id !== track.track.id
                                );

                                setLikedSongs(updatedLikedSongs);
                        
                                setSelectedPlaylist(prevPlaylist => ({
                                        ...prevPlaylist,
                                        tracks: {
                                          ...prevPlaylist.tracks,
                                          items: prevPlaylist.tracks.items.map(item =>
                                            item.track.id === track.track.id
                                              ? { ...item, liked: false }
                                              : item
                                          )
                                        }
                                      }));
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }
        };

        

    return (
        <>
        <div className='selectedPlaylistContentOuter'>
                <div className='contentHeader'>
                        <button onClick={()=>setSelectedPlaylistId(null)}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
                        <p>{selectedPlaylist?.name} ({selectedPlaylist?.tracks?.items.length} tracks)</p>
                </div>
                <div className='contentInner'>
                {selectedPlaylist ? selectedPlaylist?.tracks?.items?.map((track, idx) => (
                        <>
                        <div className='songDiv'>
                                                <img src={track.track.album.images[0] ? track.track.album.images[0].url : ""}></img>
                                                <div className='trackMainInfo'>
                                                        <p>{track.track.name}</p>
                                                        <p>{track.track.artists[0].name}</p>
                                                </div>
                                                <div className='trackAlbumName'>
                                                        <p>{track.track.album.name}</p>
                                                </div>
                                                <div className='trackLikeBtn'>
                                                        <button className={track.liked === true ? "trackLiked" : "trackUnliked"} onClick={()=>handleToggleLike(track)}><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></button>
                                                </div>
                                                <div className='trackDuration'>
                                                        <p>{msToMinutesAndSeconds(track.track.duration_ms)}</p>
                                                </div>
                                                <div className='trackMoreBtn'>
                                                        <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                showDropDown(track.track.id, e);
                                                        }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                        <FreeSongDropdownMenu accessToken={accessToken} track={track.track} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setPlaylists={setPlaylists} user={user} />
                                                </div>
                                                </div>
                        </>
                )): (
                        <p></p>
                )
                }
                </div>
        </div>
        </>
    );
}

export default FreeSelectedPlaylist;