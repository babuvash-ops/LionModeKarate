const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('https://images.unsplash.com/')) {
        // replace https://images.unsplash.com/photo-123?... with https://wsrv.nl/?url=images.unsplash.com/photo-123&...
        content = content.replace(/https:\/\/images\.unsplash\.com\/([^"'\s?]+)\?([^"'\s]+)?/g, (match, path, query) => {
           return `https://wsrv.nl/?url=images.unsplash.com/${path}${query ? '&' + query : ''}&output=webp`;
        });
        // also replace without query params
        content = content.replace(/https:\/\/images\.unsplash\.com\/([^"'\s?]+)/g, (match, path) => {
           return `https://wsrv.nl/?url=images.unsplash.com/${path}&output=webp`;
        });
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('./src');
console.log('Done');
