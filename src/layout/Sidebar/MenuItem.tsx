import { Fragment, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 侧边栏相关类型定义
export interface SidebarChildItem {
  id: string;
  name: string;
  path: string;
  collapseId?: string;
  children?: SidebarChildItem[];
}

export interface MenuItemProps extends SidebarMenuItem {
  sidebarOpen: boolean;
}

export interface SidebarMenuItem {
  id: string; // 添加唯一标识符
  name: string;
  path?: string;
  iconClass: string;
  title?: string;
  type?: 'dropdown' | 'single';
  badgeCount?: string | number;
  children?: SidebarChildItem[];
  collapseId?: string;
}

const MenuItem: React.FC<MenuItemProps> = props => {
  const {
    title,
    iconClass,
    type,
    path,
    badgeCount,
    children: links = [],
    name,
    collapseId,
    sidebarOpen,
  } = props;

  const { pathname } = useLocation();
  const { t } = useTranslation('sidebar');

  const isActive = useMemo(() => {
    return (linkPath: string) => linkPath === pathname;
  }, [pathname]);

  const checkUnder = (links: SidebarChildItem[]): boolean => {
    return (links ?? []).some(
      (link: SidebarChildItem) =>
        isActive(link.path) ||
        link.children?.some((child: SidebarChildItem) => isActive(child.path)),
    );
  };

  return (
    <Fragment>
      {title && sidebarOpen && (
        <li className="menu-title">
          <span>{t(title)}</span>
        </li>
      )}
      {type === 'dropdown' && links && links.length > 0 ? (
        <li className="">
          <Link
            data-bs-toggle="collapse"
            to={collapseId ? `#${collapseId}` : ''}
            aria-expanded={(links ?? []).some((link: SidebarChildItem) => isActive(link.path))}
          >
            <i className={iconClass}></i>
            {t(name)}
            {badgeCount && (
              <span
                className={`badge ${
                  collapseId === 'advance-ui'
                    ? 'rounded-pill bg-warning'
                    : badgeCount === 'new'
                      ? 'text-light-success'
                      : 'text-primary-dark bg-primary-300'
                } badge-notification ms-2`}
              >
                {badgeCount}
              </span>
            )}
          </Link>
          <ul
            className={`collapse ${(links ?? []).some((link: SidebarChildItem) => isActive(link.path)) || checkUnder(links) ? 'show' : ''}`}
            id={collapseId}
          >
            {(links ?? []).map((link: SidebarChildItem) => {
              return (
                <Fragment key={link.id}>
                  {link.children ? (
                    <li key={link.id} className="another-level">
                      <Link
                        data-bs-toggle="collapse"
                        to={`#${link.collapseId}`}
                        aria-expanded="false"
                      >
                        {t(link.name) || link.name}
                      </Link>
                      <ul
                        className={`collapse ${link.children.some((child: SidebarChildItem) => isActive(child.path)) ? 'show' : ''}`}
                        id={link.collapseId}
                      >
                        {link.children.map((underLink: SidebarChildItem) => (
                          <li
                            key={underLink.id}
                            className={isActive(underLink.path) ? 'active' : ''}
                          >
                            <Link className="" to={underLink.path}>
                              {t(underLink.name) || underLink.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <Fragment>
                      <li key={link.id} className={isActive(link.path) ? 'active' : ''}>
                        <Link to={link.path}>{t(link.name) || link.name}</Link>
                      </li>
                    </Fragment>
                  )}
                </Fragment>
              );
            })}
          </ul>
        </li>
      ) : (
        <li className={`no-sub ${path && isActive(path) ? 'active' : ''}`}>
          <Link to={path ?? '#'}>
            <i className={iconClass}></i>
            {t(name)}
          </Link>
        </li>
      )}
    </Fragment>
  );
};

export default MenuItem;
