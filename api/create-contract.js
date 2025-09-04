// api/create-contract.js
export default async function handler(req, res) {
  // Permitir GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Obtener parámetros de CloseCRM
    const {
      lead_id,
      lead_name
    } = req.query;

    console.log('Received from CloseCRM:', { lead_id, lead_name });

    // Validar datos requeridos
    if (!lead_name) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h2>❌ Error: Missing Client Name</h2>
            <p>No se pudo obtener el nombre del cliente desde CloseCRM.</p>
            <button onclick="window.close()">Cerrar</button>
          </body>
        </html>
      `);
    }

    // Crear la URL del formulario de Airtable con datos precargados
    const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
    const formUrlWithData = `${airtableFormUrl}?prefill_Client+Name=${encodeURIComponent(lead_name)}`;

    // Devolver una página HTML que redirige al formulario
    const landingPageHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contract Creation - Grundwerk Digital</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
            }
            
            .logo {
                font-size: 1.5rem;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 30px;
            }
            
            .client-info {
                background: #f8f9fa;
                padding: 25px;
                border-radius: 15px;
                margin: 20px 0;
                border-left: 5px solid #667eea;
            }
            
            .form-ready {
                color: #4CAF50;
                font-size: 1.2rem;
                margin-bottom: 15px;
            }
            
            .client-name {
                font-size: 1.8rem;
                color: #333;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .lead-id {
                color: #666;
                font-size: 0.9rem;
            }
            
            .continue-button {
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                padding: 15px 40px;
                border: none;
                border-radius: 30px;
                font-size: 1.2rem;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.3s, box-shadow 0.3s;
                margin-top: 30px;
            }
            
            .continue-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">📋 Grundwerk Digital</div>
            
            <h1>Contract Form Ready</h1>
            
            <div class="form-ready">✅ Form created for:</div>
            
            <div class="client-info">
                <div class="client-name">${lead_name}</div>
                ${lead_id ? `<div class="lead-id">Lead ID: ${lead_id}</div>` : ''}
            </div>
            
            <button class="continue-button" onclick="goToForm()">
                🚀 Go to Contract Form
            </button>
        </div>

        <script>
            function goToForm() {
                const formUrl = '${formUrlWithData}';
                window.open(formUrl, '_blank');
            }
        </script>
    </body>
    </html>
    `;

    // Devolver la página HTML
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(landingPageHtml);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h2>❌ Error interno</h2>
          <p>Contacta al equipo técnico.</p>
          <button onclick="window.close()">Cerrar</button>
        </body>
      </html>
    `);
  }
}
