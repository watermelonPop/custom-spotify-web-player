import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import BottomBar from './BottomBar';
import TopContent from './TopContent';

const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function Dashboard({accessToken}) {
        const [loggedIn, setLoggedIn] = useState(false);
        const [selectedPanel, setSelectedPanel] = useState("Home"); // Home, Playlists, Liked, Artists, Albums, Search
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
                    setLoggedIn(true);
                } else {
                    setLoggedIn(false);
                }
        }, [accessToken]);

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
                

    return (
        <>
        {loggedIn ? (
                <div className='outerDashboard'>
                        <TopContent accessToken={accessToken} selectedPanel={selectedPanel} setSelectedPanel={setSelectedPanel} themes={themes} currentTheme={currentTheme} setTheme={setTheme} setCurrentTheme={setCurrentTheme} setThemes={setThemes}/>
                        <BottomBar accessToken={accessToken}/>
                </div>
        ) : (
                <p></p>
        )}
        </>
    );
}

export default Dashboard;