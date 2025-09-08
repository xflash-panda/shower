import { Card, CardBody, Col } from 'reactstrap';
import { HashLink } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@helpers/currency';

// 定义组件的 Props 接口
interface WalletBalanceCardProps {
  balance: number;
  promoBalance: number;
}

const WalletBalanceCard = ({ balance, promoBalance }: WalletBalanceCardProps) => {
  const { t } = useTranslation('wallet');
  const total = balance + promoBalance;

  return (
    <Col xs={12} md={4} lg={5}>
      <div className="d-flex flex-column h-100">
        <Card className="mb-3 flex-grow-1">
          <CardBody className="text-center">
            <div className="mb-1 text-muted small fs-6 f-w-600">{t('balance.total')}</div>
            <div className="f-w-700 fs-3 text-primary lh-1">{formatCurrency(total)}</div>
            <div className="text-secondary small mt-2 f-w-500">
              <i className="ti ti-info-circle me-1"></i>
              {t('balance.totalDescription')}
            </div>
          </CardBody>
        </Card>
        <Card className="mb-3 flex-grow-1">
          <CardBody className="text-center">
            <div className="mb-1 text-muted small fs-6 f-w-600">{t('balance.account')}</div>
            <div className="f-w-600 fs-4 text-success lh-1">{formatCurrency(balance)}</div>
          </CardBody>
        </Card>
        <Card className="flex-grow-1 position-relative">
          <CardBody className="text-center">
            {/* 右上角内置样式按钮 */}
            <HashLink
              to="/invite#rebate-detail"
              className="position-absolute top-0 end-0 m-2 rounded-circle p-2"
              title={t('balance.viewDetails')}
              smooth
            >
              <i className="ti ti-list-details text-dark fs-5"></i>
            </HashLink>
            <div className="mb-1 text-muted small fs-6 f-w-600">{t('balance.commission')}</div>
            <div className="f-w-600 fs-4 text-dark lh-1">{formatCurrency(promoBalance)}</div>
          </CardBody>
        </Card>
      </div>
    </Col>
  );
};

export default WalletBalanceCard;
