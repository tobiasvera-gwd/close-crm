// api/accounting-bridge.js
export default function handler(req, res) {
  try {
    const { lead_name } = req.query;
    
    const params = new URLSearchParams();
    
    // Solo pre-llenar Company Name con el nombre del lead
    if (lead_name) {
      params.append('prefill_Company Name', lead_name);
    }
    
    // Redirect to Airtable form
    const finalUrl = `https://airtable.com/appxCc96K5ulNjpcL/pagpUoB9lGL6ai0Iy/form?${params.toString()}`;
    
    res.writeHead(302, { Location: finalUrl });
    res.end();
    
  } catch (error) {
    // Fallback redirect
    res.writeHead(302, { 
      Location: 'https://airtable.com/appxCc96K5ulNjpcL/pagpUoB9lGL6ai0Iy/form' 
    });
    res.end();
  }
}
