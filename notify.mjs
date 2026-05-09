// notify.mjs
// RenderのURLをDiscord Webhookに通知するスクリプト
// index.jsの先頭でimportして使うか、index.jsの中で直接呼び出す

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function notifyDiscord() {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn("[notify] DISCORD_WEBHOOK_URL が設定されていません。スキップします。");
    return;
  }

  // RenderはデプロイURLを環境変数として提供する
  const renderUrl =
    process.env.RENDER_EXTERNAL_URL ||
    `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`;

  const payload = {
    username: "Astroid Notifier",
    avatar_url: "https://raw.githubusercontent.com/VyperGroup/AstroidV3/main/static/images/128x128.png",
    embeds: [
      {
        title: "🚀 AstroidV3 が起動しました",
        color: 0x5865f2, // Discord Blurple
        fields: [
          {
            name: "🔗 プロキシURL",
            value: `**${renderUrl}**`,
          },
          {
            name: "📋 サービス名",
            value: process.env.RENDER_SERVICE_NAME || "不明",
            inline: true,
          },
          {
            name: "🌍 リージョン",
            value: process.env.RENDER_REGION || "不明",
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "AstroidV3 on Render",
        },
      },
    ],
  };

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`[notify] Discord通知送信完了 → ${renderUrl}`);
    } else {
      const text = await res.text();
      console.error(`[notify] Discord通知失敗: ${res.status} ${text}`);
    }
  } catch (err) {
    console.error("[notify] Discord通知エラー:", err.message);
  }
}
