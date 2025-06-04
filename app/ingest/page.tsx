'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api, { endpoints } from '@/lib/api';
import Papa from 'papaparse';

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

  // State for File Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadDataType, setUploadDataType] = useState<'customers' | 'orders' | null>(null); // To select data type
  const [failedUploadRecords, setFailedUploadRecords] = useState<any[]>([]); // State to store failed records

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

  // Handle File Upload
  const handleFileUpload = async () => {
    if (!selectedFile || !uploadDataType) {
      setUploadError('Please select a file and data type.');
      return;
    }

    setUploading(true);
    setUploadSuccess(null);
    setUploadError(null);
    setFailedUploadRecords([]); // Clear previous failed records

    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    let parsedData: any[] = [];

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;

        if (fileExtension === 'json') {
          parsedData = JSON.parse(text);
        } else if (fileExtension === 'csv') {
          // Parse CSV using Papaparse
          const results = Papa.parse(text, { header: true, skipEmptyLines: true });
          if (results.errors.length) {
            console.error('CSV parsing errors:', results.errors);
            setUploadError('Error parsing CSV file.');
            setUploading(false);
            return;
          }
          parsedData = results.data as any[]; // Ensure parsedData is treated as an array of any
        } else {
          setUploadError('Unsupported file type. Please upload a CSV or JSON file.');
          setUploading(false);
          return;
        }

        // --- Data Transformation and API Call --- //
        // TODO: Validate and transform parsedData to match backend structure
        console.log('Parsed Data:', parsedData);

        let endpoint = '';
        let transformedData: any[] = [];

        if (uploadDataType === 'customers') {
           endpoint = endpoints.customers.batchCreate;
           transformedData = parsedData.map(item => ({
              customerId: Number(item.customerId) || 0, // Ensure number, default to 0
              name: item.name || '', // Ensure string, default to empty
              email: item.email || '', // Ensure string, default to empty
              phone: item.phone || undefined, // Optional string
              totalSpend: Number(item.totalSpend) || 0, // Ensure number, default to 0
              visitCount: Number(item.visitCount) || 0, // Ensure number, default to 0
              // Convert date string to ISO 8601 string if it exists and is a valid date
              lastPurchase: item.lastPurchase ? (new Date(item.lastPurchase).toISOString() || undefined) : undefined,
           }));
           // Filter out items that might be invalid after transformation if necessary
           transformedData = transformedData.filter(item => item.name && item.email && item.customerId !== 0);

        } else if (uploadDataType === 'orders') {
           endpoint = endpoints.orders.batchCreate;
           transformedData = parsedData.map(item => ({
              orderId: item.orderId || '', // Ensure string, required
              customerId: Number(item.customerId) || 0, // Ensure number, required
              amount: Number(item.amount) || 0, // Ensure number, required
              items: Array.isArray(item.items) ? item.items.map((orderItem: any) => ({
                 productId: orderItem.productId || '', // Ensure string, required
                 quantity: Number(orderItem.quantity) || 0, // Ensure number, required
                 price: Number(orderItem.price) || 0, // Ensure number, required
              })) : [], // Ensure array, default to empty if not provided
              status: item.status || 'PENDING', // Ensure string, default to PENDING
              // Convert date string to ISO 8601 string, required
              orderDate: item.orderDate ? (new Date(item.orderDate).toISOString() || undefined) : undefined, // Ensure valid ISO string
           }));
            // Filter out items that might be invalid after transformation if necessary
           transformedData = transformedData.filter(item => item.orderId && item.customerId !== 0 && item.amount !== 0 && item.items.length > 0 && item.status && item.orderDate);
        }

        if (!endpoint || transformedData.length === 0) {
            setUploadError('No valid data to upload or endpoint not found.');
            setUploading(false);
            return;
        }

        const requestBody = uploadDataType === 'customers' ? { customers: transformedData } : { orders: transformedData };

        // --- Actual API Call --- //
         const response = await api.post(endpoint, requestBody, {
           headers: {
             'Content-Type': 'application/json', // Sending JSON body
           },
         });

        // --- Success/error handling based on backend response --- //
         if (response.data.message) {
           let successCount = 0;
           let failureCount = 0;
           const failedRecords: any[] = [];

           response.data.results.forEach((result: any) => {
             if (result.success) {
               successCount++;
             } else {
               failureCount++;
               failedRecords.push(result);
             }
           });

           setUploadSuccess(`Upload completed. Successful: ${successCount}, Failed: ${failureCount}`);

           if (failureCount > 0) {
              setFailedUploadRecords(failedRecords);
              // Optionally display failed records to the user
           }

           setSelectedFile(null);
           setUploadDataType(null);

         } else {
           // Handle unexpected response structure
           setUploadError('Upload failed: Unexpected response from server.');
         }

      } catch (error) {
        console.error('Error processing file:', error);
        setUploadError('Error processing file or uploading data.');
        setUploading(false);
      }
    };

    reader.onerror = () => {
      console.error('Error reading file:', reader.error);
      setUploadError('Error reading file.');
      setUploading(false);
    };

    reader.readAsText(selectedFile);
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
                    <div className="space-y-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Type</label>
                         <div className="mt-2 flex space-x-4">
                           <Button
                              type="button"
                             variant={uploadDataType === 'customers' ? 'default' : 'outline'}
                             onClick={() => setUploadDataType('customers')}
                            >
                             Customers
                           </Button>
                           <Button
                              type="button"
                             variant={uploadDataType === 'orders' ? 'default' : 'outline'}
                             onClick={() => setUploadDataType('orders')}
                            >
                             Orders
                           </Button>
                         </div>
                         {uploadDataType && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload a file containing {uploadDataType} data.</p>}
                       </div>
                       
                      <div>
                         <label htmlFor="dataFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select File</label>
                         <input
                           id="dataFile"
                           type="file"
                           accept=".csv, .json"
                           onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                           className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-indigo-50 dark:file:bg-indigo-900 file:text-indigo-700 dark:file:text-indigo-200
                             hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800
                             cursor-pointer"
                         />
                       </div>
                       
                       {uploadSuccess && <p className="text-sm text-green-600 dark:text-green-400">{uploadSuccess}</p>}
                       {uploadError && <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>}
                       
                       <Button 
                          onClick={handleFileUpload}
                          disabled={uploading || !selectedFile || !uploadDataType}
                       >
                         {uploading ? 'Uploading...' : 'Upload Data'}
                       </Button>
                       
                       {failedUploadRecords.length > 0 && (
                         <div className="mt-4">
                           <h4 className="text-lg font-medium text-red-600 dark:text-red-400">Failed Records:</h4>
                           <ul className="mt-2 border border-red-300 dark:border-red-700 rounded-md divide-y divide-red-300 dark:divide-red-700">
                             {failedUploadRecords.map((failedRecord, index) => (
                               <li key={index} className="p-3 text-sm text-red-800 dark:text-red-200">
                                 <p className="font-semibold">Record Data:</p>
                                 <pre className="whitespace-pre-wrap break-all text-xs">{JSON.stringify(failedRecord.data, null, 2)}</pre>
                                 <p className="font-semibold mt-1">Error:</p>
                                 <p>{failedRecord.error}</p>
                               </li>
                             ))}
                           </ul>
                         </div>
                       )}
                     </div>
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