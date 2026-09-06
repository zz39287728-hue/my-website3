import fs from 'fs';
const path = 'src/pages/Support.tsx';
let content = fs.readFileSync(path, 'utf8');

const ticketsAndFinance = `
export const SupportTickets: React.FC<{ isClientSpecific?: boolean }> = ({ isClientSpecific }) => {
  const { t, globalState, lang } = useAppContext();
  const isAr = lang === 'ar';
  const { clients, activeClientId } = globalState;
  
  const allTickets = isClientSpecific && activeClientId
    ? clients[activeClientId]?.tickets || []
    : Object.values(clients).flatMap(c => c.tickets.map(tk => ({ ...tk, clientName: c.profile.name, clientId: c.profile.id })));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">
            {t('support.nav.tickets')}
          </h2>
        </div>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left border-b border-luxury-200 dark:border-luxury-800">
              <tr>
                <th className="py-4 px-4 font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'الموضوع' : 'Subject'}</th>
                {!isClientSpecific && <th className="py-4 px-4 font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'العميل' : 'Client'}</th>}
                <th className="py-4 px-4 font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="py-4 px-4 font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {allTickets.map((ticket, i) => (
                <tr key={i} className="border-b border-luxury-100 dark:border-luxury-800">
                  <td className="py-4 px-4 text-luxury-700 dark:text-luxury-300">{ticket.subject}</td>
                  {!isClientSpecific && <td className="py-4 px-4 text-luxury-700 dark:text-luxury-300">{(ticket as any).clientName}</td>}
                  <td className="py-4 px-4 text-luxury-500">{ticket.date}</td>
                  <td className="py-4 px-4">
                    <span className={\`text-xs font-bold px-3 py-1 rounded-full \${ticket.status === 'Resolved' ? 'bg-green-500/20 text-green-600' : 'bg-gold-500/20 text-gold-600'}\`}>
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allTickets.length === 0 && (
            <div className="p-8 text-center text-luxury-500">{isAr ? 'لا توجد تذاكر' : 'No tickets found'}</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export const SupportFinance: React.FC<{ isClientSpecific?: boolean }> = ({ isClientSpecific }) => {
  const { t, globalState, lang } = useAppContext();
  const isAr = lang === 'ar';
  const { clients, activeClientId } = globalState;

  const allInvoices = isClientSpecific && activeClientId
    ? [clients[activeClientId]?.invoice].filter(Boolean)
    : Object.values(clients).map(c => ({ ...c.invoice, clientName: c.profile.name }));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">
            {t('support.nav.finance')}
          </h2>
        </div>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left border-b border-luxury-200 dark:border-luxury-800">
              <tr>
                <th className="py-4 px-4 font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'الفاتورة' : 'Invoice'}</th>
                {!isClientSpecific && <th className="py-4 px-4 font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'العميل' : 'Client'}</th>}
                <th className="py-4 px-4 font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="py-4 px-4 font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'المبلغ' : 'Amount'}</th>
                <th className="py-4 px-4 font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {allInvoices.map((inv, i) => (
                <tr key={i} className="border-b border-luxury-100 dark:border-luxury-800">
                  <td className="py-4 px-4 text-luxury-700 dark:text-luxury-300">{inv.id}</td>
                  {!isClientSpecific && <td className="py-4 px-4 text-luxury-700 dark:text-luxury-300">{(inv as any).clientName}</td>}
                  <td className="py-4 px-4 text-luxury-500">{inv.date}</td>
                  <td className="py-4 px-4 text-luxury-700 dark:text-luxury-300">{inv.items?.reduce((a, b) => a + b.amount, 0) || 0} BHD</td>
                  <td className="py-4 px-4">
                    <span className={\`text-xs font-bold px-3 py-1 rounded-full \${inv.status === 'Paid' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}\`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allInvoices.length === 0 && (
            <div className="p-8 text-center text-luxury-500">{isAr ? 'لا توجد بيانات' : 'No data found'}</div>
          )}
        </div>
      </Card>
    </div>
  );
};
`;

content = content.replace(
  'export const SupportKnowledgeBase: React.FC = () => {', 
  ticketsAndFinance + '\nexport const SupportKnowledgeBase: React.FC = () => {'
);
fs.writeFileSync(path, content);
