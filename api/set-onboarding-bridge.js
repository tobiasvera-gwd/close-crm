// api/set-onboarding-bridge.js
export default async function handler(req, res) {
  try {
    const { lead_name, lead_id } = req.query;
    
    const params = new URLSearchParams();
    
    // Solo pre-llenar el Close Lead ID para el lookup automático
    if (lead_id) {
      params.append('prefill_Close Lead ID', lead_id);
    }
    
    // El usuario completará manualmente:
    // - Contract Signee Name
    // - Contract Signed Date
    // - Notes (opcional)
    
    const finalUrl = `https://airtable.com/appxCc96K5ulNjpcL/pagPkMk6SYmEAm14I/form?${params.toString()}`;
    
    res.writeHead(302, { Location: finalUrl });
    res.end();
    
  } catch (error) {
    // Fallback simple
    res.writeHead(302, { 
      Location: 'https://airtable.com/appxCc96K5ulNjpcL/pagPkMk6SYmEAm14I/form' 
    });
    res.end();
  }
}
