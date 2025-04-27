import Joi from "joi";

const patch = Joi.object({
  fullName: Joi.string().optional().allow(null, ""),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().default("").allow(null, ""),
  address: Joi.string().optional().allow(null, ""),
  status: Joi.boolean().optional().default(true),
});

export default { patch };
