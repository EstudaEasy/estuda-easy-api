import { ISendMailOptions } from '@nestjs-modules/mailer';

export default (userName: string, token: string, expiresInMinutes: number): ISendMailOptions => {
  return {
    subject: 'Redefinição de Senha - EstudaEasy',
    attachments: [
      {
        cid: 'logo',
        filename: 'logo.png',
        contentDisposition: 'inline',
        path: 'assets/images/logo.png'
      }
    ],
    html: /*html*/ `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          :root {
            --main-color: #3b82f6;
          }
          body, p, h1, h2, h3, h4, h5, h6, a {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #333333;
          }
          body {
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 0 auto;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #ffffff;
            padding: 16px;
            text-align: center;
            border-bottom: 3px solid #3b82f6;
          }
          .header img.system-logo {
            max-width: 100px;
            height: auto;
          }
          .content {
            padding: 20px;
          }
          .content h2 {
            color: #3b82f6;
            margin-bottom: 15px;
            font-size: 24px;
            text-align: start;
          }
          .content p {
            line-height: 1.6;
            margin-bottom: 15px;
            font-size: 16px;
            text-align: justify;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .btn {
            display: inline-block;
            padding: 12px 25px;
            font-size: 16px;
            color: #ffffff;
            background-color: #3b82f6;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 15px;
            text-align: center;
            font-size: 14px;
            color: #777777;
          }
          .footer a {
            color: #3b82f6;
            text-decoration: none;
            margin: 0 5px;
            font-weight: bold;
          }
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              border-radius: 0;
            }
            .header img.system-logo {
              max-width: 80px;
            }
            .btn {
              width: 100%;
              padding: 15px 0;
            }
            .content p {
              text-align: left;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:logo" alt="EstudaEasy Logo" class="system-logo" />
          </div>
          <div class="content">
            <h2>Redefinição de senha</h2>
            <p>Olá, <strong>${userName}</strong>!</p>
            <p>Recebemos uma solicitação de redefinição de senha para sua conta.</p>
            <p>Clique no botão abaixo para redefinir sua senha:</p>
            <div class="button-container">
              <a href="${process.env.BASE_URL_CLIENT}/forgot-password/${token}" class="btn" style="color: #ffffff;">
                Redefinir a senha
              </a>
            </div>
            <p>
              Este código expira em <strong>${expiresInMinutes} minutos</strong>. Se não foi você quem solicitou, ignore
              este e-mail.
            </p>
            <p>Atenciosamente, <b>EstudaEasy</b>.</p>
          </div>
        </div>
      </body>
    </html>
    `
  };
};
