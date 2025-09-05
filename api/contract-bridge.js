// api/contract-bridge.js

export default async function handler(req, res) {
  console.log('=== SIMPLE TEST ===');
  console.log('Query params:', req.query);
  
  const { lead_name, lead_id } = req.query;
  
  // Test básico: simplemente pasar los parámetros que llegaron
  const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
  const params = new URLSearchParams();
  
  // Usar datos básicos que llegaron en la URL
  if (lead_name) {
    params.append('prefill_Client Name', lead_name);
    params.append('prefill_Legal Company Name', lead_name);
    console.log('Using lead_name:', lead_name);
  }
  
  if (lead_id) {
    params.append('prefill_Close Lead ID', lead_id);
    console.log('Using lead_id:', lead_id);
  }
  
  // Hardcoded test data para verificar que el mecanismo funciona
  params.append('prefill_Client Domain', 'test-domain.com');
  params.append('prefill_Billing Address Street and Number', 'Test Street 123');
  params.append('prefill_Billing Address City', 'Test City');
  params.append('prefill_Billing Address ZIP Code', '12345');
  params.append('prefill_Billing Address Country', 'DE');
  
  params.append('prefill_Status', 'Contract Sent');
  params.append('prefill_Company Type', 'SaaS');
  params.append('prefill_Service Type', 'Done4You');
  
  const finalUrl = airtableFormUrl + '?' + params.toString();
  console.log('Redirecting to:', finalUrl);
  
  res.redirect(302, finalUrl);
}
  res.redirect(302, finalUrl);
}
