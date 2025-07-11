import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import ClientModal from "@/components/molecules/ClientModal";
import { getAllClients } from "@/services/api/clientService";
import { getAllProjects } from "@/services/api/projectService";

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");
      const [clientData, projectData] = await Promise.all([
        getAllClients(),
        getAllProjects()
      ]);
      setClients(clientData);
      setProjects(projectData);
    } catch (err) {
      setError("Failed to load clients. Please try again.");
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  // Calculate project statistics for a client
  const calculateProjectStats = (clientId) => {
    const clientProjects = projects.filter(project => 
      parseInt(project.clientId) === parseInt(clientId)
    );
    const activeProjects = clientProjects.filter(p => p.status === "active").length;
    const totalProjects = clientProjects.length;
    return { activeProjects, totalProjects };
  };

  const handleClientCreated = (newClient) => {
    setClients(prev => [...prev, newClient]);
};

  const handleClientClick = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClients} />;
  }

if (clients.length === 0) {
    return (
      <Empty
        title="No Clients Yet"
        description="Start building your client base by adding your first client"
        icon="Users"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="Users" size={18} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Clients
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your client relationships and contacts
          </p>
        </div>
        
<Button variant="primary" onClick={() => setShowModal(true)}>
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Client
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <SearchBar
          placeholder="Search clients by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        Showing {filteredClients.length} of {clients.length} clients
      </motion.div>

      {/* Clients Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.Id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
>
            <div
              onClick={() => handleClientClick(client.Id)}
              className="cursor-pointer"
            >
              <Card hover className="p-6 h-full transition-all duration-200 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {client.company}
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant={client.status === "active" ? "success" : "secondary"}>
                    {client.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ApperIcon name="Mail" size={14} />
                    <span className="truncate">{client.email}</span>
                  </div>
                  
<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ApperIcon name="Calendar" size={14} />
                    <span>Client since {new Date(client.createdAt || client.CreatedOn).toLocaleDateString()}</span>
                  </div>
                  {/* Project Statistics */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ApperIcon name="FolderOpen" size={14} />
                    <span>
                      {(() => {
                        const stats = calculateProjectStats(client.Id);
                        return stats.totalProjects === 0 
                          ? "No projects" 
                          : `${stats.activeProjects} active, ${stats.totalProjects} total`;
                      })()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${client.email}`;
                    }}
                  >
                    <ApperIcon name="MessageSquare" size={14} className="mr-2" />
                    Contact
</Button>
                  
                  <div className="flex items-center gap-2">
                    {(() => {
                      const stats = calculateProjectStats(client.Id);
                      return stats.totalProjects > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">
                            {stats.activeProjects} active
                          </span>
                        </div>
                      );
                    })()}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/clients/${client.Id}`);
                      }}
                    >
                      <ApperIcon name="Eye" size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ApperIcon name="MoreHorizontal" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredClients.length === 0 && searchTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Empty
            title="No Clients Found"
            description={`No clients match "${searchTerm}". Try adjusting your search.`}
            icon="Search"
            actionLabel="Clear Search"
            onAction={() => setSearchTerm("")}
          />
</motion.div>
      )}

      {/* Client Modal */}
      <ClientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
};

export default Clients;