module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const Name  = body.Name  || '—';
    const Phone = body.Phone || '—';
    const org   = body.org   || '—';
    const car   = body.car   || '—';
    const now   = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

    const text = [
      '🚗 *Новая заявка на лизинг*', '',
      `👤 *Имя:* ${Name}`,
      `📞 *Телефон:* ${Phone}`,
      `🏢 *Организация:* ${org}`,
      `🚘 *Автомобиль:* ${car}`, '',
      `🕐 *Время:* ${now} МСК`, '',
      '⚡️ Перезвони в течение 15 минут!'
    ].join('\n');

    // Telegram
    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.CHAT_ID, text, parse_mode: 'Markdown' })
    });

    // Битрикс24
    const b24 = new URLSearchParams();
    b24.append('fields[TITLE]', `Лизинг авто — ${car}`);
    b24.append('fields[NAME]', Name);
    b24.append('fields[PHONE][0][VALUE]', Phone);
    b24.append('fields[PHONE][0][VALUE_TYPE]', 'WORK');
    b24.append('fields[COMMENTS]', `Организация: ${org}\nАвтомобиль: ${car}\nИсточник: сайт`);
    b24.append('fields[SOURCE_ID]', 'WEB');
    b24.append('fields[STATUS_ID]', 'NEW');

    await fetch(`${process.env.B24_URL}crm.lead.add.json`, {
      method: 'POST',
      body: b24
    });

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
