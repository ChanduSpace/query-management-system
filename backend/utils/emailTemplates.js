const emailTemplates = {
  queryReceived: (query) => ({
    subject: `We've received your query - Ticket #${query._id
      .toString()
      .slice(-6)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .footer { background: #e5e7eb; padding: 10px; text-align: center; font-size: 12px; }
          .ticket-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HelpDesk Pro</h1>
            <p>Your query has been received</p>
          </div>
          <div class="content">
            <h2>Hello ${query.customerName},</h2>
            <p>Thank you for contacting us. We've received your query and will get back to you soon.</p>
            
            <div class="ticket-info">
              <h3>Query Details:</h3>
              <p><strong>Ticket ID:</strong> #${query._id
                .toString()
                .slice(-6)}</p>
              <p><strong>Category:</strong> ${query.category}</p>
              <p><strong>Priority:</strong> ${query.priority}</p>
              <p><strong>Message:</strong> ${query.message}</p>
            </div>
            
            <p>You can expect a response within 24 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 HelpDesk Pro. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  queryUpdated: (query, update) => ({
    subject: `Update on your query - Ticket #${query._id.toString().slice(-6)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .footer { background: #e5e7eb; padding: 10px; text-align: center; font-size: 12px; }
          .update-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HelpDesk Pro</h1>
            <p>Update on your query</p>
          </div>
          <div class="content">
            <h2>Hello ${query.customerName},</h2>
            <p>There's an update on your query:</p>
            
            <div class="update-info">
              <h3>Update Details:</h3>
              <p><strong>Ticket ID:</strong> #${query._id
                .toString()
                .slice(-6)}</p>
              <p><strong>New Status:</strong> ${query.status}</p>
              <p><strong>Assigned To:</strong> ${
                query.assignedTo || "Not assigned yet"
              }</p>
              <p><strong>Update:</strong> ${update}</p>
            </div>
            
            <p>Thank you for your patience.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 HelpDesk Pro. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  queryResolved: (query) => ({
    subject: `Your query has been resolved - Ticket #${query._id
      .toString()
      .slice(-6)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .footer { background: #e5e7eb; padding: 10px; text-align: center; font-size: 12px; }
          .resolution-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HelpDesk Pro</h1>
            <p>Query Resolved</p>
          </div>
          <div class="content">
            <h2>Hello ${query.customerName},</h2>
            <p>We're happy to inform you that your query has been resolved!</p>
            
            <div class="resolution-info">
              <h3>Resolution Details:</h3>
              <p><strong>Ticket ID:</strong> #${query._id
                .toString()
                .slice(-6)}</p>
              <p><strong>Original Message:</strong> ${query.message}</p>
              <p><strong>Status:</strong> Resolved</p>
              <p><strong>Resolved At:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>If you have any further questions, please don't hesitate to contact us.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 HelpDesk Pro. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

module.exports = emailTemplates;
