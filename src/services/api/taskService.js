const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getAllTasks = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "timeTracking" } },
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
    
    const response = await apperClient.fetchRecords('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getTaskById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "timeTracking" } },
        { field: { Name: "projectId" } },
        { field: { Name: "Tags" } }
      ]
    };
    
    const response = await apperClient.getRecordById('task', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Name: taskData.name || taskData.title,
          title: taskData.title,
          priority: taskData.priority,
          status: taskData.status,
          dueDate: taskData.dueDate,
          timeTracking: taskData.timeTracking || "",
          projectId: parseInt(taskData.projectId),
          Tags: taskData.tags || ""
        }
      ]
    };
    
    const response = await apperClient.createRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to create task";
        throw new Error(errorMessage);
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Id: parseInt(id),
          Name: taskData.name || taskData.title,
          title: taskData.title,
          priority: taskData.priority,
          status: taskData.status,
          dueDate: taskData.dueDate,
          timeTracking: taskData.timeTracking || "",
          projectId: parseInt(taskData.projectId),
          Tags: taskData.tags || ""
        }
      ]
    };
    
    const response = await apperClient.updateRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to update task";
        throw new Error(errorMessage);
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Id: parseInt(id),
          status: status
        }
      ]
    };
    
    const response = await apperClient.updateRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to update task status";
        throw new Error(errorMessage);
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || "Failed to delete task";
        throw new Error(errorMessage);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Time tracking functions maintain mock functionality as they're not in database schema
let nextTimeLogId = 100;

export const startTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const now = new Date().toISOString();
  const timerData = {
    Id: parseInt(id),
    startTime: now
  };
  
  return timerData;
};

export const stopTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const now = new Date().toISOString();
  const timeLog = {
    Id: nextTimeLogId++,
    startTime: new Date(Date.now() - 3600000).toISOString(), // Mock 1 hour session
    endTime: now,
    duration: 3600000, // 1 hour in milliseconds
    date: new Date().toISOString().split('T')[0]
  };
  
  return timeLog;
};

export const getTaskTimeLogs = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  return []; // Mock empty time logs
};