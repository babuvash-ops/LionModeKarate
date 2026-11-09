import https from 'https';
https.get('https://ibb.co/MDkP914V', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<meta property="og:image" content="([^"]+)"/);
    if(match) console.log('FOUNDURL:' + match[1]);
    else console.log('not found');
  });
});
