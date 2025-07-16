import { useState, useEffect, useRef } from 'react';
import './TopContent.css';
import SpotifyWebApi from "spotify-web-api-node";
import Albums from "./Content/Albums.js";
import Artists from './Content/Artists.js';
import Search from './Content/Search.js';
import Home from './Content/Home.js';
import Playlists from './Content/Playlists.js';
import Liked from './Content/Liked.js';
import Profile from './Content/Profile.js';
import Settings from './Content/Settings.js';
import BIRDS from 'vanta/dist/vanta.birds.min';
import NET from 'vanta/dist/vanta.net.min';
import FOG from 'vanta/dist/vanta.fog.min';
import TOPOLOGY from 'vanta/dist/vanta.topology.min';
import TRUNK from 'vanta/dist/vanta.trunk.min';

const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function Content({accessToken, selectedPanel, setSelectedPanel, search, debouncedSearch, searchType, user, setUser, setSearch, debouncedSearchInput, setSearchType, selectedPlaylistId, setSelectedPlaylistId, selectedArtistId, setSelectedArtistId, selectedAlbum, setSelectedAlbum, themes, currentTheme, setTheme, setCurrentTheme, setThemes}) {
        const [playlists, setPlaylists] = useState([]);
        const [likedSongs, setLikedSongs] = useState([]);
        const [artists, setArtists] = useState([]);
        const [albums, setAlbums] = useState([]);
        const [loading, setLoading] = useState(false);
        const [vantaEffect, setVantaEffect] = useState(null);
        const [vantaChoice, setVantaChoice] = useState(() => {
                const stored = localStorage.getItem("vantaChoice");
                if (stored) return stored;
                return "Birds";
        });
        const myRef = useRef(null);
        
        useEffect(() => {
                if (!currentTheme || !vantaChoice) return;
            
                if (vantaEffect) {
                    vantaEffect.destroy(); // 💥 Clean up previous effect
                }
                let newEffect = null;

                if(vantaChoice === "Birds"){
                        newEffect = BIRDS({
                        el: myRef.current,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00,
                        backgroundColor: currentTheme.backgroundColor2,
                        color1: currentTheme.accentColor,
                        color2: currentTheme.backgroundColor1,
                        colorMode: "lerpGradient",
                        birdSize: 2.1
                        });
                }else if(vantaChoice === "Net"){
                        newEffect = NET({
                                el: myRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                scale: 1.00,
                                scaleMobile: 1.00,
                                color: currentTheme.accentColor,
                                backgroundColor: currentTheme.backgroundColor2,
                              })
                }else if(vantaChoice === "Fog"){
                        newEffect = FOG({
                                el: myRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                highlightColor: currentTheme.accentColor,
                                midtoneColor: currentTheme.backgroundColor1,
                                lowlightColor: currentTheme.backgroundColor1,
                                baseColor: currentTheme.backgroundColor2,
                                speed: 2.00
                                });
                }else if(vantaChoice === "Topology"){
                        newEffect = TOPOLOGY({
                                el: myRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                scale: 1.00,
                                scaleMobile: 1.00,
                                color: currentTheme.accentColor,
                                backgroundColor: currentTheme.backgroundColor2,
                                });
                }else if(vantaChoice === "Trunk"){
                        newEffect = TRUNK({
                                el: myRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                scale: 1.00,
                                scaleMobile: 1.00,
                                color: currentTheme.accentColor,
                                backgroundColor: currentTheme.backgroundColor2,
                                spacing: 2.50,
                                chaos: 2.00
                                });
                }
            
                setVantaEffect(newEffect);
            
                return () => {
                    newEffect?.destroy(); // 🧹 Clean up on unmount or change
                };
            }, [currentTheme, vantaChoice]); // ❗ Depend only on currentTheme

            
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);


        useEffect(() => {
                if (!accessToken || !user || !user.id) return;
                if (!spotifyApi.getAccessToken()) {
                    console.warn("Spotify access token is missing");
                    return;
                }
                
                const fetchPlaylists = async () => {
                        setLoading(true); // Start loading
                        try {
                          const data = await spotifyApi.getUserPlaylists(user.id);
                          console.log('Retrieved playlists', data.body);
                          setPlaylists(data.body.items);
                        } catch (err) {
                          console.log('Something went wrong!', err);
                        } finally {
                          setLoading(false); // End loading (success or error)
                        }
                };
                
                fetchPlaylists();
        }, [accessToken, user]);

        const setEffect = (newVantaChoice) => {
                if (!currentTheme || !newVantaChoice) return;
            
                if (vantaEffect) {
                    vantaEffect.destroy(); // 💥 Clean up previous effect
                }
                let newEffect = null;

                if(newVantaChoice === "Birds"){
                        newEffect = BIRDS({
                        el: myRef.current,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00,
                        backgroundColor: currentTheme.backgroundColor2,
                        color1: currentTheme.accentColor,
                        color2: currentTheme.backgroundColor1,
                        colorMode: "lerpGradient",
                        birdSize: 2.1
                        });
                }else if(newVantaChoice === "Net"){
                        newEffect = NET({
                                el: myRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                scale: 1.00,
                                scaleMobile: 1.00,
                                color: currentTheme.accentColor,
                                backgroundColor: currentTheme.backgroundColor2,
                              })
                }else if(newVantaChoice === "Fog"){
                        newEffect = FOG({
                                el: myRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                highlightColor: currentTheme.accentColor,
                                midtoneColor: currentTheme.backgroundColor1,
                                lowlightColor: currentTheme.backgroundColor1,
                                baseColor: currentTheme.backgroundColor2,
                                speed: 2.00
                                });
                }else if(newVantaChoice === "Topology"){
                        newEffect = TOPOLOGY({
                                el: myRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                scale: 1.00,
                                scaleMobile: 1.00,
                                color: currentTheme.accentColor,
                                backgroundColor: currentTheme.backgroundColor2,
                                });
                }else if(newVantaChoice === "Trunk"){
                        newEffect = TRUNK({
                                el: myRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                scale: 1.00,
                                scaleMobile: 1.00,
                                color: currentTheme.accentColor,
                                backgroundColor: currentTheme.backgroundColor2,
                                spacing: 2.50,
                                chaos: 2.00
                                });
                }
            
                setVantaEffect(newEffect);

                localStorage.setItem("vantaChoice", newVantaChoice);

                setVantaChoice(newVantaChoice);
            
                return () => {
                    newEffect?.destroy(); // 🧹 Clean up on unmount or change
                };
        };
        

        const showDropDown = (itemTrackId, event) => {
                event.stopPropagation();
                let idName = `myDropdown-${itemTrackId}`;
                let dropdown = document.getElementById(idName);
                if(dropdown){
                        dropdown.classList.toggle("show");

                        const rect = event.target.getBoundingClientRect();
                        const scrollTop = window.scrollY || document.documentElement.scrollTop;
                        dropdown.style.top = `${rect.bottom + scrollTop}px`;
                        dropdown.style.left = `${rect.left - 100}px`;

                        dropdown.addEventListener('mouseout', (e) => {
                                // Check if the mouse has left the dropdown area
                                if (!e.relatedTarget || !dropdown.contains(e.relatedTarget)) {
                                dropdown.classList.remove('show');
                                }
                        });
                }
        };
        const showPlaylistDropDown = (itemTrackId, event) => {
                event.stopPropagation();
            
                const oldIdName = `myDropdown-${itemTrackId}`;
                const idName = `playlistDropdown-${itemTrackId}`;
                const oldDropdown = document.getElementById(oldIdName);
                const dropdown = document.getElementById(idName);
            
                if (oldDropdown) {
                    oldDropdown.classList.remove("show");
                }
            
                if (dropdown) {
                    dropdown.style.position = "fixed";
            
                    // Try to find the closest visible container
                    let triggerElement = event.target.closest(".trackMoreBtn") || event.target.closest(".albumMore") || event.target.closest("a");
            
                    let rect;
                    if (triggerElement) {
                        rect = triggerElement.getBoundingClientRect();
                        dropdown.style.top = `${rect.bottom - 50}px`;
                        dropdown.style.left = `${rect.left - 100}px`;
                    } else {
                        // fallback to raw mouse position if trigger element is invisible
                        dropdown.style.top = `${event.clientY}px`;
                        dropdown.style.left = `${event.clientX}px`;
                    }
            
                    dropdown.classList.toggle("show");
            
                    console.log("Dropdown computed position:", dropdown.style.top, dropdown.style.left);
            
                    dropdown.addEventListener("mouseout", (e) => {
                        if (!e.relatedTarget || !dropdown.contains(e.relatedTarget)) {
                            dropdown.classList.remove("show");
                        }
                    });
                }
            };            
            
            
            



        const checkIfLiked = async (ids) => {
                //max: 50
                try {
                        const idsStr = ids.join(',');
            
                    const response = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${idsStr}`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to check liked songs');
                    }
            
                    const data = await response.json();
                    return data;
                    
                } catch (err) {
                    console.error('Error fetching liked status:', err);
                    return ids.map(() => false); // Return an array of false values if there's an error
                }
        };


        const checkIfArtistLiked = async (ids) => {
                //max: 50
                try {
                        const idsStr = ids.join(',');
            
                    const response = await fetch(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${idsStr}`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to check liked songs');
                    }
            
                    const data = await response.json();
                    return data;
                    
                } catch (err) {
                    console.error('Error fetching liked status:', err);
                    return ids.map(() => false); // Return an array of false values if there's an error
                }
        };

        const checkIfAlbumLiked = async (ids) => {
                //max: 20
                try {
                    let idsStr = "";
                    for (let i = 0; i < ids.length; i++) {
                        idsStr += ids[i];
                        if (i < ids.length - 1) {
                            idsStr += "%2C";
                        }
                    }
            
                    const response = await fetch(`https://api.spotify.com/v1/me/albums/contains?ids=${idsStr}`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to check liked songs');
                    }
            
                    const data = await response.json();
                    return data;
                    
                } catch (err) {
                    console.error('Error fetching liked status:', err);
                    return ids.map(() => false); // Return an array of false values if there's an error
                }
        };


        const handleUnlikeSong = async (track) => {
                if (!spotifyApi.getAccessToken()) {
                    console.warn("Spotify access token is missing");
                    return;
                }
            
                try {
                    await spotifyApi.removeFromMySavedTracks([track.id]);
                    setLikedSongs((prevSongs) =>
                        prevSongs.filter((item) => item.track.id !== track.id)
                    );
                } catch (err) {
                    console.log('Something went wrong!', err);
                }
        };

        const handleLikeSong = async (track) => {
                spotifyApi.addToMySavedTracks([track.id])
                .then(function(data) {
                        setLikedSongs([...likedSongs, { track }]);
                }, function(err) {
                        console.log('Something went wrong!', err);
                });
        };

        const handleUnfollowArtist = async (artist, e) => {
                e.stopPropagation();
                try {     
                        const response = await fetch(`https://api.spotify.com/v1/me/following?type=artist&ids=${artist.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${accessToken}` },
                        });
                
                        if (!response.ok) {
                                const errorData = await response.json();
                                console.error('API Error:', errorData);
                                throw new Error(`Failed to unfollow Artist: ${errorData.error.message}`);
                        }else{
                                spotifyApi.getFollowedArtists({ limit : 50 })
                                .then(function(data) {
                                        setArtists(data.body.artists.items);
                                }, function(err) {
                                        console.log('Something went wrong!', err);
                                });
                        }
                } catch (err) {
                        console.error('Failed to unfollow Artist: ', err);
                }
        };


        const handleFollowArtist = async (artist, e) => {
                e.stopPropagation();
                try {     
                        const response = await fetch(`https://api.spotify.com/v1/me/following?type=artist&ids=${artist.id}`, {
                            method: "PUT",
                            headers: { Authorization: `Bearer ${accessToken}` },
                        });
                
                        if (!response.ok) {
                                const errorData = await response.json();
                                console.error('API Error:', errorData);
                                throw new Error(`Failed to follow Artist: ${errorData.error.message}`);
                        }else{
                                spotifyApi.getFollowedArtists({ limit : 50 })
                                .then(function(data) {
                                        setArtists(data.body.artists.items);
                                }, function(err) {
                                        console.log('Something went wrong!', err);
                                });
                        }
                } catch (err) {
                        console.error('Failed to follow Artist: ', err);
                }
        };


        const handleFollowAlbum = async (album, e) => {
                e.stopPropagation();
                try {     
                        const response = await fetch(`https://api.spotify.com/v1/me/albums?ids=${album.id}`, {
                            method: "PUT",
                            headers: { Authorization: `Bearer ${accessToken}` },
                        });
                
                        if (!response.ok) {
                                const errorData = await response.json();
                                console.error('API Error:', errorData);
                                throw new Error(`Failed to follow Album: ${errorData.error.message}`);
                        }else{
                                spotifyApi.getMySavedAlbums({
                                        limit : 50
                                      })
                                      .then(function(data) {
                                        // Output items
                                        console.log(data.body.items);
                                        setAlbums(data.body.items);
                                      }, function(err) {
                                        console.log('Something went wrong!', err);
                                      });
                        }
                } catch (err) {
                        console.error('Failed to follow Album: ', err);
                }
        };

        const handleUnfollowAlbum = async (album, e) => {
                e.stopPropagation();
                try {     
                        const response = await fetch(`https://api.spotify.com/v1/me/albums?ids=${album.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${accessToken}` },
                        });
                
                        if (!response.ok) {
                                const errorData = await response.json();
                                console.error('API Error:', errorData);
                                throw new Error(`Failed to unfollow Album: ${errorData.error.message}`);
                        }else{
                                spotifyApi.getMySavedAlbums({
                                        limit : 50
                                      })
                                      .then(function(data) {
                                        // Output items
                                        console.log(data.body.items);
                                        setAlbums(data.body.items);
                                      }, function(err) {
                                        console.log('Something went wrong!', err);
                                      });
                        }
                } catch (err) {
                        console.error('Failed to unfollow Album: ', err);
                }
        };


    const handleAddToQueue = async (uri) => {
        try {
                const response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(uri)}`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to add to queue');
                }
                else{
                     console.log("SONG QUEUED")
                }
        } catch (err) {
                console.error('Error queueing:', err);
        }
    };


    const next = () => {
        if (!accessToken) return;
        if (!spotifyApi.getAccessToken()) {
            console.warn("Spotify access token is missing");
            return;
        }
        spotifyApi.skipToNext()
        .then(function() {
                console.log('Skip to next');
                //setCurrentSong(null);
        }, function(err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
        });
    };


    const handlePlayTrack = async (track) => {
        if (!accessToken) return;
        if (!spotifyApi.getAccessToken()) {
            console.warn("Spotify access token is missing");
            return;
        }
        try {
                console.log("PLAY: " + track.name + ", uri: " + track.uri);
                const val = await handleAddToQueue(track.uri);
                next();
        } catch (error) {
                console.error('Error fetching liked status for tracks:', error);
                // Set all tracks to false in case of error
                //ids.forEach(id => newLikedStatus[id] = false);
        }  
    };


    return (
        <>
        <div className='contentOuter' ref={myRef}>
                {
                        loading === true ? (
                                <>
                                        <div className="outerLoader">
                                                <div className="loader"></div>
                                        </div>
                                </>
                        ) : (
                                <div></div>
                        )
                }
                {selectedPanel === null || search !== "" ? (
                        <Search accessToken={accessToken} search={search} debouncedSearch={debouncedSearch} searchType={searchType} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} showDropDown={showDropDown} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} checkIfLiked={checkIfLiked} setSearchType={setSearchType} checkIfArtistLiked={checkIfArtistLiked} checkIfAlbumLiked={checkIfAlbumLiked} handleLikeSong={handleLikeSong} handleUnlikeSong={handleUnlikeSong} handleFollowArtist={handleFollowArtist} handleUnfollowArtist={handleUnfollowArtist} handleFollowAlbum={handleFollowAlbum} handleUnfollowAlbum={handleUnfollowAlbum} setPlaylists={setPlaylists} user={user} handlePlayTrack={handlePlayTrack} setLoading={setLoading}/>
                ) : selectedPanel === "Home" ? (
                        <Home accessToken={accessToken} setSelectedPanel={setSelectedPanel}/>
                ) : selectedPanel === "Playlists" ? (
                        <Playlists accessToken={accessToken} user={user} playlists={playlists} setPlaylists={setPlaylists} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} showDropDown={showDropDown} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} checkIfLiked={checkIfLiked} handleLikeSong={handleLikeSong} handleUnlikeSong={handleUnlikeSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} handlePlayTrack={handlePlayTrack} selectedPlaylistId={selectedPlaylistId} setSelectedPlaylistId={setSelectedPlaylistId} setLoading={setLoading}/>
                ) : selectedPanel === "Artists" ? (
                        <Artists accessToken={accessToken} setSelectedPanel={setSelectedPanel}  setSelectedAlbum={setSelectedAlbum} setSelectedArtistId={setSelectedArtistId} selectedArtistId={selectedArtistId} showPlaylistDropDown={showPlaylistDropDown} playlists={playlists} showDropDown={showDropDown} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} checkIfLiked={checkIfLiked} checkIfArtistLiked={checkIfArtistLiked} handleLikeSong={handleLikeSong} setLikedSongs={setLikedSongs} likedSongs={likedSongs} handleUnlikeSong={handleUnlikeSong} artists={artists} setArtists={setArtists} handleFollowArtist={handleFollowArtist} handleUnfollowArtist={handleUnfollowArtist} setPlaylists={setPlaylists} user={user} handlePlayTrack={handlePlayTrack} checkIfAlbumLiked={checkIfAlbumLiked} handleUnfollowAlbum={handleUnfollowAlbum} handleFollowAlbum={handleFollowAlbum} setLoading={setLoading}/>
                ) : selectedPanel === "Albums" ? (
                        <Albums accessToken={accessToken} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} playlists={playlists} showDropDown={showDropDown} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} checkIfLiked={checkIfLiked} checkIfAlbumLiked={checkIfAlbumLiked} handleLikeSong={handleLikeSong} setLikedSongs={setLikedSongs} likedSongs={likedSongs} handleUnlikeSong={handleUnlikeSong} albums={albums} setAlbums={setAlbums} handleUnfollowAlbum={handleUnfollowAlbum} setPlaylists={setPlaylists} user={user} handlePlayTrack={handlePlayTrack} setLoading={setLoading} handleFollowAlbum={handleFollowAlbum}/>
                ) : selectedPanel === "Liked" ? (
                        <Liked accessToken={accessToken} showDropDown={showDropDown} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} setSelectedArtistId={setSelectedArtistId} selectedArtistId={selectedArtistId} playlists={playlists} showPlaylistDropDown={showPlaylistDropDown} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} handleUnlikeSong={handleUnlikeSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} setPlaylists={setPlaylists} user={user} handlePlayTrack={handlePlayTrack} setLoading={setLoading}/>
                ): selectedPanel === "Profile" ? (
                        <Profile accessToken={accessToken} user={user} setUser={setUser}/>
                ): selectedPanel === "Settings" ? (
                        <Settings accessToken={accessToken} themes={themes} currentTheme={currentTheme} setTheme={setTheme} setCurrentTheme={setCurrentTheme} setThemes={setThemes} vantaChoice={vantaChoice} setVantaChoice={setVantaChoice} setEffect={setEffect}/>
                ):(
                        <p></p>
                )}
        </div>
        </>
    );
}

export default Content;