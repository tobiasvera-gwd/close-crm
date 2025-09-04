export default function handler(req, res) {
  const { lead_name, lead_id, contact_email } = req.query;
  
  const html = `
  <html>
  <head>
    <title>Contract - Grundwerk Digital</title>
    <style>
      body { font-family: Arial; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
      .container { background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
      .client-name { font-size: 2rem; color: #333; font-weight: bold; margin: 20px 0; }
      .button { background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 10px; font-size: 1.1rem; cursor: pointer; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>📋 Contract Form Ready</h1>
      <p>✅ Form created for:</p>
      <div class="client-name">${lead_name || 'NO CLIENT NAME'}</div>
      <p>Lead ID: ${lead_id || 'No ID'}</p>
      <p>Email: ${contact_email || 'No Email'}</p>
      <button class="button" onclick="goToForm()">🚀 Go to Contract Form</button>
    </div>
    <script>
      function goToForm() {
        const formUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?prefill_Client+Name=${encodeURIComponent(lead_name || '')}';
        window.open(formUrl, '_blank');
      }
    </script>
  </body>
  </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
