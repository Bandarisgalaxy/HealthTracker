import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { HealthRecord, CreateHealthRecordData } from '../types';

interface HealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHealthRecordData) => void;
  initialData?: HealthRecord | null;
  isLoading: boolean;
}

const HealthRecordModal: React.FC<HealthRecordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateHealthRecordData>({
    type: 'other',
    title: '',
    notes: {},
    meta: {},
  });

  const [notesFields, setNotesFields] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        title: initialData.title,
        notes: initialData.notes || {},
        meta: initialData.meta || {},
      });
      
      // Convert notes object to array for editing
      const notesArray = Object.entries(initialData.notes || {}).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      setNotesFields(notesArray.length > 0 ? notesArray : [{ key: '', value: '' }]);
    } else {
      setFormData({
        type: 'other',
        title: '',
        notes: {},
        meta: {},
      });
      setNotesFields([{ key: '', value: '' }]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert notes fields array back to object
    const notesObject: any = {};
    notesFields.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) {
        notesObject[key.trim()] = value.trim();
      }
    });

    onSubmit({
      ...formData,
      notes: notesObject,
    });
  };

  const addNotesField = () => {
    setNotesFields([...notesFields, { key: '', value: '' }]);
  };

  const removeNotesField = (index: number) => {
    if (notesFields.length > 1) {
      setNotesFields(notesFields.filter((_, i) => i !== index));
    }
  };

  const updateNotesField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...notesFields];
    updated[index][field] = value;
    setNotesFields(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Health Record' : 'Add Health Record'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Record Type</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                required
              >
                <option value="allergy">Allergy</option>
                <option value="vital">Vital Signs</option>
                <option value="prescription">Prescription</option>
                <option value="visit">Doctor Visit</option>
                <option value="vaccination">Vaccination</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Title</label>
              <input
                type="text"
                className="input"
                placeholder="Enter record title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Notes & Details</label>
              <button
                type="button"
                onClick={addNotesField}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                + Add Field
              </button>
            </div>
            
            <div className="space-y-3">
              {notesFields.map((field, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Field name (e.g., Blood Pressure)"
                    className="input flex-1"
                    value={field.key}
                    onChange={(e) => updateNotesField(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., 120/80)"
                    className="input flex-1"
                    value={field.value}
                    onChange={(e) => updateNotesField(index, 'value', e.target.value)}
                  />
                  {notesFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNotesField(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
                  {initialData ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                initialData ? 'Update Record' : 'Create Record'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthRecordModal;