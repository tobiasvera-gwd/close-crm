// Complete script to send contract data to Make including all fields for contract generation
let makeWebhookUrl = "https://hook.eu2.make.com/ti9s7myezsbt97pxi95w421rmrupn0s8";

let table = base.getTable("Client Database");
let query = await table.selectRecordsAsync({
    sorts: [{field: "Time of Creation", direction: "desc"}],
    maxRecords: 5
});

let targetRecord = null;
for (let record of query.records) {
    let statusObj = record.getCellValue("Status");
    let statusName = statusObj ? statusObj.name : null;
    
    if (statusName === "Contract Sent") {
        targetRecord = record;
        break;
    }
}

if (!targetRecord) {
    console.log("No record found with Contract Sent status");
    return;
}

// Extract all contract data from existing fields
let clientName = targetRecord.getCellValue("Client Name");
let status = targetRecord.getCellValue("Status")?.name;
let setupFee = targetRecord.getCellValue("Setup Fee (€)");
let retainer = targetRecord.getCellValue("Retainer (€)");
let pricePerLead = targetRecord.getCellValue("Price per Lead (€)");
let pricePerAppointment = targetRecord.getCellValue("Price per Appointment (€)");
let provision = targetRecord.getCellValue("Provision");
let contractSignedDate = targetRecord.getCellValue("Contract Signed Date");
let contractStartDate = targetRecord.getCellValue("Contract Start Date");
let mindestlaufzeit = targetRecord.getCellValue("Mindestlaufzeit");
let laufzeit = targetRecord.getCellValue("Laufzeit");
let kündigungsfrist = targetRecord.getCellValue("Kündigungsfrist");
let type = targetRecord.getCellValue("Type");
let clientId = targetRecord.getCellValue("Client ID");
let closeLeadId = targetRecord.getCellValue("Close Lead ID");

// Billing address fields with updated field names
let billingAddressStreetAndNumber = targetRecord.getCellValue("Billing Address Street and Number");
let billingAddressCity = targetRecord.getCellValue("Billing Address City");
let billingAddressCountry = targetRecord.getCellValue("Billing Address Country");
let billingAddressZipCode = targetRecord.getCellValue("Billing Address ZIP Code");
let legalCompanyName = targetRecord.getCellValue("Legal Company Name");

console.log("All contract values:");
console.log("clientName:", clientName);
console.log("status:", status);
console.log("setupFee:", setupFee);
console.log("retainer:", retainer);
console.log("pricePerLead:", pricePerLead);
console.log("pricePerAppointment:", pricePerAppointment);
console.log("provision:", provision);
console.log("contractSignedDate:", contractSignedDate);
console.log("contractStartDate:", contractStartDate);
console.log("mindestlaufzeit:", mindestlaufzeit);
console.log("laufzeit:", laufzeit);
console.log("kündigungsfrist:", kündigungsfrist);
console.log("type:", type);
console.log("clientId:", clientId);
console.log("closeLeadId:", closeLeadId);
console.log("billingAddressStreetAndNumber:", billingAddressStreetAndNumber);
console.log("billingAddressCity:", billingAddressCity);
console.log("billingAddressCountry:", billingAddressCountry);
console.log("billingAddressZipCode:", billingAddressZipCode);
console.log("legalCompanyName:", legalCompanyName);

// Create complete data object with all available fields
let recordData = {
    event: "contract_creation",
    recordId: targetRecord.id,
    clientName: clientName || "Unknown",
    status: status || "Unknown",
    setupFee: setupFee || 0,
    retainer: retainer || 0,
    pricePerLead: pricePerLead || 0,
    pricePerAppointment: pricePerAppointment || 0,
    provision: provision || "",
    contractSignedDate: contractSignedDate,
    contractStartDate: contractStartDate,
    mindestlaufzeit: mindestlaufzeit || "3 Monate",
    laufzeit: laufzeit || "Unbefristet", 
    kündigungsfrist: kündigungsfrist || "1 Monat",
    companyType: type || "Unknown",
    clientId: clientId || "",
    closeLeadId: closeLeadId || "",
    
    // Billing address data with updated field names
    billingAddressStreetAndNumber: billingAddressStreetAndNumber || "",
    billingAddressCity: billingAddressCity || "",
    billingAddressCountry: billingAddressCountry || "Germany",
    billingAddressZipCode: billingAddressZipCode || "",
    legalCompanyName: legalCompanyName || clientName,
    
    // Combined fields for contract templates
    billingAddressZipAndCity: `${billingAddressZipCode || ""} ${billingAddressCity || ""}`.trim(),
    companyNameWithLegalForm: legalCompanyName || clientName || "",
    
    timestamp: new Date().toISOString()
};

console.log("Complete object to send:");
console.log(JSON.stringify(recordData, null, 2));

// Send to Make
try {
    let response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordData)
    });
    
    console.log("Response status:", response.status);
    if (response.ok) {
        console.log("Contract data sent successfully to Make with complete billing information");
    } else {
        console.log("Error in response:", response.status);
    }
} catch (error) {
    console.log("Error in fetch:", error);
}
