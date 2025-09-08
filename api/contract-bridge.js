// api/contract-bridge.js
export default async function handler(req, res) {
  try {
    const { lead_name, lead_id } = req.query;
    
    const params = new URLSearchParams();
    
    // Debug: verificar qué datos llegan
    console.log('=== DEBUG INFO ===');
    console.log('lead_name:', lead_name);
    console.log('lead_id:', lead_id);
    console.log('API key exists:', !!process.env.CLOSE_API_KEY);
    console.log('API key first chars:', process.env.CLOSE_API_KEY ? process.env.CLOSE_API_KEY.substring(0, 10) + '...' : 'NOT FOUND');
    
    // Client Name básico
    const clientName = lead_name && lead_name.trim() !== '' ? lead_name : 'Lead Name Required';
    params.append('prefill_Client Name', clientName);
    params.append('prefill_Legal Company Name', clientName);
    
    // Debug en Notes
    let debugInfo = `Debug: lead_name=${lead_name}, lead_id=${lead_id}, api_key_exists=${!!process.env.CLOSE_API_KEY}`;
    
    // Si tenemos lead_id, hacer lookup
    if (lead_id && lead_id.trim() !== '' && process.env.CLOSE_API_KEY) {
      try {
        console.log('Making API call to CloseCRM...');
        
        const response = await fetch(`https://api.close.com/api/v1/lead/${lead_id}/`, {
          headers: {
            'Authorization': `Bearer ${process.env.CLOSE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API Response status:', response.status);
        
        if (response.ok) {
          const leadData = await response.json();
          console.log('Lead data received:', leadData.name);
          
          debugInfo += ` | API_SUCCESS: ${leadData.name}`;
          
          // Domain
          if (leadData.url) {
            const cleanDomain = leadData.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
            params.append('prefill_Client Domain', cleanDomain);
            debugInfo += ` | domain=${cleanDomain}`;
          }
          
          // Address data
          if (leadData.addresses && leadData.addresses.length > 0) {
            const address = leadData.addresses[0];
            if (address.address_1) {
              params.append('prefill_Billing Address Street and Number', address.address_1);
              debugInfo += ` | address=${address.address_1}`;
            }
            if (address.city) params.append('prefill_Billing Address City', address.city);
            if (address.zipcode) params.append('prefill_Billing Address ZIP Code', address.zipcode);
            if (address.country) params.append('prefill_Billing Address Country', address.country);
          }
          
          // Update company name
          if (leadData.name && leadData.name.trim() !== '') {
            params.set('prefill_Client Name', leadData.name);
            params.set('prefill_Legal Company Name', leadData.name);
          }
        } else {
          const errorText = await response.text();
          console.log('API Error:', response.status, errorText);
          debugInfo += ` | API_ERROR: ${response.status}`;
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        debugInfo += ` | FETCH_ERROR: ${fetchError.message}`;
      }
      
      params.append('prefill_Close Lead ID', lead_id);
    } else {
      debugInfo += ' | NO_LOOKUP: missing lead_id or api_key';
    }
    
    // Agregar debug info en Notes
    params.append('prefill_Notes', debugInfo);
    
    // Defaults
    params.append('prefill_Status', 'Contract Sent');
    params.append('prefill_Company Type', 'Unknown');
    params.append('prefill_Service Type', 'Unknown');
    
    const finalUrl = `https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?${params.toString()}`;
    
    res.writeHead(302, { Location: finalUrl });
    res.end();
    
  } catch (error) {
    console.error('Error in contract bridge:', error);
    
    // Fallback con error info
    const { lead_name, lead_id } = req.query;
    const fallbackParams = new URLSearchParams();
    fallbackParams.append('prefill_Status', 'Contract Sent');
    fallbackParams.append('prefill_Client Name', lead_name || 'Manual Entry Required');
    fallbackParams.append('prefill_Legal Company Name', lead_name || 'Manual Entry Required');
    fallbackParams.append('prefill_Notes', `ERROR: ${error.message}`);
    if (lead_id) fallbackParams.append('prefill_Close Lead ID', lead_id);
    
    res.writeHead(302, { 
      Location: `https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?${fallbackParams.toString()}`
    });
    res.end();
  }
}
