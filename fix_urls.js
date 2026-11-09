import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('https://images.unsplash.com/')) {
        content = content.replace(/https:\/\/images\.unsplash\.com\/([^"'\s?]+)\?([^"'\s]+)?/g, (match, p, query) => {
           return `https://wsrv.nl/?url=images.unsplash.com/${p}${query ? '&' + query : ''}&output=webp`;
        });
        content = content.replace(/https:\/\/images\.unsplash\.com\/([^"'\s?]+)/g, (match, p) => {
           return `https://wsrv.nl/?url=images.unsplash.com/${p}&output=webp`;
        });
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('./src');
console.log('Done');
