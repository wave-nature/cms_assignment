import { InvoiceStatus } from "@/lib/generated/prisma";
import Joi from "joi";

const get = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  customerId: Joi.string().optional(),
});

const post = Joi.object({
  amount: Joi.number().required(),
  status: Joi.string()
    .valid(InvoiceStatus.Pending, InvoiceStatus.Overdue, InvoiceStatus.Paid)
    .required(),
  dueDate: Joi.date().required(),
  invoiceDate: Joi.date().required(),
  description: Joi.string().optional(),
  ownerId: Joi.string().required(),
});

export default { get, post };
