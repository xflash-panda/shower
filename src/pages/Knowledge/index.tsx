import React, { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Input,
  Badge,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import KnowledgeModal from '@components/Common/KnowledgeModal';
import SubscriptionRequiredModal from '@components/Common/SubscriptionRequiredModal';
import EmptyState from '@components/Common/EmptyState';
import { useKnowledges } from '@hooks/useUser';
import { formatTime, TIME_FORMATS } from '@helpers/time';
import Loading from '@components/Common/Loading';
import { getCurrentLanguage } from '@/helpers/i18n';

// 类型定义基于API接口
type KnowledgeItem = API_V1.User.KnowledgeItem;
type KnowledgeDataType = Record<string, KnowledgeItem[]>;

const KnowledgePage: React.FC = () => {
  const { t } = useTranslation('knowledge');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [selectedDocTitle, setSelectedDocTitle] = useState<string>('');
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState<boolean>(false);

  // 获取知识库列表数据
  const { knowledges, isLoading: isKnowledgesLoading } = useKnowledges(
    { language: getCurrentLanguage() },
    true,
  );

  // 处理文档点击
  const handleDocumentClick = (item: KnowledgeItem): void => {
    if (item && typeof item.id === 'number') {
      setSelectedDocTitle(item.title || '');
      // 检查是否需要订阅
      if (item.free !== 0) {
        // 需要订阅，显示订阅提示Modal
        setSubscriptionModalOpen(true);
      } else {
        // 免费文档，显示文档详情Modal
        setSelectedDocId(item.id);
        setModalOpen(true);
      }
    }
  };

  // 关闭Modal并重置选中的文档ID和标题
  const handleModalClose = (): void => {
    setModalOpen(false);
    setSelectedDocId(null);
    setSelectedDocTitle('');
  };

  // 关闭订阅提示Modal并重置标题
  const handleSubscriptionModalClose = (): void => {
    setSubscriptionModalOpen(false);
    setSelectedDocTitle('');
  };

  // 获取所有分类
  const categories = useMemo(() => {
    if (!knowledges) return [];
    return Object.keys(knowledges);
  }, [knowledges]);

  // 过滤数据
  const filteredData = useMemo((): KnowledgeDataType => {
    if (!knowledges) return {};

    const result: KnowledgeDataType = {};

    Object.keys(knowledges).forEach((category: string) => {
      if (selectedCategory === 'all' || selectedCategory === category) {
        const filteredItems = knowledges[category].filter((item: KnowledgeItem) =>
          item?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        if (filteredItems.length > 0) {
          result[category] = filteredItems;
        }
      }
    });

    return result;
  }, [knowledges, searchTerm, selectedCategory]);

  // 获取总项目数
  const getTotalItems = (): number => {
    return Object.values(filteredData).reduce(
      (total: number, items: KnowledgeItem[]) => total + items.length,
      0,
    );
  };

  // 显示加载状态
  if (isKnowledgesLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '60vh' }}
      >
        <Loading size="lg" text={t('search.loading')} />
      </div>
    );
  }

  return (
    <div className="min-vh-100">
      <Container fluid className="py-4">
        {/* 页面标题区域 */}
        <Row className="mg-b-20">
          <Col xs={12}>
            <h4 className="main-title">
              <i className="ph-duotone ph-book-open me-2"></i>
              {t('title')}
            </h4>
          </Col>
        </Row>

        {/* 搜索和筛选区域 */}
        <Card className="b-r-15 mg-b-30">
          <CardBody className="pa-24">
            <Row className="align-items-stretch">
              <Col lg={3} md={4} sm={12} className="d-flex">
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={() => setDropdownOpen(!dropdownOpen)}
                  className="w-100 mg-b-20 mg-b-lg-0"
                >
                  <DropdownToggle
                    caret
                    className="w-100 text-start d-flex align-items-center justify-content-between pa-15 b-r-15 b-1-light bg-white f-s-14 h-50 text-dark knowledge-dropdown-toggle"
                  >
                    <div className="d-flex align-items-center">
                      <i className="ph ph-funnel me-2 text-primary"></i>
                      {selectedCategory === 'all' ? t('filter.allCategories') : selectedCategory}
                    </div>
                  </DropdownToggle>
                  <DropdownMenu className="w-100 b-r-15 b-1-secondary shadow-sm bg-white">
                    <DropdownItem
                      onClick={() => setSelectedCategory('all')}
                      className={selectedCategory === 'all' ? 'bg-primary text-white' : ''}
                    >
                      <i
                        className={`ph ph-squares-four me-2 ${selectedCategory === 'all' ? 'text-white' : 'text-primary'}`}
                      ></i>
                      {t('filter.allCategories')}
                    </DropdownItem>
                    <DropdownItem divider />
                    {categories.map((category: string) => (
                      <DropdownItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? 'bg-primary text-white' : ''}
                      >
                        <i
                          className={`ph ph-folder me-2 ${selectedCategory === category ? 'text-white' : 'text-primary'}`}
                        ></i>
                        {category}
                        <Badge
                          color={selectedCategory === category ? 'light' : 'secondary'}
                          className="ms-2 f-s-10"
                        >
                          {knowledges?.[category]?.length ?? 0}
                        </Badge>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
              <Col lg={9} md={8} sm={12} className="d-flex">
                <div className="position-relative w-100 h-50">
                  <Input
                    type="search"
                    placeholder={t('search.placeholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="form-control f-s-14 h-100 pa-15 pa-s-40 b-r-15 bg-white text-dark knowledge-search-input"
                  />
                  <div className="position-absolute start-0 top-0 h-100 d-flex align-items-center pa-s-15">
                    <i className="ph-duotone ph-magnifying-glass text-primary f-s-16"></i>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* 搜索结果统计 */}
        <Row className="mg-b-10">
          <Col xs={12}>
            <div className="d-flex align-items-center justify-content-between">
              <p className="text-muted f-s-14 mg-b-15">
                {searchTerm || selectedCategory !== 'all'
                  ? t('stats.filteredResults')
                  : t('stats.allDocuments')}
                <Badge color="dark" className="ms-2 pa-6 f-s-12">
                  {getTotalItems()} {t('stats.documentsCount')}
                </Badge>
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button
                  color="secondary"
                  outline
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="b-r-8"
                >
                  <i className="ph ph-arrow-clockwise me-1"></i>
                  {t('filter.reset')}
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* 文档列表 */}
        {Object.keys(filteredData).length > 0 &&
          Object.keys(filteredData).map((category: string) => (
            <div key={category} className="mg-b-30">
              {/* 分类标题 */}
              <div className="d-flex align-items-center mg-b-20">
                <h5 className="mg-b-0 f-fw-600 text-dark mg-e-15">
                  <i className="ph ph-folder me-2 text-primary"></i>
                  {category}
                </h5>
                <Badge color="dark" className="pa-6 f-s-12 b-r-6">
                  {filteredData[category].length} {t('stats.categoryCount')}
                </Badge>
              </div>

              {/* 文档网格 */}
              <Row>
                {filteredData[category].map((item: KnowledgeItem) => {
                  if (!item || typeof item.id !== 'number') return null;

                  return (
                    <Col key={item.id} lg={6} md={6} sm={12}>
                      <Card className="h-100 b-r-15 border-0 shadow-sm">
                        <CardBody className="pa-20">
                          <div className="d-flex align-items-center mg-b-15">
                            <div className="b-r-10 bg-primary pa-8 mg-e-12 d-flex align-items-center justify-content-center">
                              <i className="ph ph-file-text text-white f-s-14"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mg-b-0 f-fw-600 text-dark">{item.title}</h6>
                            </div>
                          </div>

                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                              <Badge
                                color={item.free === 0 ? 'outline-success' : 'outline-secondary'}
                                className="pa-6 f-s-11 b-r-6"
                              >
                                <i
                                  className={`ph ${item.free === 0 ? 'ph-check-circle' : 'ph-lock'} me-1`}
                                ></i>
                                {item.free === 0 ? t('document.free') : t('document.subscription')}
                              </Badge>
                              <small className="text-muted f-s-11">
                                {item.updated_at && formatTime(item.updated_at, TIME_FORMATS.DATE)}
                              </small>
                            </div>
                            <Button
                              color="primary"
                              outline={item.free !== 0}
                              className="btn btn-sm"
                              onClick={() => handleDocumentClick(item)}
                            >
                              <i
                                className={`ph ${item.free === 0 ? 'ph-eye' : 'ph-crown'} me-1`}
                              ></i>
                              {item.free === 0 ? t('document.view') : t('document.subscribe')}
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          ))}

        {/* 无搜索结果状态 */}
        {Object.keys(filteredData).length === 0 && (
          <EmptyState
            title={t('empty.noData')}
            description={
              searchTerm
                ? t('empty.noSearchResults', { searchTerm })
                : t('empty.noCategoryDocuments')
            }
            icon="iconoir-glass-empty"
            size="lg"
          />
        )}
      </Container>

      {/* 文档详情 KnowledgeModal */}
      <KnowledgeModal
        isOpen={modalOpen}
        toggle={handleModalClose}
        knowledgeId={selectedDocId ?? undefined}
        title={selectedDocTitle}
      />

      {/* 订阅提示 Modal */}
      <SubscriptionRequiredModal
        isOpen={subscriptionModalOpen}
        toggle={handleSubscriptionModalClose}
        documentTitle={selectedDocTitle}
      />
    </div>
  );
};

export default KnowledgePage;
