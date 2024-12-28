const mailer = require("./mailer");

exports.sendVerificationMail = async (user, verifyLink) => {
  const mail = `<!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Email Verification</title>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                      }
                      .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                      }
                      .header {
                        background: #4caf50;
                        color: white;
                        text-align: center;
                        padding: 20px;
                      }
                      .header h1 {
                        margin: 0;
                        font-size: 24px;
                      }
                      .content {
                        padding: 20px;
                      }
                      .content p {
                        margin: 10px 0;
                        line-height: 1.6;
                        color: #333;
                      }
                      .button {
                        text-align: center;
                      }
                      .button a {
                        display: inline-block;
                        padding: 10px 20px;
                        background: #4caf50;
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                        margin-top: 20px;
                      }
                      .footer {
                        background: #f4f4f4;
                        text-align: center;
                        padding: 10px;
                        font-size: 12px;
                        color: #777;
                      }
                    </style>
                  </head>

                  <body>
                    <div class="container">
                      <div class="header">
                        <h1>Welcome to Lomify!</h1>
                      </div>
                      <div class="content">
                        <p>Hi <strong>${user.name}</strong>,</p>
                        <p>
                          Thank you for signing up for Lomify! Please confirm your email address
                          by clicking the button below. This link will expire in
                          <strong>10 minutes</strong>.
                        </p>
                        <div class="button">
                          <a href="${verifyLink}">Verify Email</a>
                        </div>
                        <p>If you didn't request this email, you can safely ignore it.</p>
                      </div>
                      <div class="footer">
                        © 2024 Lomify. All rights reserved.
                      </div>
                    </div>
                  </body>
                </html>
                `;
  await mailer(user.email, "Verify Your Lomify Account", mail);
};
