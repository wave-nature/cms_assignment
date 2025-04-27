import { InvoiceStatus } from "@/lib/generated/prisma";
import Joi from "joi";

const patch = Joi.object({
  amount: Joi.number().optional(),
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
  fieldChanged: Joi.object().optional(),
});
export default { patch };
