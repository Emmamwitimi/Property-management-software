import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';

export default function Properties() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    property_name: '',
    location: '',
    number_of_rooms: '',
    occupied_rooms: '',
    price_bedsitter: '',
    price_one_bedroom: '',
  });
  const [editingProperty, setEditingProperty] = useState(null);

  // Fetch properties list
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/properties');
      return data;
    },
  });

  // Mutations for CRUD operations
  const addPropertyMutation = useMutation({
    mutationFn: (newProperty) => axios.post('http://localhost:5000/properties', newProperty),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      setIsModalOpen(false);
    },
  });

  const editPropertyMutation = useMutation({
    mutationFn: (updatedProperty) =>
      axios.put(`http://localhost:5000/properties/${updatedProperty.id}`, updatedProperty),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      setIsModalOpen(false);
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: (propertyId) => axios.delete(`http://localhost:5000/properties/${propertyId}`),
    onSuccess: () => queryClient.invalidateQueries(['properties']),
  });

  // Define functions for handling add, edit, and delete operations
  const handleAdd = () => {
    setEditingProperty(null);
    setFormState({
      property_name: '',
      location: '',
      number_of_rooms: '',
      occupied_rooms: '',
      price_bedsitter: '',
      price_one_bedroom: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormState(property);
    setIsModalOpen(true);
  };

  const handleDelete = (propertyId) => {
    deletePropertyMutation.mutate(propertyId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProperty) {
      editPropertyMutation.mutate({ ...formState, id: editingProperty.id });
    } else {
      addPropertyMutation.mutate(formState);
    }
  };

  // Define columns for the data table
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
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(row.original)} className="text-blue-500 hover:underline">Edit</button>
          <button onClick={() => handleDelete(row.original.id)} className="text-red-500 hover:underline">Delete</button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 ml-64 mt-20 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <button 
          onClick={handleAdd} 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      <DataTable columns={columns} data={properties || []} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="mt-20 bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{editingProperty ? 'Edit Property' : 'Add Property'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 ">
              {Object.keys(formState).map((key) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  value={formState[key]}
                  onChange={(e) => setFormState({ ...formState, [key]: e.target.value })}
                  placeholder={key.replace('_', ' ')}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              ))}
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsModalOpen(false)} type="button" className="text-gray-600 hover:underline">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
