const express = require('express');
const { HttpsProxyAgent } = require('https-proxy-agent');
const ytdl = require('ytdl-core');

const app = express();
app.use(express.json());

const proxyAgent = new HttpsProxyAgent('http://localhost:8080');

const ytdlOptions = {
  requestOptions: {
    agent: proxyAgent
  }
};

app.post('/api/download', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url, ytdlOptions);
    const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
    
    res.json({
      title: info.videoDetails.title,
      formats: formats.map(f => ({
        quality: f.qualityLabel,
        url: f.url,
        container: f.container
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));