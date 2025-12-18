import * as Joi from 'joi';

import jwt from './jwt/schema';
import typeorm from './typeorm/schema';

export default Joi.object({
  ...jwt,
  ...typeorm
});
