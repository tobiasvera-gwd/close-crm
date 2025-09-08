// api/accounting-bridge.js
export default function handler(req, res) {
  try {
    const { lead_name, lead_id, legal_name, domain, address, city, zipcode, country } = req.query;
    
    const params = new URLSearchParams();
    
    // Company Name field - usar legal name si existe, sino display name
    if (legal_name) {
      params.append('prefill_Company Name', legal_name);
    } else if (lead_name) {
      params.append('prefill_Company Name', lead_name);
    }
    
    // Hidden fields para tracking (opcional)
    if (lead_id) params.append('prefill_Close Lead ID', lead_id);
    if (domain) {
      const cleanDomain = domain.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      params.append('prefill_Company Domain', cleanDomain);
    }
    
    // Address info in notes (para referencia)
    let notes = '';
    if (address || city || zipcode || country) {
      notes = `Address Info: ${address || ''} ${city || ''} ${zipcode || ''} ${country || ''}`.trim();
      params.append('prefill_Notes', notes);
    }
    
    // Redirect to Airtable form
    const finalUrl = `https://airtable.com/appxCc96K5ulNjpcL/pagpUoB9lGL6ai0Iy/form?${params.toString()}`;
    
    res.writeHead(302, { Location: finalUrl });
    res.end();
    
  } catch (error) {
    console.error('Error in accounting bridge:', error);
    
    // Fallback redirect
    res.writeHead(302, { 
      Location: 'https://airtable.com/appxCc96K5ulNjpcL/pagpUoB9lGL6ai0Iy/form' 
    });
    res.end();
  }
}
