const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const auth = JSON.parse(fs.readFileSync('C:/Users/fyone/AppData/Roaming/com.vercel.cli/Data/auth.json', 'utf8'));
const token = auth.token;
const teamId = 'team_T4YEOSuj882rQycFBmlrGDay';
const projectId = 'prj_yaUSZdabp1yiMBuVALpqm2rgjV7D';
const baseDir = __dirname;

// Collect all files
function collectFiles(dir, prefix) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.vercel' || e.name === '.next' ||
        e.name.startsWith('deploy-') || e.name === 'download.js' || e.name === 'decode-all.js' ||
        e.name === 'deploy-out.txt' || e.name === 'deploy-err.txt' ||
        e.name === 'file-tree.json' || e.name.startsWith('vercel-')) continue;
    const fullPath = path.join(dir, e.name);
    const relPath = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) {
      results.push(...collectFiles(fullPath, relPath));
    } else {
      const data = fs.readFileSync(fullPath);
      const sha = crypto.createHash('sha1').update(data).digest('hex');
      results.push({
        file: relPath,
        data: data.toString('base64'),
        encoding: 'base64',
        sha,
        size: data.length
      });
    }
  }
  return results;
}

function apiRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.vercel.com',
      path: urlPath,
      method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch { resolve(d); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Collecting files...');
  const files = collectFiles(baseDir, '');
  console.log(`Found ${files.length} files`);

  // Create deployment
  console.log('Creating deployment...');
  const deployBody = {
    name: 'membership-site',
    project: projectId,
    target: 'production',
    files: files.map(f => ({
      file: f.file,
      data: f.data,
      encoding: f.encoding
    })),
    projectSettings: {
      framework: 'nextjs'
    }
  };

  const result = await apiRequest('POST', `/v13/deployments?teamId=${teamId}`, deployBody);

  if (result.error) {
    console.error('Deploy error:', JSON.stringify(result.error, null, 2));
  } else {
    console.log('Deploy created!');
    console.log('ID:', result.id);
    console.log('URL:', result.url);
    console.log('State:', result.readyState || result.state);
  }
}

main().catch(e => console.error('Fatal:', e));
