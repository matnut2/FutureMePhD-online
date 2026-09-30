// api/hello.js
//
// Endpoint di verifica: non ha nulla a che fare col gioco, serve solo a
// confermare che Vercel riconosce ed esegue correttamente le funzioni
// nella cartella api/. Se questo risponde, la pipeline di base funziona.

export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: 'Le funzioni serverless funzionano.',
    timestamp: new Date().toISOString()
  });
}
