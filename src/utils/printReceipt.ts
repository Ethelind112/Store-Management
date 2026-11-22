export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  transactionId: string;
  date: string;
  items: ReceiptItem[];
  totalQuantity: number;
  totalPrice: number;
  paymentMethod: string;
  cashReceived?: number;
  cashChange?: number;
}

export function printReceipt(data: ReceiptData) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  const paymentLabel =
    data.paymentMethod === "cash"
      ? "Tunai"
      : data.paymentMethod === "qris"
      ? "QRIS"
      : "Kartu Debit/Kredit";

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Struk Pembayaran - ${data.transactionId}</title>
        <style>
          @page { size: 80mm auto; margin: 4mm; }
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 72mm;
            margin: 0 auto;
            padding: 4px;
            color: #000;
            font-size: 12px;
            line-height: 1.4;
          }
          .text-center { text-align: center; }
          .bold { font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 6px 0; }
          .row { display: flex; justify-content: space-between; margin: 2px 0; }
          .item-name { font-weight: bold; word-break: break-word; }
          .item-calc { color: #333; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="text-center bold" style="font-size: 16px;">KASIR POS</div>
        <div class="text-center" style="font-size: 10px;">Struk Transaksi Penjualan</div>
        <div class="divider"></div>
        <div class="row">${data.transactionId}</div>
        <div class="row"><span>Waktu:</span><span>${data.date}</span></div>
        <div class="row"><span>Kasir:</span><span>Admin</span></div>
        <div class="divider"></div>
        ${data.items
          .map(
            (item) => `
          <div style="margin-bottom: 4px;">
            <div class="item-name">${item.name}</div>
            <div class="row item-calc">
              <span>${item.quantity} x Rp${item.price.toLocaleString("id-ID")}</span>
              <span>Rp${(item.quantity * item.price).toLocaleString("id-ID")}</span>
            </div>
          </div>
        `
          )
          .join("")}
        <div class="divider"></div>
        <div class="row"><span>Total Item:</span><span>${data.totalQuantity} pcs</span></div>
        <div class="row bold" style="font-size: 13px;"><span>Total Tagihan:</span><span>Rp${data.totalPrice.toLocaleString("id-ID")}</span></div>
        <div class="row"><span>Pembayaran:</span><span>${paymentLabel}</span></div>
        ${
          data.paymentMethod === "cash" && data.cashReceived != null
            ? `
          <div class="row"><span>Tunai Diterima:</span><span>Rp${data.cashReceived.toLocaleString("id-ID")}</span></div>
          <div class="row bold"><span>Kembalian:</span><span>Rp${(data.cashChange ?? 0).toLocaleString("id-ID")}</span></div>
        `
            : ""
        }
        <div class="divider"></div>
        <div class="text-center bold" style="margin-top: 8px;">TERIMA KASIH</div>
        <div class="text-center" style="font-size: 10px;">Silakan berkunjung kembali</div>
      </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  }, 250);
}
