import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

// Địa chỉ contract triển khai
const contractAddress = contractAddr;

const TraceMilkProduct = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [traceResult, setTraceResult] = useState(null);
  const [error, setError] = useState('');

  const { currentAccount, accountList, batchStatus, milkBoxStatus } = useContext(AccountContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập'
  // Trạng thái hộp sữa
  const milkBoxStatusEnum = milkBoxStatus;
  const batchStatusEnum = batchStatus;

  useEffect(() => {
    // Sử dụng provider của Ganache
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  const handleTrace = async (e) => {
    e.preventDefault();
    setError('');
    setTraceResult(null);
    if (!contract || serialNumber.trim() === '') {
      setError('Vui lòng nhập Serial Number hợp lệ.');
      return;
    }
    try {
      // Gọi hàm getMilkBoxDetails trên smart contract
      const details = await contract.methods.getMilkBoxDetails(serialNumber).call({ from: accountAddress });
      setTraceResult(details);
    } catch (err) {
      setError('Lỗi khi truy xuất: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '0px' }}>
      <h2>Truy xuất nguồn gốc sản phẩm sữa</h2>
      <br></br>
      <form onSubmit={handleTrace}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Serial Number (mã hộp sữa):</label><br />
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Serial Number (mã hộp sữa):"
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: "10px" }}>
            Truy xuất
          </button>
        </div>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {traceResult && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3 style={{ color: "blue" }}>Kết quả</h3>
          
          <p><strong>Serial Number (mã hộp sữa):</strong> {traceResult.serialNumber}</p>
          
          <p><strong>Sản phẩm:</strong> {traceResult.boxName}</p>
          <p><strong>Ngày sản xuất:</strong> {traceResult.manufacturingDate}</p>
          <p><strong>Ngày hết hạn:</strong> {traceResult.expirationDate}</p>
          <p>
            <div><strong>Phê duyệt (an toàn thực phẩm):</strong>{' '}</div>
            {traceResult.processingApproved ? <img
                src={require('./images/food_safety_authority.png')}
                alt="Viện an toàn thực phẩm"
                style={{ maxWidth: '100%', margin: '1rem 20px', width: "150px", height: "150px" }}
            /> : 'Chưa phê duyệt'}
          </p>
          <p><strong>Trạng thái sản phẩm sữa:</strong> {milkBoxStatusEnum[traceResult.boxStatus] || ""}</p>

          <hr style={{width: "400px", margin: "10px 0px 10px 0px"}}></hr>
          <p><strong>Lô sữa:</strong> {traceResult.batchId}</p>
          <p>
            <div><strong>Phê duyệt (vận chuyển):</strong>{' '}</div>
            {traceResult.transportApproved ? <img
                src={require('./images/transport_authority.png')}
                alt="vận chuyển"
                style={{ maxWidth: '100%', margin: '1rem 20px', width: "150px", height: "150px" }}
            /> : 'Chưa phê duyệt'}
          </p>
          <p><strong>Đơn vị phân phối:</strong> {traceResult.distributorAddress}</p>
          <p><strong>Ngày lấy sữa thô:</strong> {traceResult.milkingDate}</p>
          <p><strong>Sản lượng sữa:</strong> {traceResult.volume}</p>
          <p><strong>Trang trại:</strong> {traceResult.farmOwner}</p>
          <p>
            <div><strong>Phê duyệt (viện dinh dưỡng):</strong> {traceResult.approvedBy}</div>
            {traceResult.approvedBy ? <img
                src={require('./images/nutrition_authority.png')}
                alt="vận chuyển"
                style={{ maxWidth: '100%', margin: '1rem 20px', width: "150px", height: "150px" }}
            /> : 'Chưa phê duyệt' }
          </p>
          <p><strong>Trạng thái lô sữa:</strong> {batchStatusEnum[traceResult.batchStatus] || ""}</p>
          
        </div>
      )}
    </div>
  );
};

export default TraceMilkProduct;
