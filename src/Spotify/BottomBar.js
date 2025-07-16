import { useState, useEffect, useCallback } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import './BottomBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faForward, faBackward, faPause, faVolumeHigh, faRepeat, faShuffle } from '@fortawesome/free-solid-svg-icons';

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

        function debounce(func, delay) {
                let timeout;
                return (...args) => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => func(...args), delay);
                };
              }

function BottomBar({accessToken}) {
        const [isPlaying, setIsPlaying] = useState(false);
                const [progressMs, setProgressMs] = useState(0);
                const [shuffleOn, setShuffleOn] = useState(false);
                const [volume, setVolume] = useState(0);
                const [repeatState, setRepeatState] = useState(null);
                const [currentSong, setCurrentSong] = useState(null);

                useEffect(() => {
                        if(!accessToken) return;
                        console.log("ACCESS: ", accessToken);
                        if (accessToken) {
                            spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                        }
                }, [accessToken]);


        useEffect(() => {
                if (!accessToken) return;
                if (!spotifyApi.getAccessToken()) {
                        console.warn("Spotify access token is missing");
                        return;
                }
                //alert("SEC");
                const checkPlaybackState = () => {
                        spotifyApi.getMyCurrentPlaybackState()
                        .then(function(data) {
                        // Output items
                                if (data.body && data.body.is_playing) {
                                        console.log("User is currently playing something!");
                                        setIsPlaying(true);
                                } else {
                                        setIsPlaying(false);
                                        console.log("User is not playing anything, or doing so in private.");
                                }
                                if (data.body && data.body.shuffle_state !== undefined) {
                                    setShuffleOn(data.body.shuffle_state);
                                }
                                if(data.body && data.body.device.volume_percent !== undefined){
                                        //alert("HELLO");
                                        setVolume(data.body.device.volume_percent);
                                        if(document.getElementById("volume") !== null){
                                            document.getElementById("volume").style.setProperty('--value', `${volume}%`);
                                        }
                                }
                                if(data.body && data.body.repeat_state !== undefined){
                                        setRepeatState(data.body.repeat_state);
                                }
                                if(data.body && data.body.progress_ms !== undefined){
                                    setProgressMs(data.body.progress_ms);
                                }
                        }, function(err) {
                                console.log('Something went wrong!', err);
                        });
                };

                checkPlaybackState();

                // Set up an interval to check every second
                const intervalId = setInterval(checkPlaybackState, 1000);

                // Clean up function to clear the interval when the component unmounts or accessToken changes
                return () => clearInterval(intervalId);
        }, [accessToken]);



    useEffect(() => {
        if (!accessToken) return;
        if (!spotifyApi.getAccessToken()) {
            console.warn("Spotify access token is missing");
            return;
        }
    
        const fetchCurrentTrack = async () => {
            //title: data.body.item.name
            //artist: data.body.item.artists[0].name
            //isliked
            //length: data.body.item.duration_ms
            try {
                const data = await spotifyApi.getMyCurrentPlayingTrack();
                if (data.body && data.body.item) {
                    console.log('Now playing: ' + data.body.item.name);
                    setCurrentSong(data.body.item);
                } else {
                    console.log('No track currently playing');
                    setCurrentSong(null);
                }
            } catch (err) {
                console.error('Error fetching current track:', err);
            }
        };
    
        fetchCurrentTrack();
    
        // Set up an interval to check the current track every 5 seconds
        const interval = setInterval(fetchCurrentTrack, 1000);
    
        // Cleanup function to clear the interval when the component unmounts or accessToken changes
        return () => clearInterval(interval);
         }, [accessToken, isPlaying]); // Only re-run the effect if accessToken changes


    const pause = () => {
        if (!accessToken) return;
        if (!spotifyApi.getAccessToken()) {
            console.warn("Spotify access token is missing");
            return;
        }
        spotifyApi.pause()
        .then(function() {
                console.log('Playback paused');
                setIsPlaying(false);
        }, function(err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
        });
    };

    const play = () => {
        if (!accessToken) return;
        if (!spotifyApi.getAccessToken()) {
            console.warn("Spotify access token is missing");
            return;
        }
        spotifyApi.play()
        .then(function() {
                console.log('Playback started');
                setIsPlaying(true);
        }, function(err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
        });
    };


    const previous = () => {
        if (!accessToken) return;
        if (!spotifyApi.getAccessToken()) {
            console.warn("Spotify access token is missing");
            return;
        }
        spotifyApi.skipToPrevious()
        .then(function() {
                console.log('Skip to previous');
                setCurrentSong(null);
        }, function(err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
        });
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
                setCurrentSong(null);
        }, function(err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
        });
    };

    const toggleShuffle = () => {
        if (!spotifyApi.getAccessToken()) {
            console.warn("Spotify access token is missing");
            return;
        }
        spotifyApi.setShuffle(!shuffleOn)
        .then(function() {
                setShuffleOn(!shuffleOn);
        }, function  (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
        });
    };


    const handleSetRepeatState = (val) => {
        spotifyApi.setRepeat(val)
        .then(function () {
                setRepeatState(val);
                console.log('Repeat track.');
        }, function(err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
        });
};

    const toggleRepeatState = () => {
        if(repeatState == "off"){
                handleSetRepeatState("context");
        }else if(repeatState == "context"){
                handleSetRepeatState("track");
        }else if(repeatState == "track"){
                handleSetRepeatState("off");
        }
};


const debouncedSetVolume = useCallback(
        debounce((newVolume) => {
          if (!accessToken || !spotifyApi.getAccessToken()) return;
          spotifyApi.setVolume(newVolume)
            .then(() => {
              console.log(`Volume set to ${newVolume}`);
            })
            .catch((err) => {
              console.error('Error setting volume:', err?.body?.error || err);
            });
        }, 300), // wait 300ms after user stops dragging
        [accessToken]
      );
      
      const handleVolumeChange = useCallback((newVolume) => {
        setVolume(newVolume);
        debouncedSetVolume(newVolume);
      }, [debouncedSetVolume]);



  const debouncedSeek = useCallback(
        debounce((newProgress) => {
          if (!accessToken || !spotifyApi.getAccessToken()) return;
          spotifyApi.seek(newProgress)
            .then(() => {
              console.log('Seeked to ' + newProgress);
            })
            .catch((err) => {
              console.error('Error seeking track:', err?.body?.error || err);
            });
        }, 300),
        [accessToken]
      );
    
      const handleProgressChange = useCallback((newProgress) => {
        setProgressMs(newProgress);
        debouncedSeek(newProgress);
      }, [debouncedSeek]);

    return (
        <>
        <div className='bottomBarOuter'>
                {accessToken ? (
                        <>
                        <div className='songInfoControls'>
                                <img className='currentSongImg' src={currentSong?.album.images[0].url}></img>
                                <div className='currentSongTxt'>
                                        <p className='currentSongTitle'>{currentSong?.name}</p>
                                        <p className='currentSongArtist'>{currentSong?.artists[0].name}</p>
                                </div>
                        </div>
                        <div className='middleControls'>
                                <div className='middleControlsTop'>
                                        <p>{currentSong ? msToMinutesAndSeconds(progressMs): "0:00"}</p>
                                        <input type="range" value={progressMs} min="0" max={currentSong ? currentSong.duration_ms: "100"} onChange={(e) => debouncedSeek(e.target.value)}></input>
                                        <p>{currentSong ? msToMinutesAndSeconds(currentSong.duration_ms): "0:00"}</p>
                                </div>
                                <div className='middleControlsBott'>
                                        <button onClick={toggleShuffle} className={"shuffle-" + shuffleOn}><FontAwesomeIcon icon={faShuffle}></FontAwesomeIcon></button>
                                        <button onClick={previous}><FontAwesomeIcon icon={faBackward}></FontAwesomeIcon></button>
                                        <button onClick={isPlaying ? pause : play}>
                                                {isPlaying ? <FontAwesomeIcon icon={faPause}></FontAwesomeIcon> : <FontAwesomeIcon icon={faPlay}></FontAwesomeIcon>}
                                        </button>
                                        <button onClick={next}><FontAwesomeIcon icon={faForward}></FontAwesomeIcon></button>
                                        <button className={"repeat-" + repeatState} onClick={toggleRepeatState}>
                                                {repeatState === "track" ? "1" : <FontAwesomeIcon icon={faRepeat}></FontAwesomeIcon>}
                                        </button>
                                </div>
                        </div>
                        <div className='rightControls'>
                                <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
                                <input id="volume" type="range" value={volume} min="0" max="100" onChange={(e) => debouncedSetVolume(e.target.value)}></input>
                        </div>
                        </>
                ) : (
                        <p></p>
                )
                }
        </div>
        </>
    );
}

export default BottomBar;