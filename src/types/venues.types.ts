export interface ISpot {
  id: number;
  name: string;
  address: string | null;
}

export interface IWorkSchedule {
  dayOfWeek: number;
  dayName: string;
  workStart: string | null;
  workEnd: string | null;
  isDayOff?: boolean;
  is24h?: boolean;
}

export interface IVenues {
  colorTheme: string;
  companyName: string;
  slug: string;
  logo: string;
  // Optional description for meta tags (SEO)
  description?: string | null;
  schedule: string;
  serviceFeePercent: number;
  // Delivery pricing
  deliveryFixedFee?: string | number;
  deliveryFreeFrom?: string | number | null;
  // Free-form delivery cost label (e.g. "Оплата за счёт клиента"). When set, it
  // is shown instead of the numeric fee and delivery is excluded from the total.
  deliveryFeeLabel?: string | null;
  // Estimated delivery time label, fully formatted by the backend (e.g. "1–2 дня"
  // or "~30 мин"); hide the chip when null.
  deliveryTime?: string | null;
  // Co-branded venue header ("Powered by iShop.kg") toggle from backend.
  isCoBranded?: boolean;
  // Optional weekly schedule from backend
  schedules?: IWorkSchedule[];
  defaultDeliverySpot?: number | null;
  table: {
    id: number;
    tableNum: string;
  };
  spots?: ISpot[];
  activeSpot: number;
  isDeliveryAvailable: boolean;
  isTakeoutAvailable: boolean;
  isDineinAvailable: boolean;
  phoneNumber?: string | null;
}
