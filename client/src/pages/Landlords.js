import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';

const columns = [
  {
    accessorKey: 'landlord_name',
    header: 'Landlord Name',
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'properties_owned',
    header: 'Properties Owned',
    cell: ({ row }) => row.original.properties_owned?.length || 0,
  },
];

export default function Landlords() {
  const { data: landlords, isLoading } = useQuery({
    queryKey: ['landlords'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/landlords');
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Landlords</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Add Landlord
        </button>
      </div>

      <DataTable columns={columns} data={landlords || []} />
    </div>
  );
}
