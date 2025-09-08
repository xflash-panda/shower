import { useState, useMemo } from 'react';

// 分页 Hook 的参数接口
export interface UsePaginationProps {
  /** 总数据量 */
  totalItems: number;
  /** 每页显示的数据量，默认为 10 */
  pageSize?: number;
  /** 初始页码，默认为 1 */
  initialPage?: number;
}

// 分页 Hook 的返回值接口
export interface UsePaginationReturn<T> {
  /** 当前页码 */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 每页大小 */
  pageSize: number;
  /** 设置当前页码 */
  setCurrentPage: (page: number) => void;
  /** 跳转到指定页 */
  goToPage: (page: number) => void;
  /** 上一页 */
  goToPrevious: () => void;
  /** 下一页 */
  goToNext: () => void;
  /** 跳转到第一页 */
  goToFirst: () => void;
  /** 跳转到最后一页 */
  goToLast: () => void;
  /** 获取当前页的数据切片 */
  getPagedData: (data: T[]) => T[];
  /** 当前页开始索引（从 0 开始） */
  startIndex: number;
  /** 当前页结束索引（从 0 开始） */
  endIndex: number;
  /** 是否为第一页 */
  isFirstPage: boolean;
  /** 是否为最后一页 */
  isLastPage: boolean;
}

/**
 * 分页管理 Hook
 * @param props 分页配置参数
 * @returns 分页状态和操作方法
 */
export const usePagination = <T = any>({
  totalItems,
  pageSize = 10,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn<T> => {
  // 当前页码状态
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // 计算总页数
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  // 计算当前页的开始和结束索引
  const { startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, totalItems);
    return { startIndex: start, endIndex: end };
  }, [currentPage, pageSize, totalItems]);

  // 判断是否为第一页和最后一页
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  // 安全地设置页码（确保在有效范围内）
  const safeSetPage = (page: number) => {
    const safePage = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(safePage);
  };

  // 跳转到指定页
  const goToPage = (page: number) => {
    safeSetPage(page);
  };

  // 上一页
  const goToPrevious = () => {
    if (!isFirstPage) {
      safeSetPage(currentPage - 1);
    }
  };

  // 下一页
  const goToNext = () => {
    if (!isLastPage) {
      safeSetPage(currentPage + 1);
    }
  };

  // 跳转到第一页
  const goToFirst = () => {
    safeSetPage(1);
  };

  // 跳转到最后一页
  const goToLast = () => {
    safeSetPage(totalPages);
  };

  // 获取当前页的数据切片
  const getPagedData = (data: T[]): T[] => {
    return data.slice(startIndex, endIndex);
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage: safeSetPage,
    goToPage,
    goToPrevious,
    goToNext,
    goToFirst,
    goToLast,
    getPagedData,
    startIndex,
    endIndex,
    isFirstPage,
    isLastPage,
  };
};
