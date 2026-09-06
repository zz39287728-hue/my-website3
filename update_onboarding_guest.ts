import fs from 'fs';

const path = 'src/components/Onboarding.tsx';
let content = fs.readFileSync(path, 'utf8');

const handleGuestLogin = `
  const handleGuestLogin = () => {
    setGlobalState(prev => {
      // Create a new guest client
      const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
      const guestClient = {
        profile: {
          id: guestId,
          name: isAr ? 'ضيف' : 'Guest',
          tier: 'Bronze',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          project: 'N/A',
          area: '-',
          location: '-',
          style: '-',
          completion: 0,
          freeConsultations: 0,
          onboardingCompleted: true, // Skip onboarding
          isGuest: true
        },
        hasPendingApprovals: false,
        hasUnreadMessages: false,
        hasNewTickets: false,
        milestones: [],
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
        contract: null,
        contracts: [],
        bookings: [],
        tasks: [],
        tickets: [],
        project: {
          title: 'Welcome',
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
        designSettings: {
          theme: theme,
          lang: lang
        }
      };

      return {
        ...prev,
        activeClientId: guestId,
        clients: {
          ...prev.clients,
          [guestId]: guestClient
        }
      };
    });
    onComplete();
  };
`;

// Insert the new function before the return
content = content.replace('  return (', handleGuestLogin + '\n  return (');

// Replace the Guest button in step 1
content = content.replace(
  `<button 
                    onClick={() => setStep(2)}
                    className="w-full mt-8 text-luxury-500 dark:text-luxury-400 hover:text-gold-600 dark:hover:text-gold-400 font-bold text-sm transition-colors"
                  >
                    {isAr ? 'الدخول كضيف' : 'Continue as Guest'}
                  </button>`,
  `<button 
                    onClick={handleGuestLogin}
                    className="w-full mt-8 text-luxury-500 dark:text-luxury-400 hover:text-gold-600 dark:hover:text-gold-400 font-bold text-sm transition-colors"
                  >
                    {isAr ? 'الدخول كضيف' : 'Continue as Guest'}
                  </button>`
);

fs.writeFileSync(path, content);
console.log('Updated Onboarding guest login');
