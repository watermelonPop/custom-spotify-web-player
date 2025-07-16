import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
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

function FreeSearch({accessToken, searchType, searchResults, setSearchResults, setSearchType, handleFollowAlbum, handleUnfollowAlbum, handleLikeSong, handleUnlikeSong, handleFollowArtist, handleUnfollowArtist, showPlaylistDropDown, setSelectedArtistId, setSelectedPanel, setSelectedAlbum, playlists, setSearch, debouncedSearchInput, setPlaylists, user, showDropDown}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);


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


        const handleToggleLike = async (track) => {
                console.log("TRACK: ", track);
                if(track.liked === false){
                        try{
                                const val = await handleLikeSong(track);
                                setSearchResults(prevResults => (prevResults.map(item =>
                                        item.id === track.id
                                          ? { ...item, liked: true }
                                          : item
                                )));
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }else if(track.liked === true){
                        try{
                                const val = await handleUnlikeSong(track);
                        
                                setSearchResults(prevResults => (prevResults.map(item =>
                                        item.id === track.id
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
                console.log("Artist: ", artist);
                if(artist.liked === false){
                        try{
                                const val = await handleFollowArtist(artist, e);
                                setSearchResults(prevResults => (prevResults.map(item =>
                                        item.id === artist.id
                                          ? { ...item, liked: true }
                                          : item
                                )));
                                      
                        }catch (error) {
                                console.error('Error: ', error);
                                // Set all tracks to false in case of error
                                //ids.forEach(id => newLikedStatus[id] = false);
                        } 
                }else if(artist.liked === true){
                        try{
                                const val = await handleUnfollowArtist(artist, e);
                        
                                setSearchResults(prevResults => (prevResults.map(item =>
                                        item.id === artist.id
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
        

    return (
        <>
        <div className='searchContentOuter'>
                <div className='searchTypeSelect'>
                        <p className={searchType === "tracks" ? "selected" : ""} onClick={() => setSearchType("tracks")}>Tracks</p>
                        <p className={searchType === "albums" ? "selected" : ""} onClick={() => setSearchType("albums")}>Albums</p>
                        <p className={searchType === "artists" ? "selected" : ""} onClick={() => setSearchType("artists")}>Artists</p>
                        <div className="timeframe-indicator" data-selected={searchType} />
                </div>
                <div className='searchResultsDiv'>
                {
                        searchType === "tracks" ? (
                                <>
                                {searchResults ? searchResults.map((track, idx) => (
                                        <>
                                        <div className='songDiv' key={track.id}>
                                        <img src={track?.album?.images?.length > 0 ? track.album.images[0].url: ""}></img>
                                        <div className='trackMainInfo'>
                                                <p>{track.name}</p>
                                                <p>{track?.artists?.length > 0 ? track.artists[0].name : ""}</p>
                                        </div>
                                        <div className='trackAlbumName'>
                                                <p>{track?.album?.name}</p>
                                        </div>
                                        <div className='trackLikeBtn'>
                                                <button className={track.liked === true ? "trackLiked" : "trackUnliked"} onClick={()=>handleToggleLike(track)}>
                                                        <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                                                </button>
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
                                        </>
                                )):(
                                        <p></p>
                                )
                                }
                                </>
                        ) : searchType === "albums" ? (
                                <>
                                {searchResults ? searchResults.map((alb, idx) => (
                                        <>
                                                <div className="albumDiv" key={alb?.id} onClick={async () => {
                                                        try {
                                                                spotifyApi.setAccessToken(accessToken);
                                                                const data = await spotifyApi.getAlbum(alb.id);
                                                                setSelectedAlbum(data.body); // set the full album with tracks
                                                                setSelectedPanel("Albums");

                                                                setSearch("");
                                                                debouncedSearchInput("");
                                                        } catch (err) {
                                                                console.error("Error fetching album:", err);
                                                        }
                                                        }}>
                                                        <img src={alb?.images?.length > 0 ? alb?.images[0].url : null} />
                                                        <div className="albumInfo">
                                                                <p>{alb.name}</p>
                                                                <p>{alb?.artists?.length > 0 ? alb?.artists[0].name : ""}</p>
                                                        </div>
                                                        <div className="albumLikeBtn">
                                                                <button className={alb.liked === true ? "trackLiked" : "trackUnliked"} onClick={(e)=>handleToggleLikeAlbum(alb, e)}>
                                                                        <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                                                                </button>
                                                        </div>
                                                        <div className="albumMore">
                                                        <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                showDropDown(alb.id, e);
                                                                }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                                <FreeAlbumDropdownMenu accessToken={accessToken} album={alb} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput}  user={user} setPlaylists={setPlaylists}/>
                                                        </div>
                                                </div>
                                        </>
                                )) : <p></p>}
                                </>
                        ) : searchType === "artists" ? (
                                <>
                                {searchResults ? searchResults.map((artist, idx) => (
                                        <>
                                        <div className="artistDiv" key={artist.id} onClick={async () => {
                                                try {
                                                        spotifyApi.setAccessToken(accessToken);
                                                        const data = await setSelectedArtistId(artist.id);
                                                        console.log("DATA: ", data);
                                                        setSelectedPanel("Artists");
                                                        
                                                        setSearch("");
                                                        debouncedSearchInput("");
                                                } catch (err) {
                                                        console.error("Error fetching album:", err);
                                                }
                                                }}>
                                                <img src={artist?.images?.length > 0 ? artist?.images[0].url : ""} />
                                                <div className="artistInfo">
                                                        <p>{artist?.name}</p>
                                                </div>
                                                <div className="artistFollowers">
                                                        <p>{formatNumber(parseInt(artist?.followers?.total))} followers</p>
                                                </div>
                                                <div className="artistLikeBtn">
                                                        <button className={artist.liked === true ? "trackLiked" : "trackUnliked"} onClick={(e)=>handleToggleLikeArtist(artist, e)}>
                                                                <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                                                        </button>
                                                </div>
                                        </div>    
                                        </>
                                )) : <p></p>}
                                </>
                        ) : (
                                <p></p>
                        )
                        }
                </div>
        </div>
        </>
    );
}

export default FreeSearch;