import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
/*const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";*/

function GuestThemeCreator({currentTheme, setCreatorOpened, setThemes, themes}) {
        const [buildTheme, setBuildTheme] = useState({...currentTheme, name: "New Theme"});
        const fontOptions = [
                {name: 'Montserrat', cstyle: '"Montserrat", sans-serif', weightMin: 100, weightMax: 900},
                {name: 'Roboto Mono', cstyle: '"Roboto Mono", monospace', weightMin: 100, weightMax: 700},
                {name: 'Gamja Flower', cstyle: '"Gamja Flower", sans-serif', weightMin: 400, weightMax: 400},
                {name: 'Playfair Display', cstyle: '"Playfair Display", serif', weightMin: 400, weightMax: 900}
        ];

        useEffect(() => {
                handleSetBuildTheme(buildTheme);
        }, [buildTheme]);

        const handleThemeChange = (key, value) => {
                setBuildTheme(prev => ({
                  ...prev,
                  [key]: value
                }));
              };
              
              const handleFontChange = (selectedFont) => {
                const fontMeta = fontOptions.find(font => font.cstyle === selectedFont);
                if (fontMeta) {
                  setBuildTheme(prev => ({
                    ...prev,
                    font: fontMeta.cstyle,
                    fontWeight: fontMeta.weightMin
                  }));
                }
              };

              const adjustFontWeight = (delta) => {
                const fontMeta = fontOptions.find(font => font.cstyle === buildTheme.font);
                if (!fontMeta) return;
              
                const newWeight = Math.min(
                  fontMeta.weightMax,
                  Math.max(fontMeta.weightMin, buildTheme.fontWeight + delta)
                );
              
                setBuildTheme(prev => ({
                  ...prev,
                  fontWeight: newWeight
                }));
              };


              const handleSetBuildTheme = (theme) => {
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
            };


            const createTheme = (theme) => {
                // Add the new theme to the existing themes array
                const newThemes = [...themes, theme];
                setThemes(newThemes);
                localStorage.setItem("themes", JSON.stringify(newThemes));
              };
              

    return (
        <>
            <div className='themeCreatorContentOuter'>
                <div className='themeCreatorHeader'>
                        <button onClick={()=>{handleSetBuildTheme(currentTheme);setCreatorOpened(false)}}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
                        <p className="title">Create Theme</p>
                </div>
                <div className='themeCreatorForm'>
                <div className='themeNameInputDiv'>
                        <label htmlFor="name">Name: </label>
                        <input id="name" type="text" value={buildTheme.name} onChange={(e) => handleThemeChange("name", e.target.value)}></input>
                </div>
                <div className='themeColorInputDiv'>
                        <label htmlFor="backgroundColor1">Background Color 1: </label>
                        <div className="colorInputWrapper">
                                <input id="backgroundColor1" type="color" value={buildTheme.backgroundColor1} onChange={(e) => handleThemeChange("backgroundColor1", e.target.value)}></input>
                        </div>
                </div>
                <div className='themeColorInputDiv'>
                        <label htmlFor="txtColor1">Text Color 1: </label>
                        <div className="colorInputWrapper">
                                <input id="txtColor1" type="color" value={buildTheme.txtColor1} onChange={(e) => handleThemeChange("txtColor1", e.target.value)}></input>
                        </div>
                </div>
                <div className='themeColorInputDiv'>
                        <label htmlFor="backgroundColor2">Background Color 2: </label>
                        <div className="colorInputWrapper">
                                <input id="backgroundColor2" type="color" value={buildTheme.backgroundColor2} onChange={(e) => handleThemeChange("backgroundColor2", e.target.value)}></input>
                        </div>
                </div>
                <div className='themeColorInputDiv'>
                        <label htmlFor="txtColor2">Text Color 2: </label>
                        <div className="colorInputWrapper">
                                <input id="txtColor2" type="color" value={buildTheme.txtColor2} onChange={(e) => handleThemeChange("txtColor2", e.target.value)}></input>
                        </div>
                </div>
                <div className='themeColorInputDiv'>
                        <label htmlFor="backgroundColor3">Background Color 3: </label>
                        <div className="colorInputWrapper">
                                <input id="backgroundColor3" type="color" value={buildTheme.backgroundColor3} onChange={(e) => handleThemeChange("backgroundColor3", e.target.value)}></input>
                        </div>
                </div>
                <div className='themeColorInputDiv'>
                        <label htmlFor="txtColor3">Text Color 3: </label>
                        <div className="colorInputWrapper">
                                <input id="txtColor3" type="color" value={buildTheme.txtColor3} onChange={(e) => handleThemeChange("txtColor3", e.target.value)}></input>
                        </div>
                </div>
                <div className='themeColorInputDiv'>
                        <label htmlFor="accentColor">Accent Color: </label>
                        <div className="colorInputWrapper">
                                <input id="accentColor" type="color" value={buildTheme.accentColor} onChange={(e) => handleThemeChange("accentColor", e.target.value)}></input>
                        </div>
                </div>
                <div className='themeColorInputDiv'>
                        <label htmlFor="accentTxtColor">Accent Text Color: </label>
                        <div className="colorInputWrapper">
                                <input id="accentTxtColor" type="color" value={buildTheme.accentTxtColor} onChange={(e) => handleThemeChange("accentTxtColor", e.target.value)}></input>
                        </div>
                </div>
                <div className='themeSelectInputDiv'>
                        <label htmlFor="font">Font: </label>
                        <select id="font" value={buildTheme.font} onChange={(e) => handleFontChange(e.target.value)}>
                                {fontOptions.map(font=>
                                        <option value={font.cstyle}>{font.name}</option>
                                )}
                        </select>
                </div>
                <div className='themePMInputDiv'>
                        <label htmlFor="fontWeight">Font Weight: </label>
                        <button onClick={() => adjustFontWeight(-100)}>-</button>
                        <p id="fontWeight">{buildTheme.fontWeight}</p>
                        <button onClick={() => adjustFontWeight(+100)}>+</button>
                </div>
                </div>
                <button className='settingsBtns themeCreatorBtn' onClick={()=>{createTheme(buildTheme);handleSetBuildTheme(currentTheme);setCreatorOpened(false)}}>Create</button>
            </div>
        </>
    );
}

export default GuestThemeCreator;