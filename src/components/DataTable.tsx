import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface LogRecord {
  [key: string]: string | number;
}

interface DataTableProps {
  data: LogRecord[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const itemsPerPage = 10;

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const displayColumns = useMemo(() => {
    if (selectedColumns.length === 0) {
      // Show key columns by default
      return columns.slice(0, 8);
    }
    return selectedColumns;
  }, [columns, selectedColumns]);

  const filteredData = useMemo(() => {
    return data.filter(record =>
      Object.values(record).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(col => col !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const formatValue = (value: string | number): string => {
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return String(value);
  };

  return (
    <div className="h-[600px] flex flex-col">
      {/* Search and Column Selection */}
      <div className="p-4 space-y-4 border-b border-gray-200/50">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {columns.slice(0, 12).map(column => (
            <button
              key={column}
              onClick={() => toggleColumn(column)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                displayColumns.includes(column)
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {displayColumns.includes(column) ? (
                <Eye className="w-3 h-3 mr-1" />
              ) : (
                <EyeOff className="w-3 h-3 mr-1" />
              )}
              {column.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 sticky top-0">
            <tr>
              {displayColumns.map(column => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200/50"
                >
                  {column.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white/50 backdrop-blur-sm">
            {paginatedData.map((record, index) => (
              <tr
                key={index}
                className="hover:bg-blue-50/50 transition-colors duration-150 border-b border-gray-200/30"
              >
                {displayColumns.map(column => (
                  <td
                    key={column}
                    className="px-4 py-3 text-gray-900 border-b border-gray-200/20"
                    title={String(record[column])}
                  >
                    {formatValue(record[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;