const ytdl = require('ytdl-core');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url } = JSON.parse(event.body);
    
    if (!ytdl.validateURL(url)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid YouTube URL' }) };
    }

    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: info.videoDetails.title,
        formats: formats.map(f => ({
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