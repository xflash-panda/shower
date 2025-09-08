import React from 'react';
import { useTranslation } from 'react-i18next';

// 分页组件属性接口
export interface PaginationProps {
  /** 当前页码 */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 页码变化回调 */
  onPageChange: (page: number) => void;
  /** 是否显示分页（当总页数 <= 1 时可隐藏） */
  showWhenSinglePage?: boolean;
  /** 最多显示的页码数量（默认为 5） */
  maxVisiblePages?: number;
  /** 自定义样式类 */
  className?: string;
  /** 分页大小，可选值: 'sm' | 'lg' */
  size?: 'sm' | 'lg';
}

// 页码项接口
interface PageItem {
  value: number | '...';
  key: string;
  isEllipsis: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showWhenSinglePage = false,
  maxVisiblePages = 5,
  className = '',
  size,
}) => {
  const { t } = useTranslation('common');
  // 当只有一页且不强制显示时，不渲染组件
  if (totalPages <= 1 && !showWhenSinglePage) {
    return null;
  }

  // 生成页码列表的算法
  const generatePageList = (): PageItem[] => {
    const pages: PageItem[] = [];

    if (totalPages <= maxVisiblePages) {
      // 总页数不超过最大显示数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          value: i,
          key: `page-${i}`,
          isEllipsis: false,
        });
      }
    } else {
      // 总页数超过最大显示数，需要省略号
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (currentPage <= halfVisible + 1) {
        // 当前页在前面部分
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pages.push({
            value: i,
            key: `page-${i}`,
            isEllipsis: false,
          });
        }
        pages.push({
          value: '...',
          key: 'ellipsis-end',
          isEllipsis: true,
        });
        pages.push({
          value: totalPages,
          key: `page-${totalPages}`,
          isEllipsis: false,
        });
      } else if (currentPage >= totalPages - halfVisible) {
        // 当前页在后面部分
        pages.push({
          value: 1,
          key: 'page-1',
          isEllipsis: false,
        });
        pages.push({
          value: '...',
          key: 'ellipsis-start',
          isEllipsis: true,
        });
        for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
          pages.push({
            value: i,
            key: `page-${i}`,
            isEllipsis: false,
          });
        }
      } else {
        // 当前页在中间部分
        pages.push({
          value: 1,
          key: 'page-1',
          isEllipsis: false,
        });
        pages.push({
          value: '...',
          key: 'ellipsis-start',
          isEllipsis: true,
        });
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push({
            value: i,
            key: `page-${i}`,
            isEllipsis: false,
          });
        }
        pages.push({
          value: '...',
          key: 'ellipsis-end',
          isEllipsis: true,
        });
        pages.push({
          value: totalPages,
          key: `page-${totalPages}`,
          isEllipsis: false,
        });
      }
    }

    return pages;
  };

  const pageList = generatePageList();

  // 处理页码点击
  const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, page: number | '...') => {
    e.preventDefault();
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  // 处理上一页
  const handlePrevious = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // 处理下一页
  const handleNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 构建分页组件的样式类
  const paginationClass = [
    'pagination',
    'app-pagination',
    'justify-content-center',
    size && `pagination-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="mt-3">
      <ul className={paginationClass}>
        {/* 上一页按钮 */}
        <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
          <a
            className="page-link"
            href="#"
            aria-label={t('pagination.previous')}
            onClick={handlePrevious}
          >
            <span aria-hidden="true">«</span>
          </a>
        </li>

        {/* 页码列表 */}
        {pageList.map(pageItem => {
          if (pageItem.isEllipsis) {
            return (
              <li className="page-item disabled" key={pageItem.key}>
                <span className="page-link">...</span>
              </li>
            );
          }

          return (
            <li
              className={`page-item${currentPage === pageItem.value ? ' active' : ''}`}
              key={pageItem.key}
            >
              <a className="page-link" href="#" onClick={e => handlePageClick(e, pageItem.value)}>
                {pageItem.value}
              </a>
            </li>
          );
        })}

        {/* 下一页按钮 */}
        <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
          <a className="page-link" href="#" aria-label={t('pagination.next')} onClick={handleNext}>
            <span aria-hidden="true">»</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
