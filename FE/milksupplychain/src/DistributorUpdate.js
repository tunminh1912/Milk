import React, { useState, useContext } from 'react';
import Web3 from 'web3';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

const contractAddress = contractAddr;

const DistributorUpdate = ({ serialNumber }) => {
  const { currentAccount } = useContext(AccountContext);
  const [web3] = useState(new Web3(IPConnectGanache));
  const [contract] = useState(new web3.eth.Contract(contractABI, contractAddress));

  const [distributorAddress, setDistributorAddress] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateDistributor = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!serialNumber) {
      setError('Serial Number không hợp lệ.');
      return;
    }
    if (!distributorAddress.trim() || !newOwner.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (!privateKey || privateKey.trim() === '') {
      setError('Vui lòng nhập private key.');
      return;
    }

    try {
      const distributor = currentAccount.address;
      const data = contract.methods.updateDistributor(serialNumber, distributorAddress, newOwner).encodeABI();
      const gas = await contract.methods.updateDistributor(serialNumber, distributorAddress, newOwner).estimateGas({ from: distributor });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: distributor,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice,
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      setMessage('Thông tin hộp sữa đã được cập nhật thành công. Tx Hash: ' + receipt.transactionHash);
    } catch (err) {
      setError('Lỗi khi cập nhật thông tin hộp sữa: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Cập nhật thông tin bởi Nhà Phân Phối</h3>
      <form onSubmit={handleUpdateDistributor}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Địa chỉ nhà phân phối:</label><br />
          <input
            type="text"
            value={distributorAddress}
            onChange={(e) => setDistributorAddress(e.target.value)}
            placeholder="Nhập địa chỉ nhà phân phối"
            style={{ padding: '0.5rem', width: '500px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Chủ sở hữu mới:</label><br />
          <input
            type="text"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="Nhập tên chủ sở hữu mới"
            style={{ padding: '0.5rem', width: '500px' }}
            required
          />
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
          Cập nhật thông tin
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default DistributorUpdate;
