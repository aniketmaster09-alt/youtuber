const ytdl = require('ytdl-core');
const path = require('path');

const options = {
  requestOptions: {
    jar: path.join(__dirname, '../../cookies.txt'),
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url } = JSON.parse(event.body);
    
    if (!ytdl.validateURL(url)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid YouTube URL' }) };
    }

    const info = await ytdl.getInfo(url, options);
    const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: info.videoDetails.title,
        formats: formats.slice(0, 3).map(f => ({
          quality: f.qualityLabel,
          url: f.url,
          container: f.container
        }))
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
