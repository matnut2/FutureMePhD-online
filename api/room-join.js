// api/room-join.js
// POST { code, name } -> { ok, code, playerId, room }

import { loadRoom, saveRoom, randomPlayerId, sanitizeName } from '../lib/rooms.js';
import { MAX_PLAYERS } from '../js/data/config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Usa POST.' });
  }

  try {
    const { code, name } = req.body || {};
    if (!code) {
      return res.status(400).json({ ok: false, message: 'Codice stanza mancante.' });
    }

    const room = await loadRoom(code);
    if (!room) {
      return res.status(404).json({ ok: false, message: 'Stanza non trovata: codice sbagliato o scaduta.' });
    }
    if (room.status !== 'lobby') {
      return res.status(409).json({ ok: false, message: 'La partita in questa stanza è già iniziata.' });
    }
    if (room.seats.length >= MAX_PLAYERS) {
      return res.status(409).json({ ok: false, message: 'Stanza piena.' });
    }

    const playerId = randomPlayerId();
    const safeName = sanitizeName(name, `Giocatore ${room.seats.length + 1}`);
    room.seats.push({ playerId, name: safeName, isHuman: true, isHost: false, connected: true });

    await saveRoom(room.code, room);

    res.status(200).json({ ok: true, code: room.code, playerId, room });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Errore nell'unione alla stanza.", error: err.message });
  }
}
