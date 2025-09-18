import React from 'react';
import { PROJECT_CONFIG } from '@config/project';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-9 col-12">
            <ul className="footer-text">
              <li className="version-badge">
                <span className="badge bg-gradient-primary text-white px-3 py-2 fw-bold">
                  V1.0.0
                </span>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <ul className="footer-text text-end">
              <li>
                <p className="badge bg-gradient-primary text-white px-3 py-2 fw-bold">
                  Copyright © {new Date().getFullYear()} {PROJECT_CONFIG.copyrightMark}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
