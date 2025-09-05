// api/contract-bridge.js

export default function handler(req, res) {
  try {
    const { lead_name, lead_id, domain, address, city, zipcode, country } = req.query;
    
    const params = new URLSearchParams();
    
    // Client Information - usar lo que esté disponible
    if (lead_name) {
      params.append('prefill_Client Name', lead_name);
      params.append('prefill_Legal Company Name', lead_name);
    }
    
    // Domain - limpiar si existe
    if (domain) {
      const cleanDomain = domain.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      params.append('prefill_Client Domain', cleanDomain);
    }
    
    // Address fields - solo si existen
    if (address) params.append('prefill_Billing Address Street and Number', address);
    if (city) params.append('prefill_Billing Address City', city);
    if (zipcode) params.append('prefill_Billing Address ZIP Code', zipcode);
    if (country) params.append('prefill_Billing Address Country', country);
    if (lead_id) params.append('prefill_Close Lead ID', lead_id);
    
    // Defaults que siempre se establecen
    params.append('prefill_Status', 'Contract Sent');
    params.append('prefill_Company Type', 'Unknown');
    params.append('prefill_Service Type', 'Unknown');
    
    const finalUrl = `https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?${params.toString()}`;
    
    res.writeHead(302, { Location: finalUrl });
    res.end();
    
  } catch (error) {
    // Fallback para cualquier error
    res.writeHead(302, { 
      Location: 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?prefill_Status=Contract%20Sent' 
    });
    res.end();
  }
}
