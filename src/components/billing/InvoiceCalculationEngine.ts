import { InvoiceLineItem, InvoiceDocument } from "./billingTypes";

export interface CalculationResult {
  items: InvoiceLineItem[];
  subtotal: number;
  itemDiscountsTotal: number;
  invoiceDiscountTotal: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  taxTotal: number;
  shippingCharges: number;
  packagingCharges: number;
  roundOff: number;
  grandTotal: number;
  balanceDue: number;
}

export function calculateInvoice(doc: Partial<InvoiceDocument>): CalculationResult {
  const rawItems = doc.items || [];
  let subtotal = 0;
  let itemDiscountsTotal = 0;

  // 1. Calculate each line item
  const items: InvoiceLineItem[] = rawItems.map((item) => {
    const qty = Math.max(0, Number(item.quantity) || 0);
    const rate = Math.max(0, Number(item.unitRate) || 0);
    const lineSubtotal = Number((qty * rate).toFixed(2));

    // Discount
    let lineDiscountAmount = 0;
    if (item.discountType === "percent") {
      const discPct = Math.min(100, Math.max(0, Number(item.discountValue) || 0));
      lineDiscountAmount = Number(((lineSubtotal * discPct) / 100).toFixed(2));
    } else {
      lineDiscountAmount = Math.min(lineSubtotal, Math.max(0, Number(item.discountValue) || 0));
    }

    const lineTaxableAmount = Math.max(0, Number((lineSubtotal - lineDiscountAmount).toFixed(2)));

    // Tax
    let lineTaxAmount = 0;
    if (item.taxType !== "none") {
      const taxPct = Math.max(0, Number(item.taxPercent) || 0);
      lineTaxAmount = Number(((lineTaxableAmount * taxPct) / 100).toFixed(2));
    }

    const lineTotal = Number((lineTaxableAmount + lineTaxAmount).toFixed(2));

    subtotal += lineSubtotal;
    itemDiscountsTotal += lineDiscountAmount;

    return {
      ...item,
      quantity: qty,
      unitRate: rate,
      lineSubtotal,
      lineDiscountAmount,
      lineTaxableAmount,
      lineTaxAmount,
      lineTotal
    };
  });

  // 2. Invoice Level Discount
  let invoiceDiscountTotal = 0;
  const afterItemDiscounts = Math.max(0, subtotal - itemDiscountsTotal);

  if (doc.invoiceDiscountType === "percent") {
    const invDiscPct = Math.min(100, Math.max(0, Number(doc.invoiceDiscountValue) || 0));
    invoiceDiscountTotal = Number(((afterItemDiscounts * invDiscPct) / 100).toFixed(2));
  } else {
    invoiceDiscountTotal = Math.min(afterItemDiscounts, Math.max(0, Number(doc.invoiceDiscountValue) || 0));
  }

  const taxableAmount = Math.max(0, Number((afterItemDiscounts - invoiceDiscountTotal).toFixed(2)));

  // 3. Tax Structure
  let taxTotal = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;

  const taxStructure = doc.taxStructure || "vat";
  const overallTaxPct = Math.max(0, Number(doc.taxPercent) || 0);

  if (taxStructure === "gst") {
    const halfRate = overallTaxPct / 2;
    cgstAmount = Number(((taxableAmount * halfRate) / 100).toFixed(2));
    sgstAmount = Number(((taxableAmount * halfRate) / 100).toFixed(2));
    taxTotal = Number((cgstAmount + sgstAmount).toFixed(2));
  } else if (taxStructure === "vat" || taxStructure === "sales_tax" || taxStructure === "custom") {
    taxTotal = Number(((taxableAmount * overallTaxPct) / 100).toFixed(2));
  } else {
    taxTotal = 0;
  }

  // 4. Shipping & Packaging
  const shippingCharges = Math.max(0, Number(doc.shippingCharges) || 0);
  const packagingCharges = Math.max(0, Number(doc.packagingCharges) || 0);

  // 5. Grand Total & Round Off
  const rawTotal = taxableAmount + taxTotal + shippingCharges + packagingCharges;
  const grandTotalRounded = Math.round(rawTotal);
  const roundOff = Number((grandTotalRounded - rawTotal).toFixed(2));
  const grandTotal = Number(grandTotalRounded.toFixed(2));

  // 6. Paid amount & Balance Due
  const paidAmount = Math.max(0, Number(doc.paidAmount) || 0);
  const balanceDue = Math.max(0, Number((grandTotal - paidAmount).toFixed(2)));

  return {
    items,
    subtotal: Number(subtotal.toFixed(2)),
    itemDiscountsTotal: Number(itemDiscountsTotal.toFixed(2)),
    invoiceDiscountTotal: Number(invoiceDiscountTotal.toFixed(2)),
    taxableAmount,
    cgstAmount,
    sgstAmount,
    taxTotal,
    shippingCharges,
    packagingCharges,
    roundOff,
    grandTotal,
    balanceDue
  };
}
