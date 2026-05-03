const fs = require('fs');
const filePath = 'C:/Users/fyone/Desktop/membership-site-fix/src/components/tools/OfficePoliticsGraph.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  `className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 underline"
                  >
                    \u{1F4E5} \u30B5\u30F3\u30D7\u30EBExcel\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\uff08\u8AAC\u660E\u4ED8\u304D\uff09`,
  `className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors"
                  >
                    \u{1F4E5} \u30B5\u30F3\u30D7\u30EBExcel\u3092DL\uff08\u8AAC\u660E\u4ED8\u304D\uff09`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('\u5B8C\u4E86');
