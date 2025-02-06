export interface AddressAttributes {
    id: number;
    userId: number;
    createdBy: String;
    updatedBy: number;
    street: string;
    externalNumber: string;
    internalNumber?: string;
    postalCode: string;
    propertyType?: string;
    notes?: string;
    isDefault: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }