// Vercel serverless function - api/redirect.js
export default async function handler(req, res) {
    try {
        // Obtener parámetros de la URL
        const { contact_id, email, name, company, company_url, function: enrichFunction } = req.query;
        
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
                company_url: company_url || '',
                function: enrichFunction || 'phone'
            })
        });
        
        if (!response.ok) {
            throw new Error(`Make webhook failed: ${response.statusText}`);
        }
        
        // Respuesta al usuario
        res.status(200).json({
            success: true,
            message: 'Enviado a Clay para enriquecimiento',
            contact_id: contact_id,
            email: email
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
