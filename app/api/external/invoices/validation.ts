import { InvoiceStatus } from "@/lib/generated/prisma";
import Joi from "joi";

const get = Joi.object({
  externalInvoiceId: Joi.string().required(),
  externalCustomerId: Joi.string().required(),
});
const post = Joi.object({
  externalInvoiceId: Joi.string().required(),
  externalCustomerId: Joi.string().required(),
  amount: Joi.number().required(),
  status: Joi.string()
    .valid(InvoiceStatus.Pending, InvoiceStatus.Overdue, InvoiceStatus.Paid)
    .optional(),
  dueDate: Joi.date().optional(),
  invoiceDate: Joi.date().optional(),
  description: Joi.string().optional(),
});

export default { post ,get};
