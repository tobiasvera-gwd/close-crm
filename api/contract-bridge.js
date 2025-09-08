// api/contract-bridge.js
module.exports = async function handler(req, res) {
  try {
    const { lead_name, lead_id } = req.query;
    
    const params = new URLSearchParams();
    
    // Client Name básico
    const clientName = lead_name || 'Lead Name Required';
    params.append('prefill_Client Name', clientName);
    params.append('prefill_Legal Company Name', clientName);
    
    // Si tenemos lead_id, hacer lookup
    if (lead_id) {
      try {
        const CLOSE_API_KEY = 'api_05oaTCln3fAR3yzgbWKYeu.5VOdEOTNqRZWIj6WAOIsvB';
        
        const response = await fetch(`https://api.close.com/api/v1/lead/${lead_id}/`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(CLOSE_API_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const leadData = await response.json();
          
          // Domain
          if (leadData.url) {
            const cleanDomain = leadData.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
            params.append('prefill_Client Domain', cleanDomain);
          }
          
          // Address data
          if (leadData.addresses && leadData.addresses.length > 0) {
            const address = leadData.addresses[0];
            if (address.address_1) params.append('prefill_Billing Address Street and Number', address.address_1);
            if (address.city) params.append('prefill_Billing Address City', address.city);
            if (address.zipcode) params.append('prefill_Billing Address ZIP Code', address.zipcode);
            if (address.country) params.append('prefill_Billing Address Country', address.country);
          }
          
          // Update company name
          if (leadData.name) {
            params.set('prefill_Client Name', leadData.name);
            params.set('prefill_Legal Company Name', leadData.name);
          }
        }
      } catch (fetchError) {
        // Silent fail
      }
      
      params.append('prefill_Close Lead ID', lead_id);
    }
    
    // Defaults
    params.append('prefill_Status', 'Contract Sent');
    params.append('prefill_Company Type', 'Unknown');
    params.append('prefill_Service Type', 'Unknown');
    
    const finalUrl = `https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?${params.toString()}`;
    
    res.writeHead(302, { Location: finalUrl });
    res.end();
    
  } catch (error) {
    // Fallback simple
    const { lead_name, lead_id } = req.query;
    const fallbackParams = new URLSearchParams();
    fallbackParams.append('prefill_Status', 'Contract Sent');
    fallbackParams.append('prefill_Client Name', lead_name || 'Manual Entry Required');
    fallbackParams.append('prefill_Legal Company Name', lead_name || 'Manual Entry Required');
    if (lead_id) fallbackParams.append('prefill_Close Lead ID', lead_id);
    
    res.writeHead(302, { 
      Location: `https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?${fallbackParams.toString()}`
    });
    res.end();
  }
};
