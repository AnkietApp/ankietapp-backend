import mailgunLoader from 'mailgun-js';
import { MAILGUN_API_KEY, MAILGUN_DOMAIN } from '../utils/secrets';

const mailgun = mailgunLoader({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN
});

export default mailgun;
