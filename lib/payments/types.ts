export type PaymentStatus = 'CREATED' | 'ATTEMPTED' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type PaymentOrderType = 'TIFFIN_ORDER' | 'AGENCY_SERVICE' | 'SUBSCRIPTION' | 'CUSTOM_PAYMENT';

export type PaymentCartItemInput = {
  key: string;
  qty: number;
  title?: string;
  price?: number;
};

export type PaymentCustomer = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  flatNumber?: string;
  address?: string;
};

export type CreatePaymentOrderInput = PaymentCustomer & {
  amount?: number;
  currency?: string;
  ventureId: string;
  ventureName?: string;
  cartItems?: PaymentCartItemInput[];
  notes?: Record<string, unknown>;
  orderType?: PaymentOrderType;
};

export type ValidatedPaymentOrder = Required<Pick<CreatePaymentOrderInput, 'currency' | 'ventureId' | 'ventureName' | 'orderType'>> &
  PaymentCustomer & {
    amount: number;
    amountPaise: number;
    cartItems: PaymentCartItemInput[];
    notes: Record<string, unknown>;
    serverSummary: {
      subtotal?: number;
      discount?: number;
      couponCode?: string;
      validationSource: string;
    };
  };

export type StoredPaymentOrder = ValidatedPaymentOrder & {
  id: string;
  receipt: string;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicPaymentOrder = Omit<StoredPaymentOrder, 'razorpaySignature'>;
