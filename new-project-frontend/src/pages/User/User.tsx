import { useState } from 'react';
import NavBar from '../userComponents/Navbar';
import ViewMenu from './ViewMenu';
import ViewUserOrderTable from './ViewUserOrderTable';
import PaymentForm from './StripePaymentform' // Import the PaymentForm component
import ViewReviews from '../Vendor/ViewReviews';

const User = () => {
  const [activeTab, setActiveTab] = useState('OrderFood');

  const handleLabelClick = (label: string) => {
    setActiveTab(label);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'OrderFood':
        return (<ViewMenu />);
      case 'OrderHistory':
        return (<ViewUserOrderTable />);
      case 'CreditUpdate':
        return <PaymentForm />; // Use the PaymentForm component here
      case 'ViewReviews':
        return <ViewReviews />; // Use the PaymentForm component here
      default:
        return null;
    }
  };

  const navbarItems = [
    { label: 'OrderFood', link: '#order-food' },
    { label: 'OrderHistory', link: '#order-history' },
    { label: 'CreditUpdate', link: '#credit-update' },
    { label: 'ViewReviews', link: '#view-reviews' }
  ];

  return (
    <div className="flex h-screen">
      <div className="w-64">
        <NavBar items={navbarItems} onLabelClick={handleLabelClick} />
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default User;