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
    .valid(
      InvoiceStatus.Pending,
      InvoiceStatus.Overdue,
      InvoiceStatus.Paid,
      InvoiceStatus.PastDue
    )
    .optional(),
  dueDate: Joi.date().optional().allow(null, ""),
  invoiceDate: Joi.date().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
});

export default { post, get };
