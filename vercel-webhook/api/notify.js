const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.CHAT_ID;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { Name, Phone, org, car } = req.body;
    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

    const text = [
      '🚗 *Новая заявка на лизинг*',
      '',
      `👤 *Имя:* ${Name || '—'}`,
      `📞 *Телефон:* ${Phone || '—'}`,
      `🏢 *Организация:* ${org || '—'}`,
      `🚘 *Автомобиль:* ${car || '—'}`,
      '',
      `🕐 *Время:* ${now} МСК`,
      '',
      '⚡️ Перезвони в течение 15 минут!'
    ].join('\n');

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed' });
  }
};
