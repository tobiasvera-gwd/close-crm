// api/contract-bridge.js
export default function handler(req, res) {
  try {
    const { lead_name, lead_id, domain, address, city, zipcode, country } = req.query;
    
    const params = new URLSearchParams();
    
    // Client Name - siempre necesario, usar fallback si está vacío
    const clientName = lead_name && lead_name.trim() !== '' ? lead_name : 'Lead Name Required';
    params.append('prefill_Client Name', clientName);
    params.append('prefill_Legal Company Name', clientName);
    
    // Domain - solo si tiene valor
    if (domain && domain.trim() !== '') {
      const cleanDomain = domain.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      params.append('prefill_Client Domain', cleanDomain);
    }
    
    // Address fields - solo si tienen valores
    if (address && address.trim() !== '') {
      params.append('prefill_Billing Address Street and Number', address);
    }
    if (city && city.trim() !== '') {
      params.append('prefill_Billing Address City', city);
    }
    if (zipcode && zipcode.trim() !== '') {
      params.append('prefill_Billing Address ZIP Code', zipcode);
    }
    if (country && country.trim() !== '') {
      params.append('prefill_Billing Address Country', country);
    }
    
    // Lead ID - solo si existe
    if (lead_id && lead_id.trim() !== '') {
      params.append('prefill_Close Lead ID', lead_id);
    }
    
    // Defaults que siempre se establecen
    params.append('prefill_Status', 'Contract Sent');
    params.append('prefill_Company Type', 'Unknown');
    params.append('prefill_Service Type', 'Unknown');
    
    const finalUrl = `https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?${params.toString()}`;
    
    res.writeHead(302, { Location: finalUrl });
    res.end();
    
  } catch (error) {
    // Fallback robusto
    const fallbackParams = new URLSearchParams();
    fallbackParams.append('prefill_Status', 'Contract Sent');
    fallbackParams.append('prefill_Client Name', 'Manual Entry Required');
    fallbackParams.append('prefill_Legal Company Name', 'Manual Entry Required');
    fallbackParams.append('prefill_Company Type', 'Unknown');
    fallbackParams.append('prefill_Service Type', 'Unknown');
    
    res.writeHead(302, { 
      Location: `https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?${fallbackParams.toString()}`
    });
    res.end();
  }
}
