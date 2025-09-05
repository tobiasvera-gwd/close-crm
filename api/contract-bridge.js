// api/contract-bridge.js

// Function to clean domain from URL
function cleanDomain(url) {
  if (!url) return '';
  
  try {
    // Remove protocol (http://, https://, ftp://, etc.)
    let domain = url.replace(/^https?:\/\//, '').replace(/^ftp:\/\//, '').replace(/^\/\//, '');
    
    // Remove www. prefix
    domain = domain.replace(/^www\./, '');
    
    // Remove trailing slash and any path
    domain = domain.split('/')[0];
    
    // Remove port number if present
    domain = domain.split(':')[0];
    
    // Remove any remaining whitespace
    domain = domain.trim();
    
    return domain;
  } catch (error) {
    console.log('Error cleaning domain:', error);
    return url; // Return original if cleaning fails
  }
}

export default async function handler(req, res) {
  try {
    const { lead_name, lead_id } = req.query;
    
    let leadData = {};
    
    // Si tenemos lead_id, obtener datos completos de CloseCRM
    if (lead_id) {
      try {
        const CLOSE_API_KEY = process.env.CLOSE_API_KEY;
        
        if (!CLOSE_API_KEY) {
          console.log('Warning: CLOSE_API_KEY not found in environment variables');
        } else {
          const closeResponse = await fetch(`https://api.close.com/api/v1/lead/${lead_id}/`, {
            headers: {
              'Authorization': `Bearer ${CLOSE_API_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (closeResponse.ok) {
            const closeData = await closeResponse.json();
            
            // Extraer datos del lead de CloseCRM
            leadData = {
              name: closeData.display_name || '',
              address_1: closeData.addresses?.[0]?.address_1 || '',
              city: closeData.addresses?.[0]?.city || '',
              zipcode: closeData.addresses?.[0]?.zipcode || '',
              country: closeData.addresses?.[0]?.country || '',
              state: closeData.addresses?.[0]?.state || '',
              // Intentar obtener el dominio de diferentes campos custom posibles
              domain: closeData.custom?.Domain || 
                      closeData.custom?.['cf_WjkAENp7Wl3eNRgU7fIabqURJs1oA9Eg6NmzJNaZo7F'] || 
                      closeData.url || ''
            };
            
            console.log('Lead data successfully fetched from CloseCRM:', {
              name: leadData.name,
              hasAddress: !!leadData.address_1,
              hasCity: !!leadData.city,
              hasDomain: !!leadData.domain
            });
          } else {
            console.log('CloseCRM API response error:', closeResponse.status, closeResponse.statusText);
          }
        }
      } catch (error) {
        console.log('Error fetching lead data from CloseCRM:', error.message);
      }
    }
    
    // Usar datos de CloseCRM o fallback a query params
    const finalData = {
      name: leadData.name || lead_name || '',
      address_1: leadData.address_1 || '',
      city: leadData.city || '',
      zipcode: leadData.zipcode || '',
      country: leadData.country || '',
      state: leadData.state || '',
      domain: leadData.domain || ''
    };
    
    // Construir URL del formulario de Airtable con datos completos
    const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
    const params = new URLSearchParams();
    
    // Client Information - llenar solo si están disponibles
    if (finalData.name) {
      params.append('prefill_Client Name', finalData.name);
      params.append('prefill_Legal Company Name', finalData.name);
    }
    if (finalData.domain) {
      params.append('prefill_Client Domain', finalData.domain);
    }
    
    // Billing Address Information - llenar solo si están disponibles
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
    
    // Status y campos por defecto - siempre se establecen
    params.append('prefill_Status', 'Contract Sent');
    params.append('prefill_Company Type', 'Unknown');
    params.append('prefill_Service Type', 'Unknown');
    
    // Close Lead ID - siempre disponible si llegamos aquí
    if (lead_id) {
      params.append('prefill_Close Lead ID', lead_id);
    }
    
    // Construir URL final
    const finalUrl = airtableFormUrl + '?' + params.toString();
    
    // Log para debugging
    console.log('Redirecting to Airtable form with data:', {
      hasName: !!finalData.name,
      hasAddress: !!finalData.address_1,
      hasCity: !!finalData.city,
      hasLeadId: !!lead_id,
      paramCount: params.toString().split('&').length
    });
    
    // Redirección directa al formulario
    res.redirect(302, finalUrl);
    
  } catch (error) {
    console.error('Unexpected error in contract bridge:', error);
    
    // Fallback completo: redirigir al formulario con datos mínimos disponibles
    try {
      const fallbackParams = new URLSearchParams();
      fallbackParams.append('prefill_Status', 'Contract Sent');
      
      if (req.query.lead_name) {
        fallbackParams.append('prefill_Client Name', req.query.lead_name);
        fallbackParams.append('prefill_Legal Company Name', req.query.lead_name);
      }
      if (req.query.lead_id) {
        fallbackParams.append('prefill_Close Lead ID', req.query.lead_id);
      }
      
      const fallbackUrl = `https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?${fallbackParams.toString()}`;
      
      console.log('Using fallback redirect due to error');
      res.redirect(302, fallbackUrl);
      
    } catch (fallbackError) {
      console.error('Even fallback failed:', fallbackError);
      
      // Último recurso: formulario completamente vacío
      res.redirect(302, 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?prefill_Status=Contract%20Sent');
    }
  }
}
