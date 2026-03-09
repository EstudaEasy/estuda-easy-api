import * as Joi from 'joi';

export default {
  OPENAI_API_KEY: Joi.string().required()
};
