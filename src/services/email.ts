import { SESv2, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { createTransport } from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

const sesClient = new SESv2();

const generateEmailTemplate = (title: string, content: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Catastramite</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, Helvetica, sans-serif;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        .header {
            text-align: center;
            padding: 20px;
            background-color: #ffffff;
        }

        .content {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
            font-size: 15px;
        }

        .button {
            display: inline-block;
            padding: 12px 20px;
            margin: 20px 0;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777777;
            background-color: #f4f4f4;
        }

        @media only screen and (max-width: 600px) {
            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <table class="container" cellspacing="0" cellpadding="0">
        <tr>
            <td class="header">
                <img src="https://www.catastramite.com/logo.png" alt="Catastramite" width="200">
            </td>
        </tr>
        <tr>
            <td class="content">
                <h2>${title}</h2>
                ${content}
            </td>
        </tr>
        <tr>
            <td class="footer">
                © 2025 Catastramite - Todos los derechos reservados<br>
                <a href="https://www.catastramite.com">www.catastramite.com</a>
            </td>
        </tr>
    </table>
</body>
</html>

  `;
};

const sendMail = async (
  name: string,
  email: string,
  subject: string,
  html: string,
) => {
  const transporter = createTransport({
    SES: { sesClient, SendEmailCommand },
  });

  await transporter.sendMail({
    from: "Catastramite <info@catastramite.com>",
    to: `${name} <${email}>`,
    subject,
    html,
    attachments: [
      {
        filename: "hero-image.jpg",
        path: process.cwd() + "/public/hero-image.jpg",
        cid: "logo",
      },
    ],
  });
};

export const sendRequestCreatedEmail = async (
  toName: string,
  toEmail: string,
  requestTitle: string,
  requestId: string,
) => {
  const subject = `New Request Created: ${requestTitle}`;
  const html = generateEmailTemplate(
    "New Request Received",
    `
    <p>Hello ${toName},</p>
    <p>A new request has been created in the system.</p>
    <p><strong>Title:</strong> ${requestTitle}</p>
    <p><strong>Request ID:</strong> ${requestId}</p>
    <p>Please log in to the dashboard to view more details.</p>
    `,
  );
  await sendMail(toName, toEmail, subject, html);
};

export const sendNotificationCreatedEmail = async (
  toName: string,
  toEmail: string,
  notificationTitle: string,
  notificationMessage: string,
) => {
  const subject = `New Notification: ${notificationTitle}`;
  const html = generateEmailTemplate(
    notificationTitle,
    `
    <p>Hello ${toName},</p>
    <p>${notificationMessage}</p>
    <p>Please log in to the dashboard to view more details.</p>
    `,
  );
  await sendMail(toName, toEmail, subject, html);
};

export const sendRequestStatusUpdatedEmail = async (
  toName: string,
  toEmail: string,
  requestTitle: string,
  requestId: string,
  newStatus: string,
  feedback?: string,
) => {
  const subject = `Request Status Updated: ${requestTitle}`;
  const html = generateEmailTemplate(
    "Request Status Updated",
    `
    <p>Hello ${toName},</p>
    <p>The status of your request has been updated.</p>
    <p><strong>Title:</strong> ${requestTitle}</p>
    <p><strong>Request ID:</strong> ${requestId}</p>
    <p><strong>New Status:</strong> ${newStatus}</p>
    ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ""}
    <p>Please log in to the dashboard to view more details.</p>
    `,
  );
  await sendMail(toName, toEmail, subject, html);
};
