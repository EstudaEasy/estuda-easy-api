import * as Joi from 'joi';

import s3 from './aws/s3/schema';
import gemini from './gemini/schema';
import jwt from './jwt/schema';
import mailer from './mailer/schema';
import openai from './openai/schema';
import typeorm from './typeorm/schema';

export default Joi.object({
  ...s3,
  ...jwt,
  ...mailer,
  ...gemini,
  ...openai,
  ...typeorm
});
