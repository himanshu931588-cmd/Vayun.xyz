import { InvoiceData } from '../types';

const PROFILE_KEY = 'docukit_saved_business_profile';
const INVOICES_KEY = 'docukit_saved_invoices';

export interface SavedBusinessProfile {
  name: string;
  email: string;
  address: string;
  phone: string;
  taxId: string;
  logo?: string;
  paymentDetails: {
    bankName?: string;
    accountNumber?: string;
    routingCode?: string;
    stripePaymentUrl?: string;
    paypalEmail?: string;
    upiId?: string;
  };
}

export function saveBusinessProfile(profile: SavedBusinessProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage:', e);
  }
}

export function loadBusinessProfile(): SavedBusinessProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveInvoiceRecord(invoice: InvoiceData): void {
  try {
    const invoices = listSavedInvoices();
    const existingIndex = invoices.findIndex(i => i.id === invoice.id);
    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.unshift(invoice);
    }
    // Limit to latest 30 invoices
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices.slice(0, 30)));
  } catch (e) {
    console.error('Failed to save invoice:', e);
  }
}

export function listSavedInvoices(): InvoiceData[] {
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getInvoiceById(id: string): InvoiceData | null {
  const list = listSavedInvoices();
  return list.find(i => i.id === id) || null;
}

/**
 * Encodes an invoice into a safe Base64 URL parameter for instant zero-server PayLinks
 */
export function encodePayLink(invoice: InvoiceData): string {
  try {
    // Exclude oversized thumbnails from URL payload to stay within URL length bounds
    const slim = {
      ...invoice,
      items: invoice.items.map(item => ({
        ...item,
        receiptThumbnail: undefined
      }))
    };
    const json = JSON.stringify(slim);
    // Base64 encode safe for UTF-8
    const base64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return base64;
  } catch (e) {
    console.error('Error encoding paylink:', e);
    return '';
  }
}

/**
 * Decodes an invoice from a Base64 string
 */
export function decodePayLink(encoded: string): InvoiceData | null {
  try {
    const json = decodeURIComponent(Array.prototype.map.call(atob(encoded), (c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch (e) {
    console.error('Error decoding paylink:', e);
    return null;
  }
}
