import * as Joi from 'joi';

import jwt from './jwt/schema';
import mailer from './mailer/schema';
import typeorm from './typeorm/schema';

export default Joi.object({
  ...jwt,
  ...mailer,
  ...typeorm
});
