import Scrollbar from 'simplebar-react';
import { Link } from 'react-router-dom';
import MenuItem from '@layout/Sidebar/MenuItem';
import { sidebarConfig } from '@data/Sidebar/index';
import type { SidebarMenuItem } from '@layout/Sidebar/MenuItem';
import { getLogoPath } from '@helpers/assets';

export interface SidebarProps {
  sidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setIsSidebarOpen }) => {
  return (
    <nav className={`vertical-sidebar ${!sidebarOpen ? 'semi-nav' : ''}`}>
      <div className="app-logo">
        <Link className="logo d-inline-block" to="/dashboard">
          <picture>
            <source srcSet={getLogoPath('logo', 'webp')} type="image/webp" />
            <img
              src={getLogoPath('logo', 'png')}
              alt="Logo"
              className="dark-logo"
              width="40"
              height="40"
              loading="eager"
            />
          </picture>
        </Link>
        <span
          className="bg-light-light toggle-semi-nav"
          onClick={() => {
            setIsSidebarOpen(!sidebarOpen);
          }}
        >
          <i className="ti ti-chevrons-right f-s-20"></i>
        </span>
      </div>
      <Scrollbar className="app-nav simplebar-scrollable-y" id="app-simple-bar">
        <ul className="main-nav p-0 mt-2">
          {sidebarConfig.map((config: SidebarMenuItem) => (
            <MenuItem key={config.id} {...config} sidebarOpen={sidebarOpen} />
          ))}
        </ul>
      </Scrollbar>
      <div className="menu-navs">
        <span className="menu-previous">
          <i className="ti ti-chevron-left" />
        </span>
        <span className="menu-next">
          <i className="ti ti-chevron-right"></i>
        </span>
      </div>
    </nav>
  );
};

export default Sidebar;
