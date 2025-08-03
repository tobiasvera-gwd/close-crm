// Vercel serverless function - api/redirect.js
export default async function handler(req, res) {
    try {
        // Obtener parámetros de la URL
        const { contact_id, email, name, company, lead_url, linkedin, function: enrichFunction } = req.query;
        
        // URL de Make webhook
        const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/ihs69ldf5vmx7nl2e3y1gqxjqlgldxbt';
        
        // Enviar POST a Make con los datos
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contact_id: contact_id || '',
                email: email || '',
                name: name || '',
                company: company || '',
                lead_url: lead_url || '',
                linkedin: linkedin || '',
                function: enrichFunction || 'phone'
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
