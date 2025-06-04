'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api, { endpoints } from '@/lib/api';

export default function DataIngestionPage() {
  const [ingestionType, setIngestionType] = useState<'manual' | 'upload' | null>(null);

  // State for Add Customer Form
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    totalSpend: 0,
    visitCount: 0,
    lastPurchase: '', // YYYY-MM-DD format for date input
    customerId: '', // Add customerId to state
  });
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [customerSuccess, setCustomerSuccess] = useState<string | null>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // State for Add Order Form
  const [orderData, setOrderData] = useState({
    orderId: '', // Added orderId
    customerId: '', // Changed from customerEmail to customerId
    amount: 0,
    items: [{ productId: '', quantity: 0, price: 0 }], // Simplified single item
    status: 'PENDING', // Added status, default to PENDING
    orderDate: '', // YYYY-MM-DD format for date input
  });
   const [addingOrder, setAddingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);


  // Handle input changes for customer form
  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [id]: id === 'totalSpend' || id === 'visitCount' || id === 'customerId' ? (value === '' ? '' : Number(value)) : value // Convert numerical inputs to numbers, handle empty string
    }));
  };

  // Handle input changes for order form
  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { // Added HTMLSelectElement for status dropdown
    const { id, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [id]: id === 'amount' || id === 'customerId' || id === 'quantity' || id === 'price' ? (value === '' ? '' : Number(value)) : value // Convert numerical inputs
    }));
  };

  // Handle item input changes for order form (simplified single item)
  const handleOrderItemChange = (field: 'productId' | 'quantity' | 'price', value: string | number) => {
    setOrderData(prev => ({
      ...prev,
      items: [{ ...prev.items[0], [field]: value }],
    }));
  };


  // Handle Add Customer Submission
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingCustomer(true);
    setCustomerSuccess(null);
    setCustomerError(null);
    try {
      // Basic validation
      if (!customerData.name || !customerData.email || customerData.customerId === '') { // Add customerId validation
         setCustomerError('Name, Email, and Customer ID are required.');
         setAddingCustomer(false);
         return;
      }

      // Adjust data types and format for backend
      const dataToSend = {
         ...customerData,
         totalSpend: Number(customerData.totalSpend) || 0, // Ensure number, default to 0
         visitCount: Number(customerData.visitCount) || 0, // Ensure number, default to 0
         customerId: Number(customerData.customerId), // Ensure number
         // Convert YYYY-MM-DD string to ISO 8601 string if lastPurchase exists
         lastPurchase: customerData.lastPurchase ? new Date(customerData.lastPurchase).toISOString() : undefined,
      };

      // TODO: Call backend API to add customer
      console.log('Add Customer Data:', dataToSend);
      await api.post(endpoints.customers.create, dataToSend);

      setCustomerSuccess('Customer added successfully!');
      // Reset form
      setCustomerData({
        name: '',
        email: '',
        phone: '',
        totalSpend: 0,
        visitCount: 0,
        lastPurchase: '',
        customerId: '', // Reset customerId
      });

    } catch (error) {
      console.error('Failed to add customer:', error);
      setCustomerError('Failed to add customer.');
    } finally {
      setAddingCustomer(false);
    }
  };

  // Handle Add Order Submission
  const handleAddOrder = async (e: React.FormEvent) => {
     e.preventDefault();
     setAddingOrder(true);
     setOrderSuccess(null);
     setOrderError(null);
    try {
      // Basic validation
      if (!orderData.orderId || orderData.customerId === '' || !orderData.amount || !orderData.items[0].productId || orderData.items[0].quantity === '' || orderData.items[0].price === '' || !orderData.status || !orderData.orderDate) {
         setOrderError('All order fields are required.'); // Updated validation message
         setAddingOrder(false);
         return;
      }

       // Adjust data types and format for backend
      const dataToSend = {
         ...orderData,
         customerId: Number(orderData.customerId), // Ensure customerId is number
         amount: Number(orderData.amount), // Ensure amount is number
         items: orderData.items.map(item => ({ // Ensure item numbers
           ...item,
           quantity: Number(item.quantity),
           price: Number(item.price),
         })),
          // Convert YYYY-MM-DD string to ISO 8601 string if orderDate exists
         orderDate: orderData.orderDate ? new Date(orderData.orderDate).toISOString() : undefined, // orderDate is required per backend spec
      };

       // TODO: Call backend API to add order
      console.log('Add Order Data:', dataToSend);
      await api.post(endpoints.customers.createOrder, dataToSend);

      setOrderSuccess('Order added successfully!');
      // Reset form
       setOrderData({
        orderId: '',
        customerId: '',
        amount: 0,
        items: [{ productId: '', quantity: 0, price: 0 }],
        status: 'PENDING',
        orderDate: '',
      });

    } catch (error) {
      console.error('Failed to add order:', error);
      setOrderError('Failed to add order.');
    } finally {
      setAddingOrder(false);
    }
  };


  return (
    <ProtectedRoute>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Data Ingestion
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Ingestion Method</h2>
                  <div className="mt-4 flex space-x-4">
                    <Button
                      variant={ingestionType === 'manual' ? 'default' : 'outline'}
                      onClick={() => setIngestionType('manual')}
                    >
                      Manual Entry
                    </Button>
                    <Button
                      variant={ingestionType === 'upload' ? 'default' : 'outline'}
                      onClick={() => setIngestionType('upload')}
                    >
                      Upload File (CSV/JSON)
                    </Button>
                  </div>
                </div>

                {ingestionType === 'manual' && (
                  <div className="space-y-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manual Data Entry</h3>

                    {/* Add Customer Form */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Add New Customer</h4>
                      <form onSubmit={handleAddCustomer} className="space-y-4">
                        <div>
                          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer ID</label>
                          <Input id="customerId" type="number" value={customerData.customerId} onChange={handleCustomerInputChange} required min="0" />
                        </div>
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                          <Input id="name" value={customerData.name} onChange={handleCustomerInputChange} required />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                          <Input id="email" type="email" value={customerData.email} onChange={handleCustomerInputChange} required />
                        </div>
                         <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone (Optional)</label>
                          <Input id="phone" type="tel" value={customerData.phone} onChange={handleCustomerInputChange} />
                        </div>
                         <div>
                          <label htmlFor="totalSpend" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Spend</label>
                          <Input id="totalSpend" type="number" value={customerData.totalSpend} onChange={handleCustomerInputChange} required min="0" step="0.01" />
                        </div>
                         <div>
                          <label htmlFor="visitCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Visit Count</label>
                          <Input id="visitCount" type="number" value={customerData.visitCount} onChange={handleCustomerInputChange} required min="0" />
                        </div>
                         <div>
                          <label htmlFor="lastPurchase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Purchase (Optional)</label>
                           {/* Using native input for date picker */}
                           <input
                            id="lastPurchase"
                            type="date"
                            value={customerData.lastPurchase}
                            onChange={handleCustomerInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                         {customerSuccess && <p className="text-sm text-green-600 dark:text-green-400">{customerSuccess}</p>}
                         {customerError && <p className="text-sm text-red-600 dark:text-red-400">{customerError}</p>}
                         <Button type="submit" disabled={addingCustomer}>
                          {addingCustomer ? 'Adding...' : 'Add Customer'}
                        </Button>
                      </form>
                    </div>

                    {/* Add Order Form */}
                     <div className="space-y-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                       <h4 className="text-lg font-medium text-gray-900 dark:text-white">Add New Order</h4>
                       <form onSubmit={handleAddOrder} className="space-y-4">
                         <div>
                           <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order ID</label>
                           <Input id="orderId" value={orderData.orderId} onChange={handleOrderInputChange} required />
                         </div>
                         <div>
                           <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer ID</label>
                           <Input id="customerId" type="number" value={orderData.customerId} onChange={handleOrderInputChange} required placeholder="ID of existing customer" min="0" />
                         </div>
                         <div>
                           <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                           <Input id="amount" type="number" value={orderData.amount} onChange={handleOrderInputChange} required min="0" step="0.01" />
                         </div>
                         <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                           <h5 className="text-md font-medium text-gray-900 dark:text-white">Item Details (Simplified)</h5>
                           <div className="flex space-x-4">
                             <div>
                               <label htmlFor="productId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product ID</label>
                               <Input id="productId" value={orderData.items[0].productId} onChange={(e) => handleOrderItemChange('productId', e.target.value)} required />
                             </div>
                             <div>
                               <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                               <Input id="quantity" type="number" value={orderData.items[0].quantity} onChange={(e) => handleOrderItemChange('quantity', Number(e.target.value))} required min="1" />
                             </div>
                             <div>
                               <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price per Unit</label>
                               <Input id="price" type="number" value={orderData.items[0].price} onChange={(e) => handleOrderItemChange('price', Number(e.target.value))} required min="0" step="0.01" />
                             </div>
                           </div>
                         </div>
                         <div>
                           <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                           <select
                             id="status"
                             value={orderData.status}
                             onChange={handleOrderInputChange}
                             required
                             className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                           >
                             <option value="PENDING">Pending</option>
                             <option value="COMPLETED">Completed</option>
                             <option value="CANCELLED">Cancelled</option>
                           </select>
                         </div>
                         <div>
                           <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Date</label>
                           {/* Using native input for date picker */}
                           <input
                            id="date"
                            type="date"
                            value={orderData.orderDate}
                            onChange={handleOrderInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            required // Order date is required per backend spec
                          />
                        </div>
                         {orderSuccess && <p className="text-sm text-green-600 dark:text-green-400">{orderSuccess}</p>}
                         {orderError && <p className="text-sm text-red-600 dark:text-red-400">{orderError}</p>}
                        <Button type="submit" disabled={addingOrder}>
                          {addingOrder ? 'Adding...' : 'Add Order'}
                        </Button>
                       </form>
                     </div>
                  </div>
                )}

                {ingestionType === 'upload' && (
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Data File</h3>
                    {/* Placeholder for file upload component */}
                    <p className="text-gray-500 dark:text-gray-400">File upload component will go here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 