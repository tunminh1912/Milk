import React, { useState, useContext } from 'react';
import Web3 from 'web3';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

const contractAddress = contractAddr;

const RetailerUpdate = ({ serialNumber }) => {
  const { currentAccount } = useContext(AccountContext);
  const [web3] = useState(new Web3(IPConnectGanache));
  const [contract] = useState(new web3.eth.Contract(contractABI, contractAddress));

  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('ArrivedAtRetailer');

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!serialNumber) {
      setError('Serial Number không hợp lệ.');
      return;
    }
    if (!privateKey || privateKey.trim() === '') {
      setError('Vui lòng nhập private key.');
      return;
    }

    try {
      const retailer = currentAccount.address;
      const statusEnum = newStatus === 'ArrivedAtRetailer' ? 3 : 4; // enum ArrivedAtRetailer = 3, Sold = 4
      console.log(serialNumber, statusEnum)

      const data = contract.methods.updateBoxStatusAtRetail(serialNumber, statusEnum).encodeABI();
      const gas = await contract.methods.updateBoxStatusAtRetail(serialNumber, statusEnum).estimateGas({ from: retailer });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: retailer,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice,
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      setMessage(`Trạng thái hộp sữa đã cập nhật thành công. Tx Hash: ${receipt.transactionHash}`);
    } catch (err) {
      setError(`Lỗi khi cập nhật trạng thái hộp sữa: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Cập nhật trạng thái hộp sữa tại cửa hàng bán lẻ</h3>
      <form onSubmit={handleUpdateStatus}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Trạng thái mới:</label><br />
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ padding: '0.5rem', width: '250px' }}>
            <option value="ArrivedAtRetailer">Đã đến cửa hàng bán lẻ</option>
            <option value="Sold">Đã bán</option>
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Private Key:</label><br />
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Nhập private key"
            style={{ padding: '0.5rem', width: '500px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          Cập nhật trạng thái
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default RetailerUpdate;
