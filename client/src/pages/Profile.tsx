import { Outlet } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Profile</h1>
      <p className="text-base sm:text-lg">Manage your profile and account settings.</p>
      <Outlet />
    </div>
  );
}
