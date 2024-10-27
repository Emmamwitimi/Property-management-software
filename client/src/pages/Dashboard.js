// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import { Building2, Users, UserCircle, DollarSign } from 'lucide-react';

// const StatCard = ({ title, value, icon: Icon }) => (
//   <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//     <div className="flex items-center">
//       <div className="p-3 rounded-full bg-blue-100 mr-4">
//         <Icon className="h-6 w-6 text-blue-600" />
//       </div>
//       <div>
//         <p className="text-sm font-medium text-gray-600">{title}</p>
//         <p className="text-2xl font-semibold text-gray-900">{value}</p>
//       </div>
//     </div>
//   </div>
// );

// export default function Dashboard() {
//   const { data: tenantsData } = useQuery({
//     queryKey: ['tenants'],
//     queryFn: async () => {
//       const { data } = await axios.get('http://localhost:5000/tenants');
//       return data;
//     },
//   });

//   const { data: landlordsData } = useQuery({
//     queryKey: ['landlords'],
//     queryFn: async () => {
//       const { data } = await axios.get('http://localhost:5000/landlords');
//       return data;
//     },
//   });

//   const { data: propertiesData } = useQuery({
//     queryKey: ['properties'],
//     queryFn: async () => {
//       const { data } = await axios.get('http://localhost:5000/properties');
//       return data;
//     },
//   });

//   const revenue = "$50,000"; // Replace with your logic to fetch revenue

//   // Prepare stats object
//   const stats = {
//     tenants: tenantsData ? tenantsData.length : 0,
//     landlords: landlordsData ? landlordsData.length : 0,
//     properties: propertiesData ? propertiesData.length : 0,
//     revenue,
//     averageRent: propertiesData
//       ? (propertiesData.reduce((total, property) => total + property.price_one_bedroom, 0) / propertiesData.length).toFixed(2)
//       : 0,
//   };

//   // Prepare chart data
//   const chartData = [
//     { name: 'Total Properties', value: stats.properties },
//     { name: 'Total Tenants', value: stats.tenants },
//     { name: 'Total Landlords', value: stats.landlords },
//     { name: 'Average Rent', value: stats.averageRent },
//   ];



//   return (
//     <div className="space-y-6 ml-64">
//       <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Properties"
//           value={stats.properties}
//           icon={Building2}
//         />
//         <StatCard
//           title="Total Tenants"
//           value={stats.tenants}
//           icon={Users}
//         />
//         <StatCard
//           title="Total Landlords"
//           value={stats.landlords}
//           icon={UserCircle}
//         />
//         <StatCard
//           title="Revenue"
//           value={stats.revenue}
//           icon={DollarSign}
//         />
//         <StatCard
//           title="Average Rent"
//           value={`$${stats.averageRent}`}
//           icon={DollarSign}
//         />
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h2 className="text-lg font-semibold mb-4">Distribution Overview</h2>
//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#3B82F6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }
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
  const { data: tenantsData } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/tenants');
      return data;
    },
  });

  const { data: landlordsData } = useQuery({
    queryKey: ['landlords'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/landlords');
      return data;
    },
  });

  const { data: propertiesData } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/properties');
      return data;
    },
  });

  const revenue = "$50,000"; // Replace with your logic to fetch revenue

  // Prepare stats object
  const stats = {
    tenants: tenantsData ? tenantsData.length : 0,
    landlords: landlordsData ? landlordsData.length : 0,
    properties: propertiesData ? propertiesData.length : 0,
    revenue,
    averageRent: propertiesData
      ? (propertiesData.reduce((total, property) => total + property.price_one_bedroom, 0) / propertiesData.length).toFixed(2)
      : 0,
  };

  // Prepare chart data
  const chartData = [
    { name: 'Total Properties', value: stats.properties },
    { name: 'Total Tenants', value: stats.tenants },
    { name: 'Total Landlords', value: stats.landlords },
    { name: 'Average Rent', value: stats.averageRent },
  ];

  return (
    <div className="space-y-6 ml-64 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value={stats.properties}
          icon={Building2}
        />
        <StatCard
          title="Total Tenants"
          value={stats.tenants}
          icon={Users}
        />
        <StatCard
          title="Total Landlords"
          value={stats.landlords}
          icon={UserCircle}
        />
        <StatCard
          title="Revenue"
          value={stats.revenue}
          icon={DollarSign}
        />
        <StatCard
          title="Average Rent"
          value={`$${stats.averageRent}`}
          icon={DollarSign}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Distribution Overview</h2>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer>
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
