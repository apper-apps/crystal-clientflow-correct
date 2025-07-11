const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getAllClients = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email" } },
        { field: { Name: "company" } },
        { field: { Name: "status" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "notes" } },
        { field: { Name: "Tags" } }
      ],
      orderBy: [
        {
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('client', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const getClientById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email" } },
        { field: { Name: "company" } },
        { field: { Name: "status" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "notes" } },
        { field: { Name: "Tags" } }
      ]
    };
    
    const response = await apperClient.getRecordById('client', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching client with ID ${id}:`, error);
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Name: clientData.name,
          email: clientData.email,
          company: clientData.company,
          status: clientData.status,
          notes: clientData.notes || "",
          Tags: clientData.tags || "",
          createdAt: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.createRecord('client', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to create client";
        throw new Error(errorMessage);
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export const updateClient = async (id, clientData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Id: parseInt(id),
          Name: clientData.name,
          email: clientData.email,
          company: clientData.company,
          status: clientData.status,
          notes: clientData.notes || "",
          Tags: clientData.tags || ""
        }
      ]
    };
    
    const response = await apperClient.updateRecord('client', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to update client";
        throw new Error(errorMessage);
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export const deleteClient = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('client', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to delete client";
        throw new Error(errorMessage);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};