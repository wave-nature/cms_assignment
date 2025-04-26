import Joi from "joi";

const get = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  search: Joi.string().optional().allow(""),
});

export default { get };
