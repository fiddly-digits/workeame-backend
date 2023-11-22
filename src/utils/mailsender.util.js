import nodemailer from 'nodemailer';
import createError from 'http-errors';
import hbs from 'nodemailer-express-handlebars';

const { AWS_SMTP, AWS_PORT, AWS_USER, AWS_PASS } = process.env;
const { WORKEA_MAIL, WORKEA_VERIFICATION_SUBJECT } = process.env;

export async function sendVerificationMail(userName, email, verificationLink) {
  const transporter = nodemailer.createTransport({
    host: AWS_SMTP,
    port: AWS_PORT,
    secure: false,
    auth: {
      user: AWS_USER,
      pass: AWS_PASS
    }
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extName: '.handlebars',
        partialsDir: 'src/email/',
        layoutsDir: 'src/email/',
        defaultLayout: 'emailVerification'
      },
      viewPath: 'src/email/',
      extName: '.handlebars'
    })
  );

  transporter.sendMail(
    {
      from: WORKEA_MAIL,
      to: email,
      subject: WORKEA_VERIFICATION_SUBJECT,
      template: 'emailVerification',
      context: {
        appLogoUrl: 'https://workeame-bucket.s3.amazonaws.com/Workea+Logo.png',
        verificationLink: verificationLink,
        userName: userName
      }
    },
    (error) => {
      if (error) {
        throw createError(400, 'Error sending email');
      }
    }
  );
}

export async function forgottenPasswordMail(userName, email, verificationLink) {
  const transporter = nodemailer.createTransport({
    host: AWS_SMTP,
    port: AWS_PORT,
    secure: false,
    auth: {
      user: AWS_USER,
      pass: AWS_PASS
    }
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extName: '.handlebars',
        partialsDir: 'src/email/',
        layoutsDir: 'src/email/',
        defaultLayout: 'forgottenPassword'
      },
      viewPath: 'src/email/',
      extName: '.handlebars'
    })
  );

  transporter.sendMail(
    {
      from: WORKEA_MAIL,
      to: email,
      subject: 'Workea.me: Restablecer contraseña',
      template: 'forgottenPassword',
      context: {
        appLogoUrl: 'https://workeame-bucket.s3.amazonaws.com/Workea+Logo.png',
        verificationLink: verificationLink,
        userName: userName
      }
    },
    (error) => {
      if (error) {
        throw createError(400, 'Error sending email');
      }
    }
  );
}

export async function successVerificationMail(userName, email) {
  const transporter = nodemailer.createTransport({
    host: AWS_SMTP,
    port: AWS_PORT,
    secure: false,
    auth: {
      user: AWS_USER,
      pass: AWS_PASS
    }
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extName: '.handlebars',
        partialsDir: 'src/email/',
        layoutsDir: 'src/email/',
        defaultLayout: 'successVerification'
      },
      viewPath: 'src/email/',
      extName: '.handlebars'
    })
  );

  transporter.sendMail(
    {
      from: WORKEA_MAIL,
      to: email,
      subject: 'Workea.me: Verificación Exitosa',
      template: 'successVerification',
      context: {
        appLogoUrl: 'https://workeame-bucket.s3.amazonaws.com/Workea+Logo.png',
        userName: userName
      }
    },
    (error) => {
      if (error) {
        throw createError(400, 'Error sending email');
      }
    }
  );
}

export async function passwordChangedMail(userName, email) {
  const transporter = nodemailer.createTransport({
    host: AWS_SMTP,
    port: AWS_PORT,
    secure: false,
    auth: {
      user: AWS_USER,
      pass: AWS_PASS
    }
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extName: '.handlebars',
        partialsDir: 'src/email/',
        layoutsDir: 'src/email/',
        defaultLayout: 'passwordReset'
      },
      viewPath: 'src/email/',
      extName: '.handlebars'
    })
  );

  transporter.sendMail(
    {
      from: WORKEA_MAIL,
      to: email,
      subject: 'Workea.me: Contraseña Restablecida',
      template: 'passwordReset',
      context: {
        appLogoUrl: 'https://workeame-bucket.s3.amazonaws.com/Workea+Logo.png',
        userName: userName
      }
    },
    (error) => {
      if (error) {
        throw createError(400, 'Error sending email');
      }
    }
  );
}

// export function sendMail(email, text, subject) {
//   const transporter = nodemailer.createTransport({
//     host: AWS_SMTP,
//     port: AWS_PORT,
//     secure: false,
//     auth: {
//       user: AWS_USER,
//       pass: AWS_PASS
//     }
//   });
//   transporter.sendMail(
//     {
//       from: WORKEA_MAIL,
//       to: email,
//       subject: subject || WORKEA_VERIFICATION_SUBJECT,
//       text: text
//     },
//     (error) => {
//       if (error) {
//         throw createError(400, 'Error sending email');
//       }
//     }
//   );
// }

export async function paymentConfirmedMail(email, body, userName, title) {
  const transporter = nodemailer.createTransport({
    host: AWS_SMTP,
    port: AWS_PORT,
    secure: false,
    auth: {
      user: AWS_USER,
      pass: AWS_PASS
    }
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extName: '.handlebars',
        partialsDir: 'src/email/',
        layoutsDir: 'src/email/',
        defaultLayout: 'paymentConfirmed'
      },
      viewPath: 'src/email/',
      extName: '.handlebars'
    })
  );

  transporter.sendMail(
    {
      from: WORKEA_MAIL,
      to: email,
      subject: title,
      template: 'paymentConfirmed',
      context: {
        appLogoUrl: 'https://workeame-bucket.s3.amazonaws.com/Workea+Logo.png',
        userName: userName,
        body: body
      }
    },
    (error) => {
      if (error) {
        throw createError(400, 'Error sending email');
      }
    }
  );
}
