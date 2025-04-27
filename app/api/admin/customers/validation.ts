import Joi from "joi";

const get = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  email: Joi.string().optional().allow(""),
});

const post = Joi.object({
  fullName: Joi.string().optional(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().default(""),
  address: Joi.string().optional(),
  status: Joi.boolean().optional().default(true),
});

export default { get, post };
