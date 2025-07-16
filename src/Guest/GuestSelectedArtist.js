import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsisVertical, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GuestSongDropdownMenu from './GuestSongDropdownMenu';
import GuestAlbumDropdownMenu from './GuestAlbumDropdownMenu';
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

            function formatNumber(num) {
                if (num >= 1_000_000) {
                  return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
                } else if (num >= 1_000) {
                  return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
                } else {
                  return num.toString();
                }
              }

function GuestSelectedArtist({accessToken, selectedArtistId, setSelectedArtistId, setSelectedAlbum, setSelectedPanel, setSearch, debouncedSearchInput, showDropDown, setLoading}) {
        //setPanel
        //setSelectedAlbum
        const [selectedArtist, setSelectedArtist] = useState(null);
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);

        useEffect(() => {
                if (!accessToken || !selectedArtistId) return;
              
                const fetchArtistData = async () => {
                        setLoading(true);
                  try {
                    spotifyApi.setAccessToken(accessToken);
              
                    const [artistData, topTracksData, albumsData] = await Promise.all([
                      spotifyApi.getArtist(selectedArtistId),
                      fetch(`https://api.spotify.com/v1/artists/${selectedArtistId}/top-tracks?market=US`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      }).then(res => res.json()),
                      fetch(`https://api.spotify.com/v1/artists/${selectedArtistId}/albums?limit=20`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      }).then(res => res.json())
                    ]);
              
                    const topTracks = topTracksData.tracks ? topTracksData.tracks.slice(0, 5) : [];
                    const albums = albumsData.items || [];
        
                    setSelectedArtist({
                      ...artistData.body,
                      topTracks,
                      albums,
                    });
                  } catch (err) {
                    console.error("Error fetching artist data:", err);
                    if (err.status === 429) {
                      alert("Rate limit exceeded. Please try again later.");
                    }
                  }finally{
                        setLoading(false);
                  }
                };
              
                const timeout = setTimeout(fetchArtistData, 200); // Debounce to reduce rapid calls
              
                return () => clearTimeout(timeout);
        }, [accessToken, selectedArtistId]);
              
        
        const handleAlbumClick = async (album) => {
                try {
                        spotifyApi.setAccessToken(accessToken);
                        const data = await spotifyApi.getAlbum(album.id);
                        setSelectedAlbum(data.body); // set the full album with tracks
                        setSelectedPanel("Albums");

                        setSearch("");
                        debouncedSearchInput("");
                } catch (err) {
                  console.error("Failed to load album", err);
                }
        };

    return (
        <>
        <div className='selectedArtistContentOuter'>
        {selectedArtist && selectedArtist.topTracks && selectedArtist.albums ? ( // Check if results array has items
        <>
                        <div className="selectedArtistHeader">
                                <button onClick={()=>setSelectedArtistId(null)}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
                                <img src={selectedArtist.images[0].url} />
                                <div className='selectedArtistInfo'>
                                        <p className="title">{selectedArtist.name}</p>
                                        <p className="subtitle">{formatNumber(selectedArtist.followers.total)} followers</p>
                                </div>
                        </div>
                        <p className="artistTitle">Top Songs</p>
                        {selectedArtist.topTracks ? selectedArtist.topTracks.map(track => ( // Correctly wrap the map function
                                <div className='songDiv'>
                                                                                <img src={track.album.images[0] ? track.album.images[0].url : ""}></img>
                                                                                <div className='trackMainInfo'>
                                                                                        <p>{track.name}</p>
                                                                                        <p>{track.artists[0].name}</p>
                                                                                </div>
                                                                                <div className='trackAlbumName'>
                                                                                        <p>{track.album.name}</p>
                                                                                </div>
                                                                                <div className='trackDuration'>
                                                                                        <p>{msToMinutesAndSeconds(track.duration_ms)}</p>
                                                                                </div>
                                                                                <div className='trackMoreBtn'>
                                                                                        <button onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                showDropDown(track.id, e);
                                                                                        }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                                                        <GuestSongDropdownMenu accessToken={accessToken} track={track} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSelectedAlbum={setSelectedAlbum} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} />
                                                                                </div>
                                                                                </div>
                        )): <p></p>}
                        <p className="artistTitle">Albums</p>
                        {selectedArtist.albums.map(item => (
                                <div className="albumDiv" key={item.id} onClick={()=>handleAlbumClick(item)}
                                      >
                                        <img src={item.images.length > 0 ? item.images[0].url : ""} alt={item.name} />
                                        <div className="albumInfo">
                                                <p>{item.name}</p>
                                                <p>{item.artists[0].name}</p>
                                        </div>
                                        <div className='albumMore'>
                                                <button onClick={(e) => {
                                        e.stopPropagation();
                                        showDropDown(item.id, e);
                                        }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                        <GuestAlbumDropdownMenu accessToken={accessToken} album={item} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} />
                                        </div>
                                </div>
                        ))}
                </>
        ) : (
                <div></div>
        )}
        </div>
        </>
    );
}

export default GuestSelectedArtist;