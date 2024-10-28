import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';

export default function Landlords() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    landlord_name: '',
    phone_number: '',
    email: '',
  });
  const [editingLandlord, setEditingLandlord] = useState(null);

  // Fetch landlords list
  const { data: landlords, isLoading } = useQuery({
    queryKey: ['landlords'],
    queryFn: async () => {
      const { data } = await axios.get('https://property-management-software-5g9a.onrender.com/landlords');
      return data;
    },
  });

  // Mutations for CRUD operations
  const addLandlordMutation = useMutation({
    mutationFn: (newLandlord) => axios.post('https://property-management-software-5g9a.onrender.com/landlords', newLandlord),
    onSuccess: () => {
      queryClient.invalidateQueries(['landlords']);
      setIsModalOpen(false);
    },
  });

  const editLandlordMutation = useMutation({
    mutationFn: (updatedLandlord) =>
      axios.put(`https://property-management-software-5g9a.onrender.com/landlords/${updatedLandlord.id}`, updatedLandlord),
    onSuccess: () => {
      queryClient.invalidateQueries(['landlords']);
      setIsModalOpen(false);
    },
  });

  const deleteLandlordMutation = useMutation({
    mutationFn: (landlordId) => axios.delete(`https://property-management-software-5g9a.onrender.com/landlords/${landlordId}`),
    onSuccess: () => queryClient.invalidateQueries(['landlords']),
  });

  // Handle modal open for adding a new landlord
  const handleAdd = () => {
    setEditingLandlord(null);
    setFormState({
      landlord_name: '',
      phone_number: '',
      email: '',
    });
    setIsModalOpen(true);
  };

  // Handle modal open for editing an existing landlord
  const handleEdit = (landlord) => {
    setEditingLandlord(landlord);
    setFormState({
      landlord_name: landlord.landlord_name,
      phone_number: landlord.phone_number,
      email: landlord.email,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (landlordId) => {
    deleteLandlordMutation.mutate(landlordId);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { landlord_name, phone_number, email } = formState;

    // Prepare the data for submission, filtering out any non-editable fields
    const submitData = {
      landlord_name,
      phone_number,
      email,
      ...(editingLandlord && { id: editingLandlord.id }), // Include ID only if editing
    };

    if (editingLandlord) {
      editLandlordMutation.mutate(submitData);
    } else {
      addLandlordMutation.mutate(submitData);
    }
  };

  // Define columns with additional data fields
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
    <div className="space-y-6 px-6 mt-20 relative ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Landlords</h1>
        <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Add Landlord
        </button>
      </div>

      <DataTable columns={columns} data={landlords || []} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{editingLandlord ? 'Edit Landlord' : 'Add Landlord'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(formState).map((key) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  value={formState[key]}
                  onChange={(e) => setFormState({ ...formState, [key]: e.target.value })}
                  placeholder={key.replace('_', ' ')}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              ))}
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsModalOpen(false)} type="button" className="text-gray-600 hover:underline">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
