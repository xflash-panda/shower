import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import HeaderMenu from './HeaderMenu';

interface HeaderProps {
  sidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="header-main">
      <Container fluid>
        <Row>
          <Col xs="6" sm="4" className="d-flex align-items-center header-left p-0">
            <span className="header-toggle me-3" onClick={() => setIsSidebarOpen(!sidebarOpen)}>
              <i className="ph-duotone ph-circles-four"></i>
            </span>
          </Col>

          <Col
            xs="6"
            sm="8"
            className="d-flex align-items-center justify-content-end header-right p-0"
          >
            <HeaderMenu />
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
