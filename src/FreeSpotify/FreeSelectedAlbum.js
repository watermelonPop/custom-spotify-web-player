import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsisVertical, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
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

function FreeSelectedAlbum({accessToken, selectedAlbum, setSelectedAlbum, checkIfLiked, checkIfAlbumLiked, handleLikeSong, handleUnlikeSong, showDropDown, showPlaylistDropDown, setSelectedArtistId, setSelectedPanel, playlists, setSearch, debouncedSearchInput, setPlaylists, user, setLoading, handleFollowAlbum,handleUnfollowAlbum}) {
        const [selectedAlbumWithLikes, setSelectedAlbumWithLikes] = useState(null);
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }

                                console.log(selectedAlbum);
        }, [accessToken]);

        useEffect(() => {
                if(!accessToken) return;
                if(selectedAlbum === null || selectedAlbumWithLikes !== null){
                        return;
                }

                async function fetchLikes() {
                        setLoading(true);
                        try{
                        const alb = selectedAlbum;
                        const items = selectedAlbum.tracks.items;

                        // Step 1: extract track IDs
                        const ids = items.map(track => track.id);

                        // Step 2: get liked status
                        const likedStatusArray = await checkIfLiked(ids);

                        // Step 3: add liked status to each track
                        const itemsWithLiked = items.map((track, i) => ({
                        ...track,
                        liked: likedStatusArray[i]
                        }));

                        // Step 4: set the new array with liked info
                        alb.tracks.items = itemsWithLiked;
                        let albLiked = await checkIfAlbumLiked([alb.id]);
                        alb.liked = albLiked[0];
                        setSelectedAlbumWithLikes(alb);
                        }catch (err) {
                                console.error('Error:', err);
                        }finally{
                                setLoading(false);
                        }
                }
                fetchLikes();
        }, [selectedAlbum]);


        const handleToggleLike = async (track) => {
                console.log("TRACK: ", track);
                if(track.liked === false){
                        try{
                                const val = await handleLikeSong(track);
                                //let temp = {};
                                //temp.track = track;
                                //setLikedSongs([...likedSongs, { temp }]);
                                setSelectedAlbumWithLikes(prevAlbum => ({
                                        ...prevAlbum,
                                        tracks: {
                                          ...prevAlbum.tracks,
                                          items: prevAlbum.tracks.items.map(item =>
                                            item.id === track.id
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
                                const val = await handleUnlikeSong(track);
                        
                                setSelectedAlbumWithLikes(prevAlbum => ({
                                        ...prevAlbum,
                                        tracks: {
                                          ...prevAlbum.tracks,
                                          items: prevAlbum.tracks.items.map(item =>
                                            item.id === track.id
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



        const handleToggleLikeAlbum = async (album, e) => {
                e.stopPropagation();
                console.log("album: ", album);
                if(album.liked === false){
                        try{
                                const val = await handleFollowAlbum(album, e);
                                setSelectedAlbumWithLikes(prevArtist => ({
                                        ...prevArtist,
                                        liked: true,
                                })
                                );
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }else if(album.liked === true){
                        try{
                                const val = await handleUnfollowAlbum(album, e);
                                setSelectedAlbumWithLikes(prevArtist => ({
                                        ...prevArtist,
                                        liked: false,
                                })
                                );
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }
        };
              
        
    return (
        <>
        <div className='selectedAlbumContentOuter'>
        {selectedAlbumWithLikes && selectedAlbumWithLikes.tracks ? ( // Check if results array has items
        <>
        <div className='selectedAlbumHeader'>
        <button onClick={()=>setSelectedAlbum(null)}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
                <img src={selectedAlbumWithLikes.images.length > 0 ? selectedAlbumWithLikes.images[0].url : ""} />
                <div className='selectedAlbumInfo'>
                <p className="title">{selectedAlbumWithLikes.name}</p>
                                        <p className="subtitle">
                                        {selectedAlbumWithLikes.artists.length === 1
                                                ? selectedAlbumWithLikes.artists[0].name
                                                : selectedAlbumWithLikes.artists.length > 1
                                                ? selectedAlbumWithLikes.artists.map((artist, index) => {
                                                        // Join artist names with & symbol
                                                        return (
                                                        <span key={artist.id}>
                                                        {artist.name}
                                                        {index < selectedAlbumWithLikes.artists.length - 1 && ' & '}
                                                        </span>
                                                        );
                                                })
                                                : ""}
                                        </p>
                                        <p className="subtitle">{new Date(selectedAlbumWithLikes.release_date).getFullYear()}</p>
                                        <p className="subtitle">{selectedAlbumWithLikes.total_tracks} songs</p>
                                         <p className={selectedAlbumWithLikes.liked === true ? "followAlbumBtn likedAlbum" : "followAlbumBtn unlikedAlbum"} onClick={(e)=>handleToggleLikeAlbum(selectedAlbumWithLikes, e)}>
                                                {selectedAlbumWithLikes.liked === true ? <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> : <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}
                                                {selectedAlbumWithLikes.liked === true ? "saved" : "save"}
                                        </p>
                </div>
        </div>
                        {selectedAlbumWithLikes.tracks.items.map(track => ( // Correctly wrap the map function
                                <div className='songDiv'>
                                        <img src={selectedAlbumWithLikes.images[0].url}></img>
                                        <div className='trackMainInfo'>
                                                <p>{track.name}</p>
                                                <p>{track.artists[0].name}</p>
                                        </div>
                                        <div className='trackAlbumName'>
                                                <p>{selectedAlbumWithLikes.name}</p>
                                        </div>
                                        <div className='trackLikeBtn'>
                                                <button className={track.liked === true ? "trackLiked" : "trackUnliked"} onClick={()=>handleToggleLike(track)}><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></button>
                                        </div>
                                        <div className='trackDuration'>
                                                <p>{msToMinutesAndSeconds(track.duration_ms)}</p>
                                        </div>
                                        <div className='trackMoreBtn'>
                                                <button onClick={(e) => {
                                                e.stopPropagation();
                                                showDropDown(track.id, e);
                                                }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                <FreeSongDropdownMenu accessToken={accessToken} track={track} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setPlaylists={setPlaylists} user={user} />
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

export default FreeSelectedAlbum;