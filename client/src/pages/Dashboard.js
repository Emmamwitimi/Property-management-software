import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Building2, Users, UserCircle, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-blue-100 mr-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/admin/dashboard');
      return data;
    },
  });

  const chartData = [
    { name: 'Bedsitter', value: 15 },
    { name: '1 Bedroom', value: 25 },
    { name: '2 Bedroom', value: 10 },
  ];

  return (
    <div className="space-y-6 ml-64">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value={stats?.properties || 0}
          icon={Building2}
        />
        <StatCard
          title="Total Tenants"
          value={stats?.tenants || 0}
          icon={Users}
        />
        <StatCard
          title="Total Landlords"
          value={stats?.landlords || 0}
          icon={UserCircle}
        />
        <StatCard
          title="Revenue"
          value="$50,000"
          icon={DollarSign}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Property Distribution</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
