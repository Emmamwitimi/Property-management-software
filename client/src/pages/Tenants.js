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
      const { data } = await axios.get('http://localhost:5000/tenants');
      return data;
    },
  });

  // Fetch properties list for property selection
  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/properties');
      return data;
    },
  });

  // CRUD Mutations
  const addTenantMutation = useMutation({
    mutationFn: (newTenant) => axios.post('http://localhost:5000/tenants', newTenant),
    onSuccess: () => {
      queryClient.invalidateQueries(['tenants']);
      setIsModalOpen(false);
    },
  });

  const editTenantMutation = useMutation({
    mutationFn: (updatedTenant) =>
      axios.put(`http://localhost:5000/tenants/${updatedTenant.id}`, updatedTenant),
    onSuccess: () => {
      queryClient.invalidateQueries(['tenants']);
      setIsModalOpen(false);
    },
  });

  const deleteTenantMutation = useMutation({
    mutationFn: (tenantId) => axios.delete(`http://localhost:5000/tenants/${tenantId}`),
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




// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { Plus } from 'lucide-react';
// import { DataTable } from '../components/DataTable';
// import * as yup from 'yup'; // Assuming you use yup for validation
// import { useFormik } from 'formik';

// const TenantSchema = yup.object().shape({
//   tenant_name: yup.string().required('Tenant name is required').max(100, 'Max 100 characters'),
//   tenant_phone_number: yup.string().length(10, 'Phone number must be exactly 10 digits').required('Phone number is required'),
//   house_number: yup.string().required('House number is required').max(10, 'Max 10 characters'),
//   house_type: yup.string().required('House type is required').max(50, 'Max 50 characters'),
//   deposit_paid: yup.number().required('Deposit paid is required').positive('Must be a positive number'),
//   rent_amount: yup.number().required('Rent amount is required').positive('Must be a positive number'),
//   amount_due: yup.number().required('Amount due is required').positive('Must be a positive number'),
//   property_id: yup.number().required('Property ID is required'),
//   payment_date: yup.date(), // Optional; assume this is handled server-side
//   receipt_number_deposit: yup.string(), // Generated on the server, handled by the API
//   due_date: yup.date(), // Optional; assume this is handled server-side
//   rent_receipt_number: yup.string(), // Optional; assume this is handled server-side
//   rent_paid: yup.number().positive('Must be a positive number'), // Optional
// });

// export default function Tenants() {
//   const queryClient = useQueryClient();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTenant, setEditingTenant] = useState(null);
//   const [houseTypes, setHouseTypes] = useState([]);

//   // Fetch tenants list
//   const { data: tenants, isLoading } = useQuery({
//     queryKey: ['tenants'],
//     queryFn: async () => {
//       const { data } = await axios.get('http://localhost:5000/tenants');
//       return data;
//     },
//   });

//   // Fetch available house types
//   useEffect(() => {
//     const fetchHouseTypes = async () => {
//       try {
//         const { data } = await axios.get('http://localhost:5000/house_types');
//         setHouseTypes(data);
//       } catch (error) {
//         console.error('Error fetching house types:', error);
//       }
//     };
//     fetchHouseTypes();
//   }, []);

//   // CRUD Mutations
//   const addTenantMutation = useMutation({
//     mutationFn: (newTenant) => axios.post('http://localhost:5000/tenants', newTenant),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tenants']);
//       setIsModalOpen(false);
//     },
//   });

//   const editTenantMutation = useMutation({
//     mutationFn: (updatedTenant) =>
//       axios.put(`http://localhost:5000/tenants/${updatedTenant.id}`, updatedTenant),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tenants']);
//       setIsModalOpen(false);
//     },
//   });

//   const deleteTenantMutation = useMutation({
//     mutationFn: (tenantId) => axios.delete(`http://localhost:5000/tenants/${tenantId}`),
//     onSuccess: () => queryClient.invalidateQueries(['tenants']),
//   });

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       tenant_name: '',
//       tenant_phone_number: '',
//       house_number: '',
//       house_type: '',
//       deposit_paid: '',
//       payment_date: '', // Optional; server-side
//       receipt_number_deposit: '', // Optional; server-side
//       rent_amount: '',
//       due_date: '', // Optional; server-side
//       rent_receipt_number: '', // Optional; server-side
//       rent_paid: '', // Optional
//       amount_due: '',
//       property_id: '',
//     },
//     validationSchema: TenantSchema,
//     onSubmit: (values) => {
//       if (editingTenant) {
//         editTenantMutation.mutate({ ...values, id: editingTenant.id });
//       } else {
//         addTenantMutation.mutate(values);
//       }
//     },
//   });

//   const handleAdd = () => {
//     setEditingTenant(null);
//     formik.resetForm();
//     setIsModalOpen(true);
//   };

//   const handleEdit = (tenant) => {
//     setEditingTenant(tenant);
//     formik.setValues(tenant);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (tenantId) => {
//     deleteTenantMutation.mutate(tenantId);
//   };

//   if (isLoading) return <div>Loading...</div>;

//   const filteredTenants = tenants; // Add any filtering logic if needed

//   const columns = [
//     { accessorKey: 'tenant_name', header: 'Tenant Name' },
//     { accessorKey: 'tenant_phone_number', header: 'Phone Number' },
//     { accessorKey: 'house_number', header: 'House Number' },
//     { accessorKey: 'house_type', header: 'House Type' },
//     { accessorKey: 'deposit_paid', header: 'Deposit Paid', cell: ({ row }) => `$${row.original.deposit_paid}` },
//     { accessorKey: 'rent_amount', header: 'Rent Amount', cell: ({ row }) => `$${row.original.rent_amount}` },
//     { accessorKey: 'amount_due', header: 'Amount Due', cell: ({ row }) => `$${row.original.amount_due}` },
//     {
//       id: 'actions',
//       header: 'Actions',
//       cell: ({ row }) => (
//         <div className="flex space-x-2">
//           <button onClick={() => handleEdit(row.original)} className="text-blue-500 hover:underline">
//             Edit
//           </button>
//           <button onClick={() => handleDelete(row.original.id)} className="text-red-500 hover:underline">
//             Delete
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-6 px-4 mt-20 relative ml-64">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
//         <button
//           onClick={handleAdd}
//           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
//         >
//           <Plus className="h-5 w-5 mr-2" />
//           Add Tenant
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <DataTable columns={columns} data={filteredTenants || []} />
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
//           <div className="mt-20 bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-full max-h-[80vh] overflow-y-auto">
//             <h2 className="text-lg font-semibold mb-4">
//               {editingTenant ? 'Edit Tenant' : 'Add Tenant'}
//             </h2>
//             <form onSubmit={formik.handleSubmit} className="space-y-4">
//               {Object.keys(formik.values).map((key) => (
//                 <div key={key}>
//                   <label htmlFor={key} className="block text-sm font-medium text-gray-700">
//                     {key.replace('_', ' ').toUpperCase()}
//                   </label>
//                   <input
//                     type={key.includes('date') ? 'date' : 'text'} // Handle date fields differently
//                     name={key}
//                     id={key}
//                     value={formik.values[key]}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     placeholder={`Enter ${key.replace('_', ' ')}`}
//                     className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {formik.touched[key] && formik.errors[key] && (
//                     <p className="text-red-500 text-sm">{formik.errors[key]}</p>
//                   )}
//                 </div>
//               ))}

//               <div className="flex justify-end">
//                 <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
//                   {editingTenant ? 'Update' : 'Add'}
//                 </button>
//               </div>
//             </form>
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="mt-4 text-red-600 hover:underline"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
