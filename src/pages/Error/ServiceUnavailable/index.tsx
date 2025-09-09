import type { ReactElement } from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ServiceUnavailable = (): ReactElement => {
  const { t } = useTranslation('error');

  return (
    <div className="error-container p-0">
      <Container>
        <div>
          <div>
            <img
              src="assets/images/background/error-503.png"
              className="img-fluid"
              alt="503 Error"
            />
          </div>
          <div className="mb-3">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <p className="text-center text-secondary f-w-500">
                  {t('serviceUnavailable.description')}
                </p>
              </div>
            </div>
          </div>
          <Link role="button" to="/dashboard" className="btn btn-lg btn-light-danger text-white">
            <i className="ti ti-home"></i> {t('serviceUnavailable.backToHome')}
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default ServiceUnavailable;
