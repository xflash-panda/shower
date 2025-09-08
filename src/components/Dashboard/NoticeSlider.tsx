import React, { useState } from 'react';
import Slider from 'react-slick';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatTime, TIME_FORMATS } from '../../helpers/time';
import MarkdownRenderer from '../Common/MarkdownRenderer';

interface NoticeSliderProps {
  notices: API_V1.User.NoticeItem[];
}

const NoticeSlider: React.FC<NoticeSliderProps> = ({ notices }) => {
  const { t } = useTranslation('dashboard');
  const [noticeModal, setNoticeModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<API_V1.User.NoticeItem | null>(null);

  const toggleNoticeModal = () => {
    setNoticeModal(!noticeModal);
    if (!noticeModal) {
      setSelectedNotice(null);
    }
  };

  const handleNoticeClick = (notice: API_V1.User.NoticeItem) => {
    setSelectedNotice(notice);
    setNoticeModal(true);
  };
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 1500,
    fade: true,
    cssEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    slidesToShow: 1,
    pauseOnHover: true,
  };

  return (
    <>
      <div className="notice-slider-wrapper app-arrow square-dots">
        <Slider {...settings} className="notice-fade-slider">
          {notices.map(notice => (
            <div key={notice.id} className="notice-slide">
              <div
                className="position-relative cursor-pointer"
                onClick={() => handleNoticeClick(notice)}
              >
                <img
                  src={notice.img_url}
                  alt={notice.title}
                  className="img-fluid b-r-15 w-100 notice-slide-image"
                />
                {/* 覆盖层 */}
                <div className="notice-slide-overlay position-absolute">
                  <div className="pa-20 text-white w-100">
                    <h5 className="f-fw-600 mg-b-5 notice-text-white">{notice.title}</h5>
                    <small className="mg-b-0 notice-text-white d-block">
                      {formatTime(notice.created_at, TIME_FORMATS.DATE)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* 通知详情模态框 */}
      <Modal
        isOpen={noticeModal}
        toggle={toggleNoticeModal}
        size="lg"
        className="notice-modal"
        container=".app-wrapper"
        centered
      >
        <ModalHeader toggle={toggleNoticeModal} className="border-0 pa-25 pa-b-15">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <div className="d-flex align-items-center justify-content-center b-r-10 w-40 h-40 txt-bg-primary">
                <i className="ph-duotone ph-megaphone text-primary f-s-18"></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <h5 className="f-fw-600 mg-b-0 text-dark">{selectedNotice?.title}</h5>
              {selectedNotice && (
                <small className="text-dark mg-t-5">
                  {t('notice.published')}:
                  <span className="mg-s-4">
                    {formatTime(selectedNotice.created_at, TIME_FORMATS.DATE)}
                  </span>
                </small>
              )}
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="pa-25 pa-t-0">
          {selectedNotice && (
            <div className="notice-content pa-20 b-r-10 b-1-secondary txt-bg-secondary">
              <MarkdownRenderer
                content={selectedNotice.content}
                variant="notice"
                className="notice-markdown"
              />
            </div>
          )}

          {/* 按钮移到内容区域右下角 */}
          <div className="text-end mg-t-15">
            <Button onClick={toggleNoticeModal} color="secondary" outline className="btn-md btn">
              {t('notice.confirm')}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default NoticeSlider;
