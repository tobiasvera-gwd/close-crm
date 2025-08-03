// Test script para probar todos los campos de Close CRM
// api/test-fields.js

export default async function handler(req, res) {
    try {
        // Obtener TODOS los parámetros posibles
        const {
            // Contact fields
            contact_id,
            contact_name,
            contact_first_name,
            contact_last_name,
            contact_email,
            contact_title,
            
            // Lead/Company fields
            lead_id,
            lead_name,
            lead_display_name,
            lead_description,
            lead_url,
            lead_status,
            
            // Address fields
            lead_address_1,
            lead_address_2,
            lead_city,
            lead_state,
            lead_country,
            
            // Custom fields (pueden variar)
            linkedin_url,
            website_url,
            company_website,
            social_linkedin,
            
            // Meta
            function: enrichFunction
        } = req.query;
        
        // Crear objeto con todos los datos recibidos
        const allData = {
            contact: {
                id: contact_id,
                name: contact_name,
                first_name: contact_first_name,
                last_name: contact_last_name,
                email: contact_email,
                title: contact_title
            },
            lead: {
                id: lead_id,
                name: lead_name,
                display_name: lead_display_name,
                description: lead_description,
                url: lead_url,
                status: lead_status,
                address: {
                    address_1: lead_address_1,
                    address_2: lead_address_2,
                    city: lead_city,
                    state: lead_state,
                    country: lead_country
                }
            },
            social: {
                linkedin_url: linkedin_url,
                website_url: website_url,
                company_website: company_website,
                social_linkedin: social_linkedin
            },
            function: enrichFunction,
            timestamp: new Date().toISOString()
        };
        
        // Filtrar campos vacíos para ver qué llega realmente
        const cleanData = {};
        Object.keys(allData).forEach(category => {
            if (typeof allData[category] === 'object' && allData[category] !== null) {
                const cleanCategory = {};
                Object.keys(allData[category]).forEach(key => {
                    if (allData[category][key] && allData[category][key] !== '') {
                        cleanCategory[key] = allData[category][key];
                    }
                });
                if (Object.keys(cleanCategory).length > 0) {
                    cleanData[category] = cleanCategory;
                }
            } else if (allData[category] && allData[category] !== '') {
                cleanData[category] = allData[category];
            }
        });
        
        // Log para debugging
        console.log('=== DATOS RECIBIDOS DE CLOSE ===');
        console.log(JSON.stringify(cleanData, null, 2));
        
        // URL de Make webhook (opcional - comentar si solo quieres ver los datos)
        const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/ihs69ldf5vmx7nl2e3y1gqxjqlgldxbt';
        
        // Enviar a Make (descomenta si quieres enviar)
        /*
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cleanData)
        });
        
        if (!response.ok) {
            throw new Error(`Make webhook fehlgeschlagen: ${response.statusText}`);
        }
        */
        
        // Respuesta detallada para debugging
        res.status(200).json({
            success: true,
            message: 'Test erfolgreich - Daten empfangen',
            received_data: cleanData,
            total_fields: Object.keys(req.query).length,
            empty_fields: Object.keys(req.query).filter(key => !req.query[key] || req.query[key] === '').length,
            all_query_params: req.query
        });
        
    } catch (error) {
        console.error('Test Fehler:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            query_received: req.query
        });
    }
}
