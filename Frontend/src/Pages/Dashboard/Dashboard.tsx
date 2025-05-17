import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../Components/CustomSideBar/SideBar';
import TopBar from '../../Components/CustomTopBar/TopBar';
import './Dashboard.scss';
import { useNavigate } from 'react-router-dom';

import { TokenContext } from '../../Components/Context/TokenContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const {  refetchUser } = useContext(TokenContext);
  useEffect(() => {
    if (refetchUser) {
      refetchUser();
    }
  }, []);
  return (
    <div className="dashboardLayout">
      <div className="sideBarContainer">
        <SideBar />
      </div>
      <div className="mainContent">
        <div className="topBarContainer">
          <TopBar />
        </div>
        <div className="contentContainer">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
