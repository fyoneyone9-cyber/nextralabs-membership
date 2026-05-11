const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const auth = JSON.parse(fs.readFileSync('C:/Users/fyone/AppData/Roaming/com.vercel.cli/Data/auth.json', 'utf8'));
const token = auth.token;
const teamId = 'team_T4YEOSuj882rQycFBmlrGDay';
const projectId = 'prj_R5lVHIiKDGwkTfwyjaEC5bCAwIQN';
const baseDir = __dirname;

const SKIP_DIRS = new Set(['node_modules', '.vercel', '.next', '.git', '.husky',
  '_backup_20260510', 'booth_package', 'extension']);
const SKIP_FILES = new Set(['api-deploy.js', 'download.js', 'decode-all.js',
  'deploy-out.txt', 'deploy-err.txt', 'file-tree.json', 'tsconfig.tsbuildinfo',
  'ogp-image.png', 'booth_header.png', 'booth_header_raw.png',
  'youtube-producer-booth-pr.png', 'neon-tokyo-design.png', 'prompt-master-booth-pr.png',
  'nextra-double-launch-pr.png', 'trend-price-double-launch-pr.png',
  'package-lock.json']);
const SKIP_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico']);

const ROOT_SKIP_DIRS = new Set(['supabase']); // only skip at root level

function collectFiles(dir, prefix) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    if (!prefix && ROOT_SKIP_DIRS.has(e.name)) continue; // root-level only
    if (e.name.startsWith('deploy-') || e.name.startsWith('vercel-') || e.name.startsWith('final') || e.name.startsWith('omni') || e.name.startsWith('total')) continue;
    const fullPath = path.join(dir, e.name);
    const relPath = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) {
      results.push(...collectFiles(fullPath, relPath));
    } else {
      const ext = path.extname(e.name).toLowerCase();
      if (SKIP_FILES.has(e.name) || SKIP_EXT.has(ext)) continue;
      const data = fs.readFileSync(fullPath);
      const sha = crypto.createHash('sha1').update(data).digest('hex');
      results.push({ file: relPath, data, sha, size: data.length });
    }
  }
  return results;
}

function uploadFile(fileData, sha) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.vercel.com',
      path: `/v2/files?teamId=${teamId}`,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileData.length,
        'x-vercel-digest': sha
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.write(fileData);
    req.end();
  });
}

function apiPost(urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.vercel.com',
      path: urlPath,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
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
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Collecting files...');
  const files = collectFiles(baseDir, '');
  const totalBytes = files.reduce((s, f) => s + f.size, 0);
  console.log(`Found ${files.length} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);

  // Step 1: Upload files
  console.log('Uploading files...');
  const fileRefs = [];
  for (const f of files) {
    process.stdout.write(`  [${f.sha.slice(0,8)}] ${f.file} (${f.size}B)... `);
    const res = await uploadFile(f.data, f.sha);
    if (res.status === 200 || res.status === 201) {
      process.stdout.write('uploaded\n');
    } else if (res.status === 409) {
      process.stdout.write('already exists\n');
    } else {
      process.stdout.write(`status=${res.status}\n`);
    }
    fileRefs.push({ file: f.file, sha: f.sha, size: f.size });
  }

  // Step 2: Create deployment
  console.log('\nCreating deployment...');
  const deployBody = {
    name: 'membership-site-fix',
    project: projectId,
    target: 'production',
    files: fileRefs,
    projectSettings: { framework: 'nextjs', nodeVersion: '20.x' }
  };

  const result = await apiPost(`/v13/deployments?teamId=${teamId}&forceNew=1`, deployBody);

  if (result.error) {
    console.error('Deploy error:', JSON.stringify(result.error, null, 2));
    if (result.missingFiles) {
      console.log('Missing files:', result.missingFiles.length);
    }
  } else {
    console.log('\n✅ Deploy created!');
    console.log('ID:', result.id);
    console.log('URL: https://' + result.url);
    console.log('State:', result.readyState || result.status);
  }
}

main().catch(e => console.error('Fatal:', e));
