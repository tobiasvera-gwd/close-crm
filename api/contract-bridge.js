// api/contract-bridge.js
export default async function handler(req, res) {
  const { lead_name, lead_id, contact_email } = req.query;
  
  const html = `
  <html>
  <body style="font-family: Arial; padding: 40px; background: #f0f0f0; text-align: center;">
    <h1>✅ SUCCESS!</h1>
    <h2>Client: ${lead_name || 'NO NAME'}</h2>
    <p>Lead ID: ${lead_id || 'NO ID'}</p>
    <p>Email: ${contact_email || 'NO EMAIL'}</p>
    
    <button onclick="goToForm()" style="padding: 15px 30px; background: green; color: white; border: none; border-radius: 10px; font-size: 16px; margin-top: 20px;">
      Go to Airtable Form
    </button>
    
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
