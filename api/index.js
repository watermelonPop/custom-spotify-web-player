const SpotifWebAPI = require("spotify-web-api-node");

module.exports = async (req, res) => {
  const { url, method, body } = req;

  const spotifyApi = new SpotifWebAPI({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'https://your-vercel-domain.vercel.app',
  });

  if (url === '/api/login' && method === 'POST') {
    try {
      const data = await spotifyApi.authorizationCodeGrant(body.code);
      res.status(200).json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    } catch (e) {
      res.status(400).json({ error: "Login failed" });
    }
  } else if (url === '/api/refresh' && method === 'POST') {
    try {
      spotifyApi.setRefreshToken(body.refreshToken);
      const data = await spotifyApi.refreshAccessToken();
      res.status(200).json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    } catch (e) {
      res.status(400).json({ error: "Refresh failed" });
    }
  } else if (url === '/api/guest-token' && method === 'GET') {
    try {
      const data = await spotifyApi.clientCredentialsGrant();
      res.status(200).json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to get guest token' });
    }
  } else {
    res.status(404).json({ error: "Not found" });
  }
};
