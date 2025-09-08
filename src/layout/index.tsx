import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import ScrollArrow from './Footer/ScrollArrow';
import { applyThemeConfiguration } from '@/helpers/theme';
const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Initialize theme configuration when Layout component mounts
  useEffect(() => {
    applyThemeConfiguration();
  }, []);

  return (
    <div className="app-wrapper">
      {/*-- Menu Navigation starts --*/}
      <Sidebar sidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {/*-- Menu Navigation ends --*/}

      <div className="app-content">
        {/*-- Header Section starts --*/}
        <Header sidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        {/*-- Header Section ends --*/}

        {/*-- Body main section starts --*/}
        <main>
          <Outlet />
        </main>
        {/*-- Body main section ends --*/}
      </div>

      {/*-- tap on top --*/}
      <ScrollArrow />

      {/*-- Footer Section starts--*/}
      <Footer />
      {/*-- Footer Section ends--*/}
    </div>
  );
};

export default Layout;
