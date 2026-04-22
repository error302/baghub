import axios from 'axios';
import prisma from '../db';

// M-Pesa Daraja API configuration
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const PASSKEY = process.env.MPESA_PASSKEY || '';
const BUSINESS_SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://maisonelise.co.ke/api/payments/mpesa/callback';
const BASE_URL = process.env.MPESA_ENV === 'production' 
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

export interface IMpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: {
          Name: string;
          Value: string | number;
        }[];
      };
    };
  };
}

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage?: string;
}

/**
 * Get M-Pesa access token
 */
export const getAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  
  const response = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  
  return response.data.access_token;
};

/**
 * Generate password for STK push
 */
const generatePassword = (timestamp: string): string => {
  const data = Buffer.from(`${BUSINESS_SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
  return data;
};

/**
 * Get formatted timestamp
 */
const getTimestamp = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

/**
 * Format phone number to required format (254XXXXXXXXX)
 */
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Remove leading 0 and add 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  
  // Add 254 if not present
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
};

/**
 * Initiate M-Pesa STK Push
 */
export const initiateStkPush = async (
  phoneNumber: string,
  amount: number,
  orderNumber: string,
  orderId: string
): Promise<StkPushResponse> => {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = generatePassword(timestamp);
  
  const requestBody = {
    BusinessShortCode: BUSINESS_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(amount),
    PartyA: formatPhoneNumber(phoneNumber),
    PartyB: BUSINESS_SHORTCODE,
    PhoneNumber: formatPhoneNumber(phoneNumber),
    CallBackURL: CALLBACK_URL,
    AccountReference: orderNumber.substring(0, 12),
    TransactionDesc: `Payment for order ${orderNumber}`,
  };
  
  const response = await axios.post(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data;
};

/**
 * Handle M-Pesa callback
 */
export const handleCallback = async (callbackData: IMpesaCallback): Promise<void> => {
  const { stkCallback } = callbackData.Body;
  const { 
    MerchantRequestID, 
    CheckoutRequestID, 
    ResultCode, 
    ResultDesc,
    CallbackMetadata 
  } = stkCallback;
  
  // Find payment by checkout request ID
  const payment = await prisma.payment.findFirst({
    where: {
      transactionId: CheckoutRequestID,
    },
    include: {
      order: true,
    },
  });
  
  if (!payment) {
    console.error('Payment not found for callback:', CheckoutRequestID);
    return;
  }
  
  if (ResultCode === 0) {
    // Payment successful
    const metadata = CallbackMetadata?.Item || [];
    const mpesaReceipt = metadata.find(
      (item: { Name: string; Value: string | number }) => item.Name === 'MpesaReceiptNumber'
    )?.Value;
    
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'completed',
          transactionId: mpesaReceipt as string,
          response: callbackData as unknown as Record<string, unknown>,
        },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: 'completed',
          mpesaReceipt: mpesaReceipt as string,
          status: 'confirmed',
          confirmedAt: new Date(),
        },
      }),
    ]);
  } else {
    // Payment failed
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'failed',
        response: callbackData as unknown as Record<string, unknown>,
      },
    });
  }
};

/**
 * Query STK push status
 */
export const queryStkPush = async (checkoutRequestId: string): Promise<unknown> => {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = generatePassword(timestamp);
  
  const requestBody = {
    BusinessShortCode: BUSINESS_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };
  
  const response = await axios.post(
    `${BASE_URL}/mpesa/stkpushquery/v1/query`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data;
};

export default {
  getAccessToken,
  initiateStkPush,
  handleCallback,
  queryStkPush,
};
