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
        res.status(200).send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Enviado</title>
                <style>body{font-family:Arial;text-align:center;padding:50px;background:#f0f0f0;}</style>
            </head>
            <body>
                <h2>✅ An Clay zur Anreicherung gesendet</h2>
                <p><strong>${name}</strong></p>
                <p>${company}</p>
                <p>Diese Registerkarte wird in 1 Sekunde geschlossen...</p>
                <script>setTimeout(() => window.close(), 1000);</script>
            </body>
        </html>
        `);
        
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
