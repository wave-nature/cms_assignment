import Joi from "joi";

const post = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().min(6),
});

export default { post };
