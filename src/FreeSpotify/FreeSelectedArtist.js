import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsisVertical, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import FreeSongDropdownMenu from './FreeSongDropdownMenu';
import FreeAlbumDropdownMenu from './FreeAlbumDropdownMenu';
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

            function formatNumber(num) {
                if (num >= 1_000_000) {
                  return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
                } else if (num >= 1_000) {
                  return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
                } else {
                  return num.toString();
                }
              }

function FreeSelectedArtist({accessToken, selectedArtistId, setSelectedArtistId, setSelectedPanel, setSelectedAlbum, checkIfLiked, checkIfArtistLiked, handleLikeSong, handleUnlikeSong, handleFollowAlbum, setSearchResults, handleUnfollowAlbum, checkIfAlbumLiked, showDropDown, showPlaylistDropDown, playlists, setSearch, debouncedSearchInput, setPlaylists, user, setLoading, handleFollowArtist, handleUnfollowArtist}) {
        //setPanel
        //setSelectedAlbum
        const [selectedArtist, setSelectedArtist] = useState(null);
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);

        useEffect(() => {
                if (!accessToken || !selectedArtistId) return;
              
                const fetchArtistData = async () => {
                        setLoading(true);
                  try {
                    spotifyApi.setAccessToken(accessToken);
              
                    const [artistData, topTracksData, albumsData] = await Promise.all([
                      spotifyApi.getArtist(selectedArtistId),
                      fetch(`https://api.spotify.com/v1/artists/${selectedArtistId}/top-tracks?market=US`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      }).then(res => res.json()),
                      fetch(`https://api.spotify.com/v1/artists/${selectedArtistId}/albums?limit=20`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      }).then(res => res.json())
                    ]);
              
                    const topTracks = topTracksData.tracks ? topTracksData.tracks.slice(0, 5) : [];
                    const albums = albumsData.items || [];
                    console.log("BEFORE LIKES: ", albums);

                        // Step 1: extract track IDs
                        const ids = topTracks.map(track => track.id);

                        // Step 2: get liked status
                        const likedStatusArray = await checkIfLiked(ids);

                        // Step 3: add liked status to each track
                        const itemsWithLiked = topTracks.map((track, i) => ({
                        ...track,
                        liked: likedStatusArray[i]
                        }));

                        // Step 1: extract album IDs
                        const idsa = albums.map(track => track.id);
                        console.log("IDS: ", idsa);

                        // Step 2: get liked status
                        const likedStatusArraya = await checkIfAlbumLiked(idsa);

                        // Step 3: add liked status to each track
                        const albumsWithLiked = albums.map((track, i) => ({
                        ...track,
                        liked: likedStatusArraya[i]
                        }));

                        let artistLiked = await checkIfArtistLiked([artistData.body.id]);
                        console.log("ART LIKED: ", artistLiked);
                        console.log("ART ALBUMS: ", albumsWithLiked);

                        // Step 4: set the new array with liked info
              
                    setSelectedArtist({
                      ...artistData.body,
                      topTracks: itemsWithLiked,
                      albums: albumsWithLiked,
                      liked: artistLiked[0],
                    });
                  } catch (err) {
                    console.error("Error fetching artist data:", err);
                    if (err.status === 429) {
                      alert("Rate limit exceeded. Please try again later.");
                    }
                  }finally{
                        setLoading(false);
                  }
                };
              
                const timeout = setTimeout(fetchArtistData, 200); // Debounce to reduce rapid calls
              
                return () => clearTimeout(timeout);
        }, [accessToken, selectedArtistId]);
              
        
        const handleAlbumClick = async (albumId) => {
                try {
                  spotifyApi.setAccessToken(accessToken);
                  const data = await spotifyApi.getAlbum(albumId);
                  setSelectedAlbum(data.body); // Wait until it's fully set
                  setSelectedPanel("AlbumView");
                } catch (err) {
                  console.error("Failed to load album", err);
                }
        };

              
        const handleToggleLike = async (track) => {
                console.log("TRACK: ", track);
                if(track.liked === false){
                        try{
                                const val = await handleLikeSong(track);
                                console.log(selectedArtist.topTracks);
                                setSelectedArtist(prevArtist => ({
                                        ...prevArtist,
                                        topTracks: prevArtist.topTracks.map(item =>
                                          item.id === track.id
                                            ? { ...item, liked: true }
                                            : item
                                        )
                                }));                                 
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }else if(track.liked === true){
                        try{
                                const val = await handleUnlikeSong(track);
                        
                                setSelectedArtist(prevArtist => ({
                                        ...prevArtist,
                                        topTracks: prevArtist.topTracks.map(item =>
                                          item.id === track.id
                                            ? { ...item, liked: false }
                                            : item
                                        )
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
                                setSearchResults(prevResults => (prevResults.map(item =>
                                        item.id === album.id
                                          ? { ...item, liked: true }
                                          : item
                                )));
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }else if(album.liked === true){
                        try{
                                const val = await handleUnfollowAlbum(album, e);
                                setSearchResults(prevResults => (prevResults.map(item =>
                                        item.id === album.id
                                          ? { ...item, liked: false }
                                          : item
                                )));
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }
        };



        const handleToggleLikeArtist = async (artist, e) => {
                e.stopPropagation();
                console.log("artist: ", artist);
                if(artist.liked === false){
                        try{
                                const val = await handleFollowArtist(artist, e);
                                setSelectedArtist(prevArtist => ({
                                        ...prevArtist,
                                        liked: true,
                                })
                                );
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }else if(artist.liked === true){
                        try{
                                const val = await handleUnfollowArtist(artist, e);
                                setSelectedArtist(prevArtist => ({
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
        <div className='selectedArtistContentOuter'>
        {selectedArtist && selectedArtist.topTracks && selectedArtist.albums ? ( // Check if results array has items
        <>
                        <div className="selectedArtistHeader">
                                <button onClick={()=>setSelectedArtistId(null)}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
                                <img src={selectedArtist.images[0].url} />
                                <div className='selectedArtistInfo'>
                                        <p className="title">{selectedArtist.name}</p>
                                        <p className="subtitle">{formatNumber(parseInt(selectedArtist.followers.total))} followers</p>
                                        <p className={selectedArtist.liked === true ? "followArtistBtn likedAlbum" : "followArtistBtn unlikedAlbum"} onClick={(e)=>handleToggleLikeArtist(selectedArtist, e)}>
                                                {selectedArtist.liked === true ? <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> : <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}
                                                {selectedArtist.liked === true ? "followed" : "follow"}
                                        </p>
                                </div>
                        </div>
                        <p className="artistTitle">Top Songs</p>
                        {selectedArtist.topTracks ? selectedArtist.topTracks.map(track => ( // Correctly wrap the map function
                                <div className='songDiv'>
                                                                                <img src={track.album.images[0] ? track.album.images[0].url : ""}></img>
                                                                                <div className='trackMainInfo'>
                                                                                        <p>{track.name}</p>
                                                                                        <p>{track.artists[0].name}</p>
                                                                                </div>
                                                                                <div className='trackAlbumName'>
                                                                                        <p>{track.album.name}</p>
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
                        )): <p></p>}
                        <p className="artistTitle">Albums</p>
                        {selectedArtist.albums.map(item => (
                                <div className="albumDiv" key={item.id} onClick={async () => {
                                        try {
                                          spotifyApi.setAccessToken(accessToken);
                                          const data = await spotifyApi.getAlbum(item.id);
                                          setSelectedAlbum(data.body); // set the full album with tracks
                                          setSelectedPanel("Albums");
                                        } catch (err) {
                                          console.error("Error fetching album:", err);
                                        }
                                      }}
                                      >
                                        <img src={item.images.length > 0 ? item.images[0].url : ""} alt={item.name} />
                                        <div className="albumInfo">
                                                <p>{item.name}</p>
                                                <p>{item.artists[0].name}</p>
                                        </div>
                                        <div className="albumLikeBtn">
                                                <button className={item.liked === true ? "trackLiked" : "trackUnliked"} onClick={async(e)=>{
                                                        await handleToggleLikeAlbum(item, e);
                                                        setSelectedArtist(prevArtist => ({
                                                                ...prevArtist,
                                                                albums: prevArtist.albums.map(item2 =>
                                                                        item2.id === item.id
                                                                          ? { ...item2, liked: !item2.liked }
                                                                          : item2
                                                                )
                                                        })
                                                        )
                                                }}
                                                ><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></button>
                                        </div>
                                        <div className='albumMore'>
                                                <button onClick={(e) => {
                                        e.stopPropagation();
                                        showDropDown(item.id, e);
                                        }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                        <FreeAlbumDropdownMenu accessToken={accessToken} album={item} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput}  user={user} setPlaylists={setPlaylists}/>
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

export default FreeSelectedArtist;