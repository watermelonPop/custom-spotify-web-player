import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import GuestSongDropdownMenu from './GuestSongDropdownMenu';
import GuestAlbumDropdownMenu from './GuestAlbumDropdownMenu';
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
              

function GuestSearch({accessToken, searchType, searchResults, setSearchResults, setSearchType, setSelectedPanel, setSearch, debouncedSearchInput, setSelectedAlbum, setSelectedArtistId, showDropDown}) {

        const handleAlbumClick = async (album) => {
                try {
                        spotifyApi.setAccessToken(accessToken);
                        const data = await spotifyApi.getAlbum(album.id);
                        setSelectedAlbum(data.body); // set the full album with tracks
                        setSelectedPanel("Albums");

                        setSearch("");
                        debouncedSearchInput("");
                } catch (err) {
                  console.error("Failed to load album", err);
                }
        };

        const handleArtistClick = async (artist) => {
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
                                                <div className="albumDiv" key={alb?.id} onClick={()=>handleAlbumClick(alb)}>
                                                        <img src={alb?.images?.length > 0 ? alb?.images[0].url : null} />
                                                        <div className="albumInfo">
                                                                <p>{alb.name}</p>
                                                                <p>{alb?.artists?.length > 0 ? alb?.artists[0].name : ""}</p>
                                                        </div>
                                                        <div className="albumMore">
                                                        <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                showDropDown(alb.id, e);
                                                                }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                                <GuestAlbumDropdownMenu accessToken={accessToken} album={alb} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} />
                                                        </div>
                                                </div>
                                        </>
                                )) : <p></p>}
                                </>
                        ) : searchType === "artists" ? (
                                <>
                                {searchResults ? searchResults.map((artist, idx) => (
                                        <>
                                        <div className="artistDiv" key={artist.id} onClick={()=>handleArtistClick(artist)}>
                                                <img src={artist?.images?.length > 0 ? artist?.images[0].url : ""} />
                                                <div className="guestArtistInfo">
                                                        <p>{artist?.name}</p>
                                                </div>
                                                <div className="guestArtistFollowers">
                                                        <p>{formatNumber(parseInt(artist?.followers?.total))} followers</p>
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

export default GuestSearch;