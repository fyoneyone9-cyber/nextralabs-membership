/**
 * AIクレジット節約用の画像軽量化ツール
 * 解像度を落とし、品質を調整することでAI解析コストを最小化します
 */
export async function shrinkImageForAi(dataUrl: string, maxWidth = 800): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // 指定サイズより大きければ縮小
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);

      // 描画して圧縮（JPEG品質を落とすことでトークン量を削減）
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.6)); // 品質 0.6
    };
  });
}
