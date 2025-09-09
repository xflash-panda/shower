import type { ReactElement } from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const InternalServer = (): ReactElement => {
  const { t } = useTranslation('error');

  return (
    <div className="error-container p-0">
      <Container>
        <div>
          <div>
            <img
              src="/assets/images/background/error-500.png"
              className="img-fluid"
              alt="500 Error"
            />
          </div>
          <div className="mb-3">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <p className="text-center text-secondary f-w-500">
                  {t('internalServer.description')}
                </p>
              </div>
            </div>
          </div>
          <Link role="button" to="/dashboard" className="btn btn-lg btn-primary text-white">
            <i className="ti ti-home"></i> {t('internalServer.backToHome')}
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default InternalServer;
