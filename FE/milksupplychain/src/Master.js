import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AccountContext } from './AccountContext';
import './Master.css'; // Import the CSS

function Master() {
  // Lấy role hoặc name của tài khoản hiện tại
  const { currentAccount, accountList } = useContext(AccountContext);
  const role = currentAccount ? currentAccount.role : 'Chưa đăng nhập';
  const name = currentAccount ? currentAccount.name : '';

  const location = useLocation(); // Get current route location

  return (
    <div className="master-container">
      {/* Header */}
      <div className="header">
        <img
          src={require('./images/logo.png')}
          alt="Sơ đồ chuỗi cung ứng"
          className="logo"
        />
        <h1 className="header-title">Hệ thống Blockchain cho Chuỗi cung ứng sữa</h1>
        <div className="account-info">
          <div className="login-label">Đăng nhập:</div>
          <div>{name} - {role}</div>
        </div>
      </div>

      {/* Main content layout (sidebar + content area) */}
      <div className="main-content">
        {/* Sidebar bên trái */}
        <div className="sidebar">
          <ul className="sidebar-list">
            <li className="sidebar-item">
              <Link to="/master/trang-chu" className={`sidebar-link ${location.pathname === "/master/trang-chu" ? 'active' : ''}`}>Trang chủ</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/master/thanh-phan-tham-gia" className={`sidebar-link ${location.pathname === "/master/thanh-phan-tham-gia" ? 'active' : ''}`}>Thành phần tham gia</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/master/lo-sua-list" className={`sidebar-link ${location.pathname === "/master/lo-sua-list" ? 'active' : ''}`}>Lô sữa</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/master/san-pham-sua-list" className={`sidebar-link ${location.pathname === "/master/san-pham-sua-list" ? 'active' : ''}`}>Sản phẩm sữa</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/master/lo-sua-list" className={`sidebar-link ${location.pathname === "/master/lo-sua-list" ? 'active' : ''}`}>Nhà phân phối cập nhật thông tin hộp sữa</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/master/lo-sua-list" className={`sidebar-link ${location.pathname === "/master/lo-sua-list" ? 'active' : ''}`}>Nhà phân phối phê duyệt vận chuyển</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/master/lo-sua-list" className={`sidebar-link ${location.pathname === "/master/lo-sua-list" ? 'active' : ''}`}>Nhà bán lẻ cập nhật trạng thái</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/master/truy-xuat-san-pham" className={`sidebar-link ${location.pathname === "/master/truy-xuat-san-pham" ? 'active' : ''}`}>Truy xuất nguồn gốc</Link>
            </li>
          </ul>
        </div>

        {/* Content area (where the children routes are rendered) */}
        <div className="content">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        Ⓒ Bộ môn CNPM - Khoa CÔNG NGHỆ THÔNG TIN
      </div>
    </div>
  );
}

export default Master;