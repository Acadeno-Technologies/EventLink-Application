import QRCode from 'qrcode';

export async function generateQrDataUrl(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  if (!text || text.trim() === '') return '';

  const defaultOpts: QRCode.QRCodeToDataURLOptions = {
    width: options?.width || 320,
    margin: options?.margin || 2,
    color: {
      dark: options?.color?.dark || '#0f172a',
      light: options?.color?.light || '#ffffff',
    },
    errorCorrectionLevel: 'M',
    ...options,
  };

  try {
    return await QRCode.toDataURL(text, defaultOpts);
  } catch (err) {
    try {
      // Fallback with lower error correction level for high-density payloads
      return await QRCode.toDataURL(text, { ...defaultOpts, errorCorrectionLevel: 'L' });
    } catch (innerErr) {
      console.error('Failed to generate QR code:', innerErr);
      return '';
    }
  }
}

export function downloadQrImage(dataUrl: string, filename: string = 'event-qr-code.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
