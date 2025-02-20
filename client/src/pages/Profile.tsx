import { Outlet } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Profile</h1>
      <p className="text-lg">Manage your profile and account settings.</p>
      <Outlet /> {/* This will render the nested routes */}
    </div>
  );
}
