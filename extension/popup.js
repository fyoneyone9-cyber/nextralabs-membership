const BASE_URL = 'https://membership-site-nextralabos.vercel.app/products';

const openTool = (id) => {
  chrome.tabs.create({ url: `${BASE_URL}/${id}/app` });
};

document.getElementById('inbox').addEventListener('click', (e) => { e.preventDefault(); openTool('inbox-organizer'); });
document.getElementById('staysee').addEventListener('click', (e) => { e.preventDefault(); openTool('staysee-ai-finder'); });
document.getElementById('money').addEventListener('click', (e) => { e.preventDefault(); openTool('money-guard'); });
document.getElementById('sidejob').addEventListener('click', (e) => { e.preventDefault(); openTool('ai-sidejob'); });
