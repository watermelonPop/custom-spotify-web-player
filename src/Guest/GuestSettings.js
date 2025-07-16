import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import GuestThemeCreator from './GuestThemeCreator';
import GuestThemeEditor from './GuestThemeEditor';
import BIRDS from 'vanta/dist/vanta.birds.min';
import NET from 'vanta/dist/vanta.net.min';
import FOG from 'vanta/dist/vanta.fog.min';
import TOPOLOGY from 'vanta/dist/vanta.topology.min';
import TRUNK from 'vanta/dist/vanta.trunk.min';
/*const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";*/

function GuestSettings({themes, currentTheme, setTheme, setCurrentTheme, setThemes, vantaChoice, setVantaChoice, setEffect}) {
    const [creatorOpened, setCreatorOpened] = useState(false);
    const [selectedEditTheme, setSelectedEditTheme] = useState(null);
    const [previousTheme, setPreviousTheme] = useState(null);
    const [birdsEffect, setBirdsEffect] = useState(null);
    const myBirdsRef = useRef(null);
    const [netEffect, setNetEffect] = useState(null);
    const myNetRef = useRef(null);
    const [fogEffect, setFogEffect] = useState(null);
    const myFogRef = useRef(null);
    const [topologyEffect, setTopologyEffect] = useState(null);
    const myTopologyRef = useRef(null);
    const [trunkEffect, setTrunkEffect] = useState(null);
    const myTrunkRef = useRef(null);


        useEffect(() => {
            if (!currentTheme || creatorOpened || selectedEditTheme) return;
        
            if (birdsEffect) {
                birdsEffect.destroy(); // 💥 Clean up previous effect
            }
            if (netEffect) {
                netEffect.destroy(); // 💥 Clean up previous effect
            }
            if (fogEffect) {
                fogEffect.destroy(); // 💥 Clean up previous effect
            }
            if (topologyEffect) {
                topologyEffect.destroy(); // 💥 Clean up previous effect
            }
            if (trunkEffect) {
                trunkEffect.destroy(); // 💥 Clean up previous effect
            }

            let newEffect = BIRDS({
                el: myBirdsRef.current,
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

            setBirdsEffect(newEffect);

            let newEffect2 = NET({
                    el: myNetRef.current,
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

            setNetEffect(newEffect2);

            let newEffect3 = FOG({
                el: myFogRef.current,
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
            
            setFogEffect(newEffect3);

            let newEffect4 = TOPOLOGY({
                el: myTopologyRef.current,
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

            setTopologyEffect(newEffect4);

            let newEffect5 = TRUNK({
                el: myTrunkRef.current,
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

                setTrunkEffect(newEffect5)
        
            return () => {
                newEffect?.destroy(); // 🧹 Clean up on unmount or change
                newEffect2?.destroy();
                newEffect3?.destroy();
                newEffect4?.destroy();
                newEffect5?.destroy();
            };
        }, [currentTheme, creatorOpened, selectedEditTheme]);

    return (
        <>
        {creatorOpened === false  && selectedEditTheme === null ? (
            <div className='settingsContentOuter'>
                    <p className='contentTitle'>Settings</p>
                    <p className="artistTitle">Themes</p>
                    <div className='themesDiv'>
                    {themes.map(theme => (
                        <div key={theme.name} className="themeDiv" onClick={() => {
                            setCurrentTheme(theme);
                            setTheme(theme); // 💥 Immediately apply and persist the theme
                        }}>
                            <div className="themeNameOverlay" style={{ fontFamily: theme.font, fontWeight: theme.fontWeight }}>
                                {theme.name}
                            </div>
                                <div className="themeColorDiv" style={{ backgroundColor: theme.backgroundColor1, color: theme.txtColor1 }}>
                                    <button onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviousTheme(currentTheme); // ⬅️ Save current theme before editing
                                            setSelectedEditTheme(theme);
                                        }}>
                                        <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
                                    </button>
                                </div>
                                <div className="themeColorDiv" style={{ backgroundColor: theme.backgroundColor2 }}></div>
                                <div className="themeColorDiv" style={{ backgroundColor: theme.backgroundColor3 }}></div>
                                <div className="themeColorDiv" style={{ backgroundColor: theme.accentColor }}>
                                </div>
                                <div className="themeColorDiv" style={{ backgroundColor: theme.txtColor1 }}></div>
                                <div className="themeColorDiv" style={{ backgroundColor: theme.txtColor2 }}></div>
                                <div className="themeColorDiv" style={{ backgroundColor: theme.txtColor3 }}></div>
                                <div className="themeColorDiv" style={{ backgroundColor: theme.accentTxtColor }}></div>
                        </div>
                ))}
                <button onClick={()=>setCreatorOpened(true)} className='settingsBtns'>+add</button>
                </div>
                <p className="artistTitle">Effects</p>
                <div className='vantaEffectOptions'>
                    <div className='effectRow'>
                        <div className='effectDiv' onClick={() =>setEffect("Off")}>
                            Off
                        </div>
                        <div className='effectDiv' ref={myBirdsRef} onClick={() =>setEffect("Birds")}>
                            Birds
                        </div>
                        <div className='effectDiv' ref={myNetRef} onClick={() =>setEffect("Net")}>
                            Net
                        </div>
                    </div>
                    <div className='effectRow'>
                        <div className='effectDiv' ref={myFogRef} onClick={() =>setEffect("Fog")}>
                            Fog
                        </div>
                        <div className='effectDiv' ref={myTopologyRef} onClick={() =>setEffect("Topology")}>
                            Topology
                        </div>
                        <div className='effectDiv' ref={myTrunkRef} onClick={() =>setEffect("Trunk")}>
                            Trunk
                        </div>
                    </div>
                </div>
                <button onClick={()=>localStorage.clear()} className='settingsBtns'>reset themes & effects</button>
            </div>
        ) : creatorOpened === true && selectedEditTheme === null ? (
            <GuestThemeCreator setCreatorOpened={setCreatorOpened} currentTheme={currentTheme} setThemes={setThemes} themes={themes}/>
        ) : creatorOpened === false && selectedEditTheme !== null ? (
            <GuestThemeEditor selectedEditTheme={selectedEditTheme} themes={themes} setThemes={setThemes} currentTheme={currentTheme} setSelectedEditTheme={setSelectedEditTheme} setCurrentTheme={setCurrentTheme} previousTheme={previousTheme}/>
        ) : (
            <p></p>
        )
        }
        </>
    );
}

export default GuestSettings;