import Joi from "joi";

const get = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  email: Joi.string().optional().allow(""),
});

const post = Joi.object({
  fullName: Joi.string().optional().allow(null, ""),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().default("").allow(null, ""),
  address: Joi.string().optional().allow(null, ""),
  status: Joi.boolean().optional().default(true),
});

export default { get, post };
