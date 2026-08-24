import { useMemo } from "react";
import { InvoiceDocument, InvoiceLineItem } from "./billingTypes";
import { calculateInvoice, CalculationResult } from "./InvoiceCalculationEngine";

/**
 * Custom React Hook that automatically calculates Grand Total
 * (Subtotal - Discounts + Taxes + Additional Charges / Shipping)
 * in real-time as users add or modify items, prices, quantities, discounts, or tax percentages.
 */
export function useInvoiceCalculation(doc: Partial<InvoiceDocument>): CalculationResult {
  return useMemo(() => {
    return calculateInvoice(doc);
  }, [
    doc.items,
    doc.invoiceDiscountType,
    doc.invoiceDiscountValue,
    doc.taxStructure,
    doc.taxPercent,
    doc.shippingCharges,
    doc.packagingCharges,
    doc.paidAmount
  ]);
}
