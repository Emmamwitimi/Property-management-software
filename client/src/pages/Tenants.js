import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';

export default function Tenants() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    tenant_name: '',
    tenant_phone_number: '',
    house_number: '',
    house_type: '',
    deposit_paid: '',
    payment_date: '',
    receipt_number_deposit: '',
    rent_amount: '',
    due_date: '',
    rent_receipt_number: '',
    rent_paid: '',
    amount_due: '',
  });

  const [editingTenant, setEditingTenant] = useState(null);
  const [selectedHouseType, setSelectedHouseType] = useState('');

  // Fetch tenants list
  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data } = await axios.get('https://property-management-software-5g9a.onrender.com/tenants');
      return data;
    },
  });

  // Fetch properties list for property selection
  // const { data: properties } = useQuery({
  //   queryKey: ['properties'],
  //   queryFn: async () => {
  //     const { data } = await axios.get('https://property-management-software-5g9a.onrender.com/properties');
  //     return data;
  //   },
  // });

  // CRUD Mutations
  const addTenantMutation = useMutation({
    mutationFn: (newTenant) => axios.post('https://property-management-software-5g9a.onrender.com/tenants', newTenant),
    onSuccess: () => {
      queryClient.invalidateQueries(['tenants']);
      setIsModalOpen(false);
    },
  });

  const editTenantMutation = useMutation({
    mutationFn: (updatedTenant) =>
      axios.put(`https://property-management-software-5g9a.onrender.com/tenants/${updatedTenant.id}`, updatedTenant),
    onSuccess: () => {
      queryClient.invalidateQueries(['tenants']);
      setIsModalOpen(false);
    },
  });

  const deleteTenantMutation = useMutation({
    mutationFn: (tenantId) => axios.delete(`https://property-management-software-5g9a.onrender.com/tenants/${tenantId}`),
    onSuccess: () => queryClient.invalidateQueries(['tenants']),
  });

  // Modal Handlers
  const handleAdd = () => {
    setEditingTenant(null);
    setFormState({
      tenant_name: '',
      tenant_phone_number: '',
      house_number: '',
      house_type: '',
      deposit_paid: '',
      payment_date: '',
      receipt_number_deposit: '',
      rent_amount: '',
      due_date: '',
      rent_receipt_number: '',
      rent_paid: '',
      amount_due: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setFormState({
      tenant_name: tenant.tenant_name,
      tenant_phone_number: tenant.tenant_phone_number,
      house_number: tenant.house_number,
      house_type: tenant.house_type,
      deposit_paid: tenant.deposit_paid,
      payment_date: tenant.payment_date,
      receipt_number_deposit: tenant.receipt_number_deposit,
      rent_amount: tenant.rent_amount,
      due_date: tenant.due_date,
      rent_receipt_number: tenant.rent_receipt_number,
      rent_paid: tenant.rent_paid,
      amount_due: tenant.amount_due,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (tenantId) => {
    deleteTenantMutation.mutate(tenantId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTenant) {
      editTenantMutation.mutate({ ...formState, id: editingTenant.id });
    } else {
      addTenantMutation.mutate(formState);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  // Get unique house types from the tenants data
  const houseTypes = Array.from(new Set(tenants.map(tenant => tenant.house_type)));

  const filteredTenants = selectedHouseType
    ? tenants.filter((tenant) => tenant.house_type === selectedHouseType)
    : tenants;

  const columns = [
    { accessorKey: 'tenant_name', header: 'Tenant Name' },
    { accessorKey: 'tenant_phone_number', header: 'Phone Number' },
    { accessorKey: 'house_number', header: 'House Number' },
    { accessorKey: 'house_type', header: 'House Type' },
    { accessorKey: 'deposit_paid', header: 'Deposit Paid', cell: ({ row }) => `$${row.original.deposit_paid}` },
    { accessorKey: 'payment_date', header: 'Payment Date', cell: ({ row }) => new Date(row.original.payment_date).toLocaleDateString() },
    { accessorKey: 'receipt_number_deposit', header: 'Deposit Receipt' },
    { accessorKey: 'rent_amount', header: 'Rent Amount', cell: ({ row }) => `$${row.original.rent_amount}` },
    { accessorKey: 'due_date', header: 'Due Date', cell: ({ row }) => new Date(row.original.due_date).toLocaleDateString() },
    { accessorKey: 'rent_paid', header: 'Rent Paid', cell: ({ row }) => `$${row.original.rent_paid || 0}` },
    { accessorKey: 'amount_due', header: 'Amount Due', cell: ({ row }) => `$${row.original.amount_due}` },
    { accessorKey: 'rent_receipt_number', header: 'Rent Receipt' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(row.original)} className="text-blue-500 hover:underline">
            Edit
          </button>
          <button onClick={() => handleDelete(row.original.id)} className="text-red-500 hover:underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 px-4 mt-20 relative ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Tenant
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="houseType" className="mr-2">Filter by House Type:</label>
        <select
          id="houseType"
          value={selectedHouseType}
          onChange={(e) => setSelectedHouseType(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">All</option>
          {houseTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <DataTable columns={columns} data={filteredTenants || []} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="mt-20 bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editingTenant ? 'Edit Tenant' : 'Add Tenant'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(formState).map((key) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {key.replace('_', ' ').toUpperCase()}
                  </label>
                  <input
                    type={typeof formState[key] === 'number' ? 'number' : 'text'}
                    id={key}
                    value={formState[key]}
                    onChange={(e) => setFormState({ ...formState, [key]: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingTenant ? 'Update Tenant' : 'Add Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



