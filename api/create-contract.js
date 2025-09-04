<!DOCTYPE html>
<html lang="en">
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
        
        .missing-data {
            color: #ff6b6b;
            font-style: italic;
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
        
        .continue-button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
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
        
        .missing-fields {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: left;
        }
        
        .missing-fields h3 {
            color: #856404;
            margin-bottom: 15px;
        }
        
        .missing-fields ul {
            color: #856404;
            padding-left: 20px;
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
            <h2>❌ Error: Missing Client Data</h2>
            <p>Could not retrieve client information from CloseCRM.</p>
            <button onclick="window.close()">Close Window</button>
        </div>
        
        <div id="success-state">
            <h1>📋 Contract Form Ready</h1>
            
            <div class="form-ready">✅ Form created for:</div>
            
            <div class="client-info">
                <div class="client-name" id="clientName">Loading...</div>
            </div>
            
            <div class="details">
                <div class="detail-item">
                    <div class="detail-label">Lead ID</div>
                    <div class="detail-value" id="leadId">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">Contract Creation</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Contact Email</div>
                    <div class="detail-value" id="contactEmail">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Contact Name</div>
                    <div class="detail-value" id="contactName">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Address</div>
                    <div class="detail-value" id="address">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Domain</div>
                    <div class="detail-value" id="domain">-</div>
                </div>
            </div>
            
            <div id="missing-fields" class="missing-fields" style="display: none;">
                <h3>⚠️ Missing Required Data:</h3>
                <ul id="missing-list"></ul>
                <p style="margin-top: 10px;"><strong>Please update these fields in CloseCRM before proceeding.</strong></p>
            </div>
            
            <button class="continue-button" id="continueButton">
                🚀 Go to Contract Form
            </button>
            
            <div class="instructions">
                <h3>📋 Instructions:</h3>
                <p>Complete the form with all necessary data to generate the contract. Client data is pre-filled from CloseCRM.</p>
            </div>
        </div>
    </div>

    <script>
        // Get ALL parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const leadName = urlParams.get('lead_name');
        const leadId = urlParams.get('lead_id');
        const contactEmail = urlParams.get('contact_email');
        const address = urlParams.get('address');
        const domain = urlParams.get('domain');
        const contactName = urlParams.get('contact_name');
        const notes = urlParams.get('notes');
        const linkedin = urlParams.get('linkedin');
        
        console.log('Received data:', { leadName, leadId, contactEmail, address, domain, contactName, notes, linkedin });
        
        // Check for missing required data
        const missingFields = [];
        if (!leadName) missingFields.push('Client Name');
        if (!contactEmail) missingFields.push('Contact Email');
        if (!contactName) missingFields.push('Contact Name');
        
        // Show error if no client name
        if (!leadName) {
            document.getElementById('error-state').style.display = 'block';
            document.getElementById('success-state').style.display = 'none';
            return;
        }
        
        // Update content with real data
        document.getElementById('clientName').textContent = leadName;
        document.getElementById('leadId').textContent = leadId || 'Not available';
        document.getElementById('contactEmail').textContent = contactEmail || 'Missing';
        document.getElementById('address').textContent = address || 'Not provided';
        document.getElementById('domain').textContent = domain || 'Not provided';
        document.getElementById('contactName').textContent = contactName || 'Missing';
        
        // Show missing fields warning if any
        if (missingFields.length > 0) {
            const missingDiv = document.getElementById('missing-fields');
            const missingList = document.getElementById('missing-list');
            
            missingFields.forEach(field => {
                const li = document.createElement('li');
                li.textContent = field;
                missingList.appendChild(li);
            });
            
            missingDiv.style.display = 'block';
        }
        
        // Create Airtable form URL with ALL available data
        const airtableFormUrl = 'https://airtable.com/appxCc96K5ulNjpcL/pagVjxOWAS0rICA5j/form';
        let formUrlWithData = `${airtableFormUrl}?prefill_Client+Name=${encodeURIComponent(leadName)}`;
        
        // Add other fields to form if they exist
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
        
        // Configure button
        document.getElementById('continueButton').addEventListener('click', () => {
            window.open(formUrlWithData, '_blank');
        });
    </script>
</body>
</html>
