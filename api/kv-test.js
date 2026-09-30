// api/kv-test.js
//
// Endpoint di verifica per Vercel KV: scrive una chiave di prova e la
// rilegge subito dopo. Se KV non è ancora collegato al progetto, le
// variabili d'ambiente che @vercel/kv si aspetta non esistono e la
// libreria lancia un errore chiaro: lo intercettiamo e lo spieghiamo,
// invece di lasciar rompere la funzione con uno stack trace criptico.

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const testValue = { hello: 'mondo', at: new Date().toISOString() };
    await kv.set('rimanda-a-domani:test', testValue);
    const readBack = await kv.get('rimanda-a-domani:test');

    res.status(200).json({
      ok: true,
      message: 'Scrittura e lettura su Vercel KV riuscite.',
      wrote: testValue,
      readBack
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'Vercel KV non risponde. Probabilmente non è ancora collegato a questo progetto (tab Storage su vercel.com) o il progetto non è stato ridistribuito dopo averlo collegato.',
      error: err.message
    });
  }
}
