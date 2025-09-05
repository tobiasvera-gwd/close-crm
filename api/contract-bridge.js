// api/contract-bridge.js

// Function to clean domain from URL
function cleanDomain(url) {
  if (!url) return '';
  
  try {
    let domain = url.replace(/^https?:\/\//, '').replace(/^ftp:\/\//, '').replace(/^\/\//, '');
    domain = domain.replace(/^www\./, '');
    domain = domain.split('/')[0];
    domain = domain.split(':')[0];
    domain = domain.trim();
    return domain;
  } catch (error) {
    return url;
  }
}

export default async function handler(req, res) {
  try {
    const { lead_name, lead_id } = req.query;
    
    let leadData = {};
    
    // Obtener datos reales de CloseCRM si tenemos lead_id
    if (lead_id) {
      try {
        const CLOSE_API_KEY = process.env.CLOSE_API_KEY;
        
        if (CLOSE_API_KEY) {
          const closeResponse = await fetch(`https://api.close.com/api/v1/lead/${lead_id}/`, {
            headers: {
              'Authorization': `Bearer ${CLOSE_API_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (closeResponse.ok) {
            const closeData = await closeResponse.json();
            
            leadData = {
              name: closeData.display_name || '',
              address_1: closeData.addresses?.[0]?.address_1 || '',
              city: closeData.addresses?.[0]?.city || '',
              zipcode: closeData.addresses?.[0]?.zipcode || '',
              country: closeData.addresses?.[0]?.country || '',
              domain: cleanDomain(closeData.url || '')
            };
          }
        }
      } catch (error) {
        // Si falla la API, continuar con datos básicos
      }
    }
    
    // Usar datos de CloseCRM o fallback
    const finalData = {
      name: leadData.name || lead_name || '',
      address_1: leadData.address_1 || '',
      city: leadData.city || '',
      zipcode: leadData.zipcode || '',
      country: leadData.country || '',
      domain: leadData.domain || ''
    };
    
    // Construir URL del formulario de Airtable
    const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
    const params = new URLSearchParams();
    
    // Client Information
    if (finalData.name) {
      params.append('prefill_Client Name', finalData.name);
      params.append('prefill_Legal Company Name', finalData.name);
    }
    if (finalData.domain) {
      params.append('prefill_Client Domain', finalData.domain);
    }
    
    // Billing Address Information
    if (finalData.address_1) {
      params.append('prefill_Billing Address Street and Number', finalData.address_1);
    }
    if (finalData.city) {
      params.append('prefill_Billing Address City', finalData.city);
    }
    if (finalData.zipcode) {
      params.append('prefill_Billing Address ZIP Code', finalData.zipcode);
    }
    if (finalData.country) {
      params.append('prefill_Billing Address Country', finalData.country);
    }
    
    // Status y campos por defecto
    params.append('prefill_Status', 'Contract Sent');
    params.append('prefill_Company Type', 'Unknown');
    params.append('prefill_Service Type', 'Unknown');
    
    // Close Lead ID
    if (lead_id) {
      params.append('prefill_Close Lead ID', lead_id);
    }
    
    const finalUrl = airtableFormUrl + '?' + params.toString();
    
    // Redirección
    res.writeHead(302, { Location: finalUrl });
    res.end();
    
  } catch (error) {
    // Fallback en caso de error
    res.writeHead(302, { 
      Location: 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?prefill_Status=Contract%20Sent' 
    });
    res.end();
  }
}
