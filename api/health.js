// Route de santé simple pour tester Vercel Serverless Functions
export default function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'Vercel Serverless Function is working',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  })
}




