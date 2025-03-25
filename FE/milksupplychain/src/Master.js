import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AccountContext } from './AccountContext';

function Master() {
  // Lấy role hoặc name của tài khoản hiện tại
  const { currentAccount, accountList } = useContext(AccountContext);
  const role = currentAccount ? currentAccount.role : 'Chưa đăng nhập';
  const name = currentAccount ? currentAccount.name : '';

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#66FF33'
      }}>
        <img
                src={require('./images/logo.png')}
                alt="Sơ đồ chuỗi cung ứng"
                style={{ height: "50px" }}
            />
        <h1 style={{ margin: 0, color: "#00008b" }}>Hệ thống Blockchain cho Chuỗi cung ứng sữa</h1>
        <div>
          <div style={{fontWeight: 'bold', textAlign: 'right'}}>Đăng nhập:</div>
          <div>{name} - {role}</div>
        </div>
      </div>

      {/* Nội dung chính (Sidebar + Content) */}
      <div style={{ display: 'flex', minHeight: '80vh' }}>
        {/* Sidebar bên trái */}
        <div style={{
          width: '200px',
          backgroundColor: '#8bc34a70',
          borderRight: '1px solid #ddd',
          padding: '1rem'
        }}>
          <ul style={{ listStyle: 'unset', paddingLeft: 8 }}>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/trang-chu">Trang chủ</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/thanh-phan-tham-gia">Thành phần tham gia</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/lo-sua-list">Lô sữa</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/san-pham-sua-list">Sản phẩm sữa</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/san-pham-sua-list">Nhà phân phối cập nhật thông tin hộp sữa</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/san-pham-sua-list">Nhà phân phối phê duyệt vận chuyển</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/san-pham-sua-list">Nhà bán lẻ cập nhật trạng thái</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/truy-xuat-san-pham">Truy xuất nguồn gốc</Link>
            </li>
          </ul>
        </div>

        {/* Khu vực hiển thị trang con */}
        <div style={{ flex: 1, padding: '1rem' }}>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '0.5rem',
        backgroundColor: '#cce5ff',
        fontWeight: 'bold',
        color: '#5a6461',
        fontSize: "19px"
      }}>
        Ⓒ Bộ môn CNPM - Khoa CÔNG NGHỆ THÔNG TIN
      </div>
    </div>
  );
}

export default Master;
