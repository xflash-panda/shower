import React from 'react';
import { useTranslation } from 'react-i18next';
import AppleLogin from 'react-apple-login';

interface AppleLoginButtonProps {
  clientId: string;
  onCallback: (response: any) => void;
}

const AppleLoginButton: React.FC<AppleLoginButtonProps> = ({ clientId, onCallback }) => {
  const { t } = useTranslation('login');
  const getAppleRedirectUri = () => {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? `:${port}` : ''}/api/v1/identity/auth/apple/callback`;
  };

  return (
    <AppleLogin
      clientId={clientId}
      redirectURI={getAppleRedirectUri()}
      usePopup={false}
      callback={onCallback}
      scope="email name"
      responseMode="query"
      render={(renderProps: { onClick: (e?: any) => void; disabled?: boolean }) => (
        <button
          type="button"
          className="btn btn-light-dark icon-btn b-r-5 m-1 w-45 h-45"
          title={t('form.appleLogin')}
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          <i className="ti ti-brand-apple"></i>
        </button>
      )}
    />
  );
};

export default AppleLoginButton;
