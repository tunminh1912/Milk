import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';
import MilkSupplyChainABI from './MilkSupplyChainABI.js';

// Thay bằng địa chỉ contract triển khai của bạn
const contractAddress = contractAddr;

const MilkBatchList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy địa chỉ của tài khoản hiện tại
  const { currentAccount, accountList, batchStatus, milkBoxStatus } = useContext(AccountContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập'
  // Trạng thái lô sữa
  const batchStatusEnum = batchStatus;

  useEffect(() => {
    async function init() {
      // Kết nối với Ganache
      const web3Instance = new Web3(IPConnectGanache);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    }
    init();
  }, []);

  // Lấy danh sách lô sữa dựa trên biến nextBatchId
  const fetchBatches = async () => {
    if (!contract) return;
    setError('');
    try {
      const nextBatchId = await contract.methods.nextBatchId().call({ from: accountAddress });
      let batchList = [];
      // Lấy từ 1 đến nextBatchId-1
      for (let i = 1; i < Number(nextBatchId); i++) {
        const batch = await contract.methods.milkBatches(i).call({ from: accountAddress });
        // console.log(`Batch ${i}:`, batch);
        batchList.push(batch);
      }
      setBatches(batchList);
    } catch (err) {
      setError('Error fetching batches: ' + err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [contract]);

  // Hàm chuyển sang trang chỉnh sửa lô sữa (sửa dựa trên batchId)
  const handleEdit = (batchId) => {
    navigate(`/master/lo-sua?batchId=${batchId}`);
  };

  // Hàm chuyển sang trang duyệt lô sữa
  const handleApprove = (batchId, batchName) => {
    navigate(`/master/lo-sua-duyet?batchId=${batchId}&batchName=${batchName}`);
  };

  // Hàm chuyển sang trang tạo mới lô sữa
  const handleCreateNew = () => {
    navigate('/master/lo-sua');
  };

  return (
    <div style={{ padding: '0px' }}>
      <h2>Danh sách lô sữa</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '10px', marginBottom: "4px" }}>
        <button onClick={fetchBatches} style={{ padding: '4px 8px', marginRight: '1rem' }}>
          Lấy danh sách lô sữa
        </button>
        <button onClick={handleCreateNew} style={{ padding: '4px 8px' }}>
          Tạo mới
        </button>
      </div>
      {batches.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{backgroundColor: "#aecfd3"}}>
            <tr>
              <th style={{padding: "3px", minWidth: "20px"}}>ID</th>
              <th style={{padding: "3px", minWidth: "100px"}}>Tên lô sữa</th>
              <th style={{padding: "3px", minWidth: "100px"}}>Ngày lấy sữa</th>
              <th style={{padding: "3px", minWidth: "50px"}}>Sản lượng</th>
              <th style={{padding: "3px", minWidth: "200px"}}>Trang trại</th>
              <th style={{padding: "3px", minWidth: "100px"}}>Cơ quan duyệt</th>
              <th style={{padding: "3px", minWidth: "60px"}}>Trạng thái</th>
              <th style={{padding: "3px"}}></th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <tr key={index}>
                <td style={{padding: "3px", textAlign: "center"}}>{batch.batchId}</td>
                <td style={{padding: "3px"}}>{batch.batchName}</td>
                <td style={{padding: "3px"}}>{batch.milkingDate}</td>
                <td style={{padding: "3px"}}>{batch.volume}</td>
                <td style={{padding: "3px"}}>{batch.farmOwner}</td>
                <td style={{padding: "3px"}}>{batch.approvedBy}</td>
                <td style={{padding: "3px"}}>{batchStatusEnum[batch.status] || ""}</td>
                <td style={{padding: "3px", width: "100px", whiteSpace: 'nowrap'}}>
                  <button onClick={() => handleEdit(batch.batchId)} style={{ marginRight: '5px', padding: "3px", width: "45px"}}>
                    Sửa
                  </button>
                  <button onClick={() => handleApprove(batch.batchId, batch.batchName)} style={{ padding: "3px", width: "45px"}}>Duyệt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{color: "#FF0000"}}>Không có lô sữa nào.</p>
      )}
      
    </div>
  );
};

export default MilkBatchList;
