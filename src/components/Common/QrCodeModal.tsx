import React, { useState, useEffect, useCallback } from 'react';
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import toast from '@helpers/toast';

interface QrCodeModalProps {
  isOpen: boolean;
  toggle: () => void;
  url: string;
  title?: string;
  description?: string;
  clientName?: string;
  clientIcon?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  toggle,
  url,
  title = 'QR Code',
  description,
  clientName,
  clientIcon,
  size = 'md',
  className = '',
}) => {
  const { t } = useTranslation('common');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generateQrCode = useCallback(async (urlToEncode: string): Promise<void> => {
    try {
      setIsGenerating(true);
      setError('');
      const qrCodeOptions = {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M' as const,
      };

      const dataUrl = await QRCode.toDataURL(urlToEncode, qrCodeOptions);
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      setError(t('qrCode.error.generateFailed'));
      toast.error(t('qrCode.error.generateFailed'));
    } finally {
      setIsGenerating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Combine both useEffect into one optimized effect
  useEffect(() => {
    if (isOpen && url) {
      // Generate QR code when modal opens with valid URL
      void generateQrCode(url);
    } else if (!isOpen) {
      // Reset states when modal closes
      setQrCodeDataUrl('');
      setIsGenerating(false);
      setError('');
    }
  }, [isOpen, url, generateQrCode]);

  const handleDownloadQrCode = useCallback((): void => {
    if (!qrCodeDataUrl) {
      toast.error(t('qrCode.error.notAvailable'));
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      // Include client name in filename if available
      const fileName = clientName
        ? `${clientName.toLowerCase().replace(/\s+/g, '_')}_qrcode.png`
        : 'qrcode.png';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(t('qrCode.success.downloaded'));
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error(t('qrCode.error.downloadFailed'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCodeDataUrl, clientName]);

  const handleRetry = useCallback(() => {
    void generateQrCode(url);
  }, [generateQrCode, url]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size={size}
      centered
      className={`qr-code-modal ${className}`}
    >
      <ModalHeader toggle={toggle} className="border-0 pa-20 pa-b-10">
        <div className="d-flex align-items-center">
          <i className="ph-duotone ph-qr-code text-primary mg-e-10 f-s-20"></i>
          <span className="f-fw-600 text-dark">{title}</span>
        </div>
      </ModalHeader>

      <ModalBody className="pa-20 pa-t-10">
        {/* QR Code Display Area */}
        <div className="qr-code-container text-center mg-b-20">
          {isGenerating ? (
            <div className="d-flex flex-column align-items-center justify-content-center pa-40">
              <div className="spinner-border text-primary mg-b-15" role="status">
                <span className="visually-hidden">{t('qrCode.generating')}</span>
              </div>
              <p className="text-muted mg-b-0">{t('qrCode.generating')}</p>
            </div>
          ) : error ? (
            <div className="d-flex flex-column align-items-center justify-content-center pa-40">
              <i className="ph-duotone ph-warning-circle text-danger mg-b-15 display-4"></i>
              <p className="text-danger mg-b-0">{error}</p>
              <Button color="primary" size="sm" className="mg-t-15" onClick={handleRetry}>
                <i className="ph-duotone ph-arrow-clockwise mg-e-5"></i>
                {t('qrCode.retry')}
              </Button>
            </div>
          ) : qrCodeDataUrl ? (
            <div className="qr-code-wrapper">
              {/* Client Name Display - moved above QR code */}
              {clientName && (
                <div className="software-name-container mg-b-12 text-center">
                  <div className="d-inline-flex align-items-center gap-1">
                    {clientIcon ? (
                      <span className={`${clientIcon} small`}></span>
                    ) : (
                      <i className="ph-duotone ph-desktop text-primary small"></i>
                    )}
                    <span className="f-fw-600 text-dark small">{clientName}</span>
                  </div>
                </div>
              )}

              <div className="qr-code-image-container d-inline-block pa-15 bg-white b-r-10 border">
                <img
                  src={qrCodeDataUrl}
                  alt={t('qrCode.download')}
                  className="qr-code-image w-100 h-auto d-block"
                />
              </div>

              {/* Description - positioned between QR code and download button */}
              {description && (
                <div className="mg-t-15">
                  <p className="text-muted mg-b-0 lh-base f-s-13">{description}</p>
                </div>
              )}

              {/* Download Button */}
              <div className="mg-t-15 text-center">
                <Button
                  color="primary"
                  className="btn btn-sm"
                  onClick={handleDownloadQrCode}
                  disabled={!qrCodeDataUrl || isGenerating}
                  title={t('qrCode.download')}
                >
                  <i className="ph-duotone ph-download-simple mg-e-5"></i>
                  {t('qrCode.download')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center pa-40">
              <i className="ph-duotone ph-qr-code text-muted mg-b-15 display-4"></i>
              <p className="text-muted mg-b-0">{t('qrCode.error.noUrlProvided')}</p>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default QrCodeModal;
