import fs from 'fs';

const path = 'src/pages/Support.tsx';
let content = fs.readFileSync(path, 'utf8');

const newSupportDashboard = `
export const SupportDashboard: React.FC = () => {
  const { t, globalState, lang } = useAppContext();
  const isAr = lang === 'ar';
  const { clients } = globalState;
  
  const allClients = Object.values(clients);
  const totalClients = allClients.length;
  
  const allTickets = allClients.flatMap(c => c.tickets.map(t => ({ ...t, clientName: c.profile.name, clientId: c.profile.id, clientTier: c.profile.tier })));
  const openTickets = allTickets.filter(t => t.status !== 'Resolved');
  
  const pendingApprovalsCount = allClients.filter(c => c.hasPendingApprovals).length;
  const unreadMessagesCount = allClients.filter(c => c.hasUnreadMessages).length;
  
  const pendingInvoices = allClients.flatMap(c => c.invoice && c.invoice.status === 'Pending' ? [{ ...c.invoice, clientName: c.profile.name }] : []);
  const totalPendingRevenue = pendingInvoices.reduce((acc, inv) => acc + inv.items.reduce((s, i) => s + i.amount, 0), 0);
  
  const recentActivities = [
    ...allTickets.slice(0, 3).map(t => ({ id: t.id, text: isAr ? \`تذكرة جديدة من \${t.clientName}\` : \`New ticket from \${t.clientName}\`, time: t.date, icon: Ticket, color: 'text-blue-500' })),
    ...pendingInvoices.slice(0, 2).map(i => ({ id: i.id, text: isAr ? \`فاتورة بانتظار الدفع (\${i.clientName})\` : \`Pending payment from \${i.clientName}\`, time: i.date, icon: DollarSign, color: 'text-gold-500' })),
    { id: 'act1', text: isAr ? 'تم تحديث النظام بنجاح' : 'System updated successfully', time: 'Today, 08:00 AM', icon: CheckCircle2, color: 'text-green-500' }
  ].sort((a, b) => 0); 

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold flex items-center gap-3 text-luxury-900 dark:text-luxury-50 mb-2">
            <Activity className="text-gold-600" size={32} />
            {isAr ? 'مركز المراقبة والتحكم' : 'Support Control Center'}
          </h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">
            {isAr ? 'نظرة عامة على حالة النظام، العملاء، والتذاكر النشطة.' : 'Overview of system health, client activities, and active tickets.'}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-luxury-900 px-4 py-2 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-sm">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-luxury-700 dark:text-luxury-300">{isAr ? 'جميع الأنظمة تعمل' : 'All Systems Operational'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isAr ? 'إجمالي العملاء' : 'Total Clients', value: totalClients, icon: User, color: 'text-luxury-700 dark:text-luxury-300', bg: 'bg-luxury-100 dark:bg-luxury-800' },
          { label: isAr ? 'تذاكر مفتوحة' : 'Open Tickets', value: openTickets.length, icon: Ticket, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', alert: openTickets.length > 0 },
          { label: isAr ? 'رسائل غير مقروءة' : 'Unread Messages', value: unreadMessagesCount, icon: MessageSquare, color: 'text-gold-600 dark:text-gold-400', bg: 'bg-gold-100 dark:bg-gold-900/30' },
          { label: isAr ? 'موافقات معلقة' : 'Pending Approvals', value: pendingApprovalsCount, icon: FileSignature, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' }
        ].map((metric, idx) => (
          <Card key={idx} delay={0.1 * idx} className="p-6 relative overflow-hidden group hover:shadow-lg transition-all border-luxury-200 dark:border-luxury-800/60">
            {metric.alert && <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500"></div>}
            <div className="flex justify-between items-start mb-4">
              <div className={\`p-3 rounded-xl \${metric.bg}\`}>
                <metric.icon size={24} className={metric.color} />
              </div>
              <TrendingUp size={20} className="text-green-500 opacity-50" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-luxury-900 dark:text-luxury-50 mb-1">{metric.value}</h3>
            <p className="text-sm font-bold text-luxury-500">{metric.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-0 overflow-hidden border-luxury-200 dark:border-luxury-800/60">
            <div className="p-6 border-b border-luxury-100 dark:border-luxury-800/50 flex justify-between items-center bg-luxury-50/50 dark:bg-luxury-900/20">
              <div>
                <h3 className="font-bold text-lg text-luxury-900 dark:text-luxury-50 flex items-center gap-2">
                  <AlertCircle size={20} className="text-red-500" />
                  {isAr ? 'مركز الإجراءات العاجلة' : 'Urgent Action Center'}
                </h3>
                <p className="text-sm text-luxury-500">{isAr ? 'تذاكر وطلبات تحتاج لتدخل سريع' : 'Tickets and requests requiring immediate attention'}</p>
              </div>
            </div>
            <div className="divide-y divide-luxury-100 dark:divide-luxury-800/50">
              {openTickets.slice(0, 4).map((ticket, i) => (
                <div key={i} className="p-6 hover:bg-luxury-50 dark:hover:bg-luxury-900/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg shrink-0">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-luxury-900 dark:text-luxury-100 mb-1">{ticket.subject}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-luxury-500 font-medium">
                        <span className="flex items-center gap-1"><User size={14}/> {ticket.clientName}</span>
                        <span className="px-2 py-0.5 bg-luxury-200 dark:bg-luxury-800 rounded text-luxury-700 dark:text-luxury-300">{ticket.clientTier || 'Client'}</span>
                        <span className="flex items-center gap-1 text-red-500"><Clock size={14}/> {isAr ? 'متجاوز لـ SLA' : 'SLA Overdue'}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="shrink-0 text-sm py-1.5">{isAr ? 'عرض التفاصيل' : 'View Details'}</Button>
                </div>
              ))}
              {openTickets.length === 0 && (
                <div className="p-8 text-center text-luxury-500">
                  <CheckCircle2 size={48} className="mx-auto text-green-500 mb-3 opacity-50" />
                  <p>{isAr ? 'لا توجد إجراءات عاجلة حالياً' : 'No urgent actions required right now'}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 border-luxury-200 dark:border-luxury-800/60">
            <h3 className="font-bold text-lg text-luxury-900 dark:text-luxury-50 flex items-center gap-2 mb-6">
              <PieChart size={20} className="text-gold-600" />
              {isAr ? 'نظرة مالية سريعة' : 'Financial Snapshot (Pending)'}
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3 text-center md:text-left md:border-r border-luxury-200 dark:border-luxury-800 pb-6 md:pb-0 md:pr-6">
                <p className="text-sm font-bold text-luxury-500 mb-2">{isAr ? 'إجمالي المبالغ المعلقة' : 'Total Pending Revenue'}</p>
                <p className="text-4xl font-serif font-bold text-gold-600 dark:text-gold-400">{totalPendingRevenue.toLocaleString()} <span className="text-lg">BHD</span></p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                  <TrendingUp size={16} /> +12% {isAr ? 'هذا الشهر' : 'this month'}
                </div>
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                {pendingInvoices.slice(0, 3).map((inv, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-luxury-50 dark:bg-luxury-900/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Receipt size={18} className="text-luxury-400" />
                      <div>
                        <p className="font-bold text-sm text-luxury-900 dark:text-luxury-100">{inv.clientName}</p>
                        <p className="text-xs text-luxury-500">{inv.date}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-luxury-700 dark:text-luxury-300">{inv.items.reduce((s, it) => s + it.amount, 0).toLocaleString()} BHD</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-6 border-luxury-200 dark:border-luxury-800/60 bg-gradient-to-br from-luxury-50 to-white dark:from-luxury-900 dark:to-luxury-950">
            <h3 className="font-bold text-lg text-luxury-900 dark:text-luxury-50 mb-6">{isAr ? 'أداء فريق الدعم' : 'Support Team Performance'}</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{isAr ? 'معدل حل التذاكر' : 'Ticket Resolution Rate'}</span>
                  <span className="text-lg font-bold text-green-600">92%</span>
                </div>
                <div className="w-full h-2 bg-luxury-200 dark:bg-luxury-800 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{isAr ? 'متوسط وقت الاستجابة' : 'Avg Response Time'}</span>
                  <span className="text-lg font-bold text-blue-600">1.2h</span>
                </div>
                <div className="w-full h-2 bg-luxury-200 dark:bg-luxury-800 rounded-full overflow-hidden">
                  <div className="w-[30%] h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{isAr ? 'رضا العملاء (CSAT)' : 'Client Satisfaction'}</span>
                  <span className="text-lg font-bold text-gold-600">4.8/5</span>
                </div>
                <div className="w-full h-2 bg-luxury-200 dark:bg-luxury-800 rounded-full overflow-hidden">
                  <div className="w-[96%] h-full bg-gold-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-luxury-200 dark:border-luxury-800/60">
            <h3 className="font-bold text-lg text-luxury-900 dark:text-luxury-50 flex items-center gap-2 mb-6">
              <Bell size={20} className="text-luxury-500" />
              {isAr ? 'سجل النشاطات الحديثة' : 'Recent Activity Logs'}
            </h3>
            <div className="space-y-4">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-luxury-50 dark:hover:bg-luxury-900/50 transition-colors">
                  <div className={\`p-2 rounded-full shrink-0 h-min \${act.color.replace('text-', 'bg-').replace('-500', '-100')} dark:\${act.color.replace('text-', 'bg-').replace('-500', '-900/30')} \${act.color}\`}>
                    <act.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-luxury-900 dark:text-luxury-100 mb-1">{act.text}</p>
                    <p className="text-xs text-luxury-500">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 text-sm">{isAr ? 'عرض كل السجلات' : 'View All Logs'}</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
`;

const regex = /export const SupportDashboard: React\.FC = \(\) => \{[\s\S]*?return \([\s\S]*?\}\);[\s\n]*\};/g;

if(regex.test(content)) {
  content = content.replace(regex, newSupportDashboard);
  fs.writeFileSync(path, content);
  console.log("Successfully replaced SupportDashboard");
} else {
  console.error("Could not find SupportDashboard using regex.");
}
