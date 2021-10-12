import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  DB_SCHEMA: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
});
