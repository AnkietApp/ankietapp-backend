import mailgun from '../config/mailgun';

const sendEmail = (
  to: string,
  from: string,
  subject: string,
  content: string
): void => {
  const data = {
    to,
    from,
    subject,
    text: content
  };
  mailgun.messages().send(data, (error: any, body: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log(body);
      console.log(data);
    }
  });
};

export default sendEmail;
