// tableFormConfig.ts

enum UserCategory {
    Management = 'management',
    TeachingStaff = 'teaching_staff',
    NonTeachingStaff = 'non_teaching_staff',
    Student = 'student',
    Union = 'union'
}

// Configuration types
type FieldConfig = {
    label: string;
    type: 'text' | 'password' | 'email' | 'select' | 'number' | 'array' | 'object' | 'boolean' | 'datetime';
    required?: boolean;
    options?: { label: string; value: string }[];
    validation?: {
        pattern?: RegExp;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        message?: string;
    };
    hidden?: boolean;
    render?: (value: any) => React.ReactNode;
    arrayConfig?: FieldConfig;
    objectConfig?: Record<string, FieldConfig>;
};

type TableConfig = {
    title: string;
    fields: Record<string, FieldConfig>;
};

// User Configurations
export const userConfig: Record<string, TableConfig> = {
    create: {
        title: 'Create User',
        fields: {
            name: {
                label: 'Name',
                type: 'text',
                required: true,
                validation: {
                    minLength: 2,
                    maxLength: 50,
                    message: 'Name must be between 2 and 50 characters'
                }
            },
            admissionNumber: {
                label: 'Admission Number',
                type: 'text',
                required: true
            },
            email: {
                label: 'Email',
                type: 'email',
                required: true,
                validation: {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                }
            },
            password: {
                label: 'Password',
                type: 'password',
                required: true,
                hidden: true,
                validation: {
                    minLength: 6,
                    message: 'Password must be at least 6 characters long'
                }
            },
            role: {
                label: 'Role',
                type: 'text',
                required: true
            },
            userCategory: {
                label: 'User Category',
                type: 'select',
                required: true,
                options: Object.entries(UserCategory).map(([label, value]) => ({
                    label,
                    value
                }))
            },
            mobileNumber: {
                label: 'Mobile Number',
                type: 'text',
                required: true,
                validation: {
                    pattern: /^\+?[1-9]\d{9,11}$/,
                    message: 'Please enter a valid mobile number'
                }
            }
        }
    },
    get: {
        title: 'Users',
        fields: {
            _id: {
                label: 'ID',
                type: 'text',
                hidden: true
            },
            name: {
                label: 'Name',
                type: 'text'
            },
            admissionNumber: {
                label: 'Admission Number',
                type: 'text'
            },
            email: {
                label: 'Email',
                type: 'email'
            },
            role: {
                label: 'Role',
                type: 'text'
            },
            userCategory: {
                label: 'Category',
                type: 'select',
                options: Object.entries(UserCategory).map(([label, value]) => ({
                    label,
                    value
                }))
            },
            credits: {
                label: 'Credits',
                type: 'number',
                render: (value) => `₹${value}`
            },
            mobileNumber: {
                label: 'Mobile',
                type: 'text'
            }
        }
    }
};

// Menu Configurations
export const menuConfig: Record<string, TableConfig> = {
    create: {
        title: 'Create Menu',
        fields: {
            vendorId: {
                label: 'Vendor ID',
                type: 'text',
                required: true
            },
            items: {
                label: 'Menu Items',
                type: 'array',
                arrayConfig: {
                    type: 'object',
                    objectConfig: {
                        name: {
                            label: 'Item Name',
                            type: 'text',
                            required: true
                        },
                        calories: {
                            label: 'Calories',
                            type: 'text',
                            required: true
                        },
                        description: {
                            label: 'Description',
                            type: 'text',
                            required: true
                        },
                        price: {
                            label: 'Price',
                            type: 'number',
                            required: true,
                            validation: {
                                min: 0
                            }
                        },
                        availability: {
                            label: 'Available',
                            type: 'boolean',
                            required: true
                        },
                        maxOrderQuantity: {
                            label: 'Max Order Quantity',
                            type: 'number',
                            required: true,
                            validation: {
                                min: 1
                            }
                        }
                    },
                    label: ""
                }
            }
        }
    },
    get: {
        title: 'Menu',
        fields: {
            _id: {
                label: 'ID',
                type: 'text',
                hidden: true
            },
            vendorId: {
                label: 'Vendor',
                type: 'text'
            },
            items: {
                label: 'Items',
                type: 'array',
                arrayConfig: {
                    type: 'object',
                    objectConfig: {
                        name: {
                            label: 'Name',
                            type: 'text'
                        },
                        price: {
                            label: 'Price',
                            type: 'number',
                            render: (value) => `₹${value}`
                        },
                        availability: {
                            label: 'Available',
                            type: 'boolean'
                        },
                        orderQuantity: {
                            label: 'Orders',
                            type: 'number'
                        }
                    },
                    label: ""
                }
            }
        }
    }
};

// Order Configurations
export const orderConfig: Record<string, TableConfig> = {
    create: {
        title: 'Create Order',
        fields: {
            userId: {
                label: 'User ID',
                type: 'text',
                required: true
            },
            menuItems: {
                label: 'Items',
                type: 'array',
                arrayConfig: {
                    label: 'Menu Items',
                    type: 'object',
                    objectConfig: {
                        menuItemId: {
                            label: 'Item ID',
                            type: 'text',
                            required: true
                        },
                        quantity: {
                            label: 'Quantity',
                            type: 'number',
                            required: true,
                            validation: {
                                min: 1
                            }
                        }
                    }
                }
            },
            deliveryTime: {
                label: 'Delivery Time',
                type: 'datetime',
                required: true
            }
        }
    },
    get: {
        title: 'Orders',
        fields: {
            _id: {
                label: 'Order ID',
                type: 'text'
            },
            name: {
                label: 'Customer',
                type: 'text'
            },
            totalAmount: {
                label: 'Total',
                type: 'number',
                render: (value) => `₹${value}`
            },
            deliveryTime: {
                label: 'Delivery',
                type: 'datetime',
                render: (value) => new Date(value).toLocaleString()
            },
            menuItems: {
                label: 'Items',
                type: 'array',
                arrayConfig: {
                    type: 'object',
                    objectConfig: {
                        name: {
                            label: 'Item',
                            type: 'text'
                        },
                        quantity: {
                            label: 'Qty',
                            type: 'number'
                        },
                        totalPrice: {
                            label: 'Price',
                            type: 'number',
                            render: (value) => `₹${value}`
                        }
                    },
                    label: ""
                }
            }
        }
    }
};

// Review Configurations
export const reviewConfig: Record<string, TableConfig> = {
    create: {
        title: 'Create Review',
        fields: {
            userId: {
                label: 'User ID',
                type: 'text',
                required: true
            },
            vendorId: {
                label: 'Vendor ID',
                type: 'text',
                required: true
            },
            reviewItem: {
                label: 'Review',
                type: 'object',
                objectConfig: {
                    menuItemId: {
                        label: 'Item ID',
                        type: 'text',
                        required: true
                    },
                    score: {
                        label: 'Rating',
                        type: 'number',
                        required: true,
                        validation: {
                            min: 1,
                            max: 5
                        }
                    },
                    description: {
                        label: 'Comment',
                        type: 'text',
                        required: true
                    }
                }
            }
        }
    },
    get: {
        title: 'Reviews',
        fields: {
            _id: {
                label: 'ID',
                type: 'text',
                hidden: true
            },
            name: {
                label: 'Customer',
                type: 'text'
            },
            reviewItem: {
                label: 'Review',
                type: 'object',
                objectConfig: {
                    score: {
                        label: 'Rating',
                        type: 'number',
                        render: (value) => '⭐'.repeat(value)
                    },
                    description: {
                        label: 'Comment',
                        type: 'text'
                    }
                }
            }
        }
    }
};


// In tableFormConfig.ts
export const loginConfig: TableConfig = {
    title: 'Login',
    fields: {
      email: {
        label: 'Email',
        type: 'email',
        required: true,
        validation: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Please enter a valid email'
        }
      },
      admissionNumber: {
        label: 'Admission Number',
        type: 'text',
        required: true
      },
      password: {
        label: 'Password',
        type: 'password',
        required: true
      }
    }
  };

export { UserCategory };
export type { FieldConfig, TableConfig};