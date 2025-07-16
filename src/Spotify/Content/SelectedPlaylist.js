import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import './Content.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsisVertical, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SongDropdownMenu from './SongDropdownMenu';
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

function SelectedPlaylist({accessToken, selectedPlaylistId, setSelectedPlaylistId, user, showPlaylistDropDown, setSelectedArtistId, setSelectedPanel, setSelectedAlbum, playlists, showDropDown, setSearch, debouncedSearchInput, checkIfLiked,handleLikeSong, handleUnlikeSong, likedSongs, setLikedSongs, setPlaylists, handlePlayTrack, setLoading}) {
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
                          const playlistMeta = await spotifyApi.getPlaylist(selectedPlaylistId);
                          const total = playlistMeta.body.tracks.total;
                          const limit = 100;
                          let offset = 0;
                          let allTracks = [];
                      
                          while (offset < total) {
                            const trackPage = await spotifyApi.getPlaylistTracks(selectedPlaylistId, {
                              offset,
                              limit,
                            });
                            allTracks = allTracks.concat(trackPage.body.items);
                            offset += limit;
                          }
                      
                          // Gather all track IDs
                          const trackIds = allTracks
                                .filter(item => item.track && item.track.id) // 💥 filter invalid items
                                .map(item => item.track.id);
                      
                          // Helper to batch IDs into arrays of 50
                          const batchArray = (arr, batchSize) => {
                            const batches = [];
                            for (let i = 0; i < arr.length; i += batchSize) {
                              batches.push(arr.slice(i, i + batchSize));
                            }
                            return batches;
                          };
                      
                          // Check liked status in batches
                          const batches = batchArray(trackIds, 50);
                          let likedStatuses = [];
                          for (const batch of batches) {
                                console.log("Batch:", batch); 
                            const status = await checkIfLiked(batch);
                            likedStatuses = likedStatuses.concat(status);
                          }
                      
                          // Update each track with its liked status
                          const updatedTracks = allTracks.map((item, idx) => ({
                            ...item,
                            liked: likedStatuses[idx] || false, // fallback to false if something goes wrong
                          }));
                      
                          const fullPlaylist = {
                            ...playlistMeta.body,
                            tracks: {
                              ...playlistMeta.body.tracks,
                              items: updatedTracks,
                            },
                          };
                      
                          console.log(`Fetched full playlist ${selectedPlaylistId}:`, fullPlaylist);
                          setSelectedPlaylist(fullPlaylist);
                        } catch (err) {
                          console.error('Error fetching full playlist:', err);
                          //return null;
                        } finally {
                                setLoading(false);
                        }
                      };
                      
                    
                
                fetchSelectedPlaylist();
        }, [accessToken, selectedPlaylistId]);


        const handleToggleLike = async (track, e) => {
                e.stopPropagation();
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
                        <div className='songDiv trackClickable' onClick={()=>handlePlayTrack(track.track)}>
                                                <img src={track.track.album.images[0] ? track.track.album.images[0].url : ""}></img>
                                                <div className='trackMainInfo'>
                                                        <p>{track.track.name}</p>
                                                        <p>{track.track.artists[0].name}</p>
                                                </div>
                                                <div className='trackAlbumName'>
                                                        <p>{track.track.album.name}</p>
                                                </div>
                                                <div className='trackLikeBtn'>
                                                        <button className={track.liked === true ? "trackLiked" : "trackUnliked"} onClick={(e)=>handleToggleLike(track, e)}><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></button>
                                                </div>
                                                <div className='trackDuration'>
                                                        <p>{msToMinutesAndSeconds(track.track.duration_ms)}</p>
                                                </div>
                                                <div className='trackMoreBtn'>
                                                        <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                showDropDown(track.track.id, e);
                                                        }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                        <SongDropdownMenu accessToken={accessToken} track={track.track} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setPlaylists={setPlaylists} user={user}/>
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

export default SelectedPlaylist;