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
    
    // Construir URL del formulario de Airtable con datos precargados
    const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
    const params = new URLSearchParams();
    
    // Client Information
    params.append('prefill_Client Name', lead_name);
    params.append('prefill_Legal Company Name', lead_name);
    if (domain) params.append('prefill_Client Domain', domain);
    
    // Billing Address Information (matching form field names)
    if (address_1) params.append('prefill_Billing Address Street', address_1);
    if (city) params.append('prefill_Billing Address City', city);
    if (zipcode) params.append('prefill_ZIP Code', zipcode);
    if (country) params.append('prefill_Billing Address Country', country);
    
    // Company Information
    params.append('prefill_Company Type', 'Unknown'); // Default value
    
    // Status automático
    params.append('prefill_Status', 'Contract Sent');
    params.append('prefill_Proposal Status', 'In Progress');
    
    // Complementary Data
    if (lead_id) params.append('prefill_Close Lead ID', lead_id);
    
    const finalUrl = airtableFormUrl + '?' + params.toString();
    
    // Redirección directa
    res.redirect(302, finalUrl);
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
