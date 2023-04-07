import Joi from '@hapi/joi';

export const currencySchema = Joi.object({
  id: Joi.number().integer().required(),
  currency_name: Joi.string().regex(/^USD[A-Z]{3}$/).required(),
  rate: Joi.number().required()
});

