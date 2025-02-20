// Move the existing dashboard component here
import { DashboardStats } from './components/dashboard-stats';
import { DashboardActions } from './components/dashboard-actions';
import { RecentActivity } from './components/recent-activity';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <DashboardStats />
      <DashboardActions />
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
