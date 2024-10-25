import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';

const columns = [
  {
    accessorKey: 'tenant_name',
    header: 'Tenant Name',
  },
  {
    accessorKey: 'tenant_phone_number',
    header: 'Phone Number',
  },
  {
    accessorKey: 'house_number',
    header: 'House Number',
  },
  {
    accessorKey: 'house_type',
    header: 'House Type',
  },
  {
    accessorKey: 'rent_amount',
    header: 'Rent Amount',
    cell: ({ row }) => `$${row.original.rent_amount}`,
  },
  {
    accessorKey: 'amount_due',
    header: 'Amount Due',
    cell: ({ row }) => `$${row.original.amount_due}`,
  },
];

export default function Tenants() {
  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/tenants');
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Add Tenant
        </button>
      </div>

      <DataTable columns={columns} data={tenants || []} />
    </div>
  );
}
