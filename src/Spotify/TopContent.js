import { useState, useEffect, useCallback } from 'react';
import './TopContent.css';
import TopBar from './TopBar';
import SideBar from './SideBar';
import Content from './Content';
import SpotifyWebApi from "spotify-web-api-node";
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

function TopContent({accessToken, selectedPanel, setSelectedPanel, themes,currentTheme,setTheme, setCurrentTheme, setThemes}) {
        const [search, setSearch] = useState("");
        const [debouncedSearch, setDebouncedSearch] = useState("");
        const [searchType, setSearchType] = useState("tracks");
        const [user, setUser] = useState(null);
        const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
        const [selectedArtistId, setSelectedArtistId] = useState(null);
        const [selectedAlbum, setSelectedAlbum] = useState(null);
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
                    }
                };
                
                fetchUserData();
        }, [accessToken]);
        

    return (
        <>
        <div className='topContentOuter'>
                <TopBar accessToken={accessToken} search={search} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} user={user} setSelectedPanel={setSelectedPanel}/>
                <div className='rightContent'>
                        <SideBar accessToken={accessToken} setSelectedPanel={setSelectedPanel} setSearch={setSearch} setSelectedPlaylistId={setSelectedPlaylistId} setSelectedArtistId={setSelectedArtistId} setSelectedAlbum={setSelectedAlbum} selectedPanel={selectedPanel}/>
                        <Content accessToken={accessToken} selectedPanel={selectedPanel} setSelectedPanel={setSelectedPanel} search={search} debouncedSearch={debouncedSearch} searchType={searchType} user={user} setUser={setUser} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setSearchType={setSearchType} setSelectedPlaylistId={setSelectedPlaylistId} selectedPlaylistId={selectedPlaylistId} setSelectedArtistId={setSelectedArtistId} selectedArtistId={selectedArtistId} setSelectedAlbum={setSelectedAlbum} selectedAlbum={selectedAlbum} themes={themes} currentTheme={currentTheme} setTheme={setTheme} setCurrentTheme={setCurrentTheme} setThemes={setThemes}/>
                </div>
        </div>
        </>
    );
}

export default TopContent;