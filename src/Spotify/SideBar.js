import { useState, useEffect } from 'react';
import './TopContent.css';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser, faGear, faList, faCompactDisc, faPalette, faHouse } from '@fortawesome/free-solid-svg-icons';

const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function SideBar({accessToken, setSelectedPanel, setSearch, setSelectedPlaylistId, setSelectedArtistId, setSelectedAlbum, selectedPanel}) {
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);
        

    return (
        <>
        <div className='sideBarOuter'>
                <p onClick={() => {
                        setSearch("");
                        setSelectedPanel("Home");
                }} className={selectedPanel === "Home" ? "selectedSideBar" : ""}><FontAwesomeIcon icon={faHouse}></FontAwesomeIcon> Home</p>
                <p onClick={() => {
                        setSearch("");
                        setSelectedPanel("Playlists");
                        setSelectedPlaylistId(null);
                }} className={selectedPanel === "Playlists" ? "selectedSideBar" : ""}><FontAwesomeIcon icon={faList}></FontAwesomeIcon> Playlists</p>
                <p onClick={() => {
                        setSearch("");
                        setSelectedPanel("Liked");
                }} className={selectedPanel === "Liked" ? "selectedSideBar" : ""}><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> Liked Songs</p>
                <p onClick={() => {
                        setSearch("");
                        setSelectedPanel("Artists");
                        setSelectedArtistId(null);
                }} className={selectedPanel === "Artists" ? "selectedSideBar" : ""}><FontAwesomeIcon icon={faPalette}></FontAwesomeIcon> Artists</p>
                <p onClick={() => {
                        setSearch("");
                        setSelectedPanel("Albums");
                        setSelectedAlbum(null);
                }} className={selectedPanel === "Albums" ? "selectedSideBar" : ""}><FontAwesomeIcon icon={faCompactDisc}></FontAwesomeIcon> Albums</p>
                <p onClick={() => {
                        setSearch("");
                        setSelectedPanel("Profile");
                }} className={selectedPanel === "Profile" ? "selectedSideBar" : ""}><FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Profile</p>
                <p onClick={() => {
                        setSearch("");
                        setSelectedPanel("Settings");
                }} className={selectedPanel === "Settings" ? "selectedSideBar" : ""}><FontAwesomeIcon icon={faGear}></FontAwesomeIcon> Settings</p>
        </div>
        </>
    );
}

export default SideBar;