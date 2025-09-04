// api/create-contract.js (nota: carpeta "api" en la raíz, no "pages/api")
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Obtener datos de CloseCRM
    const {
      lead_name,
      lead_id
    } = req.query;

    console.log('Received params:', { lead_name, lead_id }); // Para debugging

    // Validación básica
    if (!lead_name) {
      return res.redirect('/error.html?message=' + encodeURIComponent('Falta el nombre del cliente en CloseCRM'));
    }

    // Redirigir al formulario de Airtable con datos precargados
    const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
    const redirectUrl = `${airtableFormUrl}?prefill_Client+Name=${encodeURIComponent(lead_name)}`;

    console.log('Redirecting to:', redirectUrl); // Para debugging

    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Error:', error);
    res.redirect('/error.html?message=' + encodeURIComponent('Error interno del sistema'));
  }
}
