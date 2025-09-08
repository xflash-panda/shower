import React from 'react';
import { Button, Table } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface InviteCodeTableProps {
  codes: API_V1.User.InviteCodeItem[];
  onCopyCode: (code: string) => void;
  onCopyLink: (code: string) => void;
}

const InviteCodeTable = ({ codes, onCopyCode, onCopyLink }: InviteCodeTableProps) => {
  const { t } = useTranslation('invite');

  return (
    <>
      <div className="table-responsive">
        <Table className="table table-bottom-border align-middle mb-0 text-center" hover size="sm">
          <thead>
            <tr className="text-dark fw-semibold align-middle">
              <th className="text-center align-middle">#</th>
              <th className="text-start align-middle">{t('table.inviteCode')}</th>
              <th className="d-none d-md-table-cell text-center align-middle">
                {t('table.createdAt')}
              </th>
              <th className="text-center align-middle">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((item, idx) => (
              <tr key={item.id} className="align-middle">
                <td className="text-center align-middle">{idx + 1}</td>
                <td className="text-start align-middle">
                  <span className="badge rounded-pill bg-primary text-white fs-6 px-4 py-2 font-monospace">
                    {item.code}
                  </span>
                </td>
                <td className="d-none d-md-table-cell text-center align-middle">
                  <span className="font-monospace">
                    {new Date(item.created_at * 1000).toLocaleString()}
                  </span>
                </td>
                <td className="text-center align-middle">
                  <div
                    className="d-flex justify-content-center align-items-center gap-2"
                    role="group"
                    aria-label={t('table.actions')}
                  >
                    <Button
                      color="primary"
                      outline
                      size="sm"
                      title={t('actions.copyCode')}
                      className="d-flex align-items-center px-2"
                      onClick={() => onCopyCode(item.code)}
                      style={{ minWidth: 0 }}
                    >
                      <i className="ph ph-copy me-1"></i>
                      {t('actions.copyCode')}
                    </Button>
                    <Button
                      color="secondary"
                      outline
                      size="sm"
                      title={t('actions.copyLink')}
                      className="d-flex align-items-center px-2"
                      onClick={() => onCopyLink(item.code)}
                      style={{ minWidth: 0 }}
                    >
                      <i className="ph ph-link me-1"></i>
                      {t('actions.copyLink')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default InviteCodeTable;
