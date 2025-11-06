const ytdl = require('ytdl-core');

const options = {
  requestOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Cookie': 'HSID=AA3F5nt2q6TBlB6mT; SSID=AhfB7LFmPrgT_9ngl; APISID=gxR1ISU2RT3y7mbW/A62PCHOlM9r3yg_sD; SAPISID=Lr-zkJdlb0GdVHX1/AWgsjyeanFJQc6Abz; __Secure-1PAPISID=Lr-zkJdlb0GdVHX1/AWgsjyeanFJQc6Abz; __Secure-3PAPISID=Lr-zkJdlb0GdVHX1/AWgsjyeanFJQc6Abz; SID=g.a0003AjjJc9pmisaHyHLSlmbpjbfUfELmkuPqVb_Y483jrcXetpAVp-eT60_XI2BVfdTC2aHhQACgYKAdsSARASFQHGX2Mi6CsG3rLL77r5Kbta_qF2lxoVAUF8yKq-O2HBmxnO3N_nR_MTkz860076; __Secure-1PSID=g.a0003AjjJc9pmisaHyHLSlmbpjbfUfELmkuPqVb_Y483jrcXetpAm5S2BSWTctI0Ms0-kPZW8gACgYKAfoSARASFQHGX2MiLpLX6DxPLIM7AwgQYwC82hoVAUF8yKoS0Tscfbo7AY6MZnVmo1TB0076; __Secure-3PSID=g.a0003AjjJc9pmisaHyHLSlmbpjbfUfELmkuPqVb_Y483jrcXetpA-KcPZD9nNJC0qp4ttPQ1twACgYKAZkSARASFQHGX2Mi8Fg4USrkKsaU_OS8idz8GBoVAUF8yKr1GI_7HP3kgrDHxu852p1M0076; VISITOR_INFO1_LIVE=0RJBxR1apDs; YSC=SX4urkp40ho; PREF=f4=4000000&f6=40000000&tz=Asia.Calcutta&f7=100'
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
