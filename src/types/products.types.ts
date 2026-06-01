export interface ICategory {
  id: number;
  categoryName: string;
}

export interface IFoodCart {
  id: string;
  article?: string | null;
  productName: string;
  productDescription: string | null;
  productPrice: number;
  weight: number;
  // TODO: добавить на бэке — единица измерения веса/объёма ("мл", "гр" и т.п.)
  measureUnit?: string | null;
  productPhoto: string;
  category: ICategory;
  quantity: number;
  availableQuantity?: number;
  modificators?: IModificator;
}

export interface IModificator {
  id: number;
  name: string;
  price: number;
}

export interface IProduct {
  id: number;
  // Human-readable article/SKU from backend (format {SLUG}-{NNNN}); may be null.
  article?: string | null;
  productName: string;
  productDescription: string | null;
  productPrice: number;
  weight: number;
  // TODO: добавить на бэке — единица измерения веса/объёма ("мл", "гр" и т.п.)
  measureUnit?: string | null;
  productPhoto: string;
  productPhotoSmall: string;
  productPhotoLarge: string;
  category?: ICategory;
  categories?: ICategory[];
  modificators: IModificator[];
  isRecommended: boolean;
  quantity: number;
}

export interface IOrderProduct {
  venueSlug: string,
  spotSlug: string,
  tableNum?: string,
  phone: string,
  comment: string,
  serviceMode: number,
  servicePrice: string,
  tipsPrice: string,
  orderProducts: {
    product: number,
    count: number,
    modificator?: number
  }[]
}
