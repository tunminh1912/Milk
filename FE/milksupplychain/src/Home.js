import React from 'react';
import './home.css'; // Import the CSS file

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Chuỗi cung ứng sữa của Vinamilk</h1>
        <p>Exploring the Journey from Farm to Consumer</p>
      </header>

      <section className="supply-chain-overview">
        <h2>Supply Chain Overview</h2>
        <img
          src={require('./images/supplychain.png')}
          alt="Supply Chain Diagram"
          className="supply-chain-image"
        />
      </section>

      <section className="supply-chain-step farm-step">
        <div className="step-content">
          <h3>1. Trang Trại</h3>
          <p>
          Vinamilk sở hữu hệ thống trang trại bò sữa hiện đại, đạt chuẩn
          GlobalG.A.P. và Organic, đảm bảo nguồn sữa tươi sạch và chất lượng
          cao.
          </p>
        </div>
        <img src={require('./images/farm.png')} alt="Dairy Farm" className="step-image" />
      </section>

      <section className="supply-chain-step manufacturer-step">
        <img
          src={require('./images/manufacturer.png')}
          alt="Manufacturing Plant"
          className="step-image"
        />
        <div className="step-content">
          <h3>2. Nhà sản xuất</h3>
          <p>
          Các nhà máy của Vinamilk ứng dụng công nghệ tiên tiến để chế biến sữa
          tươi thành các sản phẩm như sữa nước, sữa bột, sữa chua và nhiều sản
          phẩm dinh dưỡng khác.
          </p>
        </div>
      </section>

      <section className="supply-chain-step distributor-step">
        <div className="step-content">
          <h3>3. Nhà Phân Phối</h3>
          <p>
          Hệ thống phân phối của Vinamilk được tối ưu hóa với kho lạnh và
          phương tiện vận chuyển chuyên dụng, đảm bảo sản phẩm được bảo quản và
          giao hàng đúng tiêu chuẩn.
          </p>
        </div>
        <img
          src={require('./images/distributor.png')}
          alt="Distribution Network"
          className="step-image"
        />
      </section>

      <section className="supply-chain-step retailer-step">
        <img src={require('./images/retailer.png')} alt="Retail Outlets" className="step-image" />
        <div className="step-content">
          <h3>4. Nhà Bán lẻ</h3>
          <p>
          Sản phẩm Vinamilk được phân phối qua siêu thị, cửa hàng tiện lợi, đại
          lý sữa và kênh thương mại điện tử, đáp ứng nhu cầu người tiêu dùng
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2024 Vinamilk. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;