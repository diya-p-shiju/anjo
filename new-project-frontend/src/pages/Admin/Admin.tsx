import React, { useState } from 'react';
import Navbar from '../userComponents/Navbar';
import ViewUsers from './ViewUsers';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Users');

  const handleLabelClick = (label: string) => {
    setActiveTab(label);
  };

  const navbarItems = [
    { label: 'Users', link: '/admin' }
  ];

  return (
    <div className="flex h-screen">
      <div className="w-64">
        <Navbar items={navbarItems} onLabelClick={handleLabelClick} />
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'Users' && <ViewUsers />}
      </div>
    </div>
  );
};

export default Admin;
