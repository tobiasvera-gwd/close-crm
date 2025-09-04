// api/contract-bridge.js
export default async function handler(req, res) {
  const {
    lead_name,
    lead_id,
    contact_email,
    contact_name,
    address,
    domain,
    notes,
    linkedin
  } = req.query;

  // Si no hay nombre del cliente, mostrar error
  if (!lead_name) {
    return res.setHeader('Content-Type', 'text/html').send(`
      <html>
      <body style="font-family: Arial; padding: 50px; text-align: center; background: #ffebee;">
        <h1>❌ Error</h1>
        <h2>Missing Client Name</h2>
        <p>Could not retrieve client information from CloseCRM.</p>
        <button onclick="window.close()" style="padding: 10px 20px; background: #c62828; color: white; border: none; border-radius: 5px;">Close</button>
      </body>
      </html>
    `);
  }

  // Crear lista de campos faltantes
  const missingFields = [];
  if (!contact_email) missingFields.push('Contact Email');
  if (!contact_name) missingFields.push('Contact Name');
  if (!address) missingFields.push('Address');
  if (!domain) missingFields.push('Domain');

  // HTML de respuesta con diseño completo
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contract Creation - Grundwerk Digital</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
              font-family: 'Arial', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
          }
          .container {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 600px;
              width: 100%;
          }
          .logo {
              font-size: 2rem;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 30px;
          }
          .client-info {
              background: #f8f9fa;
              padding: 25px;
              border-radius: 15px;
              margin: 20px 0;
              border-left: 5px solid #667eea;
          }
          .client-name {
              font-size: 1.8rem;
              color: #333;
              font-weight: bold;
              margin-bottom: 10px;
          }
          .form-ready {
              color: #4CAF50;
              font-size: 1.2rem;
              margin-bottom: 20px;
          }
          .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 20px 0;
              text-align: left;
          }
          .detail-item {
              background: white;
              padding: 15px;
              border-radius: 10px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          .detail-label {
              font-weight: bold;
              color: #666;
              font-size: 0.9rem;
              margin-bottom: 5px;
          }
          .detail-value {
              color: #333;
              font-size: 1.1rem;
          }
          .missing-data {
              color: #ff6b6b;
              font-style: italic;
          }
          .continue-button {
              background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
              color: white;
              padding: 15px 40px;
              border: none;
              border-radius: 30px;
              font-size: 1.2rem;
              font-weight: bold;
              cursor: pointer;
              transition: transform 0.3s, box-shadow 0.3s;
              margin-top: 30px;
          }
          .continue-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
          }
          .missing-fields {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              text-align: left;
          }
          .missing-fields h3 {
              color: #856404;
              margin-bottom: 15px;
          }
          .missing-fields ul {
              color: #856404;
              padding-left: 20px;
          }
          .instructions {
              background: #e3f2fd;
              padding: 20px;
              border-radius: 10px;
              margin-top: 25px;
              text-align: left;
          }
          .instructions h3 {
              color: #1976d2;
              margin-bottom: 15px;
          }
          .instructions p {
              color: #555;
              line-height: 1.6;
          }
          @media (max-width: 768px) {
              .details { grid-template-columns: 1fr; }
              .container { padding: 30px 20px; }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="logo">📋 Grundwerk Digital</div>
          
          <h1>📋 Contract Form Ready</h1>
          
          <div class="form-ready">✅ Form created for:</div>
          
          <div class="client-info">
              <div class="client-name">${lead_name}</div>
          </div>
          
          <div class="details">
              <div class="detail-item">
                  <div class="detail-label">Lead ID</div>
                  <div class="detail-value">${lead_id || 'Not available'}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Status</div>
                  <div class="detail-value">Contract Creation</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Contact Email</div>
                  <div class="detail-value ${!contact_email ? 'missing-data' : ''}">${contact_email || 'Missing'}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Contact Name</div>
                  <div class="detail-value ${!contact_name ? 'missing-data' : ''}">${contact_name || 'Missing'}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Address</div>
                  <div class="detail-value ${!address ? 'missing-data' : ''}">${address || 'Not provided'}</div>
              </div>
              <div class="detail-item">
                  <div class="detail-label">Domain</div>
                  <div class="detail-value ${!domain ? 'missing-data' : ''}">${domain || 'Not provided'}</div>
              </div>
          </div>
          
          ${missingFields.length > 0 ? `
          <div class="missing-fields">
              <h3>⚠️ Missing Required Data:</h3>
              <ul>
                  ${missingFields.map(field => `<li>${field}</li>`).join('')}
              </ul>
              <p style="margin-top: 10px;"><strong>Please update these fields in CloseCRM before proceeding.</strong></p>
          </div>
          ` : ''}
          
          <button class="continue-button" onclick="goToForm()">
              🚀 Go to Contract Form
          </button>
          
          <div class="instructions">
              <h3>📋 Instructions:</h3>
              <p>Complete the form with all necessary data to generate the contract. Client data is pre-filled from CloseCRM.</p>
          </div>
      </div>

      <script>
          function goToForm() {
              // Crear URL del formulario de Airtable con todos los datos
              const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
              let formUrl = airtableFormUrl + '?prefill_Client+Name=' + encodeURIComponent('${lead_name}');
              
              // Agregar otros campos si existen
              ${contact_email ? `formUrl += '&prefill_Contact+Email=' + encodeURIComponent('${contact_email}');` : ''}
              ${contact_name ? `formUrl += '&prefill_Contact+Name=' + encodeURIComponent('${contact_name}');` : ''}
              ${address ? `formUrl += '&prefill_Address=' + encodeURIComponent('${address}');` : ''}
              ${domain ? `formUrl += '&prefill_Domain=' + encodeURIComponent('${domain}');` : ''}
              ${lead_id ? `formUrl += '&prefill_Close+Lead+ID=' + encodeURIComponent('${lead_id}');` : ''}
              ${notes ? `formUrl += '&prefill_Notes=' + encodeURIComponent('${notes}');` : ''}
              ${linkedin ? `formUrl += '&prefill_LinkedIn=' + encodeURIComponent('${linkedin}');` : ''}
              
              window.open(formUrl, '_blank');
          }
      </script>
  </body>
  </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
