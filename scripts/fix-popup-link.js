const fs = require('fs');

const filePath = 'C:/Users/fyone/Desktop/membership-site-fix/src/components/tools/OfficePoliticsGraph.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// ポップアップ内のSTEP1のサンプルリンク部分を更新
content = content.replace(
  `                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <a
                    href="/samples/social-graph-sample.xlsx"
                    download
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 underline"
                  >
                    \u{1F4E5} \u30B5\u30F3\u30D7\u30EBExcel\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\uff08\u8AAC\u660E\u4ED8\u304D\uff09
                  </a>
                  <span className="text-gray-600 text-xs">\u2190 Excel\u3067\u958B\u3044\u3066\u540D\u524D\u3092\u66F8\u304D\u63DB\u3048\u308B\u3060\u3051</span>
                </div>`,
  `                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <a
                    href="/samples/social-graph-sample.xlsx"
                    download
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors"
                  >
                    \u{1F4E5} \u30B5\u30F3\u30D7\u30EBExcel\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9
                  </a>
                  <span className="text-gray-500 text-xs">\u2190 \u958B\u3044\u3066\u540D\u524D\u3092\u66F8\u304D\u63DB\u3048\u308B\u3060\u3051</span>
                </div>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('完了');
