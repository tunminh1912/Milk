import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Master from './Master';
import Home from './Home.js';
import ParticipantsList from './ParticipantsList';
import MilkBatchList from './MilkBatchList';
import MilkBatchForm from './MilkBatchForm';
import MilkBatchApproval from './MilkBatchApproval';
import MilkBoxForm from './MilkBoxForm';
import MilkBoxList from "./MilkBoxList.js"
import MilkBoxApproval from "./MilkBoxApproval.js" 
import TraceMilkProduct from './TraceMilkProduct';
import Add_participants from './Add_participants.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/master" element={<Master />}>
        {/* Các route con hiển thị trong <Outlet> của Home */}
        <Route path="trang-chu" element={<Home />} />
        <Route path="thanh-phan-tham-gia" element={<ParticipantsList />} />
        <Route path="lo-sua-list" element={<MilkBatchList />} />
        <Route path="lo-sua" element={<MilkBatchForm />} />
        <Route path="lo-sua-duyet" element={<MilkBatchApproval />} />
        <Route path="san-pham-sua" element={<MilkBoxForm />} />
        <Route path="san-pham-sua-list" element={<MilkBoxList />} />
        <Route path="san-pham-sua-duyet" element={<MilkBoxApproval />} />
        <Route path="truy-xuat-san-pham" element={<TraceMilkProduct />} />
        <Route path="thanh-phan-tham-gia/them" element={<Add_participants />} />
      </Route>
    </Routes>
  );
}

export default App;
