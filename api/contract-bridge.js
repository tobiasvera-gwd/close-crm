// api/contract-bridge.js
export default function handler(req, res) {
  try {
    const {
      lead_name,
      lead_id,
      contact_email,
      contact_name,
      address_1,
      city,
      zipcode,
      country,
      domain,
      notes,
      linkedin
    } = req.query;

    console.log('Received data:', req.query);

    // Si no hay nombre del cliente, mostrar error
    if (!lead_name) {
      return res.status(400).setHeader('Content-Type', 'text/html').send(`
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

    // HTML de respuesta
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
                    <div class="detail-label">Address</div>
                    <div class="detail-value ${!address_1 ? 'missing-data' : ''}">${address_1 || 'Missing'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">City</div>
                    <div class="detail-value ${!city ? 'missing-data' : ''}">${city || 'Missing'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">ZIP Code</div>
                    <div class="detail-value ${!zipcode ? 'missing-data' : ''}">${zipcode || 'Missing'}</div>
                </div>
            </div>
            
            <!-- DEBUG: Show all received parameters -->
            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left; font-family: monospace; font-size: 12px;">
                <strong>DEBUG - Received Parameters:</strong><br>
                lead_name: ${lead_name || 'undefined'}<br>
                lead_id: ${lead_id || 'undefined'}<br>
                contact_email: ${contact_email || 'undefined'}<br>
                contact_name: ${contact_name || 'undefined'}<br>
                address_1: ${address_1 || 'undefined'}<br>
                city: ${city || 'undefined'}<br>
                zipcode: ${zipcode || 'undefined'}<br>
                country: ${country || 'undefined'}<br>
                domain: ${domain || 'undefined'}<br>
                <br>
                <strong>All URL params:</strong><br>
                ${JSON.stringify(req.query, null, 2)}
            </div>
            
            <button class="continue-button" onclick="goToForm()">
                🚀 Go to Contract Form
            </button>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-top: 25px; text-align: left;">
                <h3 style="color: #1976d2; margin-bottom: 15px;">📋 Instructions:</h3>
                <p style="color: #555; line-height: 1.6;">Complete the form with all necessary data to generate the contract. Client data is pre-filled from CloseCRM.</p>
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
                ${address_1 ? `formUrl += '&prefill_Address=' + encodeURIComponent('${address_1}');` : ''}
                ${city ? `formUrl += '&prefill_City=' + encodeURIComponent('${city}');` : ''}
                ${zipcode ? `formUrl += '&prefill_ZIP+Code=' + encodeURIComponent('${zipcode}');` : ''}
                ${country ? `formUrl += '&prefill_Country=' + encodeURIComponent('${country}');` : ''}
                ${lead_id ? `formUrl += '&prefill_Close+Lead+ID=' + encodeURIComponent('${lead_id}');` : ''}
                ${domain ? `formUrl += '&prefill_Domain=' + encodeURIComponent('${domain}');` : ''}
                ${notes ? `formUrl += '&prefill_Notes=' + encodeURIComponent('${notes}');` : ''}
                ${linkedin ? `formUrl += '&prefill_LinkedIn=' + encodeURIComponent('${linkedin}');` : ''}
                
                window.open(formUrl, '_blank');
            }
        </script>
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);

  } catch (error) {
    console.error('Error in contract-bridge:', error);
    res.status(500).setHeader('Content-Type', 'text/html').send(`
      <html>
      <body style="font-family: Arial; padding: 50px; text-align: center; background: #ffebee;">
        <h1>❌ Server Error</h1>
        <p>Error: ${error.message}</p>
        <button onclick="window.close()">Close</button>
      </body>
      </html>
    `);
  }
}
