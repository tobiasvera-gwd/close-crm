// File: api/blocklist-instantly.js
// Handler for Close CRM to Instantly blocklist integration

export default async function handler(req, res) {
  // Handle both GET (redirect links) and POST (webhooks)
  const method = req.method;
  
  try {
    if (method === 'GET') {
      // Handle Close CRM redirect links with query parameters
      const { 
        contact_id, 
        lead_id, 
        name, 
        company, 
        domain,
        email 
      } = req.query;
      
      // Log the incoming data
      console.log('Close CRM redirect received:', {
        contact_id,
        lead_id,
        name,
        company,
        domain,
        email,
        timestamp: new Date().toISOString()
      });
      
      // Prepare data for Make.com webhook
      const payload = {
        action: 'add_to_blocklist',
        source: 'close_crm_redirect',
        contact_data: {
          contact_id,
          lead_id,
          name,
          company,
          domain,
          email,
          timestamp: new Date().toISOString()
        }
      };
      
      // Send to Make.com webhook
      await sendToMakeWebhook(payload);
      
      // Return success page or redirect
      return res.status(200).json({
        success: true,
        message: 'Contact added to blocklist successfully',
        data: {
          contact_id,
          name,
          company
        }
      });
      
    } else if (method === 'POST') {
      // Handle webhook posts from Close CRM
      const webhookData = req.body;
      
      console.log('Close CRM webhook received:', webhookData);
      
      // Process webhook data
      const payload = processCloseWebhook(webhookData);
      
      // Send to Make.com
      await sendToMakeWebhook(payload);
      
      return res.status(200).json({
        success: true,
        message: 'Webhook processed successfully'
      });
      
    } else {
      return res.status(405).json({
        error: 'Method not allowed',
        allowed: ['GET', 'POST']
      });
    }
    
  } catch (error) {
    console.error('Handler error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Send data to Make.com webhook
async function sendToMakeWebhook(payload) {
  const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
  
  if (!makeWebhookUrl) {
    throw new Error('MAKE_WEBHOOK_URL environment variable not set');
  }
  
  const response = await fetch(makeWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Make.com webhook failed: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

// Process Close CRM webhook data
function processCloseWebhook(webhookData) {
  const { event, data } = webhookData;
  
  switch (event) {
    case 'lead.created':
    case 'lead.updated':
      return {
        action: 'process_lead',
        event_type: event,
        source: 'close_crm_webhook',
        lead_data: {
          lead_id: data.id,
          company: data.display_name,
          domain: data.url,
          status: data.status_label,
          created: data.date_created,
          contacts: data.contacts?.map(contact => ({
            contact_id: contact.id,
            name: contact.name,
            email: contact.emails?.[0]?.email,
            phone: contact.phones?.[0]?.phone
          })) || []
        }
      };
      
    case 'contact.created':
    case 'contact.updated':
      return {
        action: 'process_contact',
        event_type: event,
        source: 'close_crm_webhook',
        contact_data: {
          contact_id: data.id,
          name: data.name,
          email: data.emails?.[0]?.email,
          phone: data.phones?.[0]?.phone,
          lead_id: data.lead_id
        }
      };
      
    default:
      return {
        action: 'log_event',
        event_type: event,
        source: 'close_crm_webhook',
        raw_data: data
      };
  }
}

// Utility function to extract domain from URL
function extractDomain(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}
