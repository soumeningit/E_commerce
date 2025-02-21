exports.generatePaymentSuccessEmail = (customerName, paymentId, orderId, amount, companyName, year) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Success</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  background: #fff;
                  margin: 20px auto;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background: #4CAF50;
                  color: white;
                  text-align: center;
                  padding: 15px;
                  font-size: 24px;
                  font-weight: bold;
                  border-radius: 8px 8px 0 0;
              }
              .body {
                  padding: 20px;
                  color: #333;
                  font-size: 16px;
                  line-height: 1.6;
              }
              .footer {
                  background: #f1f1f1;
                  color: #777;
                  text-align: center;
                  padding: 10px;
                  font-size: 14px;
                  border-radius: 0 0 8px 8px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">Payment Successful</div>
              <div class="body">
                  <p>Dear ${customerName},</p>
                  <p>Thank you for your payment. Your transaction has been successfully completed.</p>
                  <p><strong>Payment ID:</strong> ${paymentId}</p>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Amount:</strong> $${amount}</p>
                  <p>If you have any questions, feel free to contact our support team.</p>
                  <p>Best regards,</p>
                  <p><strong>${companyName}</strong></p>
              </div>
              <div class="footer">
                  &copy; ${year} ${companyName}. All rights reserved.
              </div>
          </div>
      </body>
      </html>
  `;
}