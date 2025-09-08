// Script combinado: Update Client Database from Forms: Contract Signed + Send Webhook
let formsTable = base.getTable("Forms: Contract Signed");
let clientTable = base.getTable("Client Database");
let makeWebhookUrl = "https://hook.eu2.make.com/pckxjuci6f95xak4mvc6qbl3qn2iqqfw";

console.log("Starting Client Database update script + webhook...");

let query = await formsTable.selectRecordsAsync();
let processedRecords = 0;

// Get the exact status options to avoid any formatting issues
let statusField = clientTable.getField('Status');
let statusOptions = statusField.options.choices;
let onboardingOption = statusOptions.find(option => option.name === 'Onboarding');

console.log(`Status options available:`, statusOptions.map(opt => `"${opt.name}"`));
console.log(`Onboarding option found:`, onboardingOption);

for (let record of query.records) {
    try {
        // Check if already processed
        let updateSent = record.getCellValue("Update Sent");
        if (updateSent) {
            continue;
        }
        
        processedRecords++;
        console.log(`Processing form record: ${record.id}`);
        
        // Get form data
        let clientRecord = record.getCellValue("Client");
        let contractSigneeName = record.getCellValue("Contract Signee Name");
        let contractSignedDate = record.getCellValue("Contract Signed Date");
        let clientNameFromLookup = record.getCellValue("Client Name (from Client)");
        
        console.log(`Contract Signee: ${contractSigneeName}`);
        console.log(`Contract Signed Date: ${contractSignedDate}`);
        console.log(`Client: ${clientNameFromLookup}`);
        
        // Create automatic record name WITHOUT parentheses
        let recordName = clientNameFromLookup ? 
            `Contract Signed - ${clientNameFromLookup}` : 
            `Contract Signed - ${contractSigneeName || 'Unknown'}`;
        
        console.log(`Record name will be: ${recordName}`);
        
        // Verify we have required data
        if (!clientRecord || clientRecord.length === 0) {
            console.log("No client linked, skipping...");
            continue;
        }
        
        if (!contractSigneeName || !contractSignedDate) {
            console.log("Missing signee name or date, skipping...");
            continue;
        }
        
        let clientRecordId = clientRecord[0].id;
        console.log(`Client Record ID: ${clientRecordId}`);
        
        // === STEP 1: UPDATE CLIENT DATABASE ===
        console.log("=== STEP 1: Updating Client Database ===");
        
        // Prepare update data with exact field validation
        let updateData = {};
        
        // Contract Signee Name - verified as singleLineText
        updateData['Contract Signee Name'] = String(contractSigneeName);
        
        // Contract Signed Date - ensure proper date format
        if (contractSignedDate) {
            // If it's already a proper date, use it directly
            if (contractSignedDate instanceof Date) {
                updateData['Contract Signed Date'] = contractSignedDate;
            } 
            // If it's a string, ensure it's a proper date format
            else if (typeof contractSignedDate === 'string') {
                // Check if it's just a year (like "2025")
                if (contractSignedDate.length === 4 && !isNaN(contractSignedDate)) {
                    // If it's just a year, use today's date with that year
                    let today = new Date();
                    updateData['Contract Signed Date'] = new Date(parseInt(contractSignedDate), today.getMonth(), today.getDate());
                } else {
                    // Try to parse the date string normally
                    let parsedDate = new Date(contractSignedDate);
                    if (!isNaN(parsedDate.getTime())) {
                        updateData['Contract Signed Date'] = parsedDate;
                    } else {
                        // If parsing fails, use today's date
                        updateData['Contract Signed Date'] = new Date();
                    }
                }
            } else {
                // If it's neither Date nor string, use today's date
                updateData['Contract Signed Date'] = new Date();
            }
            
            console.log(`Processed date: ${updateData['Contract Signed Date']}`);
        }
        
        // Status - use the exact option object, not just the string
        if (onboardingOption) {
            updateData['Status'] = {name: onboardingOption.name};
        } else {
            console.log("❌ Onboarding option not found in status choices");
            continue;
        }
        
        console.log(`Final update data:`, updateData);
        
        // Update Client Database
        await clientTable.updateRecordAsync(clientRecordId, updateData);
        console.log(`✅ Updated client ${clientRecordId}`);
        
        // === STEP 2: GET UPDATED CLIENT DATA FOR WEBHOOK ===
        console.log("=== STEP 2: Getting updated client data for webhook ===");
        
        // Get the freshly updated client record with all data
        let updatedClientRecord = await clientTable.selectRecordAsync(clientRecordId);
        
        // Prepare webhook payload with updated data from Client Database
        let payload = {
            // Basic info
            event: "client_onboarding",
            recordId: updatedClientRecord.id,
            clientId: updatedClientRecord.getCellValue("Client ID"),
            clientName: updatedClientRecord.getCellValue("Client Name"),
            currentStatus: updatedClientRecord.getCellValue("Status")?.name,
            timestamp: new Date().toISOString(),
            
            // Contract & Financial info
            setupFee: updatedClientRecord.getCellValue("Setup Fee (€)") || 0,
            retainer: updatedClientRecord.getCellValue("Retainer (€)") || 0,
            provision: updatedClientRecord.getCellValue("Provision (€)") || 0,
            pricePerLead: updatedClientRecord.getCellValue("Preis pro Lead (€)") || "",
            pricePerAppointment: updatedClientRecord.getCellValue("Preis Pro Appointment (€)") || 0,
            dealSize: updatedClientRecord.getCellValue("Deal Size") || 0,
            
            // Contract dates and terms (now updated)
            contractStartDate: updatedClientRecord.getCellValue("Contract Start Date"),
            contractEndDate: updatedClientRecord.getCellValue("Contract End Date"),
            contractSignedDate: updatedClientRecord.getCellValue("Contract Signed Date"),
            laufzeit: updatedClientRecord.getCellValue("Laufzeit"),
            mindestlaufzeit: updatedClientRecord.getCellValue("Mindestlaufzeit"),
            kündigungsfrist: updatedClientRecord.getCellValue("Kündigungsfrist"),
            
            // Contract signee info (now updated)
            contractSigneeName: updatedClientRecord.getCellValue("Contract Signee Name"),
            
            // Service info
            serviceType: updatedClientRecord.getCellValue("Service Type"),
            type: updatedClientRecord.getCellValue("Type"),
            
            // PandaDoc info
            pandadocProposalId: updatedClientRecord.getCellValue("Pandadoc Contract ID"),
            pandadocContractLink: updatedClientRecord.getCellValue("PandaDoc Contract Link"),
            
            // Additional fields
            accountManager: updatedClientRecord.getCellValue("Account Manager Name"),
            communicationChannel: updatedClientRecord.getCellValue("Communication Channel"),
            emailSetupType: updatedClientRecord.getCellValue("Email Setup Type"),
            leadSource: updatedClientRecord.getCellValue("Leadsource"),
            
            // Company details
            legalCompanyName: updatedClientRecord.getCellValue("Legal Company Name"),
            billingAddressStreet: updatedClientRecord.getCellValue("Billing Address Street and Number"),
            billingAddressCity: updatedClientRecord.getCellValue("Billing Address City"),
            billingAddressZip: updatedClientRecord.getCellValue("Billing Address ZIP Code"),
            billingAddressCountry: updatedClientRecord.getCellValue("Billing Address Country"),
            
            // Lead source from client data
            quelle: updatedClientRecord.getCellValue("Leadsource"),
            
            // Tech setup info
            instantlyWorkspaceId: updatedClientRecord.getCellValue("Instantly Workspace ID"),
            lemlistWorkspaceId: updatedClientRecord.getCellValue("Lemlist Workspace ID"),
            heyreachWorkspaceId: updatedClientRecord.getCellValue("Heyreach Workspace ID"),
            clickupClientId: updatedClientRecord.getCellValue("ClickUp Client ID"),
            
            // Volume and capacity
            leadVolume: updatedClientRecord.getCellValue("Lead Volume"),
            emailSendingVolume: updatedClientRecord.getCellValue("Email Sending Volumen /w"),
            maxEmailSendingVolume: updatedClientRecord.getCellValue("MAX Email Sending Volumen /w"),
            linkedinAccounts: updatedClientRecord.getCellValue("LinkedIn Accounts"),
            
            // Services configuration
            emailInstantly: updatedClientRecord.getCellValue("Email (Instantly)"),
            linkedinHeyreach: updatedClientRecord.getCellValue("LinkedIn (Heyreach)"),
            multichannelLemlist: updatedClientRecord.getCellValue("Multichannel (Lemlist)"),
            consulting: updatedClientRecord.getCellValue("Consulting"),
            replyManagement: updatedClientRecord.getCellValue("Reply Management"),
            googleSheetsCRM: updatedClientRecord.getCellValue("GoogleSheets CRM"),
            basicCrmIntegration: updatedClientRecord.getCellValue("Basic CRM Integration"),
            individualCrmIntegration: updatedClientRecord.getCellValue("Individual CRM Integration"),
            
            // Contact info
            clientGwdEmail: updatedClientRecord.getCellValue("Client GWD Email"),
            accountingEmail: updatedClientRecord.getCellValue("Accounting Email"),
            accountingCC: updatedClientRecord.getCellValue("Accounting CC"),
            
            // Payment info
            sepaInfo: updatedClientRecord.getCellValue("SEPA?")
        };
        
        // === STEP 3: SEND WEBHOOK TO MAKE ===
        console.log("=== STEP 3: Sending webhook to Make ===");
        console.log(`Sending webhook for: ${payload.clientName}`);
        console.log(`Payload summary: Setup=${payload.setupFee}, Retainer=${payload.retainer}, Deal Size=${payload.dealSize}`);
        
        // Send webhook to Make
        let response = await fetch(makeWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log(`✅ Webhook sent successfully for ${payload.clientName}`);
            
            // Mark webhook as sent in Client Database
            await clientTable.updateRecordAsync(clientRecordId, {
                'Onboarding Webhook Sent': new Date()
            });
            console.log(`✅ Marked webhook as sent in Client Database`);
            
        } else {
            console.error(`❌ Webhook failed for ${payload.clientName}: ${response.status} ${response.statusText}`);
            // Continue with form processing even if webhook fails
        }
        
        // === STEP 4: MARK FORM AS PROCESSED ===
        console.log("=== STEP 4: Marking form as processed ===");
        
        // Update form record name and mark as processed
        await formsTable.updateRecordAsync(record.id, {
            'Name': recordName,
            'Update Sent': new Date()
        });
        
        console.log(`✅ Form named: ${recordName} and marked as processed`);
        console.log(`✅ COMPLETED: ${clientNameFromLookup} - All steps successful`);
        
    } catch (error) {
        console.error(`Error processing record ${record.id}:`, error.message);
        console.error(`Full error details:`, error);
    }
}

console.log(`Combined script completed. Processed ${processedRecords} records.`);
