enum UserCategory {
    Management = 'management',
    TeachingStaff = 'teaching_staff',
    NonTeachingStaff = 'non_teaching_staff',
    Student = 'student',
    Union = 'union'
}

type createUserType {
    name: string;
    admissionNumber: string;
    email: string;
    password: string;
    role: string;
    userCategory: UserCategory;
    mobileNumber: string;
}

type getUserType {   // for getting the user after every other thing
    _id : string;
    name : string;
    admissionNumber : string;
    email : string;
    password : string;
    role : string;
    userCategory : UserCategory;
    credits : number;
    mobileNumber : string;
}

type updateUserType {
    name : string;
    admissionNumber : string;
    email : string;
    password : string;
    role : string;
    userCategory : UserCategory;
    mobileNumber : string;
}

type loginType {
    email : string;
    admissionNumber : string;
    password : string;
}

type createMenuType {
    vendorId: string;
    items: [{   
        name: string;
        calories: string;
        description: string;
        price: number;
        availability: boolean;
        orderQuantity: number;   // update with orders
        maxOrderQuantity: number;
    }];
}

type getMenuType {
    _id: string;
    vendorId: string;
    items: [{
        name: string;
        calories: string;
        description: string;
        price: number;
        availability: boolean;
        orderQuantity: number;   // update with orders
        maxOrderQuantity: number;
    }];
}

type updateMenuType = Partial<getMenuType>;

type createOrderType {
    userId: string;
    menuItems: [{
        menuItemId: string;
        calories: string;
        name: string;
        price: number;
        quantity: number;
        totalPrice: number;
    }];
    totalAmount: number;
    deliveryTime: string;
    vendorId: string;
    name: string;
    email: string;
    mobileNumber: string;
}

type getOrderType {
    _id: string;
    userId: string;
    menuItems: [{
        menuItemId: string;
        calories: string;
        name: string;
        price: number;
        quantity: number;
        totalPrice: number;
    }];
    totalAmount: number;
    deliveryTime: string;
    vendorId: string;
    name: string;
    email: string;
    mobileNumber: string;
}

type updateOrderType = Partial<getOrderType>;

type createReviewType {
    userId: string;
    vendorId: string;
    reviewItem: {
        menuItemId: string;
        score: number;
        description: string;
    };
    name: string;
    email: string;
    mobileNumber: string;
}

type getReviewType {
    _id: string;
    userId: string;
    vendorId: string;
    reviewItem: {
        menuItemId: string;
        score: number;
        description: string;
    };
    name: string;
    email: string;
    mobileNumber: string;
}

type updateReviewType = Partial<getReviewType>;

export { UserCategory };
export type { createUserType, getUserType, updateUserType, loginType, createMenuType, getMenuType, updateMenuType, createOrderType, getOrderType, updateOrderType, createReviewType, getReviewType, updateReviewType };
