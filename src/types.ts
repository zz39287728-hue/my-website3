export enum ProjectStage {
  CONCEPT = 'Site Analysis & Concept Inception',
  LAYOUTS = '2D Spatial Layouts & Planning',
  RENDERS = '3D High-Fidelity Modeling & 4K Renders',
  SPECIFICATIONS = 'FF&E Schedules, Material Sourcing & Specifications',
  CONSTRUCTION = 'Construction Documents, MEP & Site Supervision',
  HANDOVER = 'Final Handover, Furniture Staging & Lighting Fine-Tuning'
}

export enum StageStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  UPCOMING = 'UPCOMING'
}

export interface Milestone {
  id: string;
  stage: ProjectStage;
  status: StageStatus;
  progress: number;
  date?: string;
  weight: number; // Percentage weight of this stage towards total completion
  attachment?: { name: string; url: string };
}

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  tier: string;
  project: string;
  area: string;
  avatar: string;
  completion: number;
  style: string;
  location: string;
  status: 'Active' | 'Archived';
  freeConsultations: number; // Number of free consultations remaining
  onboardingCompleted?: boolean;
  designPreferences?: Record<string, string>;
  isGuest?: boolean;
}

export interface ArchitectProfile {
  name: string;
  title: string;
  avatar: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Revision';
  img: string;
}

export interface InvoiceItem {
  id: string;
  desc: string;
  amount: number;
  category?: string;
}

export interface InvoiceData {
  id: string;
  date: string;
  items: InvoiceItem[];
  status: 'Pending' | 'Paid';
  paymentMethod?: 'BenefitPay' | 'Credit Card';
  paidAt?: string;
  transactionId?: string;
}

export interface CartItem {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  type: 'package' | 'service' | 'milestone';
  packageId?: string;
  features?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'ARCHITECT' | 'CLIENT' | 'SUPPORT' | string;
  recipient?: 'ARCHITECT' | 'CLIENT' | 'SUPPORT' | string;
  text: string;
  attachment?: { name: string; size: string; url?: string; type?: string };
  attachments?: { name: string; size: string; url?: string; type?: string }[];
  actionItem?: {
    type: 'PAYMENT' | 'APPROVAL' | 'MEETING';
    title: string;
    amount?: number;
    completed?: boolean;
  };
  timestamp: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
}

export interface ContractItem {
  id: string;
  referenceNumber: string;
  title: string;
  titleAr?: string;
  type: string;
  typeAr?: string;
  description: string;
  descriptionAr?: string;
  clauses?: string[];
  clausesAr?: string[];
  totalValue?: number;
  dateCreated: string;
  status: 'Pending' | 'Signed' | 'Sealed';
  isSignedByClient: boolean;
  isSealedByArchitect: boolean;
  signedAt?: string;
  sealedAt?: string;
  signatureDataUrl?: string;
  signeeName?: string;
  architectNotes?: string;
}

export interface ContractData {
  isSignedByClient: boolean;
  isSealedByArchitect: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'Under Review' | 'In Progress' | 'Resolved';
  date: string;
  architectNotes?: string;
}

export interface Booking {
  id: string;
  date: string; // ISO string format YYYY-MM-DD
  time: string; // e.g., "09:00"
  durationHours: number; // e.g., 2
  type: 'In-Studio' | 'Virtual' | 'Site Visit';
  status: 'Pending' | 'Confirmed' | 'Rescheduled' | 'Awaiting Payment' | 'Awaiting Confirmation' | 'Cancelled' | 'Rejected';
  initiatedBy: 'CLIENT' | 'ARCHITECT';
  cost?: number;
  isGuestBooking?: boolean;
  guestPhone?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ClientFile {
  id: string;
  name: string;
  type: string;
  url: string;
  date: string;
  size?: string;
}

export interface ClientFolder {
  id: string;
  name: string;
  description?: string;
  files: ClientFile[];
}

export interface PinterestReference {
  id: string;
  url: string;
  category?: string;
  note?: string;
  dateAdded: string;
}

export interface ClientProjectData {
  profile: UserProfile;
  milestones: Milestone[];
  materials: MaterialItem[];
  folders?: ClientFolder[];
  pinterestReferences?: PinterestReference[];
  invoice: InvoiceData;
  paidInvoices?: InvoiceData[];
  cart?: CartItem[];
  chatHistory: ChatMessage[];
  contract: ContractData;
  contracts?: ContractItem[];
  tickets: Ticket[];
  bookings: Booking[];
  tasks: Task[];
  hasUnreadMessages: boolean;
  hasPendingApprovals: boolean;
  hasNewTickets: boolean;
}

export interface BlockedSlot {
  id: string;
  date: string; // ISO string format YYYY-MM-DD
  time: string | 'ALL_DAY'; // e.g., "09:00" or "ALL_DAY"
  durationHours: number; // How many hours to block
  reason: string;
}

export enum ViewModule {
  DASHBOARD = 'DASHBOARD',
  PACKAGES = 'PACKAGES',
  VISION_BUILDER = 'VISION_BUILDER',
  PORTFOLIO_VR = 'PORTFOLIO_VR',
  COLLECTIONS = 'COLLECTIONS',
  BOOKING = 'BOOKING',
  CHAT = 'CHAT',
  CONTRACTS = 'CONTRACTS',
  INVOICE = 'INVOICE',
  CART = 'CART',
  SUPPORT = 'SUPPORT',
  PROFILE = 'PROFILE',
  FILES = 'FILES',
  DESIGN_PREFERENCES = 'DESIGN_PREFERENCES',
  // Admin Modules
  ADMIN_DIRECTORY = 'ADMIN_DIRECTORY',
  ADMIN_ARCHIVE = 'ADMIN_ARCHIVE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_FINANCE = 'ADMIN_FINANCE',
  ADMIN_CHAT = 'ADMIN_CHAT',
  ADMIN_CONTRACTS = 'ADMIN_CONTRACTS',
  ADMIN_BOOKINGS = 'ADMIN_BOOKINGS',
  ADMIN_PROFILE = 'ADMIN_PROFILE',
  ADMIN_TASKS = 'ADMIN_TASKS',
  ADMIN_CALENDAR = 'ADMIN_CALENDAR',
  SUPPORT_STORE = 'SUPPORT_STORE',
  // Support Modules
  SUPPORT_DASHBOARD = 'SUPPORT_DASHBOARD',
  SUPPORT_TICKETS = 'SUPPORT_TICKETS',
  SUPPORT_FINANCE = 'SUPPORT_FINANCE',
  SUPPORT_CLIENTS = 'SUPPORT_CLIENTS',
  SUPPORT_KNOWLEDGE_BASE = 'SUPPORT_KNOWLEDGE_BASE',
  SUPPORT_LOGS = 'SUPPORT_LOGS',
  SUPPORT_SETTINGS = 'SUPPORT_SETTINGS',
  SUPPORT_CLIENT_DASHBOARD = 'SUPPORT_CLIENT_DASHBOARD',
  SUPPORT_CLIENT_TICKETS = 'SUPPORT_CLIENT_TICKETS',
  SUPPORT_CLIENT_FINANCE = 'SUPPORT_CLIENT_FINANCE',
  SUPPORT_CLIENT_CHAT = 'SUPPORT_CLIENT_CHAT'
}

export type Role = 'GUEST' | 'CLIENT' | 'ARCHITECT' | 'SUPPORT';

export interface CompanyExpense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

export interface CompanyFinances {
  expenses: CompanyExpense[];
}


export interface StoreCollectionItem {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isNew: boolean;
}

export interface StorePackageItem {
  nameAr?: string;
  priceNumber: number;
  id: string;
  name: string;
  price: string;
  originalPrice?: number;
  features: string[];
  description?: string;
  tier: 'essential' | 'executive' | 'signature';
}

export interface StoreConsultationItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  duration: string;
  type: 'In-Studio' | 'Virtual' | 'Site Visit';
}

export interface StoreData {
  collections: StoreCollectionItem[];
  packages: StorePackageItem[];
  consultations: StoreConsultationItem[];
}

export interface GlobalState {
  storeData: StoreData;
  architectProfile: ArchitectProfile;
  clients: Record<string, ClientProjectData>;
  activeClientId: string;
  blockedSlots: BlockedSlot[];
  openedDays?: string[];
  companyFinances: CompanyFinances;
  isImpersonating?: boolean;
  originalRole?: Role;
}
