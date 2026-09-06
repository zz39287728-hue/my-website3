import fs from 'fs';

const path = 'src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const createClientTarget = `          project: {
            title: '',
            subtitle: '',
            description: '',
            progress: 0,
            totalStages: 5,
            currentStage: 1,
            nextMilestone: '',
            deliveryDate: '',
            images: [],
            updates: []
          },
          chatHistory: [],
          bookings: [],
          contract: null,
          tasks: [],
          designSettings: {
            theme: 'dark',
            lang: 'en'
          }
        }
      }
    }));`;

const createClientReplace = `          project: {
            title: '',
            subtitle: '',
            description: '',
            progress: 0,
            totalStages: 5,
            currentStage: 1,
            nextMilestone: '',
            deliveryDate: '',
            images: [],
            updates: []
          },
          chatHistory: [],
          bookings: [],
          contract: {
            id: 'CON-NEW',
            title: 'Design Agreement',
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            content: 'Please upload the contract document.'
          },
          contracts: [],
          tasks: [],
          tickets: [],
          milestones: [],
          materials: [],
          invoice: {
            id: 'INV-NEW',
            title: 'Initial Payment',
            amount: 0,
            status: 'Unpaid',
            dueDate: new Date().toISOString().split('T')[0],
            items: []
          },
          paidInvoices: [],
          cart: []
        }
      }
    }));`;

content = content.replace(createClientTarget, createClientReplace);

fs.writeFileSync(path, content);
console.log('Fixed Admin.tsx typescript errors part 2');
