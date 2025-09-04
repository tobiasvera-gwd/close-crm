// api/contract-bridge.js
export default function handler(req, res) {
  try {
    const {
      lead_name,
      lead_id,
      address_1,
      city,
      zipcode,
      country,
      domain
    } = req.query;

    // Si no hay nombre del cliente, mostrar error
    if (!lead_name) {
      return res.status(400).setHeader('Content-Type', 'text/html').send(`
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui; padding: 50px; text-align: center; background: #000; color: #fff;">
          <h1>Error</h1>
          <h2>Missing Client Name</h2>
          <p>Could not retrieve client information from CloseCRM.</p>
          <button onclick="window.close()" style="padding: 12px 24px; background: #fff; color: #000; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Close</button>
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
            * { 
                margin: 0; 
                padding: 0; 
                box-sizing: border-box; 
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                background: #000;
                color: #fff;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                line-height: 1.6;
            }
            
            .container {
                background: #fff;
                color: #000;
                border-radius: 12px;
                padding: 48px;
                box-shadow: 0 25px 50px rgba(255, 255, 255, 0.1);
                text-align: center;
                max-width: 700px;
                width: 100%;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .logo {
                font-size: 1.5rem;
                font-weight: 700;
                color: #000;
                margin-bottom: 32px;
                letter-spacing: -0.025em;
            }
            
            .title {
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 8px;
                letter-spacing: -0.025em;
            }
            
            .subtitle {
                color: #22c55e;
                font-size: 1.1rem;
                margin-bottom: 24px;
                font-weight: 500;
            }
            
            .client-info {
                background: #f8f9fa;
                padding: 32px;
                border-radius: 8px;
                margin: 32px 0;
                border-left: 4px solid #000;
            }
            
            .client-name {
                font-size: 2rem;
                color: #000;
                font-weight: 700;
                margin-bottom: 12px;
                letter-spacing: -0.025em;
            }
            
            .details {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 32px 0;
                text-align: left;
            }
            
            .detail-item {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }
            
            .detail-label {
                font-weight: 600;
                color: #6b7280;
                font-size: 0.875rem;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .detail-value {
                color: #000;
                font-size: 1rem;
                font-weight: 500;
            }
            
            .continue-button {
                background: #000;
                color: #fff;
                padding: 16px 32px;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-top: 32px;
                letter-spacing: -0.025em;
            }
            
            .continue-button:hover {
                background: #1f2937;
                transform: translateY(-1px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            
            .instructions {
                background: #000;
                color: #fff;
                padding: 24px;
                border-radius: 8px;
                margin-top: 32px;
                text-align: left;
            }
            
            .instructions h3 {
                color: #fff;
                margin-bottom: 12px;
                font-weight: 600;
            }
            
            .instructions p {
                color: #d1d5db;
                line-height: 1.6;
            }
            
            @media (max-width: 768px) {
                .container { 
                    padding: 32px 24px; 
                }
                .details { 
                    grid-template-columns: 1fr; 
                }
                .title {
                    font-size: 1.75rem;
                }
                .client-name {
                    font-size: 1.75rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">Grundwerk Digital</div>
            
            <h1 class="title">Contract Form Ready</h1>
            <div class="subtitle">Form created for:</div>
            
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
                    <div class="detail-label">Domain</div>
                    <div class="detail-value">${domain || 'Not provided'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Address</div>
                    <div class="detail-value">${address_1 || 'Not provided'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${city || ''} ${zipcode || ''} ${country || ''}</div>
                </div>
            </div>
            
            <button class="continue-button" onclick="goToForm()">
                Go to Contract Form
            </button>
            
            <div class="instructions">
                <h3>Instructions</h3>
                <p>Complete the form with all necessary data to generate the contract. Client data is pre-filled from CloseCRM.</p>
            </div>
        </div>

        <script>
            function goToForm() {
                const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
                const params = new URLSearchParams();
                
                // Client Information
                params.append('prefill_Client Name', '${lead_name}');
                params.append('prefill_Legal Company Name', '${lead_name}');
                ${address_1 ? `params.append('prefill_Address', '${address_1.replace(/'/g, "\\'")}');` : ''}
                ${city ? `params.append('prefill_City', '${city}');` : ''}
                ${zipcode ? `params.append('prefill_ZIP Code', '${zipcode}');` : ''}
                ${country ? `params.append('prefill_Country', '${country}');` : ''}
                ${domain ? `params.append('prefill_Client Domain', '${domain}');` : ''}
                
                // Status automático
                params.append('prefill_Status', 'Contract Send');
                params.append('prefill_Proposal Status', 'In Progress');
                
                // Complementary Data
                ${lead_id ? `params.append('prefill_Close Lead ID', '${lead_id}');` : ''}
                
                const finalUrl = airtableFormUrl + '?' + params.toString();
                window.open(finalUrl, '_blank');
            }
        </script>
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).setHeader('Content-Type', 'text/html').send(`
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui; padding: 50px; text-align: center; background: #000; color: #fff;">
        <h1>Server Error</h1>
        <p>Something went wrong. Please try again.</p>
        <button onclick="window.close()" style="padding: 12px 24px; background: #fff; color: #000; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">Close</button>
      </body>
      </html>
    `);
  }
}
