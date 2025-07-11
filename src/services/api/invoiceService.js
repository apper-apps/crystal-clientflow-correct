const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getAllInvoices = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "paymentDate" } },
        { field: { Name: "lineItems" } },
        { field: { Name: "clientId" } },
        { field: { Name: "projectId" } },
        { field: { Name: "Tags" } }
      ],
      orderBy: [
        {
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "paymentDate" } },
        { field: { Name: "lineItems" } },
        { field: { Name: "clientId" } },
        { field: { Name: "projectId" } },
        { field: { Name: "Tags" } }
      ]
    };
    
    const response = await apperClient.getRecordById('app_invoice', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    // Validate required fields
    if (!invoiceData.projectId) {
      throw new Error("Project ID is required");
    }
    if (!invoiceData.amount || invoiceData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (!invoiceData.dueDate) {
      throw new Error("Due date is required");
    }

    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Name: `Invoice-${Date.now()}`,
          amount: parseFloat(invoiceData.amount),
          status: invoiceData.status || 'draft',
          dueDate: invoiceData.dueDate,
          paymentDate: invoiceData.paymentDate || null,
          lineItems: JSON.stringify(invoiceData.lineItems || []),
          clientId: parseInt(invoiceData.clientId),
          projectId: parseInt(invoiceData.projectId),
          Tags: invoiceData.tags || ""
        }
      ]
    };
    
    const response = await apperClient.createRecord('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to create invoice";
        throw new Error(errorMessage);
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    if (invoiceData.amount !== undefined && invoiceData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Id: parseInt(id),
          amount: invoiceData.amount !== undefined ? parseFloat(invoiceData.amount) : undefined,
          status: invoiceData.status,
          dueDate: invoiceData.dueDate,
          paymentDate: invoiceData.paymentDate || null,
          lineItems: invoiceData.lineItems ? JSON.stringify(invoiceData.lineItems) : undefined,
          clientId: invoiceData.clientId ? parseInt(invoiceData.clientId) : undefined,
          projectId: invoiceData.projectId ? parseInt(invoiceData.projectId) : undefined,
          Tags: invoiceData.tags
        }
      ]
    };
    
    const response = await apperClient.updateRecord('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to update invoice";
        throw new Error(errorMessage);
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const markInvoiceAsSent = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Id: parseInt(id),
          status: "sent"
        }
      ]
    };
    
    const response = await apperClient.updateRecord('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to mark invoice as sent";
        throw new Error(errorMessage);
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error marking invoice as sent:", error);
    throw error;
  }
};

export const markInvoiceAsPaid = async (id, paymentDate) => {
  try {
    if (!paymentDate) {
      throw new Error("Payment date is required");
    }

    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Id: parseInt(id),
          status: "paid",
          paymentDate: new Date(paymentDate).toISOString()
        }
      ]
    };
    
    const response = await apperClient.updateRecord('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to mark invoice as paid";
        throw new Error(errorMessage);
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to delete invoice";
        throw new Error(errorMessage);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};