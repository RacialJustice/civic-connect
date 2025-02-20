import { Outlet } from 'react-router-dom';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Your Profile</h1>
      <p className="text-lg">Manage your account and preferences.</p>
      <Outlet /> {/* This will render the nested routes */}
    </div>
  );
};

export default Profile;
