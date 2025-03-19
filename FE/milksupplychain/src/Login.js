import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import "./Login.css"
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext';

function Login() {
  // Dùng để điều hướng trang
  const navigate = useNavigate();

  const [ganacheAccounts, setGanacheAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [error, setError] = useState('');
  const { setAccountList, setCurrentAccount, setBatchStatus, setMilkBoxStatus } = useContext(AccountContext);

  // Danh sách tài khoản hardcode hiển thị trong dropdown
  const accountList = [
    { role: 'ADMIN', name: 'Quản trị', address: '0x4854748Ee84e2c66E2Ec0eF26FFad47B20C11530' },
    { role: 'FARM', name: 'Trang trại', address: '0x9F0358b98Dc99380FCD0C0dB54Cfb1dA24C86bd2' },
    { role: 'MANUFACTURER', name: 'Nhà sản xuất', address: '0xbE39E8E9AcB9d26dA669FD5d3B67862DBc9731b6' },
    { role: 'DISTRIBUTOR', name: 'Nhà phân phối', address: '0x9b0Df6B058dA255d9f702b3BbEd4628B5acbb7cB' },
    { role: 'RETAILER', name: 'Nhà bán lẻ', address: '0xE4c080D9ffBF3e9948c720C0D862DB75730C279F' },
    { role: 'NUTRITION_AUTHORITY', name: 'Viện dinh dưỡng', address: '0x81AE993dc3c8c7EBffB7D22242F4fdCAd1699236' },
    { role: 'FOOD_SAFETY_AUTHORITY', name: 'Viện an toàn thực phẩm', address: '0x877c0CC83182eFeF861865f1BEaE40988B037E55' },
    { role: 'TRANSPORT_AUTHORITY', name: 'Kiểm định vận chuyển', address: '0x1f7c62905E4BF4F53255526A61E7C5c98718e586' },
  ];

  // Trang thái lô sữa
  const batchStatus = {
    0: "Tạo mới",
    1: "Được duyệt",
    2: "Chế biến",
    3: "Kết thúc"
  };
  // Trang thái sữa
  const milkBoxStatus = {
    0: "Tạo mới",
    1: "Được duyệt",
    2: "Vận chuyển",
    3: "Cửa hàng",
    4: "Được bán",
  };

  // Lấy danh sách tài khoản từ Ganache khi component được mount
  function fetchAccounts() {
    const web3 = new Web3(IPConnectGanache);
    web3.eth.getAccounts()
      .then(function(accounts) {
        setGanacheAccounts(accounts);
      })
      .catch(function(err) {
        console.error('Lỗi khi lấy danh sách account từ Ganache: ', err);
      });
  }

  useEffect(function() {
    // Lấy danh sách tài khoản từ Ganache
    fetchAccounts();
    // Đưa danh sách account vào context
    setAccountList(accountList);
  }, []);

  // Xử lý đăng nhập
  function handleLogin() {
    setError('');
    if (!selectedAccount) {
      setError('Vui lòng chọn tài khoản!');
      return;
    }
    if (ganacheAccounts.includes(selectedAccount)) {
        const account = accountList.find(acc => acc.address === selectedAccount);
        // Lưu account vào context
        setCurrentAccount(account);
        // Trang thái
        setBatchStatus(batchStatus);
        setMilkBoxStatus(milkBoxStatus);
        navigate('/master/trang-chu');
    } else {
      setError('Tài khoản không hợp lệ hoặc không khớp với Ganache.');
    }
  }

  return (
    <div style={{
      maxWidth: '360px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '5px'
    }}>
      <h2 style={{color: 'blue', marginBottom: '10px'}}>Đăng nhập</h2>
      
      <select value={selectedAccount} onChange={function(e) { setSelectedAccount(e.target.value); }}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      >
        <option value="">Chọn tài khoản</option>
        {accountList.map(function(acc, index) {
          return (
            <option key={index} value={acc.address}>
              {acc.name} - {acc.role}
            </option>
          );
        })}
      </select>

      <button onClick={handleLogin} style={{ width: '100%', padding: '0.5rem', fontWeight: 'bold' }}>
        Đăng nhập
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export default Login;
