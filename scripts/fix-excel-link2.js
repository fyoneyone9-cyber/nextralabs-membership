const fs = require('fs');

const filePath = 'C:/Users/fyone/Desktop/membership-site-fix/src/components/tools/OfficePoliticsGraph.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'href="/samples/office-politics-sample.csv"',
  'href="/samples/social-graph-sample.xlsx"'
);
content = content.replace(
  '\u{1F4E5} \u30B5\u30F3\u30D7\u30EBCSV\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9',
  '\u{1F4E5} \u30B5\u30F3\u30D7\u30EBExcel\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\uff08\u8AAC\u660E\u4ED8\u304D\uff09'
);
content = content.replace(
  '\u2190 \u3053\u308C\u3092\u7DE8\u96C6\u3059\u308B\u306E\u304C\u6700\u901F',
  '\u2190 Excel\u3067\u958B\u3044\u3066\u540D\u524D\u3092\u66F8\u304D\u63DB\u3048\u308B\u3060\u3051'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('完了');
