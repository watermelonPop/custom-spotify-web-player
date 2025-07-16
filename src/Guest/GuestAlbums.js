import { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-node";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faHeart } from '@fortawesome/free-solid-svg-icons';
import GuestSelectedAlbum from './GuestSelectedAlbum';
import GuestAlbumDropdownMenu from './GuestAlbumDropdownMenu';
const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;    
        const spotifyApi = new SpotifyWebApi({
        clientId: spotify_client_id,
        });
        var spotify_redirect_uri = "http://127.0.0.1:3000";

function GuestAlbums({accessToken, albumIds, albums, setAlbums, selectedAlbum, setSelectedAlbum, showDropDown, setSelectedArtistId, setSelectedPanel, setSearch, debouncedSearchInput, setLoading}) {
        const [newReleases, setNewReleases] = useState([]);
        useEffect(() => {
                                if(!accessToken) return;
                                console.log("ACCESS: ", accessToken);
                                if (accessToken) {
                                    spotifyApi.setAccessToken(accessToken);  // ✅ this is critical
                                }
        }, [accessToken]);



        useEffect(() => {
                if (!accessToken) return;
                
                const fetchAlbums = async () => {
                        setLoading(true);
                        try {
                            const all = [];
                            for (let i = 0; i < albumIds.length; i += 20) {
                                const batch = albumIds.slice(i, i + 20);
                                const response = await spotifyApi.getAlbums(batch);
                                all.push(...response.body.albums);
                            }
                    
                            // Deduplicate albums by ID
                            const uniqueAlbumsMap = new Map();
                            all.forEach(album => {
                                if (album?.id && !uniqueAlbumsMap.has(album.id)) {
                                    uniqueAlbumsMap.set(album.id, album);
                                }
                            });
                    
                            const deduplicatedAlbums = Array.from(uniqueAlbumsMap.values());
                            console.log("Deduplicated Albums:", deduplicatedAlbums);
                            setAlbums(deduplicatedAlbums);
                        } catch (err) {
                            console.error("Error fetching albums:", err);
                            if (err.statusCode === 429 && err.headers?.['retry-after']) {
                                const wait = parseInt(err.headers['retry-after']) * 1000;
                                console.warn(`Rate limited. Retrying in ${wait}ms...`);
                                setTimeout(fetchAlbums, wait);
                            }
                        } finally {
                            setLoading(false);
                        }
                    };
                    
                
                fetchAlbums();
        }, [accessToken]);



        useEffect(() => {
                if (!accessToken) return;
                
                const fetchNewReleases = async () => {
                        setLoading(true);
                        try{
                        let data = await spotifyApi.getNewReleases({ limit : 5 });
                        let data2 = await fetchAlbums(data.body.albums.items.map(item=>item.id));
                        }catch (err) {
                                console.error("Error:", err);
                        }finally{
                                setLoading(false);
                        }
                };

                const fetchAlbums = async (ids) => {
                        try {
                                const all = [];
                                for (let i = 0; i < ids.length; i += 20) {
                                  const batch = ids.slice(i, i + 20);
                                  const response = await spotifyApi.getAlbums(batch);
                                  all.push(...response.body.albums);
                                }
                                console.log("ALBUMS: ", all);
                                setNewReleases(all);
                        } catch (err) {
                                console.error("Error fetching artists batch:", err);
                                if (err.statusCode === 429 && err.headers?.['retry-after']) {
                                  const wait = parseInt(err.headers['retry-after']) * 1000;
                                  console.warn(`Rate limited. Retrying in ${wait}ms...`);
                                  setTimeout(fetchAlbums, wait);
                                }
                        }
                };
                
                fetchNewReleases();
        }, [accessToken]);
        

    return (
        <>
        <div className='albumsContentOuter'>
                {selectedAlbum === null ? (
                <>
                        <p className='contentTitle'>New Releases</p>
                        {newReleases ? newReleases.map(item => ( // Correctly wrap the map function
                                <div className="albumDiv" key={item?.id} onClick={()=>setSelectedAlbum(item)}>
                                        <img src={item?.images?.length > 0 ? item.images[0].url : ""} />
                                        <div className="albumInfo">
                                                <p>{item?.name}</p>
                                                <p>{item?.artists[0].name}</p>
                                        </div>
                                        <div className="albumMore">
                                                <button onClick={(e) => {
                                                e.stopPropagation();
                                                showDropDown(item?.id, e);
                                                }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                <GuestAlbumDropdownMenu accessToken={accessToken} album={item} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} />
                                        </div>
                                </div>
                        )): <p></p>}
                        <p className='contentTitle'>Simone's Albums</p>
                        {albums ? albums.map(item => ( // Correctly wrap the map function
                                <div className="albumDiv" key={item?.id} onClick={()=>setSelectedAlbum(item)}>
                                        <img src={item?.images?.length > 0 ? item.images[0].url : ""} />
                                        <div className="albumInfo">
                                                <p>{item?.name}</p>
                                                <p>{item?.artists[0].name}</p>
                                        </div>
                                        <div className="albumMore">
                                                <button onClick={(e) => {
                                                e.stopPropagation();
                                                showDropDown(item?.id, e);
                                                }}><FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon></button>
                                                <GuestAlbumDropdownMenu accessToken={accessToken} album={item} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} />
                                        </div>
                                </div>
                        )): <p></p>}
                </>
        ):(
                <GuestSelectedAlbum accessToken={accessToken} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} showDropDown={showDropDown} setSelectedArtistId={setSelectedArtistId} setSelectedPanel={setSelectedPanel} setSearch={setSearch} debouncedSearchInput={debouncedSearchInput} setLoading={setLoading}/>
        )
                }
        </div>
        </>
    );
}

export default GuestAlbums;