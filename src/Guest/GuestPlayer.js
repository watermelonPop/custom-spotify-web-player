import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faForward, faBackward, faPause, faVolumeHigh, faRepeat, faShuffle, faHouse, faList, faHeart, faPalette, faCompactDisc, faUser, faGear, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import GuestSearch from './GuestSearch';
import GuestHome from './GuestHome';
import GuestPlaylists from './GuestPlaylists';
import GuestLiked from './GuestLiked';
import GuestArtists from './GuestArtists';
import GuestAlbums from './GuestAlbums';
import GuestProfile from './GuestProfile';
import GuestSettings from './GuestSettings';
import BIRDS from 'vanta/dist/vanta.birds.min';
import NET from 'vanta/dist/vanta.net.min';
import FOG from 'vanta/dist/vanta.fog.min';
import TOPOLOGY from 'vanta/dist/vanta.topology.min';
import TRUNK from 'vanta/dist/vanta.trunk.min';
import './Guest.css';
const spotifyApi = new SpotifyWebApi();

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function GuestPlayer() {
        const [accessToken, setAccessToken] = useState(null);
        const [search, setSearch] = useState("");
        const [debouncedSearch, setDebouncedSearch] = useState("");
        const [searchResults, setSearchResults] = useState([]);
        const [selectedPanel, setSelectedPanel] = useState("Home");
        const [searchType, setSearchType] = useState("tracks");
        const playlistIds = ['30Scf1QTQUZd19VIaxUfNS', '4Bik1M6pF0Rzo86hSAqZDU'];
        const [playlists, setPlaylists] = useState([]);
        const [likedSongs, setLikedSongs] = useState([]);
        const [artistIds, setArtistIds] = useState([]);
        const [albumIds, setAlbumIds] = useState([]);
        const [albums, setAlbums] = useState([]);
        const [selectedAlbum, setSelectedAlbum] = useState(null);
        const [selectedArtistId, setSelectedArtistId] = useState(null);
        const [selectedPlaylist, setSelectedPlaylist] = useState(null);
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

        const debouncedSearchInput = useCallback(
                debounce((val) => setDebouncedSearch(val), 400), []
              );

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
                axios.get("https://custom-spotify-web-player.vercel.app/guest-token")
                  .then(res => {
                        console.log("AXXEAS TOKEN: ", res.data.accessToken);
                    setAccessToken(res.data.accessToken);
                    spotifyApi.setAccessToken(res.data.accessToken);
                  })
                  .catch(err => console.error("Failed to fetch guest token", err));
              }, []);
            
              
                useEffect(() => {
                        if (debouncedSearch === "" || !debouncedSearch) {
                                setSearchResults([]);
                                return; // ✅ Prevent running search calls when search is empty
                        }
                        if (!accessToken) return;
                        if (!spotifyApi.getAccessToken()) {
                                console.warn("Spotify access token is missing");
                                return;
                        }
                        
                        const doSearch = async () => {
                                setLoading(true);
                                try{
                                        if(searchType == "tracks"){
                                                let data = await spotifyApi.searchTracks(search, {
                                                        limit: 50
                                                });
                                                setSearchResults(data.body.tracks.items);
                                        }else if(searchType == "albums"){
                                                let data = await spotifyApi.searchAlbums(search, {
                                                        limit: 50
                                                        });
                                                setSearchResults(data.body.albums.items);
                                        }else if(searchType == "artists"){
                                                let data = await spotifyApi.searchArtists(search);
                                                setSearchResults(data.body.artists.items);
                                        }
                                }catch (err) {
                                        console.error('Error:', err);
                                }finally{
                                        setLoading(false);
                                }
                        };
                        doSearch();
                        
                }, [debouncedSearch, accessToken, searchType]);

                useEffect(() => {
                        if (!accessToken) return;
                        if (!spotifyApi.getAccessToken()) {
                          console.warn("Spotify access token is missing");
                          return;
                        }
                      
                        const fetchPlaylist = async (id) => {
                                try {
                                  const playlistMeta = await spotifyApi.getPlaylist(id);
                                  const total = playlistMeta.body.tracks.total;
                                  const limit = 100;
                                  let offset = 0;
                                  let allTracks = [];
                              
                                  while (offset < total) {
                                    const trackPage = await spotifyApi.getPlaylistTracks(id, {
                                      offset,
                                      limit,
                                    });
                                    allTracks = allTracks.concat(trackPage.body.items);
                                    offset += limit;
                                  }

                                  setLikedSongs(prevLikedSongs => {
                                        // Create a Set of existing liked track IDs for fast lookup
                                        const likedTrackIds = new Set(prevLikedSongs.map(item => item.track.id));
                                        // Filter new tracks that are not already liked
                                        const newLikedTracks = allTracks
                                          .filter(item => !likedTrackIds.has(item.track.id))
                                          .map(item => ({ track: item.track }));
                                        // Return new likedSongs array
                                        return [...prevLikedSongs, ...newLikedTracks];
                                      });

                                      setArtistIds(prevArtistIds => {
                                        const artistIdSet = new Set(prevArtistIds);
                                        const newArtistIds = allTracks
                                          .map(item => item.track.artists?.[0]?.id)
                                          .filter(id => id && !artistIdSet.has(id));
                                      
                                        // Combine and remove duplicates using Set again (just in case)
                                        return Array.from(new Set([...prevArtistIds, ...newArtistIds]));
                                      });

                                      setAlbumIds(prevAlbumIds => {
                                        const albumIdSet = new Set(prevAlbumIds);
                                        const newAlbumIds = allTracks
                                          .map(item => item.track.album?.id)
                                          .filter(id => id && !albumIdSet.has(id));
                                        return Array.from(new Set([...prevAlbumIds, ...newAlbumIds]));
                                      });
                              
                                  const fullPlaylist = {
                                    ...playlistMeta.body,
                                    tracks: {
                                      ...playlistMeta.body.tracks,
                                      items: allTracks,
                                    },
                                  };
                              
                                  console.log(`Fetched full playlist ${id}:`, fullPlaylist);
                                  return fullPlaylist;
                                } catch (err) {
                                  console.error('Error fetching full playlist:', err);
                                  return;
                                }
                              };
                              
                      
                        const fetchPlaylists = async () => {
                          // Use Promise.all to fetch all playlists in parallel
                          setLoading(true);
                          try{
                          const tempPlists = await Promise.all(
                            playlistIds.map(plistId => fetchPlaylist(plistId))
                          );
                          setPlaylists(tempPlists);
                                }catch (err) {
                                        console.error('Error fetching full playlist:', err);
                                      }finally{
                                              setLoading(false);
                                      }
                        };
                      
                        fetchPlaylists();
                      }, [accessToken]);
        
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
            }, [currentTheme, vantaChoice]);



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
              

    return (
        <>
        <div className='outerDashboard'>
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
                                <div className='guestUserInfo' onClick={()=>{setSearch("");setSelectedPanel("Profile");}}>
                                        <div className='guestInfoImgDiv'>
                                                <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                                        </div>
                                        <p>Guest</p>
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
                                                        setSelectedPlaylist(null);
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
                                                <GuestSearch accessToken={accessToken} searchType={searchType} searchResults={searchResults} setSearchResults={setSearchResults} setSearchType={setSearchType} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setSelectedAlbum={setSelectedAlbum} setSelectedArtistId={setSelectedArtistId} showDropDown={showDropDown}/>
                                        ) : selectedPanel === "Home" ? (
                                                <GuestHome setSelectedPanel={setSelectedPanel}/>
                                        ) : selectedPanel === "Playlists" ? (
                                                <GuestPlaylists accessToken={accessToken} playlists={playlists} setPlaylists={setPlaylists} showDropDown={showDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} selectedPlaylist={selectedPlaylist} setSelectedPlaylist={setSelectedPlaylist}/>
                                        ) : selectedPanel === "Artists" ? (
                                                <GuestArtists accessToken={accessToken} artistIds={artistIds} selectedArtistId={selectedArtistId} setSelectedArtistId={setSelectedArtistId} setSelectedAlbum={setSelectedAlbum} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} showDropDown={showDropDown} setLoading={setLoading}/>
                                        ) : selectedPanel === "Albums" ? (
                                                <GuestAlbums accessToken={accessToken} albumIds={albumIds} setAlbums={setAlbums} albums={albums} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} showDropDown={showDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setLoading={setLoading}/>
                                        ) : selectedPanel === "Liked" ? (
                                                <GuestLiked accessToken={accessToken} likedSongs={likedSongs} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} showDropDown={showDropDown}/>
                                        ): selectedPanel === "Profile" ? (
                                                <GuestProfile/>
                                        ): selectedPanel === "Settings" ? (
                                                <GuestSettings themes={themes} currentTheme={currentTheme} setTheme={setTheme} setCurrentTheme={setCurrentTheme} setThemes={setThemes} vantaChoice={vantaChoice} setVantaChoice={setVantaChoice} setEffect={setEffect}/>
                                        ):(
                                                <p></p>
                                        )}
                                </div>
                        </div>
                </div>
        </div>
        </>
    );
}

export default GuestPlayer;