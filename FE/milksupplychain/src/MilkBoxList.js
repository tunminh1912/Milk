import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

// Thay đổi địa chỉ contract và tài khoản xem cho phù hợp:
const contractAddress = contractAddr;

const MilkBoxList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [milkBoxes, setMilkBoxes] = useState([]);
  const [error, setError] = useState('');
  const [eventLogs, setEventLogs] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [serialNumberSearch, setSerialNumberSearch] = useState('');
  const navigate = useNavigate();

  // Lấy địa chỉ của tài khoản hiện tại
  const { currentAccount, accountList, batchStatus, milkBoxStatus } = useContext(AccountContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập'
  // Trạng thái hộp sữa
  const milkBoxStatusEnum = milkBoxStatus;

  useEffect(() => {
    // Kết nối với Ganache
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  const fetchMilkBoxes = async () => {
    if (!contract) return;
    setError('');
    try {
      let boxes = [];
    
      serialNumbers.push(serialNumberSearch)
      const serial = serialNumbers[0];
      const details = await contract.methods.getMilkBoxDetails(serial).call({ from: accountAddress });
      boxes.push(details);
      setMilkBoxes(boxes);
    } catch (err) {
      setError('Error fetching milk boxes: ' + err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    if (serialNumbers.length > 0) {
      fetchMilkBoxes();
    }
  }, [serialNumbers, contract]);

  const handleEdit = (serial) => {
    navigate(`/master/san-pham-sua-duyet?serialNumber=${serial}`);
  };

  const handleApprove = (serial, boxName) => {
    navigate(`/master/san-pham-sua-duyet?serialNumber=${serial}&boxName=${boxName}`);
  };

  return (
    <div style={{ padding: '0px' }}>
      <h2>Danh sách hộp sữa</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ marginTop: '1rem', marginBottom: "5px" }}>
        <label>Serial Number (mã hộp sữa):</label><br/>
        <input
            type="text"
            value={serialNumberSearch}
            onChange={(e) => setSerialNumberSearch(e.target.value)}
            style={{ padding: '0.5rem', width: '150px', marginRight: "10px" }}
            required
        />
        <button onClick={fetchMilkBoxes} style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          Tìm kiếm hộp sữa
        </button>
        <button onClick={() => navigate('/master/san-pham-sua')} style={{ padding: '0.5rem 1rem' }}>
          Tạo mới hộp sữa
        </button>
      </div>
      {milkBoxes.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{backgroundColor: "#aecfd3"}}>
            <tr>
              <th>Serial Number</th>
              <th>ID lô sữa</th>
              <th>Tên sản phẩm</th>
              <th>Ngày sản xuất</th>
              <th>Ngày hết hạn </th>
              <th>Trạng thái</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {milkBoxes.map((box, index) => (
              <tr key={index}>
                <td style={{padding: "3px"}}>{box.serialNumber}</td>
                <td style={{padding: "3px", textAlign: "center"}}>{box.batchId}</td>
                <td style={{padding: "3px"}}>{box.boxName}</td>
                <td style={{padding: "3px"}}>{box.manufacturingDate}</td>
                <td style={{padding: "3px"}}>{box.expirationDate}</td>
                <td style={{padding: "3px", }}>{milkBoxStatusEnum[box.boxStatus] || ""}</td>
                <td style={{padding: "3px", width: "100px", whiteSpace: 'nowrap'}}>
                  <button onClick={() => handleEdit(box.serialNumber)} style={{ marginRight: '5px', padding: "3px", width: "45px"}}>
                    Sửa
                  </button>
                  <button onClick={() => handleApprove(box.serialNumber, box.boxName)} style={{ padding: "3px", width: "45px"}}>
                    Duyệt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có hộp sữa nào.</p>
      )}
      
    </div>
  );
};

export default MilkBoxList;
