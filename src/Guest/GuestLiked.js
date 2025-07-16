import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsisVertical, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GuestSongDropdownMenu from './GuestSongDropdownMenu';

        function msToMinutesAndSeconds(ms) {
                const minutes = Math.floor(ms / 60000);
                const seconds = Math.floor((ms % 60000) / 1000);
                return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
            }

function GuestLiked({accessToken, likedSongs, setSelectedArtistId, setSelectedPanel, setSelectedAlbum, setSearch, debouncedSearchInput, showDropDown}) {

    return (
        <>
        <div className='likedContentOuter'>
                <p className='contentTitle'>Simone's Liked Songs</p>
                {likedSongs ? likedSongs.map((track, idx) => (
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
                                                <div className='trackDuration'>
                                                        <p>{msToMinutesAndSeconds(track.track.duration_ms)}</p>
                                                </div>
                                                <div className='trackMoreBtn'>
                                                        <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                showDropDown(track.track.id, e);
                                                        }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                        <GuestSongDropdownMenu accessToken={accessToken} track={track.track} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} />
                                                </div>
                                                </div>
                        </>
                )): (
                        <p></p>
                )
                }
        </div>
        </>
    );
}

export default GuestLiked;