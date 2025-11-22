// Handler de test simple pour Vercel
export default function handler(req, res) {
  res.json({ 
    status: 'OK', 
    message: 'Vercel Serverless Function is working',
    path: req.url,
    method: req.method
  })
}








