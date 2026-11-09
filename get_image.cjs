const https = require('https');
https.get('https://unsplash.com/napi/search/photos?query=karate', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(parsed.results.slice(0,3).map(r => 'https://images.unsplash.com/photo-' + r.id + '?auto=format&fit=crop&q=80&w=2000').join('\n'));
    } catch(e) {
      console.log('Error parsing JSON:', data.slice(0, 50));
    }
  });
});
