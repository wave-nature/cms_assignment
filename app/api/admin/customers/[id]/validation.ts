import Joi from "joi";

const patch = Joi.object({
  fullName: Joi.string().optional(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().default(""),
  address: Joi.string().optional(),
  status: Joi.boolean().optional().default(true),
});

export default { patch };
