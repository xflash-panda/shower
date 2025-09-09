import type { ReactElement } from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Forbidden = (): ReactElement => {
  const { t } = useTranslation('error');

  return (
    <div className="error-container p-0">
      <Container>
        <div>
          <div>
            <img src="assets/images/background/error-403.png" className="img-fluid" alt="" />
          </div>
          <div className="mb-3">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <p className="text-center text-secondary f-w-500">{t('forbidden.description')}</p>
              </div>
            </div>
          </div>
          <Link role="button" to="/dashboard" className="btn btn-lg btn-light-success">
            <i className="ti ti-home"></i> {t('forbidden.backToHome')}
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Forbidden;
