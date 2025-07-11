import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { createClient, updateClient } from "@/services/api/clientService";

const ClientModal = ({ isOpen, onClose, onClientCreated, onClientUpdated, client, mode = "create" }) => {
const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    notes: "",
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when client prop changes (for edit mode)
  React.useEffect(() => {
    if (mode === "edit" && client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        company: client.company || "",
        notes: client.notes || "",
        status: client.status || "active"
      });
    } else {
      setFormData({
        name: "",
        email: "",
        company: "",
        notes: "",
        status: "active"
      });
    }
    setErrors({});
  }, [client, mode, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
setLoading(true);
    
    try {
      if (mode === "edit") {
        const updatedClient = await updateClient(client.Id, {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          notes: formData.notes,
          status: formData.status
        });
        toast.success("Client updated successfully!");
        onClientUpdated?.(updatedClient);
      } else {
        const newClient = await createClient({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          notes: formData.notes,
          status: formData.status
        });
        toast.success("Client created successfully!");
        onClientCreated?.(newClient);
      }
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        notes: "",
        status: "active"
      });
      setErrors({});
      
      onClose();
    } catch (error) {
      toast.error(error.message || (mode === "edit" ? "Failed to update client. Please try again." : "Failed to create client. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        email: "",
        company: "",
        notes: "",
        status: "active"
      });
      setErrors({});
      onClose();
    }
  };

return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "edit" ? "Edit Client" : "Add New Client"}
      size="lg"
    >
<div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter client name"
              error={errors.name}
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              error={errors.email}
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Company Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company *
            </label>
            <Input
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Enter company name"
              error={errors.company}
              disabled={loading}
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.company}
              </p>
            )}
          </div>

          {/* Notes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <Input
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes about the client..."
              disabled={loading}
              as="textarea"
              rows={3}
            />
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={loading}
              className="flex w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1"
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              {mode === "edit" ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <ApperIcon name={mode === "edit" ? "Save" : "UserPlus"} size={16} className="mr-2" />
              {mode === "edit" ? "Update Client" : "Create Client"}
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ClientModal;