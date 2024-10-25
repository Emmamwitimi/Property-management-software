import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';

const columns = [
  {
    accessorKey: 'property_name',
    header: 'Property Name',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'number_of_rooms',
    header: 'Total Rooms',
  },
  {
    accessorKey: 'occupied_rooms',
    header: 'Occupied Rooms',
  },
  {
    accessorKey: 'price_bedsitter',
    header: 'Bedsitter Price',
    cell: ({ row }) => `$${row.original.price_bedsitter}`,
  },
  {
    accessorKey: 'price_one_bedroom',
    header: '1 Bedroom Price',
    cell: ({ row }) => `$${row.original.price_one_bedroom}`,
  },
];

export default function Properties() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/properties');
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      <DataTable columns={columns} data={properties || []} />
    </div>
  );
}
