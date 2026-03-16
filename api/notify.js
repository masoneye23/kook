module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const Name  = body.Name  || '—';
    const Phone = body.Phone || '—';
    const org   = body.org   || '—';
    const car   = body.car   || '—';

    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

    const text = [
      '🚗 *Новая заявка на лизинг*',
      '',
      `👤 *Имя:* ${Name}`,
      `📞 *Телефон:* ${Phone}`,
      `🏢 *Организация:* ${org}`,
      `🚘 *Автомобиль:* ${car}`,
      '',
      `🕐 *Время:* ${now} МСК`,
      '',
      '⚡️ Перезвони в течение 15 минут!'
    ].join('\n');

    const tgRes = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text,
          parse_mode: 'Markdown'
        })
      }
    );

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      console.error('TG error:', tgData);
      return res.status(500).json({ error: tgData.description });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
