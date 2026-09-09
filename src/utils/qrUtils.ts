import QRCode from 'qrcode';

export async function generateQrDataUrl(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 320,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#0f172a',
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'H',
      ...options,
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
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
