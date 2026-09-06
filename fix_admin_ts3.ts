import fs from 'fs';

const path = 'src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `    const newClientObj = {
      profile: {
        id: newId,
        name: newClientForm.name,
        email: newClientForm.email || 'N/A',
        phone: newClientForm.phone || 'N/A',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200',
        tier: 'Standard',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        project: 'New Project',
        area: '-',
        location: '-',
        style: '-',
        completion: 0,
        freeConsultations: 0
      },
      hasPendingApprovals: false,
      hasUnreadMessages: false,
      hasNewTickets: false,
      milestones: [
        { id: 'm1', stage: 'Stage 1: Discovery & Concept', status: 'In Progress', date: 'Pending', pendingAction: true }
      ],
      materials: [],
      invoice: {
        id: 'INV-NEW-' + Math.floor(Math.random() * 1000),
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        items: []
      },
      paidInvoices: [],
      contracts: [],
      payments: [],
      tickets: [],
      project: {
        stage: 'DISCOVERY',
        progress: 0,
        updates: [],
        documents: []
      }
    } as any;`;

const replacement = `    const newClientObj: any = {
      profile: {
        id: newId,
        name: newClientForm.name,
        email: newClientForm.email || 'N/A',
        phone: newClientForm.phone || 'N/A',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200',
        tier: 'Standard',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        project: 'New Project',
        area: '-',
        location: '-',
        style: '-',
        completion: 0,
        freeConsultations: 0
      },
      hasPendingApprovals: false,
      hasUnreadMessages: false,
      hasNewTickets: false,
      milestones: [
        { id: 'm1', stage: 'Stage 1: Discovery & Concept', status: 'In Progress', date: 'Pending', pendingAction: true }
      ],
      materials: [],
      invoice: {
        id: 'INV-NEW',
        title: 'Initial Invoice',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Unpaid',
        items: []
      },
      paidInvoices: [],
      cart: [],
      chatHistory: [],
      contract: {
        id: 'CON-NEW',
        title: 'Design Agreement',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        content: 'Please upload the contract document.'
      },
      contracts: [],
      bookings: [],
      tasks: [],
      tickets: [],
      project: {
        title: 'New Project',
        subtitle: '',
        description: '',
        progress: 0,
        totalStages: 5,
        currentStage: 1,
        nextMilestone: '',
        deliveryDate: '',
        images: [],
        updates: []
      }
    };`;

content = content.replace(/const newClientObj = \{[\s\S]*?\s+    \};/, replacement);

fs.writeFileSync(path, content);
console.log('Replaced newClientObj block');
