import * as Joi from 'joi';

import typeorm from './typeorm/schema';

export default Joi.object({
  ...typeorm
});
