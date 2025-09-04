<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contract Details Form - Grundwerk Digital</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2rem; margin-bottom: 10px; }
        .header p { opacity: 0.9; }
        .form-section {
            padding: 30px;
        }
        .section-title {
            color: #333;
            font-size: 1.3rem;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .form-row-triple {
            display: grid;
            grid-template-columns: 2fr 1fr 2fr;
            gap: 15px;
        }
        label {
            display: block;
            font-weight: 600;
            color: #444;
            margin-bottom: 8px;
        }
        .required { color: #e74c3c; }
        input, select, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        .prefilled {
            background-color: #f8f9fa;
            border-color: #28a745;
        }
        .prefilled::before {
            content: "✓ ";
            color: #28a745;
        }
        .help-text {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .contract-preview {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .contract-preview h4 {
            color: #333;
            margin-bottom: 15px;
        }
        .contract-text {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            color: #444;
        }
        .submit-section {
            padding: 30px;
            background: #f8f9fa;
            text-align: center;
        }
        .submit-btn {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
        }
        @media (max-width: 768px) {
            .form-row, .form-row-triple { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Contract Creation Form</h1>
            <p>Complete all details to generate the service contract</p>
        </div>

        <form class="form-section">
            <!-- Client Information (Pre-filled from CloseCRM) -->
            <div class="section-title">Client Information (from CloseCRM)</div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Client Name <span class="required">*</span></label>
                    <input type="text" id="clientName" class="prefilled" value="Bigleet GmbH" readonly>
                    <div class="help-text">Automatically filled from CloseCRM</div>
                </div>
                <div class="form-group">
                    <label>CloseCRM Lead ID</label>
                    <input type="text" id="leadId" class="prefilled" value="lead_AyN1VXZdUt5LkLqFk13IkELlhZzT5X4T2aWphQBFokY" readonly>
                </div>
            </div>

            <!-- Legal Company Information (to be completed) -->
            <div class="section-title">Legal Company Details</div>
            
            <div class="form-group">
                <label>Complete Legal Company Name <span class="required">*</span></label>
                <input type="text" id="legalName" placeholder="e.g., Bigleet GmbH" required>
                <div class="help-text">Include legal form (GmbH, AG, Ltd., etc.)</div>
            </div>

            <div class="form-group">
                <label>Billing Address - Street and Number <span class="required">*</span></label>
                <input type="text" id="address" placeholder="e.g., Hauptstraße 123" required>
            </div>

            <div class="form-row-triple">
                <div class="form-group">
                    <label>City <span class="required">*</span></label>
                    <input type="text" id="city" placeholder="e.g., Berlin" required>
                </div>
                <div class="form-group">
                    <label>ZIP Code <span class="required">*</span></label>
                    <input type="text" id="zipCode" placeholder="e.g., 10437" required>
                </div>
                <div class="form-group">
                    <label>Country</label>
                    <select id="country">
                        <option value="Deutschland">Deutschland</option>
                        <option value="Österreich">Österreich</option>
                        <option value="Schweiz">Schweiz</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Contract Signed By (Authorized Representative) <span class="required">*</span></label>
                <input type="text" id="signedBy" placeholder="e.g., Max Mustermann, CEO" required>
                <div class="help-text">Full name and title of the person authorized to sign</div>
            </div>

            <!-- Service Details -->
            <div class="section-title">Service Configuration</div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Monthly Retainer (€) <span class="required">*</span></label>
                    <input type="number" id="monthlyRetainer" placeholder="e.g., 2500" required>
                    <div class="help-text">Net amount in Euro</div>
                </div>
                <div class="form-group">
                    <label>Setup Fee (€)</label>
                    <input type="number" id="setupFee" placeholder="e.g., 1500">
                    <div class="help-text">One-time setup fee (if applicable)</div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Contract Duration</label>
                    <select id="contractType">
                        <option value="12weeks">12 Weeks (Setup + 8 weeks campaigns)</option>
                        <option value="6months">6 Months minimum term</option>
                        <option value="12months">12 Months minimum term</option>
                        <option value="unlimited">Unlimited with minimum term</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Number of Domains to Setup</label>
                    <input type="number" id="domainsCount" placeholder="e.g., 3" min="1" max="10">
                </div>
            </div>

            <div class="form-group">
                <label>Outreach Software</label>
                <select id="outreachSoftware">
                    <option value="instantly">Instantly</option>
                    <option value="lemlist">Lemlist</option>
                    <option value="heyreach">HeyReach</option>
                    <option value="multiple">Multiple Platforms</option>
                </select>
            </div>

            <!-- Contract Preview -->
            <div class="contract-preview">
                <h4>📄 Contract Preview</h4>
                <div class="contract-text">
                    <strong>Grundwerk Digital GmbH</strong><br>
                    Pappelallee 78/79<br>
                    10437 Berlin<br>
                    Vertreten durch: Tom Soto Schiller<br>
                    Nachfolgend "Auftragnehmer" genannt
                    <br><br>
                    <strong id="previewLegalName">[Company Legal Name]</strong><br>
                    <span id="previewAddress">[Street and Number]</span><br>
                    <span id="previewZip">[ZIP]</span> <span id="previewCity">[City]</span><br>
                    Vertreten durch: <span id="previewSignedBy">[Authorized Representative]</span><br>
                    Nachfolgend "Auftraggeber" genannt
                </div>
            </div>

            <!-- Additional Notes -->
            <div class="form-group">
                <label>Additional Notes / Special Requirements</label>
                <textarea id="notes" rows="4" placeholder="Any special requirements or notes for this contract..."></textarea>
            </div>
        </form>

        <div class="submit-section">
            <button type="submit" class="submit-btn">🚀 Generate Contract in PandaDoc</button>
            <div style="margin-top: 15px; color: #666; font-size: 14px;">
                This will create a new contract in PandaDoc and update CloseCRM with the contract link
            </div>
        </div>
    </div>

    <script>
        // Get parameters from URL (from CloseCRM)
        const urlParams = new URLSearchParams(window.location.search);
        
        // CloseCRM Variables
        const leadName = urlParams.get('lead_name');           // {{lead.display_name}}
        const leadId = urlParams.get('lead_id');               // {{lead.id}}
        const contactEmail = urlParams.get('contact_email');   // {{contact.email}}
        const address1 = urlParams.get('address_1');           // {{lead.primary_address.address_1}}
        const city = urlParams.get('city');                    // {{lead.primary_address.city}}
        const zipcode = urlParams.get('zipcode');              // {{lead.primary_address.zipcode}}
        const country = urlParams.get('country');              // {{lead.primary_address.country}}
        
        // Fill form fields with CloseCRM data
        function populateFormFromCloseCRM() {
            // Read-only fields
            if (leadId) document.getElementById('leadId').value = leadId;
            if (contactEmail) document.getElementById('contactEmail').value = contactEmail;
            
            // Editable but pre-filled fields
            if (leadName) document.getElementById('legalName').value = leadName;
            if (address1) document.getElementById('address').value = address1;
            if (city) document.getElementById('city').value = city;
            if (zipcode) document.getElementById('zipCode').value = zipcode;
            if (country) document.getElementById('country').value = country;
            
            // Add visual indicator for pre-filled fields
            const prefilledFields = ['legalName', 'address', 'city', 'zipCode', 'country'];
            prefilledFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && field.value) {
                    field.classList.add('prefilled');
                    field.style.borderColor = '#28a745';
                }
            });
            
            // Update preview immediately
            updatePreview();
        }

        // Live preview update
        function updatePreview() {
            document.getElementById('previewLegalName').textContent = 
                document.getElementById('legalName').value || '[Company Legal Name]';
            document.getElementById('previewAddress').textContent = 
                document.getElementById('address').value || '[Street and Number]';
            document.getElementById('previewZip').textContent = 
                document.getElementById('zipCode').value || '[ZIP]';
            document.getElementById('previewCity').textContent = 
                document.getElementById('city').value || '[City]';
            document.getElementById('previewSignedBy').textContent = 
                document.getElementById('signedBy').value || '[Authorized Representative]';
        }

        // Add event listeners for live preview
        ['legalName', 'address', 'zipCode', 'city', 'signedBy'].forEach(id => {
            document.getElementById(id).addEventListener('input', updatePreview);
        });

        // Initialize form with CloseCRM data
        populateFormFromCloseCRM();
        
        // Log received data for debugging
        console.log('CloseCRM Data Received:', {
            leadName, leadId, contactEmail, address1, city, zipcode, country
        });
    </script>
</body>
</html>
