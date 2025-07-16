import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faForward, faBackward, faPause, faVolumeHigh, faRepeat, faShuffle, faHouse, faList, faHeart, faPalette, faCompactDisc, faUser, faGear, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import SpotifyWebApi from "spotify-web-api-node";
import FreeHome from './FreeHome';
import FreeProfile from './FreeProfile';
import FreeSearch from './FreeSearch';
import FreeSettings from './FreeSettings';
import FreePlaylists from './FreePlaylists';
import FreeArtists from './FreeArtists';
import FreeAlbums from './FreeAlbums';
import FreeLiked from './FreeLiked';
import BIRDS from 'vanta/dist/vanta.birds.min';
import NET from 'vanta/dist/vanta.net.min';
import FOG from 'vanta/dist/vanta.fog.min';
import TOPOLOGY from 'vanta/dist/vanta.topology.min';
import TRUNK from 'vanta/dist/vanta.trunk.min';
import './Free.css';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

        function debounce(func, delay) {
                let timeout;
                return (...args) => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => func(...args), delay);
                };
        }
function FreeDashboard({accessToken}) {
        const [search, setSearch] = useState("");
        const [debouncedSearch, setDebouncedSearch] = useState("");
        const [searchType, setSearchType] = useState("tracks");
        const [user, setUser] = useState(null);
        const [searchResults, setSearchResults] = useState([]);
        const [selectedPanel, setSelectedPanel] = useState("Home");
        const [playlists, setPlaylists] = useState([]);
        const [artists, setArtists] = useState([]);
        const [albums, setAlbums] = useState([]);
        const [likedSongs, setLikedSongs] = useState([]);
        const [selectedAlbum, setSelectedAlbum] = useState(null);
        const [selectedArtistId, setSelectedArtistId] = useState(null);
        const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
        const [loading, setLoading] = useState(false);

        const [vantaEffect, setVantaEffect] = useState(null);
        const [vantaChoice, setVantaChoice] = useState(() => {
                const stored = localStorage.getItem("vantaChoice");
                if (stored) return stored;
                return "Birds";
        });
        const myRef = useRef(null);
        const defaultThemes = [
                {
                    name: "default", 
                    font: '"Montserrat", sans-serif', 
                    fontWeight: 700, 
                    backgroundColor1: "#121212", 
                    backgroundColor2: "#212121", 
                    backgroundColor3:"#535353", 
                    accentColor: "#4B825E", 
                    txtColor1: "#FFFFFF", 
                    txtColor2:"#FFFFFF", 
                    txtColor3:"#FFFFFF", 
                    accentTxtColor: "#000000"
                },
                {
                    name: "strawberry", 
                    font: '"Roboto Mono", monospace', 
                    fontWeight: 600, 
                    backgroundColor1: "#92C786", 
                    backgroundColor2: "#FCF8EA", 
                    backgroundColor3:"#FCF8EA", 
                    accentColor: "#FD9E9E", 
                    txtColor1: "#000000", 
                    txtColor2:"#000000", 
                    txtColor3:"#000000", 
                    accentTxtColor: "#000000"
                },
                {
                    name: "tteok", 
                    font: '"Gamja Flower", sans-serif', 
                    fontWeight: 600, 
                    backgroundColor1: "#F4ACB7", 
                    backgroundColor2: "#FFE5D9", 
                    backgroundColor3:"#9D8189", 
                    accentColor: "#D8E2DC", 
                    txtColor1: "#000000", 
                    txtColor2:"#000000", 
                    txtColor3:"#FFE5D9", 
                    accentTxtColor: "#000000"
                },
                {
                    name: "pj", 
                    font: '"Playfair Display", serif', 
                    fontWeight: 700, 
                    backgroundColor1: "#0D1B2A", 
                    backgroundColor2: "#415A77", 
                    backgroundColor3:"#778DA9", 
                    accentColor: "#00524B", 
                    txtColor1: "#E0E1DD", 
                    txtColor2:"#E0E1DD", 
                    txtColor3:"#000000", 
                    accentTxtColor: "#E0E1DD"
                }
            ];

            const [themes, setThemes] = useState(() => {
                const stored = localStorage.getItem("themes");
                return stored ? JSON.parse(stored) : defaultThemes;
              });
        
              const [currentTheme, setCurrentTheme] = useState(() => {
                const stored = localStorage.getItem("currentTheme");
                if (stored) return JSON.parse(stored);
                return themes[0];
              });

              useEffect(() => {
                localStorage.setItem("themes", JSON.stringify(themes));
              }, [themes]);
              
        
              useEffect(() => {
                const stored = localStorage.getItem("currentTheme");
                if (stored) {
                  const theme = JSON.parse(stored);
                  setCurrentTheme(theme);
                  setTheme(theme); // 🧠 make sure theme is applied on mount
                }
              }, []);
        
        useEffect(() => {
                if(!accessToken) return;
                console.log("ACCESS: ", accessToken);
                if (accessToken) {
                        spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                }
        }, [accessToken]);

        const debouncedSearchInput = useCallback(
                debounce((value) => {
                        setDebouncedSearch(value);
                }, 400),
                []
        );

        useEffect(() => {
                if (!accessToken) return;
                
                const fetchUserData = async () => {
                        setLoading(true);
                        try {
                        const response = await fetch("https://api.spotify.com/v1/me", {
                                method: "GET",
                                headers: { Authorization: `Bearer ${accessToken}` },
                        });
                
                        if (!response.ok) {
                                throw new Error('Network response was not ok');
                        }
                
                        const data = await response.json();
                        //alert(data.display_name); // Process the user data as needed
                        if(data){
                                console.log("USER: ", data);
                                setUser(data);
                        }
                        } catch (err) {
                        console.error('Error fetching user data:', err);
                        }finally{
                                setLoading(false);
                        }
                };
                
                fetchUserData();
        }, [accessToken]);

        useEffect(() => {
                if (debouncedSearch === "" || !debouncedSearch) {
                  setSearchResults([]);
                  setLoading(false); // Not loading if search is empty
                  return;
                }
                if (!accessToken) return;
                if (!spotifyApi.getAccessToken()) {
                  console.warn("Spotify access token is missing");
                  return;
                }
              
                const doSearch = async () => {
                  setLoading(true);
                  try {
                    if (searchType === "tracks") {
                      const data = await spotifyApi.searchTracks(search, { limit: 50 });
                      const items = data.body.tracks.items;
                      const ids = items.map(track => track.id).filter(Boolean);
                      const chunkedIds = [];
                      for (let i = 0; i < ids.length; i += 50) {
                        chunkedIds.push(ids.slice(i, i + 50));
                      }
                      const likedStatusChunks = await Promise.all(
                        chunkedIds.map(chunk => checkIfLiked(chunk))
                      );
                      const likedStatusArray = likedStatusChunks.flat();
                      const itemsWithLiked = items.map((item, i) => ({
                        ...item,
                        liked: likedStatusArray[i],
                      }));
                      setSearchResults(itemsWithLiked);
              
                    } else if (searchType === "albums") {
                      const data = await spotifyApi.searchAlbums(search, { limit: 50 });
                      const items = data.body.albums.items;
                      const ids = items.map(album => album.id).filter(Boolean);
                      const chunkedIds = [];
                      for (let i = 0; i < ids.length; i += 20) {
                        chunkedIds.push(ids.slice(i, i + 20));
                      }
                      const likedStatusChunks = await Promise.all(
                        chunkedIds.map(chunk => checkIfAlbumLiked(chunk))
                      );
                      const likedStatusArray = likedStatusChunks.flat();
                      const itemsWithLiked = items.map((item, i) => ({
                        ...item,
                        liked: likedStatusArray[i],
                      }));
                      setSearchResults(itemsWithLiked);
              
                    } else if (searchType === "artists") {
                      const data = await spotifyApi.searchArtists(search);
                      const items = data.body.artists.items;
                      const ids = items.map(artist => artist.id).filter(Boolean);
                      const chunkedIds = [];
                      for (let i = 0; i < ids.length; i += 50) {
                        chunkedIds.push(ids.slice(i, i + 50));
                      }
                      const likedStatusChunks = await Promise.all(
                        chunkedIds.map(chunk => checkIfArtistLiked(chunk))
                      );
                      const likedStatusArray = likedStatusChunks.flat();
                      const itemsWithLiked = items.map((item, i) => ({
                        ...item,
                        liked: likedStatusArray[i],
                      }));
                      setSearchResults(itemsWithLiked);
                    }
                  } catch (err) {
                    console.error(err);
                    setSearchResults([]); // Optionally clear results on error
                  } finally {
                    setLoading(false);
                  }
                };
              
                doSearch();
              }, [debouncedSearch, accessToken, searchType]);
              


                useEffect(() => {
                                if (!accessToken || !user || !user.id) return;
                                if (!spotifyApi.getAccessToken()) {
                                    console.warn("Spotify access token is missing");
                                    return;
                                }
                                
                                const fetchPlaylists = async () => {
                                        setLoading(true);
                                        try{
                                                let data = await spotifyApi.getUserPlaylists(user.id);
                                                setPlaylists(data.body.items);
                                        }catch (err) {
                                                console.error(err);
                                        } finally {
                                                setLoading(false);
                                        }
                                };
                                
                                fetchPlaylists();
                        }, [accessToken, user]);

                        useLayoutEffect(() => {
                                console.log("REF: ", myRef.current);
                                if (!myRef.current || !currentTheme || !vantaChoice) return;
                            
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
                            }, [currentTheme, vantaChoice, myRef.current]);
                
                
                
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
                        
                
                
                                      const setTheme = (theme) => {
                                        var r = document.querySelector(':root');
                                        r.style.setProperty('--backgroundColor1', theme.backgroundColor1);
                                        r.style.setProperty('--backgroundColor2', theme.backgroundColor2);
                                        r.style.setProperty('--backgroundColor3', theme.backgroundColor3);
                                        r.style.setProperty('--accentColor', theme.accentColor);
                                        r.style.setProperty('--txtColor1', theme.txtColor1);
                                        r.style.setProperty('--txtColor2', theme.txtColor2);
                                        r.style.setProperty('--txtColor3', theme.txtColor3);
                                        r.style.setProperty('--accentTxtColor', theme.accentTxtColor);
                                        r.style.setProperty('--fontFamily', theme.font);
                                        r.style.setProperty('--fontWeight', theme.fontWeight);
                                        localStorage.setItem("currentTheme", JSON.stringify(theme));
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


        const checkIfArtistLiked = async (ids) => {
                //max: 50
                try {
                    let idsStr = "";
                    for (let i = 0; i < ids.length; i++) {
                        idsStr += ids[i];
                        if (i < ids.length - 1) {
                            idsStr += "%2C";
                        }
                    }
            
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


        
                const checkIfLiked = async (ids) => {
                        //max: 50
                        try {
                            let idsStr = "";
                            for (let i = 0; i < ids.length; i++) {
                                idsStr += ids[i];
                                if (i < ids.length - 1) {
                                    idsStr += "%2C";
                                }
                            }
                    
                            const response = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${idsStr}`, {
                                method: "GET",
                                headers: { Authorization: `Bearer ${accessToken}` },
                            });
                    
                            if (!response.ok) {
                                throw new Error('Failed to check liked songs');
                            }
                    
                            const data = await response.json();
                            console.log("CHECK: ", data);
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
                        //setLikedSongs([...likedSongs, { track }]);
                }, function(err) {
                        console.log('Something went wrong!', err);
                });
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
                                        //setAlbums(data.body.items);
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
                console.log(album);
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
                                        //setAlbums(data.body.items);
                                      }, function(err) {
                                        console.log('Something went wrong!', err);
                                      });
                        }
                } catch (err) {
                        console.error('Failed to unfollow Album: ', err);
                }
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


    return (
        <>
        <div className='outerDashboard'>
                {user ? (
                        <>
                <div className='freeTopContentOuter'>
                        <div className='topBarOuter'>
                                <p className='spotifyTitle'><FontAwesomeIcon icon={faSpotify}></FontAwesomeIcon>Spotify</p>
                                <div className='searchBarOuter'>
                                        <p><FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>Search</p><input value={search} onChange={(e) => {
                                        setSearch(e.target.value);
                                        debouncedSearchInput(e.target.value);
                                        }}></input>
                                        <button onClick={()=> setSearch("")}>x</button>
                                </div>
                                <div className='userInfo' onClick={()=>{setSearch(""); setSelectedPanel("Profile");}}>
                                        {user?.images?.length > 0 ? (
                                                <>
                                                <div className='userInfoImgDiv'>
                                                        <img src={user.images[0].url}></img>
                                                </div>
                                                </>
                                        ):(
                                                <>
                                                <div className='guestInfoImgDiv'>
                                                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                                                </div>
                                                </>
                                        )}
                                        <p>{user.display_name}</p>
                                </div>
                        </div>
                        <div className='rightContent'>
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
                                        <FreeSearch accessToken={accessToken} searchType={searchType} searchResults={searchResults} setSearchType={setSearchType} handleFollowAlbum={handleFollowAlbum} handleUnfollowAlbum={handleUnfollowAlbum} setSearchResults={setSearchResults} handleLikeSong={handleLikeSong} handleUnlikeSong={handleUnlikeSong} handleFollowArtist={handleFollowArtist} handleUnfollowArtist={handleUnfollowArtist} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setPlaylists={setPlaylists} user={user} showDropDown={showDropDown}/>
                                ) : selectedPanel === "Home" ? (
                                        <FreeHome accessToken={accessToken} setSelectedPanel={setSelectedPanel}/>
                                ) : selectedPanel === "Playlists" ? (
                                        <FreePlaylists accessToken={accessToken} user={user} playlists={playlists} setPlaylists={setPlaylists} checkIfLiked={checkIfLiked} handleLikeSong={handleLikeSong} handleUnlikeSong={handleUnlikeSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} showDropDown={showDropDown} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} selectedPlaylistId={selectedPlaylistId} setSelectedPlaylistId={setSelectedPlaylistId} setLoading={setLoading}/>
                                ) : selectedPanel === "Artists" ? (
                                        <FreeArtists accessToken={accessToken}  setSelectedPanel={setSelectedPanel} checkIfArtistLiked={checkIfArtistLiked} handleLikeSong={handleLikeSong} handleUnlikeSong={handleUnlikeSong} artists={artists} setArtists={setArtists} handleUnfollowArtist={handleUnfollowArtist} setPlaylists={setPlaylists} user={user} setSelectedAlbum={setSelectedAlbum} checkIfLiked={checkIfLiked} checkIfAlbumLiked={checkIfAlbumLiked} handleUnfollowAlbum={handleUnfollowAlbum} handleFollowAlbum={handleFollowAlbum} setSearchResults={setSearchResults} selectedArtistId={selectedArtistId} setSelectedArtistId={setSelectedArtistId} showDropDown={showDropDown} showPlaylistDropDown={showPlaylistDropDown} playlists={playlists} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setLoading={setLoading} handleFollowArtist={handleFollowArtist}/>
                                ) : selectedPanel === "Albums" ? (
                                        <FreeAlbums accessToken={accessToken} playlists={playlists} albums={albums} setAlbums={setAlbums} handleUnfollowAlbum={handleUnfollowAlbum} setPlaylists={setPlaylists} user={user} checkIfLiked={checkIfLiked} checkIfAlbumLiked={checkIfAlbumLiked} handleLikeSong={handleLikeSong} handleUnlikeSong={handleUnlikeSong} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} showDropDown={showDropDown} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setLoading={setLoading} handleFollowAlbum={handleFollowAlbum}/>
                                ) : selectedPanel === "Liked" ? (
                                        <FreeLiked accessToken={accessToken} setSelectedPanel={setSelectedPanel} playlists={playlists} handleUnlikeSong={handleUnlikeSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} showPlaylistDropDown={showPlaylistDropDown} setSelectedArtistId={setSelectedArtistId} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setPlaylists={setPlaylists} user={user} showDropDown={showDropDown} setLoading={setLoading}/>
                                ): selectedPanel === "Profile" ? (
                                        <FreeProfile accessToken={accessToken} user={user}/>
                                ): selectedPanel === "Settings" ? (
                                        <FreeSettings accessToken={accessToken} themes={themes} currentTheme={currentTheme} setTheme={setTheme} setCurrentTheme={setCurrentTheme} setThemes={setThemes} vantaChoice={vantaChoice} setVantaChoice={setVantaChoice} setEffect={setEffect}/>
                                ):(
                                        <p></p>
                                )}
                                </div>
                        </div>
                </div>
                </>
                ):(
                        <p></p>
                )}
        </div>
        </>
    );
}

export default FreeDashboard;