import React, { useState, useContext } from 'react';
import Web3 from 'web3';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

const contractAddress = contractAddr;

const TransportApproval = ({ serialNumber }) => {
  const { currentAccount } = useContext(AccountContext);
  const [web3] = useState(new Web3(IPConnectGanache));
  const [contract] = useState(new web3.eth.Contract(contractABI, contractAddress));

  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleApproveTransport = async (e) => {
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
      const transportAuthority = currentAccount.address;
      const data = contract.methods.approveTransportBox(serialNumber).encodeABI();
      const gas = await contract.methods.approveTransportBox(serialNumber).estimateGas({ from: transportAuthority });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: transportAuthority,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice,
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      setMessage('Hộp sữa đã được phê duyệt vận chuyển thành công. Tx Hash: ' + receipt.transactionHash);
    } catch (err) {
      setError('Lỗi khi phê duyệt vận chuyển hộp sữa: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Phê duyệt vận chuyển bởi Cơ quan Vận tải</h3>
      <form onSubmit={handleApproveTransport}>
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
          Phê duyệt vận chuyển
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default TransportApproval;
