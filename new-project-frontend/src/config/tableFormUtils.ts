// tableFormUtils.ts

import { FieldConfig, TableConfig } from './tableFormConfig';

// Generate table columns from config
export const generateTableColumns = (config: TableConfig) => {
  return Object.entries(config.fields)
    .filter(([_, field]) => !field.hidden)
    .map(([key, field]) => ({
      key,
      label: field.label,
      render: field.render,
      sortable: field.type === 'text' || field.type === 'number' || field.type === 'datetime'
    }));
};

// Generate form fields from config
export const generateFormFields = (config: TableConfig) => {
  return Object.entries(config.fields)
    .filter(([_, field]) => !field.hidden)
    .map(([key, field]) => ({
      key,
      label: field.label,
      type: field.type,
      required: field.required,
      validation: field.validation,
      options: field.options,
      arrayConfig: field.arrayConfig,
      objectConfig: field.objectConfig
    }));
};

// Example usage:
/* 
import { userConfig } from './tableFormConfig';

// For tables
const userColumns = generateTableColumns(userConfig.get);

// For forms
const createUserFields = generateFormFields(userConfig.create);
*/