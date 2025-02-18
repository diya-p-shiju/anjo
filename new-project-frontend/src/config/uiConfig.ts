// uiConfig.ts

// Table UI Configuration
export const tableStyles = {
    // Main container
    container: "w-full bg-white rounded-lg shadow-sm",
    
    // Table header section
    header: {
      wrapper: "p-6 border-b border-gray-200",
      title: "text-xl font-semibold text-gray-800",
      topRow: "flex items-center justify-between mb-4",
      actions: "flex items-center space-x-4",
      
      // Search input
      search: {
        wrapper: "relative",
        input: "pl-10 pr-4 py-2 w-64 bg-[#0F1F0F] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500",
        icon: "absolute left-3 top-2.5 h-4 w-4 text-gray-400"
      },
      
      // Filter buttons
      filters: {
        wrapper: "flex space-x-2",
        button: "px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
      }
    },
    
    // Main table
    table: {
      wrapper: "w-full min-w-full divide-y divide-gray-200",
      header: {
        row: "bg-[#1A2E1A]",
        cell: "px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
      },
      body: {
        row: "hover:bg-gray-50 transition-colors",
        cell: "px-6 py-4 whitespace-nowrap text-sm text-gray-600",
        link: "text-green-600 hover:text-green-700"
      }
    },
    
    // Status badges
    status: {
      success: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
      pending: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
      error: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
    },
    
    // Pagination
    pagination: {
      wrapper: "px-6 py-3 flex items-center justify-between border-t border-gray-200",
      button: "px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50",
      text: "text-sm text-gray-600"
    }
  };
  
  // Form UI Configuration
  export const formStyles = {
    // Form container
    container: "max-w-2xl mx-auto bg-white rounded-lg shadow-sm",
    
    // Form header
    header: {
      wrapper: "px-6 py-4 border-b border-gray-200",
      title: "text-xl font-semibold text-gray-800"
    },
    
    // Form content
    content: {
      wrapper: "p-6 space-y-6",
      section: "space-y-4"
    },
    
    // Form fields
    field: {
      wrapper: "space-y-1",
      label: "block text-sm font-medium text-gray-700",
      required: "text-red-500 ml-1",
      
      // Input types
      input: {
        text: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm",
        select: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm",
        textarea: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm",
        checkbox: "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded",
        radio: "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
      },
      
      // Helper text
      helper: "mt-1 text-sm text-gray-500",
      error: "mt-1 text-sm text-red-600"
    },
    
    // Form actions
    actions: {
      wrapper: "px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg",
      submit: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
      cancel: "px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    }
  };
  
  // Example usage of the Table UI
