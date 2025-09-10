import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthApi } from '../lib/api';
import { HealthRecord, CreateHealthRecordData } from '../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Filter,
  Heart,
  Activity,
  Pill,
  Stethoscope,
  Shield,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import HealthRecordModal from '../components/HealthRecordModal';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  
  const queryClient = useQueryClient();

  const { data: recordsData, isLoading } = useQuery({
    queryKey: ['health-records'],
    queryFn: () => healthApi.getRecords(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateHealthRecordData) => healthApi.createRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      toast.success('Health record created successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create record');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateHealthRecordData> }) =>
      healthApi.updateRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      toast.success('Health record updated successfully');
      setIsModalOpen(false);
      setEditingRecord(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update record');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => healthApi.deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      toast.success('Health record deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete record');
    },
  });

  const records = recordsData?.data.records || [];

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateRecord = (data: CreateHealthRecordData) => {
    createMutation.mutate(data);
  };

  const handleUpdateRecord = (data: CreateHealthRecordData) => {
    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data });
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditRecord = (record: HealthRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'allergy': return <Shield className="h-5 w-5" />;
      case 'vital': return <Activity className="h-5 w-5" />;
      case 'prescription': return <Pill className="h-5 w-5" />;
      case 'visit': return <Stethoscope className="h-5 w-5" />;
      case 'vaccination': return <Shield className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'allergy': return 'text-red-600 bg-red-50';
      case 'vital': return 'text-blue-600 bg-blue-50';
      case 'prescription': return 'text-green-600 bg-green-50';
      case 'visit': return 'text-purple-600 bg-purple-50';
      case 'vaccination': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your personal health information securely
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            className="input pl-10 pr-8"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="allergy">Allergies</option>
            <option value="vital">Vitals</option>
            <option value="prescription">Prescriptions</option>
            <option value="visit">Visits</option>
            <option value="vaccination">Vaccinations</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No health records</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first health record.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <div key={record.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getRecordColor(record.type)}`}>
                    {getRecordIcon(record.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{record.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{record.type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRecord(record)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {record.notes && Object.keys(record.notes).length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notes:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {Object.entries(record.notes).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(record.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <HealthRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={editingRecord ? handleUpdateRecord : handleCreateRecord}
        initialData={editingRecord}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default Dashboard;