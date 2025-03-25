import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

const contractAddress = contractAddr;

const Add_participants = () => {
    const navigate = useNavigate();
    const { currentAccount } = useContext(AccountContext);

    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [participant, setParticipant] = useState({
        address: '',
        name: '',
        location: '',
        phone: '',
        role: '',
        isActive: true,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const web3Instance = new Web3(IPConnectGanache);
        setWeb3(web3Instance);
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParticipant({ ...participant, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!participant.address || !participant.name || !participant.role) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        try {
            await contract.methods.setParticipant(
                participant.address,
                participant.name,
                participant.location,
                participant.phone,
                participant.role,
                participant.isActive
            ).send({ 
                from: currentAccount.address,
                gas: 5000000 // Tăng gas limit
            });

            setSuccess('Thêm thành công!');
            // setTimeout(() => navigate('/master/thanh-phan-tham-gia'), 1500);
        } catch (err) {
            setError('Lỗi khi thêm: ' + err.message);
            console.error(err);
        }
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3>Thêm Thành Phần Tham Gia</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Địa chỉ ví:</label><br />
                    <input
                        type="text"
                        name="address"
                        value={participant.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ ví"
                        style={{ padding: '0.5rem', width: '500px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Tên:</label><br />
                    <input
                        type="text"
                        name="name"
                        value={participant.name}
                        onChange={handleChange}
                        placeholder="Nhập tên"
                        style={{ padding: '0.5rem', width: '500px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Địa điểm:</label><br />
                    <input
                        type="text"
                        name="location"
                        value={participant.location}
                        onChange={handleChange}
                        placeholder="Nhập địa điểm"
                        style={{ padding: '0.5rem', width: '500px' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Điện thoại:</label><br />
                    <input
                        type="text"
                        name="phone"
                        value={participant.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        style={{ padding: '0.5rem', width: '500px' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Vai trò:</label><br />
                    <select
                        name="role"
                        value={participant.role}
                        onChange={handleChange}
                        style={{ padding: '0.5rem', width: '500px' }}
                        required
                    >
                        <option value="">Chọn vai trò</option>
                        <option value="FARM">FARM</option>
                        <option value="MANUFACTURER">MANUFACTURER</option>
                        <option value="DISTRIBUTOR">DISTRIBUTOR</option>
                        <option value="RETAILER">RETAILER</option>
                        <option value="NUTRITION_AUTHORITY">NUTRITION_AUTHORITY</option>
                        <option value="FOOD_SAFETY_AUTHORITY">FOOD_SAFETY_AUTHORITY</option>
                        <option value="TRANSPORT_AUTHORITY">TRANSPORT_AUTHORITY</option>
                    </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={participant.isActive}
                            onChange={() => setParticipant({ ...participant, isActive: !participant.isActive })}
                        /> Hoạt động
                    </label>
                </div>
                <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
                    Thêm
                </button>
                <button onClick={() => navigate('/master/thanh-phan-tham-gia')} style={{ padding: '0.5rem 1rem' }}>
                    Quay lại
                </button>
            </form>
            {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    );
}

export default Add_participants
