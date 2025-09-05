// api/contract-bridge.js

export default function handler(req, res) {
  try {
    const { lead_name, lead_id } = req.query;
    
    // Construir URL del formulario de Airtable
    const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
    const params = new URLSearchParams();
    
    // Datos del lead si están disponibles
    if (lead_name) {
      params.append('prefill_Client Name', lead_name);
      params.append('prefill_Legal Company Name', lead_name);
    }
    
    if (lead_id) {
      params.append('prefill_Close Lead ID', lead_id);
    }
    
    // Datos de prueba hardcodeados
    params.append('prefill_Client Domain', 'test-domain.com');
    params.append('prefill_Billing Address Street and Number', 'Test Street 123');
    params.append('prefill_Billing Address City', 'Test City');
    params.append('prefill_Billing Address ZIP Code', '12345');
    params.append('prefill_Billing Address Country', 'DE');
    params.append('prefill_Status', 'Contract Sent');
    params.append('prefill_Company Type', 'SaaS');
    params.append('prefill_Service Type', 'Done4You');
    
    const finalUrl = airtableFormUrl + '?' + params.toString();
    
    // Redirección
    res.writeHead(302, { Location: finalUrl });
    res.end();
    
  } catch (error) {
    // En caso de error, redirigir al formulario vacío
    res.writeHead(302, { 
      Location: 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form?prefill_Status=Contract%20Sent' 
    });
    res.end();
  }
}
