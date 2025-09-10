import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderApi } from '../lib/api';
import { Reminder, CreateReminderData } from '../types';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Check,
  Bell,
  Repeat
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReminderModal from '../components/ReminderModal';

const Reminders: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: remindersData, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => reminderApi.getReminders(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateReminderData) => reminderApi.createReminder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder created successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create reminder');
    },
  });

  const markDoneMutation = useMutation({
    mutationFn: (id: string) => reminderApi.markDone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder marked as done');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark reminder as done');
    },
  });

  const reminders = remindersData?.data.reminders || [];
  const activeReminders = reminders.filter(r => !r.done);
  const completedReminders = reminders.filter(r => r.done);

  const handleCreateReminder = (data: CreateReminderData) => {
    createMutation.mutate(data);
  };

  const handleMarkDone = (id: string) => {
    markDoneMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRepeatLabel = (repeat?: string) => {
    switch (repeat) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Once';
    }
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
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
          <h1 className="text-2xl font-bold text-gray-900">Health Reminders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Stay on top of your health appointments and medications
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Bell className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Reminders</p>
              <p className="text-2xl font-bold text-gray-900">{activeReminders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeReminders.filter(r => isOverdue(r.remindAt)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <Check className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedReminders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Reminders */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Reminders</h2>
        {activeReminders.length === 0 ? (
          <div className="card text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No active reminders</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first reminder to stay on track with your health.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeReminders.map((reminder) => (
              <div
                key={reminder._id}
                className={`card ${
                  isOverdue(reminder.remindAt) 
                    ? 'border-l-4 border-l-red-500 bg-red-50' 
                    : 'border-l-4 border-l-primary-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {reminder.title}
                      </h3>
                      {isOverdue(reminder.remindAt) && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    {reminder.message && (
                      <p className="mt-1 text-sm text-gray-600">{reminder.message}</p>
                    )}
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(reminder.remindAt)}
                      </div>
                      <div className="flex items-center">
                        <Repeat className="h-4 w-4 mr-1" />
                        {getRepeatLabel(reminder.repeat)}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleMarkDone(reminder._id)}
                    className="btn-success ml-4"
                    disabled={markDoneMutation.isPending}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Completed</h2>
          <div className="space-y-4">
            {completedReminders.slice(0, 5).map((reminder) => (
              <div key={reminder._id} className="card bg-gray-50 opacity-75">
                <div className="flex items-center">
                  <div className="p-2 bg-success-100 rounded-lg">
                    <Check className="h-4 w-4 text-success-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-through">
                      {reminder.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Completed • {getRepeatLabel(reminder.repeat)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateReminder}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};

export default Reminders;