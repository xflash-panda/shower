import { useState, useMemo } from 'react';
import { Input, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { ClientDownloadData, type Client, type DownloadOption } from '@data/V1/Client/ClientData';
import { copyText } from '@helpers/clipboard';
import { detectPlatform, type PlatformType } from '@helpers/platform';
import toast from '@helpers/toast';
import QrCodeModal from '@components/Common/QrCodeModal';
import KnowledgeModal from '@components/Common/KnowledgeModal';
import { getCurrentLanguage } from '@/helpers/i18n';

interface ClientProps {
  subscribeUrl: string;
}

const ClientComponent: React.FC<ClientProps> = ({ subscribeUrl }) => {
  const { t } = useTranslation(['dashboard', 'common']);

  // Helper function to get localized description
  const getLocalizedDescription = (client: Client): string => {
    const currentLanguage = getCurrentLanguage();
    return (
      client.description[currentLanguage as keyof typeof client.description] ||
      client.description['zh-CN']
    );
  };

  // Helper function to build subscription URL with flag parameter
  const buildSubscriptionUrl = (flag: string): string => {
    const url = new URL(subscribeUrl);
    url.searchParams.set('flag', flag);
    return url.toString();
  };

  // Helper function to get all download options for a client
  const getDownloadOptions = (client: Client): DownloadOption[] => {
    return client.downloadUrls ?? [];
  };

  // Helper function to copy subscription link
  const copySubscriptionLink = (flag: string): void => {
    try {
      const subscriptionUrlWithFlag = buildSubscriptionUrl(flag);
      const _success = copyText(subscriptionUrlWithFlag);
    } catch (error) {
      console.error('Error copying subscription link:', error);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');

  // Use useMemo to cache platform detection result
  const detectedPlatform = useMemo(() => {
    return detectPlatform();
  }, []);

  const [activePlatform, setActivePlatform] = useState<PlatformType>(detectedPlatform);

  // State management for client config dropdowns
  const [clientConfigDropdowns, setClientConfigDropdowns] = useState<Record<string, boolean>>({});

  // QR Code Modal state
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [qrModalUrl, setQrModalUrl] = useState<string>('');
  const [qrModalClientName, setQrModalClientName] = useState<string>('');
  const [qrModalClientIcon, setQrModalClientIcon] = useState<string>('');

  // Knowledge Modal state
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState<boolean>(false);
  const [knowledgeModalId, setKnowledgeModalId] = useState<number | undefined>(undefined);
  const [knowledgeModalSlug, setKnowledgeModalSlug] = useState<string | undefined>(undefined);
  const [knowledgeModalTitle, setKnowledgeModalTitle] = useState<string>('');

  // 简化的一键导入处理函数
  const handleOneClickImport = (client: Client): void => {
    try {
      // 生成导入链接
      const importUrl = client.generateImportUrl(subscribeUrl);

      // 尝试打开链接
      setTimeout(() => {
        window.open(importUrl, '_self');
      }, 500);
    } catch (error) {
      console.error('Error importing configuration:', error);
      toast.error(t('dashboard:toast.error.importFailed'));
    }
  };

  // Toggle specific client dropdown state
  const toggleClientConfigDropdown = (clientId: string) => {
    setClientConfigDropdowns(prev => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  // QR Code Modal functions
  const openQrModal = (flag: string, clientName: string, clientIcon: string): void => {
    const subscriptionUrlWithFlag = buildSubscriptionUrl(flag);
    setQrModalUrl(subscriptionUrlWithFlag);
    setQrModalClientName(clientName);
    setQrModalClientIcon(clientIcon);
    setIsQrModalOpen(true);
  };

  const toggleQrModal = (): void => {
    setIsQrModalOpen(!isQrModalOpen);
  };

  // Helper function to handle documentation based on docs config
  const handleDocumentationClick = (client: Client): void => {
    const { docs } = client;

    if (docs.type === 'url') {
      // For URL type, open directly in new tab
      window.open(docs.value, '_blank');
    } else if (docs.type === 'id') {
      // For ID type, use KnowledgeModal with ID
      setKnowledgeModalId(docs.value);
      setKnowledgeModalSlug(undefined);
      setKnowledgeModalTitle(`${client.name} Documentation`);
      setIsKnowledgeModalOpen(true);
    } else if (docs.type === 'slug') {
      // For slug type, use KnowledgeModal with slug
      setKnowledgeModalId(undefined);
      setKnowledgeModalSlug(docs.value);
      setKnowledgeModalTitle(client.name);
      setIsKnowledgeModalOpen(true);
    }
  };

  const toggleKnowledgeModal = (): void => {
    setIsKnowledgeModalOpen(!isKnowledgeModalOpen);
    if (!isKnowledgeModalOpen) {
      // Reset state when closing
      setKnowledgeModalId(undefined);
      setKnowledgeModalSlug(undefined);
      setKnowledgeModalTitle('');
    }
  };

  return (
    <div className="d-flex flex-column flex-grow-1">
      {/* Platform switching tabs - responsive optimization */}
      <div className="mg-b-20 mg-t-20 flex-shrink-0">
        {/* Mobile layout */}
        <div className="d-block d-md-none">
          {/* Mobile platform selection - compact design */}
          <div className="mg-b-15">
            <div className="d-flex justify-content-center gap-2 pa-2">
              {ClientDownloadData.platforms.map(platform => (
                <Button
                  key={platform.id}
                  color={activePlatform === platform.id ? 'primary' : 'secondary'}
                  outline={activePlatform !== platform.id}
                  size="sm"
                  className="d-flex align-items-center justify-content-center f-fw-600 pa-8 w-40 h-40 b-r-10"
                  onClick={() => setActivePlatform(platform.id as PlatformType)}
                  title={platform.name} // Provide hover tooltip
                >
                  <i className={`${platform.icon}`}></i>
                </Button>
              ))}
            </div>
          </div>
          {/* Mobile search box */}
          <div className="position-relative app-form app-icon-form">
            <Input
              type="search"
              placeholder={t('client.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="form-control"
            />
            <i className="ph-duotone ph-magnifying-glass text-dark"></i>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="d-none d-md-flex justify-content-between align-items-center gap-4">
          {/* Desktop platform selection */}
          <div
            className="btn-group flex-wrap"
            role="group"
            aria-label={t('client.platformSelection')}
          >
            {ClientDownloadData.platforms.map(platform => (
              <Button
                key={platform.id}
                color={activePlatform === platform.id ? 'primary' : 'secondary'}
                outline={activePlatform !== platform.id}
                size="sm"
                className="d-flex align-items-center justify-content-center gap-2 f-fw-600 pa-8 pa-s-12 pa-e-12 w-120"
                onClick={() => setActivePlatform(platform.id as PlatformType)}
              >
                <i className={`${platform.icon}`}></i>
                <span>{platform.name}</span>
              </Button>
            ))}
          </div>
          {/* Desktop search box */}
          <div className="flex-shrink-0 w-250">
            <div className="position-relative app-form app-icon-form">
              <Input
                type="search"
                placeholder={t('client.searchPlaceholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-control"
              />
              <i className="ph-duotone ph-magnifying-glass text-dark"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Current platform client list - responsive optimization */}
      <div className="flex-grow-1">
        {ClientDownloadData.platforms
          .filter(platform => platform.id === activePlatform)
          .map(platform => (
            <div key={platform.id}>
              {platform.clients
                .filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(client => (
                  <div key={client.id} className="mg-b-12">
                    <div className="pa-15 bg-white b-r-10 shadow-sm border-0">
                      {/* Desktop layout */}
                      <div className="d-none d-md-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center flex-grow-1">
                          {/* Client-specific icon */}
                          <div className="d-flex align-items-center justify-content-center b-r-8 mg-e-12 w-40 h-40 flex-shrink-0">
                            <span className={`${client.icon} d-inline-block`}></span>
                          </div>

                          <div className="flex-grow-1 mg-e-15">
                            <div className="d-flex align-items-center justify-content-between mg-b-5">
                              <h6 className="f-fw-700 mg-b-0 text-dark">{client.name}</h6>
                            </div>

                            <small className="text-muted mg-b-8 lh-base d-block">
                              {getLocalizedDescription(client)}
                            </small>

                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge txt-bg-primary f-fw-600 pa-2 pa-s-6 pa-e-6">
                                <i className="ph-duotone ph-tag me-1"></i>
                                {client.version}
                              </span>
                              <span className="badge txt-bg-info f-fw-600 pa-2 pa-s-6 pa-e-6">
                                <i className="ph-duotone ph-calendar me-1"></i>
                                {client.updateDate}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop button group - only show on medium and above screens */}
                        <div className="d-none d-md-flex gap-2 flex-shrink-0">
                          {/* Always use dropdown for consistency */}
                          <Dropdown
                            isOpen={clientConfigDropdowns[`download-${client.id}`] || false}
                            toggle={() => {
                              setClientConfigDropdowns(prev => ({
                                ...prev,
                                [`download-${client.id}`]: !prev[`download-${client.id}`],
                              }));
                            }}
                          >
                            <DropdownToggle
                              caret
                              color="primary"
                              className="btn btn-sm"
                              style={{ minWidth: '85px' }}
                            >
                              <i className="ph-duotone ph-download me-1"></i>
                              {t('client.download')}
                            </DropdownToggle>
                            <DropdownMenu>
                              {/* Always show detailed download options */}
                              {getDownloadOptions(client).map(option => (
                                <DropdownItem
                                  key={`${option.architecture}-${option.fileType}`}
                                  onClick={() => window.open(option.url, '_blank')}
                                  className="d-flex justify-content-between align-items-center"
                                >
                                  <div>
                                    <small className="f-fw-600">
                                      {option.architecture.toUpperCase()} -{' '}
                                      {option.fileType.toUpperCase()}
                                    </small>
                                    <small className="text-muted d-block">
                                      {option.fileType === 'exe'
                                        ? 'Installer Package'
                                        : option.fileType === 'dmg'
                                          ? 'Disk Image'
                                          : option.fileType === '7z'
                                            ? 'Portable Archive'
                                            : option.fileType === 'tar.gz'
                                              ? 'Archive File'
                                              : option.fileType === 'app'
                                                ? 'App Store Application'
                                                : option.fileType === 'apk'
                                                  ? 'Android Package'
                                                  : option.fileType === 'msi'
                                                    ? 'Windows Installer'
                                                    : option.fileType === 'zip'
                                                      ? 'Compressed Archive'
                                                      : option.fileType === 'gz'
                                                        ? 'Gzip Archive'
                                                        : option.fileType === 'AppImage'
                                                          ? 'Linux AppImage'
                                                          : 'Download File'}
                                    </small>
                                  </div>
                                  <i className="ph-duotone ph-download text-primary"></i>
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                          <Button
                            color="secondary"
                            outline
                            className="btn btn-sm"
                            onClick={() => handleDocumentationClick(client)}
                          >
                            <i className="ph-duotone ph-book me-1"></i>
                            {t('client.documentation')}
                          </Button>
                          <Dropdown
                            isOpen={clientConfigDropdowns[client.id] ?? false}
                            toggle={() => toggleClientConfigDropdown(client.id)}
                          >
                            <DropdownToggle
                              color="primary"
                              outline
                              size="sm"
                              className="btn btn-sm"
                            >
                              <i className="ph-duotone ph-gear me-1"></i>
                              {t('client.configImport')}
                              <i className="ti ti-chevron-down ms-1"></i>
                            </DropdownToggle>
                            <DropdownMenu className="app-dropdown dropdown-menu-end" end>
                              {/* 第一个一键导入UI - 移除状态处理 */}
                              <DropdownItem
                                className="client-dropdown-item d-flex align-items-center pa-10 pa-s-15 pa-e-15 f-fw-500"
                                onPointerDown={() => void handleOneClickImport(client)}
                              >
                                <span className="bg-light-info h-30 w-30 d-flex-center b-r-8 me-3">
                                  <i className="ph-duotone ph-export text-info"></i>
                                </span>
                                <div>
                                  <small className="f-fw-600">{t('client.oneClickImport')}</small>
                                  <small className="text-muted d-block">
                                    {t('client.oneClickImportDesc')}
                                  </small>
                                </div>
                              </DropdownItem>

                              <div className="dropdown-divider mg-s-15 mg-e-15"></div>

                              <DropdownItem
                                className="client-dropdown-item d-flex align-items-center pa-10 pa-s-15 pa-e-15 f-fw-500"
                                key="copy"
                                onPointerDown={() => {
                                  copySubscriptionLink(client.subFlag);
                                  toast.success(t('subscription.success.linkClicked'));
                                }}
                              >
                                <span className="bg-light-success h-30 w-30 d-flex-center b-r-8 me-3">
                                  <i className="ph-duotone ph-copy text-success"></i>
                                </span>
                                <div>
                                  <small className="f-fw-600">
                                    {t('client.copySubscriptionLink')}
                                  </small>
                                  <small className="text-muted d-block">
                                    {t('client.copyLinkDesc')}
                                  </small>
                                </div>
                              </DropdownItem>

                              <DropdownItem
                                className="client-dropdown-item d-flex align-items-center pa-10 pa-s-15 pa-e-15 f-fw-500"
                                key="qr"
                                onPointerDown={() => {
                                  openQrModal(client.subFlag, client.name, client.icon);
                                }}
                              >
                                <span className="bg-light-primary h-30 w-30 d-flex-center b-r-8 me-3">
                                  <i className="ph-duotone ph-qr-code text-primary"></i>
                                </span>
                                <div>
                                  <small className="f-fw-600">{t('client.scanQrCode')}</small>
                                  <small className="text-muted d-block">
                                    {t('client.qrCodeDesc')}
                                  </small>
                                </div>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>

                      {/* Mobile layout - optimized version */}
                      <div className="d-block d-md-none">
                        {/* Mobile header: icon + title - enhanced visual effect */}
                        <div className="d-flex align-items-center mg-b-15">
                          <div className="d-flex align-items-center justify-content-center b-r-10 mg-e-15 w-50 h-50 flex-shrink-0 shadow-sm">
                            <span className={`${client.icon} d-inline-block`}></span>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="f-fw-700 mg-b-0 text-dark lh-sm">{client.name}</h5>
                          </div>
                        </div>

                        {/* Mobile description - optimized readability */}
                        <div className="mg-b-15">
                          <small className="text-muted mg-b-0 lh-base d-block">
                            {getLocalizedDescription(client)}
                          </small>
                        </div>

                        {/* Mobile tags - enhanced visual effect */}
                        <div className="d-flex flex-wrap gap-2 mg-b-20">
                          <span className="badge txt-bg-primary f-fw-600 pa-4 pa-s-8 pa-e-8 b-r-6">
                            <i className="ph-duotone ph-tag me-1"></i>
                            {client.version}
                          </span>
                          <span className="badge txt-bg-info f-fw-600 pa-4 pa-s-8 pa-e-8 b-r-6">
                            <i className="ph-duotone ph-calendar me-1"></i>
                            {client.updateDate}
                          </span>
                        </div>

                        {/* Mobile button group - enhanced touch experience */}
                        <div className="d-grid gap-3">
                          {/* Always use dropdown for consistency */}
                          <Dropdown
                            isOpen={clientConfigDropdowns[`mobile-download-${client.id}`] || false}
                            toggle={() => {
                              setClientConfigDropdowns(prev => ({
                                ...prev,
                                [`mobile-download-${client.id}`]:
                                  !prev[`mobile-download-${client.id}`],
                              }));
                            }}
                          >
                            <DropdownToggle
                              caret
                              color="primary"
                              className="d-flex align-items-center justify-content-center pa-12 f-fw-600 w-100"
                            >
                              <i className="ph-duotone ph-download me-2"></i>
                              {t('client.downloadClient')}
                            </DropdownToggle>
                            <DropdownMenu className="w-100">
                              {/* Always show detailed download options */}
                              {getDownloadOptions(client).map(option => (
                                <DropdownItem
                                  key={`mobile-${option.architecture}-${option.fileType}`}
                                  onClick={() => window.open(option.url, '_blank')}
                                  className="pa-15"
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <small className="f-fw-600">
                                        {option.architecture.toUpperCase()} -{' '}
                                        {option.fileType.toUpperCase()}
                                      </small>
                                      <small className="text-muted d-block">
                                        {option.fileType === 'exe'
                                          ? 'Installer Package'
                                          : option.fileType === 'dmg'
                                            ? 'Disk Image'
                                            : option.fileType === '7z'
                                              ? 'Portable Archive'
                                              : option.fileType === 'tar.gz'
                                                ? 'Archive File'
                                                : option.fileType === 'app'
                                                  ? 'App Store Application'
                                                  : option.fileType === 'apk'
                                                    ? 'Android Package'
                                                    : option.fileType === 'msi'
                                                      ? 'Windows Installer'
                                                      : option.fileType === 'zip'
                                                        ? 'Compressed Archive'
                                                        : option.fileType === 'gz'
                                                          ? 'Gzip Archive'
                                                          : option.fileType === 'AppImage'
                                                            ? 'Linux AppImage'
                                                            : 'Download File'}
                                      </small>
                                    </div>
                                    <i className="ph-duotone ph-download text-primary"></i>
                                  </div>
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>

                          <div className="d-flex gap-3">
                            <Button
                              color="primary"
                              outline
                              className="flex-fill d-flex align-items-center justify-content-center pa-10 f-fw-500"
                              onClick={() => handleDocumentationClick(client)}
                            >
                              <i className="ph-duotone ph-book me-1"></i>
                              {t('client.viewDocumentation')}
                            </Button>

                            <Dropdown
                              isOpen={clientConfigDropdowns[client.id] ?? false}
                              toggle={() => toggleClientConfigDropdown(client.id)}
                              className="flex-fill"
                            >
                              <DropdownToggle
                                color="primary"
                                outline
                                className="btn w-100 d-flex align-items-center justify-content-center pa-10 f-fw-500"
                              >
                                <i className="ph-duotone ph-gear me-1"></i>
                                {t('client.configImport')}
                                <i className="ti ti-chevron-down ms-1"></i>
                              </DropdownToggle>
                              <DropdownMenu className="app-dropdown dropdown-menu-end" end>
                                {/* 第二个一键导入UI - 移除状态处理 */}
                                <DropdownItem
                                  className="client-dropdown-item d-flex align-items-center pa-10 pa-s-15 pa-e-15 f-fw-500"
                                  onPointerDown={() => void handleOneClickImport(client)}
                                >
                                  <span className="bg-light-info h-30 w-30 d-flex-center b-r-8 me-3">
                                    <i className="ph-duotone ph-export text-info"></i>
                                  </span>
                                  <div>
                                    <small className="f-fw-600">{t('client.oneClickImport')}</small>
                                    <small className="text-muted d-block">
                                      {t('client.oneClickImportDesc')}
                                    </small>
                                  </div>
                                </DropdownItem>

                                <div className="dropdown-divider mg-s-15 mg-e-15"></div>

                                <DropdownItem
                                  className="client-dropdown-item d-flex align-items-center pa-10 pa-s-15 pa-e-15 f-fw-500"
                                  onPointerDown={() => {
                                    copySubscriptionLink(client.subFlag);
                                    toast.success(t('subscription.success.linkCopied'));
                                  }}
                                >
                                  <span className="bg-light-success h-30 w-30 d-flex-center b-r-8 me-3">
                                    <i className="ph-duotone ph-copy text-success"></i>
                                  </span>
                                  <div>
                                    <small className="f-fw-600">
                                      {t('client.copySubscriptionLink')}
                                    </small>
                                    <small className="text-muted d-block">
                                      {t('client.copyLinkDesc')}
                                    </small>
                                  </div>
                                </DropdownItem>

                                <DropdownItem
                                  className="client-dropdown-item d-flex align-items-center pa-10 pa-s-15 pa-e-15 f-fw-500"
                                  onPointerDown={() => {
                                    openQrModal(client.subFlag, client.name, client.icon);
                                  }}
                                >
                                  <span className="bg-light-primary h-30 w-30 d-flex-center b-r-8 me-3">
                                    <i className="ph-duotone ph-qr-code text-primary"></i>
                                  </span>
                                  <div>
                                    <small className="f-fw-600">{t('client.scanQrCode')}</small>
                                    <small className="text-muted d-block">
                                      {t('client.qrCodeDesc')}
                                    </small>
                                  </div>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        toggle={toggleQrModal}
        url={qrModalUrl}
        title={t('client.qrCodeTitle')}
        description={t('client.qrCodeDescription')}
        clientName={qrModalClientName}
        clientIcon={qrModalClientIcon}
        size="md"
      />

      {/* Knowledge Modal */}
      <KnowledgeModal
        isOpen={isKnowledgeModalOpen}
        toggle={toggleKnowledgeModal}
        knowledgeId={knowledgeModalId}
        knowledgeSlug={knowledgeModalSlug}
        title={knowledgeModalTitle}
      />
    </div>
  );
};

export default ClientComponent;
