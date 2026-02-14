"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, FileImage, FileText } from "lucide-react";

export default function AdminQRPage() {
  const [tableId, setTableId] = useState("5");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const tableUrl = `${baseUrl}/table/${tableId}`;

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setQrDataUrl(null);
    try {
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(tableUrl, {
        width: 400,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }, [tableUrl]);

  const handleDownloadImage = useCallback(() => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `table-${tableId}-qr.png`;
    link.click();
  }, [qrDataUrl, tableId]);

  const handleDownloadPdf = useCallback(async () => {
    if (!qrDataUrl) return;
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const size = 60;
      const x = (pageW - size) / 2;
      const y = 20;
      doc.addImage(qrDataUrl, "PNG", x, y, size, size);
      doc.setFontSize(14);
      doc.text(`Table ${tableId}`, pageW / 2, y + size + 10, { align: "center" });
      doc.text(tableUrl, pageW / 2, y + size + 16, { align: "center" });
      doc.save(`table-${tableId}-qr.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
    }
  }, [qrDataUrl, tableId, tableUrl]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">QR Code Generation</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Table QR code</CardTitle>
          <CardDescription>
            Enter a table number, generate the QR code, then download it as an image or PDF to print and place on the table.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Table number</label>
            <Input
              value={tableId}
              onChange={(e) => {
                setTableId(e.target.value);
                setQrDataUrl(null);
              }}
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">URL</label>
            <p className="text-sm text-muted-foreground break-all bg-muted p-3 rounded-md">
              {tableUrl}
            </p>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full"
          >
            <QrCode className="h-4 w-4 mr-2" />
            {generating ? "Generating…" : "Generate QR code"}
          </Button>

          {qrDataUrl && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-center bg-muted/50 rounded-lg p-6">
                <img
                  src={qrDataUrl}
                  alt={`QR code for table ${tableId}`}
                  className="w-48 h-48 object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Table {tableId} — scan to open menu
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDownloadImage}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDownloadPdf}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
