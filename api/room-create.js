// api/room-create.js
// POST { hostName } -> { ok, code, playerId, room }
//
// Crea una stanza nuova in stato 'lobby' con l'host come primo giocatore,
// e restituisce il playerId: il client lo conserva (es. localStorage) per
// dimostrare nelle richieste successive quale posto controlla.

import { generateUniqueRoomCode, saveRoom, randomPlayerId, sanitizeName } from '../lib/rooms.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Usa POST.' });
  }

  try {
    const { hostName } = req.body || {};
    const name = sanitizeName(hostName, 'Host');

    const code = await generateUniqueRoomCode();
    const playerId = randomPlayerId();

    const room = {
      code,
      createdAt: Date.now(),
      status: 'lobby', // 'lobby' | 'playing' | 'finished'
      seats: [
        { playerId, name, isHuman: true, isHost: true, connected: true }
      ],
      engineState: null // valorizzato allo step 3, quando la partita parte
    };

    await saveRoom(code, room);

    res.status(200).json({ ok: true, code, playerId, room });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Errore nella creazione della stanza.', error: err.message });
  }
}
