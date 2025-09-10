import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { exportApi } from '../lib/api';
import { Download, FileText, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const Export: React.FC = () => {
  const exportPdfMutation = useMutation({
    mutationFn: () => exportApi.exportPdf(),
    onSuccess: (response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'health-records.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export PDF');
    },
  });

  const exportJsonMutation = useMutation({
    mutationFn: () => exportApi.exportJson(),
    onSuccess: (response) => {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'health-records.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('JSON exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export JSON');
    },
  });

  const handleExportPdf = () => {
    exportPdfMutation.mutate();
  };

  const handleExportJson = () => {
    exportJsonMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Export Health Data</h1>
        <p className="mt-1 text-sm text-gray-600">
          Download your health records in different formats for backup or sharing
        </p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Export */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">PDF Export</h3>
              <p className="text-sm text-gray-600">Formatted document for printing</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Professional formatting
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Ready for printing
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Easy to share with doctors
            </div>
          </div>
          
          <button
            onClick={handleExportPdf}
            disabled={exportPdfMutation.isPending}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportPdfMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating PDF...
              </div>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </>
            )}
          </button>
        </div>

        {/* JSON Export */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">JSON Export</h3>
              <p className="text-sm text-gray-600">Structured data for backup</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Complete data backup
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Machine-readable format
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Easy data migration
            </div>
          </div>
          
          <button
            onClick={handleExportJson}
            disabled={exportJsonMutation.isPending}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportJsonMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating JSON...
              </div>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </>
            )}
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-semibold text-blue-900">Data Privacy & Security</h3>
            <div className="mt-2 text-sm text-blue-800 space-y-1">
              <p>• Your health data is encrypted and secure</p>
              <p>• Exports include all your health records and notes</p>
              <p>• Files are generated locally and not stored on our servers</p>
              <p>• Keep your exported files in a secure location</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;