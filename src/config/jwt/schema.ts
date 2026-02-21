import * as Joi from 'joi';

export default {
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_PASSWORD_RESET_SECRET: Joi.string().required()
};
