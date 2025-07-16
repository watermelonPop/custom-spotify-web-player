import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faHeart } from '@fortawesome/free-solid-svg-icons';
import GuestSelectedArtist from './GuestSelectedArtist';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

        function formatNumber(num) {
                if (num >= 1_000_000) {
                  return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
                } else if (num >= 1_000) {
                  return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
                } else {
                  return num.toString();
                }
              }

function GuestArtists({accessToken, artistIds, selectedArtistId, setSelectedArtistId, setSelectedAlbum, setSelectedPanel, setSearch, debouncedSearchInput, showDropDown, setLoading}) {
        const [artists, setArtists] = useState([]);
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);

        useEffect(() => {
                if (!accessToken || !artistIds) return;
                if (!spotifyApi.getAccessToken()) {
                        console.warn("Spotify access token is missing");
                        return;
                }
                      const fetchArtists = async () => {
                        setLoading(true);
                        try {
                          const all = [];
                          for (let i = 0; i < artistIds.length; i += 50) {
                            const batch = artistIds.slice(i, i + 50);
                            const response = await spotifyApi.getArtists(batch);
                            all.push(...response.body.artists);
                          }
                          setArtists(all);
                        } catch (err) {
                          console.error("Error fetching artists batch:", err);
                          if (err.statusCode === 429 && err.headers?.['retry-after']) {
                            const wait = parseInt(err.headers['retry-after']) * 1000;
                            console.warn(`Rate limited. Retrying in ${wait}ms...`);
                            setTimeout(fetchArtists, wait);
                          }
                        }finally{
                                setLoading(false);
                        }
                      };
                      
                
                fetchArtists();
        }, [accessToken, artistIds]);
        

    return (
        <>
        <div className='artistsContentOuter'>
                {selectedArtistId === null ? (
                        <>
                        <p className='contentTitle'>Simone's Artists</p>
                        {artists ? artists.map(item => ( // Correctly wrap the map function
                        <div className="artistDiv" key={item?.id} onClick={()=>setSelectedArtistId(item?.id)}>
                                <img src={item?.images?.length > 0 ? item.images[0].url : ""} />
                                <div className="guestArtistInfo">
                                        <p>{item?.name}</p>
                                </div>
                                <div className="guestArtistFollowers">
                                        <p>{formatNumber(parseInt(item?.followers?.total))} followers</p>
                                </div>
                        </div>)): <p></p>}
                        </>
                ): (
                        <>
                                <GuestSelectedArtist accessToken={accessToken} selectedArtistId={selectedArtistId} setSelectedArtistId={setSelectedArtistId} setSelectedAlbum={setSelectedAlbum} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} showDropDown={showDropDown} setLoading={setLoading}/>
                        </>
                )
                }
        </div>
        </>
    );
}

export default GuestArtists;