// api/room-state.js
// GET ?code=XXXXX -> { ok, room }
//
// Il client la richiama a intervalli (polling) per restare aggiornato.

import { loadRoom } from '../lib/rooms.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, message: 'Usa GET.' });
  }

  try {
    const code = (req.query.code || '').toString();
    if (!code) {
      return res.status(400).json({ ok: false, message: 'Codice stanza mancante.' });
    }

    const room = await loadRoom(code);
    if (!room) {
      return res.status(404).json({ ok: false, message: 'Stanza non trovata.' });
    }

    res.status(200).json({ ok: true, room });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Errore nella lettura della stanza.', error: err.message });
  }
}
