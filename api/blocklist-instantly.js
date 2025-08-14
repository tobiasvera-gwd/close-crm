// File: api/blocklist-instantly.js
// Simple handler to send Close CRM data to Make.com webhook

export default async function handler(req, res) {
  try {
    // Get data from URL parameters
    const {
      contact_id,
      lead_id,
      name,
      company,
      domain,
      email
    } = req.query;

    // Prepare payload for Make.com
    const payload = {
      contact_id,
      lead_id,
      name,
      company,
      domain,
      email,
      timestamp: new Date().toISOString()
    };

    // Send to Make.com webhook
    const response = await fetch('https://hook.eu2.make.com/8f3uqx387ca6yes709014kgvkhwb0oir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status}`);
    }

    // Return success
    res.status(200).json({
      success: true,
      message: 'Data sent to Make.com successfully',
      data: payload
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
