// jwt.ts


/**
 * JWT のペイロード部を「検証せずに」展開する。
 * フォーマット不正などの場合は null を返す。
 *
 * 署名の正当性は一切確認しないので、
 * 信頼できる場面での「中身を見る専用」に使うこと。
 */
export default function decodeJwtPayload<T = any>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payloadB64 = parts[1];
    const jsonText = base64UrlDecodeToString(payloadB64);
    return JSON.parse(jsonText) as T;
  } catch {
    return null;
  }
}

/**
 * ついでにヘッダも見たい場合用
 */
export function decodeJwtHeader<T = any>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length < 1) return null;

    const headerB64 = parts[0];
    const jsonText = base64UrlDecodeToString(headerB64);
    return JSON.parse(jsonText) as T;
  } catch {
    return null;
  }
}
/**
 * Base64URL 文字列を UTF-8 文字列にデコードする
 * 依存なし（Node なら Buffer, ブラウザなら atob を使用）
 */
function base64UrlDecodeToString(base64Url: string): string {
  // Base64URL → Base64
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  // パディング追加
  const padLength = (4 - (base64.length % 4)) % 4;
  if (padLength > 0) {
    base64 = base64.padEnd(base64.length + padLength, "=");
  }

  // Node 環境では Buffer、ブラウザでは atob を使う
  if (typeof Buffer !== "undefined") {
    // Node / Next.js の Node runtime
    return Buffer.from(base64, "base64").toString("utf8");
  }

  if (typeof atob !== "undefined") {
    // ブラウザ / Edge Runtime
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    // UTF-8 文字列に変換
    return new TextDecoder().decode(bytes);
  }

  throw new Error("No base64 decoder available in this environment");
}
