"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, FileImage, FileText } from "lucide-react";
import { FLOOR_PLAN_SECTIONS } from "@/lib/floor-plan";

const ALL_TABLES = FLOOR_PLAN_SECTIONS.flatMap((s) =>
  s.tables.map((t) => ({ id: t.id, label: `${s.title} ${t.label}` }))
);

export default function SuperadminQRPage() {
  const [tableId, setTableId] = useState("5");
  const [qrMode, setQrMode] = useState<"wait" | "table">("table");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const waitUrl = `${baseUrl}/wait`;
  const tableUrl = `${baseUrl}/table/${tableId}`;
  const currentUrl = qrMode === "wait" ? waitUrl : tableUrl;

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setQrDataUrl(null);
    try {
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(currentUrl, {
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
  }, [currentUrl]);

  const handleDownloadImage = useCallback(() => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download =
      qrMode === "wait" ? "wait-queue-qr.png" : `table-${tableId}-qr.png`;
    link.click();
  }, [qrDataUrl, tableId, qrMode]);

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
      const title = qrMode === "wait" ? "Join waiting list" : `Table ${tableId}`;
      doc.text(title, pageW / 2, y + size + 10, { align: "center" });
      doc.text(currentUrl, pageW / 2, y + size + 16, { align: "center" });
      doc.save(
        qrMode === "wait" ? "wait-queue-qr.pdf" : `table-${tableId}-qr.pdf`
      );
    } catch (err) {
      console.error("PDF download failed:", err);
    }
  }, [qrDataUrl, tableId, qrMode, currentUrl]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">QR code generator</h1>

      <div className="flex gap-2 border-b pb-4">
        <Button
          variant={qrMode === "wait" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setQrMode("wait");
            setQrDataUrl(null);
          }}
        >
          Waiting list
        </Button>
        <Button
          variant={qrMode === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setQrMode("table");
            setQrDataUrl(null);
          }}
        >
          Table
        </Button>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>
            {qrMode === "wait" ? "Waiting list QR" : "Table QR code"}
          </CardTitle>
          <CardDescription>
            {qrMode === "wait"
              ? "Place this QR at the entrance so guests can join the queue."
              : "Generate a QR code for a table so seated guests can open the menu."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {qrMode === "table" && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Table number
              </label>
              <Input
                value={tableId}
                onChange={(e) => {
                  setTableId(e.target.value);
                  setQrDataUrl(null);
                }}
                placeholder="e.g. 5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Or pick:{" "}
                {ALL_TABLES.slice(0, 8).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="underline mr-2"
                    onClick={() => {
                      setTableId(t.id);
                      setQrDataUrl(null);
                    }}
                  >
                    {t.label}
                  </button>
                ))}
                …
              </p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-2 block">URL</label>
            <p className="text-sm text-muted-foreground break-all bg-muted p-3 rounded-md">
              {currentUrl}
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
                  alt={
                    qrMode === "wait"
                      ? "QR code for waiting list"
                      : `QR code for table ${tableId}`
                  }
                  className="w-48 h-48 object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {qrMode === "wait"
                  ? "Scan to join the waiting list"
                  : `Table ${tableId} — scan to open menu`}
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
