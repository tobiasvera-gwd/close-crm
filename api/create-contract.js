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
            max-width: 600px;
            width: 100%;
        }
        
        .logo {
            font-size: 2rem;
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
        
        .client-name {
            font-size: 1.8rem;
            color: #333;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .form-ready {
            color: #4CAF50;
            font-size: 1.2rem;
            margin-bottom: 20px;
        }
        
        .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
            text-align: left;
        }
        
        .detail-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        .detail-label {
            font-weight: bold;
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 5px;
        }
        
        .detail-value {
            color: #333;
            font-size: 1.1rem;
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
        
        .instructions {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 10px;
            margin-top: 25px;
            text-align: left;
        }
        
        .instructions h3 {
            color: #1976d2;
            margin-bottom: 15px;
        }
        
        .instructions p {
            color: #555;
            line-height: 1.6;
        }
        
        .error-state {
            background: #ffebee;
            color: #c62828;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        @media (max-width: 768px) {
            .details {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">📋 Grundwerk Digital</div>
        
        <div id="error-state" class="error-state" style="display: none;">
            <h2>❌ Error: Datos faltantes</h2>
            <p>No se pudo obtener la información del cliente desde CloseCRM.</p>
            <button onclick="window.close()">Cerrar</button>
        </div>
        
        <div id="success-state">
            <h1>📋 Formulario de contrato listo</h1>
            
            <div class="form-ready">✅ Form created for:</div>
            
            <div class="client-info">
                <div class="client-name" id="clientName">Cargando...</div>
            </div>
            
            <div class="details">
                <div class="detail-item">
                    <div class="detail-label">Lead ID</div>
                    <div class="detail-value" id="leadId">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Estado</div>
                    <div class="detail-value">Contract Creation</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value" id="contactEmail">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Contacto</div>
                    <div class="detail-value" id="contactName">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Dirección</div>
                    <div class="detail-value" id="address">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Dominio</div>
                    <div class="detail-value" id="domain">-</div>
                </div>
            </div>
            
            <button class="continue-button" id="continueButton">
                🚀 Ir al formulario de contrato
            </button>
            
            <div class="instructions">
                <h3>📋 Instrucciones:</h3>
                <p>Completa el formulario con todos los datos necesarios para generar el contrato. Los datos del cliente ya están precargados desde CloseCRM.</p>
            </div>
        </div>
    </div>

    <script>
        // Obtener TODOS los parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const leadName = urlParams.get('lead_name');
        const leadId = urlParams.get('lead_id');
        const contactEmail = urlParams.get('contact_email');
        const address = urlParams.get('address');
        const domain = urlParams.get('domain');
        const contactName = urlParams.get('contact_name');
        const notes = urlParams.get('notes');
        const linkedin = urlParams.get('linkedin');
        
        // Actualizar contenido con datos reales
        if (leadName) {
            document.getElementById('clientName').textContent = leadName;
        } else {
            document.getElementById('clientName').textContent = 'No disponible';
            document.getElementById('error-state').style.display = 'block';
            document.getElementById('success-state').style.display = 'none';
            return;
        }
        
        document.getElementById('leadId').textContent = leadId || 'No disponible';
        document.getElementById('contactEmail').textContent = contactEmail || 'No disponible';
        document.getElementById('address').textContent = address || 'No disponible';
        document.getElementById('domain').textContent = domain || 'No disponible';
        document.getElementById('contactName').textContent = contactName || 'No disponible';
        
        // Crear URL del formulario con TODOS los datos
        const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
        let formUrlWithData = `${airtableFormUrl}?prefill_Client+Name=${encodeURIComponent(leadName)}`;
        
        // Agregar otros campos al formulario si existen
        if (contactEmail) {
            formUrlWithData += `&prefill_Contact+Email=${encodeURIComponent(contactEmail)}`;
        }
        if (address) {
            formUrlWithData += `&prefill_Address=${encodeURIComponent(address)}`;
        }
        if (domain) {
            formUrlWithData += `&prefill_Domain=${encodeURIComponent(domain)}`;
        }
        if (contactName) {
            formUrlWithData += `&prefill_Contact+Name=${encodeURIComponent(contactName)}`;
        }
        if (leadId) {
            formUrlWithData += `&prefill_Close+Lead+ID=${encodeURIComponent(leadId)}`;
        }
        if (notes) {
            formUrlWithData += `&prefill_Notes=${encodeURIComponent(notes)}`;
        }
        if (linkedin) {
            formUrlWithData += `&prefill_LinkedIn=${encodeURIComponent(linkedin)}`;
        }
        
        // Configurar botón
        document.getElementById('continueButton').addEventListener('click', () => {
            window.open(formUrlWithData, '_blank');
        });
    </script>
</body>
</html>
