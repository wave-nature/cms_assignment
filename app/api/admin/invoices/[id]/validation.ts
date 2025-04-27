import { InvoiceStatus } from "@/lib/generated/prisma";
import Joi from "joi";

const patch = Joi.object({
  amount: Joi.number().optional(),
  status: Joi.string()
    .valid(InvoiceStatus.Pending, InvoiceStatus.Overdue, InvoiceStatus.Paid)
    .optional(),
  dueDate: Joi.date().optional(),
  invoiceDate: Joi.date().optional(),
  description: Joi.string().optional().allow(null, ""),
  fieldChanged: Joi.object().optional(),
});
export default { patch };
