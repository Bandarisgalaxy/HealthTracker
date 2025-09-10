import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CreateReminderData } from '../types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReminderData) => void;
  isLoading: boolean;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateReminderData>({
    title: '',
    message: '',
    remindAt: '',
    repeat: 'none',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      message: '',
      remindAt: '',
      repeat: 'none',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Get current date and time for min attribute
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Health Reminder</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              name="title"
              className="input"
              placeholder="e.g., Take blood pressure medication"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Message (Optional)</label>
            <textarea
              name="message"
              className="input resize-none"
              rows={3}
              placeholder="Additional details or instructions..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Remind Me At</label>
            <input
              type="datetime-local"
              name="remindAt"
              className="input"
              min={minDateTime}
              value={formData.remindAt}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Repeat</label>
            <select
              name="repeat"
              className="input"
              value={formData.repeat}
              onChange={handleChange}
            >
              <option value="none">No Repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Reminder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;