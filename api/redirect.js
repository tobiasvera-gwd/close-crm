// Vercel serverless function - api/redirect.js
export default async function handler(req, res) {
    try {
        // Obtener parámetros de la URL
        const { contact_id, lead_id, name, company, domain } = req.query;
        
        // URL de Make webhook
        const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/w6p2uxzc6mpmpl88wx9bwzislvrl1ffg';
        
        // Enviar POST a Make con los datos
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contact_id: contact_id || '',
                lead_id: lead_id || '',
                name: name || '',
                company: company || '',
                domain: domain || ''
            })
        });
        
        if (!response.ok) {
            throw new Error(`Make webhook fehlgeschlagen: ${response.statusText}`);
        }
        
        // Respuesta al usuario
        res.status(200).json({
            success: true,
            message: 'An Clay zur Anreicherung gesendet',
            contact_id: contact_id,
            email: email
        });
        
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
