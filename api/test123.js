// api/test123.js
export default async function handler(req, res) {
  const clientName = req.query.lead_name || 'NO NAME RECEIVED';
  const leadId = req.query.lead_id || 'NO ID RECEIVED';
  
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <html>
    <body style="padding: 50px; font-family: Arial; text-align: center;">
      <h1>🎯 SUCCESS!</h1>
      <h2>Client Name: ${clientName}</h2>
      <h3>Lead ID: ${leadId}</h3>
      <hr style="margin: 30px 0;">
      <p>If you see the REAL client name above (not 'NO NAME'), then it's working!</p>
    </body>
    </html>
  `);
}
