import React from 'react';
import { Button } from 'reactstrap';
import { useTranslation, Trans } from 'react-i18next';

interface InviteHeaderProps {
  codesLength: number;
  inviteGenLimit: number;
  onGenCode: () => void;
  isGenerating?: boolean;
}

const InviteHeader = ({
  codesLength,
  inviteGenLimit,
  onGenCode,
  isGenerating = false,
}: InviteHeaderProps) => {
  const { t } = useTranslation('invite');

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <span className="text-muted">
        <Trans
          i18nKey="invite:header.generatedCount"
          values={{ current: codesLength, total: inviteGenLimit }}
          components={{ b: <b /> }}
        />
      </span>
      <Button
        color="primary"
        size="md"
        className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
        onClick={onGenCode}
        disabled={isGenerating || codesLength >= inviteGenLimit}
      >
        {isGenerating ? (
          <>
            <i className="ph ph-spinner ph-spin"></i>
            {t('header.generating')}
          </>
        ) : (
          <>
            <i className="ph ph-plus"></i>
            {t('header.generateCode')}
          </>
        )}
      </Button>
    </div>
  );
};

export default InviteHeader;
