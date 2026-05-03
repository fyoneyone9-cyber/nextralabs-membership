const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
  const wb = new ExcelJS.Workbook();

  // ===== シート1: サンプルデータ =====
  const ws = wb.addWorksheet('サンプルデータ（ここを編集）');

  // 列幅
  ws.columns = [
    { key: 'from',   width: 18 },
    { key: 'to',     width: 18 },
    { key: 'weight', width: 12 },
    { key: 'note',   width: 40 },
  ];

  // ヘッダー行
  const headerRow = ws.addRow(['from（送信者）', 'to（受信者）', 'weight（強さ）', '📝 説明']);
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FF3730A3' } }
    };
  });
  ws.getRow(1).height = 28;

  // データ行
  const data = [
    ['田中部長', '鈴木課長', 5, 'やり取りが多い（週5回以上）'],
    ['田中部長', '山田主任', 3, 'やり取りが中程度（週3回）'],
    ['鈴木課長', '佐藤',    4, ''],
    ['鈴木課長', '山田主任', 6, 'やり取りが非常に多い'],
    ['山田主任', '佐藤',    2, 'やり取りが少ない（週2回）'],
    ['山田主任', '伊藤',    3, ''],
    ['佐藤',    '伊藤',    4, ''],
    ['伊藤',    '田中部長', 2, ''],
    ['清水',    '鈴木課長', 5, ''],
    ['清水',    '伊藤',    4, ''],
    ['清水',    '佐藤',    3, ''],
    ['高橋',    '山田主任', 2, ''],
    ['高橋',    '清水',    3, ''],
  ];

  data.forEach((row, i) => {
    const r = ws.addRow(row);
    const bgColor = i % 2 === 0 ? 'FFF5F3FF' : 'FFFFFFFF';
    r.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.alignment = { vertical: 'middle', horizontal: col === 3 ? 'center' : 'left' };
      cell.font = { size: 10 };
    });
    // weight列を色付け
    const weightCell = r.getCell(3);
    weightCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDD6FE' } };
    weightCell.font = { bold: true, size: 10 };
  });

  // ===== シート2: 使い方ガイド =====
  const ws2 = wb.addWorksheet('📖 使い方ガイド');
  ws2.columns = [{ width: 60 }, { width: 40 }];

  const guide = [
    ['📖 社内政治相関図 - CSVフォーマットガイド', ''],
    ['', ''],
    ['【列の意味】', ''],
    ['from（送信者）', 'メッセージを送った人 / 会議を招集した人の名前'],
    ['to（受信者）', 'メッセージを受け取った人 / 会議に参加した人の名前'],
    ['weight（強さ）', 'やり取りの回数・強度を数値で入力（1〜10推奨）'],
    ['', ''],
    ['【weightの目安】', ''],
    ['1〜2', 'ほぼやり取りなし（月1回以下）'],
    ['3〜4', 'たまにやり取りあり（週1〜2回）'],
    ['5〜6', 'よくやり取りする（週3〜5回）'],
    ['7〜8', '非常に多い（毎日複数回）'],
    ['9〜10', '密接な関係（常に連絡を取り合う）'],
    ['', ''],
    ['【使い方】', ''],
    ['①', 'このファイルの「サンプルデータ」シートを編集する'],
    ['②', '名前をあなたの職場の実際の人名に変更する'],
    ['③', 'weightをやり取りの頻度に合わせて調整する'],
    ['④', 'ファイル → 名前を付けて保存 → CSV（コンマ区切り）で保存'],
    ['⑤', '相関図ツールにそのCSVをアップロードする'],
    ['', ''],
    ['【データ収集の参考】', ''],
    ['Slackの場合', '「メンション数」をカウントしてweightに使う'],
    ['Gmailの場合', 'やり取りのスレッド数をweightに使う'],
    ['カレンダーの場合', '同じ会議に参加した回数をweightに使う'],
    ['感覚値でもOK', '数値は厳密でなくて大丈夫。雰囲気で入れてください'],
  ];

  guide.forEach((row, i) => {
    const r = ws2.addRow(row);
    if (i === 0) {
      r.getCell(1).font = { bold: true, size: 14, color: { argb: 'FF4F46E5' } };
    } else if (row[0].startsWith('【')) {
      r.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF6D28D9' } };
      r.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } };
    } else {
      r.getCell(1).font = { size: 10 };
      r.getCell(2).font = { size: 10, color: { argb: 'FF374151' } };
    }
  });

  // 出力
  const outPath = path.join('C:/Users/fyone/Desktop', 'social-graph-sample.xlsx');
  await wb.xlsx.writeFile(outPath);
  console.log('完了: ' + outPath);
}

main().catch(console.error);
