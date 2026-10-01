// lib/rooms.js
//
// Logica delle stanze condivisa dalle funzioni in api/. Non è una route
// (vive fuori da api/), è un modulo di supporto.
//
// Ogni funzione accetta un client KV opzionale (kvClient), di default
// quello vero di Vercel: permette di testare la logica con un client
// finto in memoria, senza toccare KV reale.

import { kv as defaultKv } from '@vercel/kv';

// Alfabeto senza caratteri ambigui (0/O, 1/I/L) per codici facili da leggere a voce o digitare.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 5;

// Una stanza abbandonata scompare da sola da KV dopo questo tempo.
const ROOM_TTL_SECONDS = 60 * 60 * 6; // 6 ore

function roomKey(code) {
  return `room:${code.toUpperCase()}`;
}

function randomCode() {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

export async function generateUniqueRoomCode(kvClient = defaultKv) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode();
    const existing = await kvClient.get(roomKey(code));
    if (!existing) return code;
  }
  throw new Error('Impossibile generare un codice stanza libero al momento, riprova.');
}

export async function loadRoom(code, kvClient = defaultKv) {
  if (!code) return null;
  return kvClient.get(roomKey(code.toUpperCase()));
}

export async function saveRoom(code, room, kvClient = defaultKv) {
  await kvClient.set(roomKey(code), room, { ex: ROOM_TTL_SECONDS });
}

export function randomPlayerId() {
  return crypto.randomUUID();
}

// Pulisce e limita un nome fornito dall'utente, con una scelta di riserva.
export function sanitizeName(raw, fallback) {
  const cleaned = (raw ?? '').toString().trim().slice(0, 16);
  return cleaned || fallback;
}
