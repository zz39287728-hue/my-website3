import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { ViewModule } from '../types';
import { Ticket, DollarSign, MessageSquare, CheckCircle2, Clock, AlertCircle, Search, PieChart, TrendingUp, TrendingDown, Receipt, Plus, Trash2, MapPin, Building, Activity, FileText, ChevronRight, User, ExternalLink, Calendar, FileSignature, StickyNote, Bell } from 'lucide-react';

export const SupportClientDashboard: React.FC<{ setView?: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState, setGlobalState, lang, role, setRole } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const isAr = lang === 'ar';

  const handleImpersonateClient = () => {
    setGlobalState(prev => ({
      ...prev,
      isImpersonating: true,
      originalRole: role
    }));
    setRole('CLIENT');
  };

  if (!activeClient) return null;

  const totalBilled = activeClient.invoice.items.reduce((acc, item) => acc + item.amount, 0);
  
  const upcomingBooking = activeClient.bookings?.find(b => b.status === 'Confirmed' || b.status === 'Pending' || b.status === 'Awaiting Confirmation');
  const pendingContractsCount = activeClient.contracts?.filter(c => !c.isSignedByClient).length || 0;
  const needsAttention = activeClient.hasPendingApprovals || activeClient.hasUnreadMessages || activeClient.hasNewTickets || pendingContractsCount > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header & Impersonate Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">
            {activeClient.profile.name} - {isAr ? 'الدعم الفني' : 'Support Dashboard'}
          </h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{isAr ? 'إدارة شاملة لملف العميل قبل الدخول بصلاحياته.' : 'Comprehensive management of the client profile.'}</p>
        </div>
        <Button variant="primary" onClick={handleImpersonateClient} className="flex items-center gap-2">
          <ExternalLink size={18} />
          {isAr ? 'الدخول كعميل (لوحة العميل)' : 'Log in as Client (Dashboard)'}
        </Button>
      </div>

      {/* Action Required Banner */}
      {needsAttention && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-full text-red-600 dark:text-red-400 animate-pulse">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-red-700 dark:text-red-400 text-lg">
                {isAr ? 'يوجد إجراءات مطلوبة' : 'Action Required'}
              </h4>
              <p className="text-sm font-medium text-red-600/80 dark:text-red-300/80">
                {isAr ? 'العميل لديه تحديثات أو طلبات معلقة تحتاج إلى اهتمامك فوراً.' : 'This client has pending updates or requests that need your immediate attention.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeClient.hasUnreadMessages && <span className="text-xs font-bold bg-red-500 text-white px-3 py-1 rounded-full">{isAr ? 'رسائل جديدة' : 'New Messages'}</span>}
            {activeClient.hasNewTickets && <span className="text-xs font-bold bg-red-500 text-white px-3 py-1 rounded-full">{isAr ? 'تذاكر جديدة' : 'New Tickets'}</span>}
            {activeClient.hasPendingApprovals && <span className="text-xs font-bold bg-red-500 text-white px-3 py-1 rounded-full">{isAr ? 'اعتمادات معلقة' : 'Pending Approvals'}</span>}
            {pendingContractsCount > 0 && <span className="text-xs font-bold bg-red-500 text-white px-3 py-1 rounded-full">{pendingContractsCount} {isAr ? 'عقود بانتظار التوقيع' : 'Pending Contracts'}</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client Profile & Status */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-bl-full -z-10 blur-2xl"></div>
            <img 
              src={activeClient.profile.avatar} 
              alt={activeClient.profile.name} 
              className="w-24 h-24 rounded-2xl object-cover border-2 border-gold-500/30 shadow-lg"
            />
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50">{activeClient.profile.name}</h3>
                  <p className="text-sm font-bold text-gold-700 dark:text-gold-400">{activeClient.profile.tier}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeClient.profile.status === 'Active' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400'}`}>
                  {activeClient.profile.status === 'Active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'مؤرشف' : 'Archived')}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-luxury-100 dark:bg-luxury-900 rounded-lg text-luxury-500"><Building size={16} /></div>
                  <div>
                    <p className="text-xs text-luxury-500">{isAr ? 'المشروع' : 'Project'}</p>
                    <p className="text-sm font-bold text-luxury-900 dark:text-luxury-200">{activeClient.profile.project} ({activeClient.profile.area})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-luxury-100 dark:bg-luxury-900 rounded-lg text-luxury-500"><MapPin size={16} /></div>
                  <div>
                    <p className="text-xs text-luxury-500">{isAr ? 'الموقع' : 'Location'}</p>
                    <p className="text-sm font-bold text-luxury-900 dark:text-luxury-200">{activeClient.profile.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-luxury-100 dark:bg-luxury-900 rounded-lg text-luxury-500"><Activity size={16} /></div>
                  <div>
                    <p className="text-xs text-luxury-500">{isAr ? 'النمط المعماري' : 'Design Style'}</p>
                    <p className="text-sm font-bold text-luxury-900 dark:text-luxury-200">{activeClient.profile.style}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="flex flex-col justify-center">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{isAr ? 'حالة المشروع' : 'Project Progress'}</p>
                <div className="p-1.5 bg-gold-500/10 rounded text-gold-600"><CheckCircle2 size={16} /></div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-serif font-bold text-luxury-900 dark:text-luxury-50">{activeClient.profile.completion}%</span>
              </div>
              <div className="w-full bg-luxury-200 dark:bg-luxury-800 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-gold-600 to-gold-400 h-2 rounded-full" style={{ width: `${activeClient.profile.completion}%` }}></div>
              </div>
              <p className="text-xs font-medium text-luxury-500">{isAr ? 'المرحلة الحالية:' : 'Current Stage:'} <strong className="text-luxury-900 dark:text-luxury-200">{activeClient.milestones.find(m => m.status === 'IN_PROGRESS')?.stage || 'Review'}</strong></p>
            </Card>

            <Card className="flex flex-col justify-center">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{isAr ? 'الحالة المالية' : 'Financial Status'}</p>
                <div className="p-1.5 bg-green-500/10 rounded text-green-600"><DollarSign size={16} /></div>
              </div>
              <h3 className="text-3xl font-serif font-bold text-luxury-900 dark:text-luxury-50 mb-1">{totalBilled.toLocaleString()} BHD</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs font-medium text-luxury-500">{isAr ? 'الفاتورة الحالية:' : 'Current Invoice:'}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded ${activeClient.invoice.status === 'Paid' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                  {activeClient.invoice.status === 'Paid' ? (isAr ? 'مدفوعة' : 'Paid') : (isAr ? 'معلقة' : 'Pending')}
                </span>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'المواعيد القادمة' : 'Upcoming Booking'}</h3>
                <div className="p-1.5 bg-luxury-100 dark:bg-luxury-900 rounded text-luxury-600 dark:text-luxury-400"><Calendar size={16} /></div>
              </div>
              {upcomingBooking ? (
                <div>
                  <p className="font-bold text-luxury-900 dark:text-luxury-100 text-lg mb-1">{upcomingBooking.date} • {upcomingBooking.time}</p>
                  <p className="text-sm text-luxury-600 dark:text-luxury-400 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold-600"></span>
                    {upcomingBooking.type} - {isAr ? 'الحالة:' : 'Status:'} {upcomingBooking.status}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-luxury-500 py-2">{isAr ? 'لا توجد مواعيد قادمة' : 'No upcoming bookings'}</p>
              )}
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'ملاحظات الدعم الفني' : 'Support Notes'}</h3>
                <div className="p-1.5 bg-luxury-100 dark:bg-luxury-900 rounded text-luxury-600 dark:text-luxury-400"><StickyNote size={16} /></div>
              </div>
              <div className="bg-luxury-50 dark:bg-luxury-950 p-3 rounded-lg border border-luxury-200 dark:border-luxury-800">
                <p className="text-sm text-luxury-700 dark:text-luxury-300 italic">
                  {isAr ? 'عميل VIP. يفضل التواصل عبر الواتساب للمسائل المستعجلة. الرد خلال ساعة.' : 'VIP Client. Prefers WhatsApp for urgent issues. Ensure 1-hour response.'}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Quick Links & Alerts */}
        <div className="space-y-6">
          <Card className="bg-luxury-900 dark:bg-luxury-950 border-none shadow-xl">
            <h3 className="text-gold-400 font-bold mb-4">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setView && setView(ViewModule.SUPPORT_CLIENT_TICKETS)}
                className="w-full flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-gold-500/20 group-hover:text-gold-400 transition-colors"><Ticket size={18} /></div>
                  <span className="font-medium text-sm">{isAr ? 'إدارة التذاكر' : 'Manage Tickets'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {(activeClient.tickets || []).filter(t => t.status !== 'Resolved').length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {(activeClient.tickets || []).filter(t => t.status !== 'Resolved').length} {isAr ? 'مفتوحة' : 'Open'}
                    </span>
                  )}
                  <ChevronRight size={16} className="text-luxury-400" />
                </div>
              </button>

              <button 
                onClick={() => setView && setView(ViewModule.SUPPORT_CLIENT_CHAT)}
                className="w-full flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-gold-500/20 group-hover:text-gold-400 transition-colors"><MessageSquare size={18} /></div>
                  <span className="font-medium text-sm">{isAr ? 'محادثة العميل' : 'Client Chat'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {activeClient.hasUnreadMessages && (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                  <ChevronRight size={16} className="text-luxury-400" />
                </div>
              </button>

              <button 
                onClick={() => setView && setView(ViewModule.SUPPORT_CLIENT_FINANCE)}
                className="w-full flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-gold-500/20 group-hover:text-gold-400 transition-colors"><Receipt size={18} /></div>
                  <span className="font-medium text-sm">{isAr ? 'الفواتير والمدفوعات' : 'Invoices & Payments'}</span>
                </div>
                <ChevronRight size={16} className="text-luxury-400" />
              </button>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'أحدث التذاكر' : 'Recent Tickets'}</h3>
              <button onClick={() => setView && setView(ViewModule.SUPPORT_CLIENT_TICKETS)} className="text-xs font-bold text-gold-700 dark:text-gold-500 hover:underline">
                {isAr ? 'عرض الكل' : 'View All'}
              </button>
            </div>
            <div className="space-y-3">
              {(activeClient.tickets || []).slice(0, 3).map(ticket => (
                <div key={ticket.id} className="p-3 border border-luxury-200 dark:border-luxury-800 rounded-lg hover:border-gold-500/50 transition-colors cursor-pointer" onClick={() => setView && setView(ViewModule.SUPPORT_CLIENT_TICKETS)}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm text-luxury-900 dark:text-luxury-100 line-clamp-1">{ticket.subject}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ticket.status === 'Under Review' ? 'bg-red-500/10 text-red-600' : ticket.status === 'In Progress' ? 'bg-gold-500/10 text-gold-700' : 'bg-green-500/10 text-green-600'}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-luxury-500">{ticket.date}</p>
                </div>
              ))}
              {(activeClient.tickets || []).length === 0 && (
                <p className="text-sm text-luxury-500 text-center py-4">{isAr ? 'لا توجد تذاكر مسجلة' : 'No tickets found'}</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-luxury-900 dark:text-luxury-50">{isAr ? 'آخر المحادثات' : 'Recent Communications'}</h3>
              <button onClick={() => setView && setView(ViewModule.SUPPORT_CLIENT_CHAT)} className="text-xs font-bold text-gold-700 dark:text-gold-500 hover:underline">
                {isAr ? 'عرض الشات' : 'View Chat'}
              </button>
            </div>
            <div className="space-y-3">
              {(activeClient.chatHistory || []).slice(-2).reverse().map(msg => (
                <div key={msg.id} className="p-3 bg-luxury-50 dark:bg-luxury-950 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${msg.sender === 'CLIENT' ? 'bg-luxury-200 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300' : 'bg-gold-500/20 text-gold-700 dark:text-gold-400'}`}>
                      {msg.sender === 'CLIENT' ? (isAr ? 'العميل' : 'Client') : (msg.sender === 'SUPPORT' ? (isAr ? 'الدعم' : 'Support') : 'Arch')}
                    </span>
                    <span className="text-xs text-luxury-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-luxury-800 dark:text-luxury-200 line-clamp-2">{msg.text || (msg.attachments && msg.attachments.length > 0 ? (isAr ? 'ملف مرفق' : 'Attachment') : '')}</p>
                </div>
              ))}
              {(activeClient.chatHistory || []).length === 0 && (
                <p className="text-sm text-luxury-500 text-center py-4">{isAr ? 'لا توجد رسائل' : 'No messages found'}</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};



export const SupportDashboard: React.FC = () => {
  const { t, globalState, lang } = useAppContext();
  const isAr = lang === 'ar';
  const { clients } = globalState;
  
  const allClients = Object.values(clients);
  const totalClients = allClients.length;
  
  const allTickets = allClients.flatMap(c => (c.tickets || []).map(t => ({ ...t, clientName: c.profile.name, clientId: c.profile.id, clientTier: c.profile.tier })));
  const openTickets = allTickets.filter(t => t.status !== 'Resolved');
  
  const pendingApprovalsCount = allClients.filter(c => c.hasPendingApprovals).length;
  const unreadMessagesCount = allClients.filter(c => c.hasUnreadMessages).length;
  
  const pendingInvoices = allClients.flatMap(c => c.invoice && c.invoice.status === 'Pending' ? [{ ...c.invoice, clientName: c.profile.name }] : []);
  const totalPendingRevenue = pendingInvoices.reduce((acc, inv) => acc + inv.items.reduce((s, i) => s + i.amount, 0), 0);
  
  const recentActivities = [
    ...allTickets.slice(0, 3).map(t => ({ id: t.id, text: isAr ? `تذكرة جديدة من \${t.clientName}` : `New ticket from \${t.clientName}`, time: t.date, icon: Ticket, color: 'text-blue-500' })),
    ...pendingInvoices.slice(0, 2).map(i => ({ id: i.id, text: isAr ? `فاتورة بانتظار الدفع (\${i.clientName})` : `Pending payment from \${i.clientName}`, time: i.date, icon: DollarSign, color: 'text-gold-500' })),
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
              <div className={`p-3 rounded-xl \${metric.bg}`}>
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
                  <div className={`p-2 rounded-full shrink-0 h-min \${act.color.replace('text-', 'bg-').replace('-500', '-100')} dark:\${act.color.replace('text-', 'bg-').replace('-500', '-900/30')} \${act.color}`}>
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
                    <span className={`text-xs font-bold px-3 py-1 rounded-full \${ticket.status === 'Resolved' ? 'bg-green-500/20 text-green-600' : 'bg-gold-500/20 text-gold-600'}`}>
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
                    <span className={`text-xs font-bold px-3 py-1 rounded-full \${inv.status === 'Paid' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
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
export const SupportKnowledgeBase: React.FC = () => {
  const { t } = useAppContext();
  const [articles, setArticles] = useState([
    { id: '1', title: 'How to reset a client password', category: 'Account', views: 124, status: 'Published' },
    { id: '2', title: 'Handling refund requests', category: 'Finance', views: 89, status: 'Published' },
    { id: '3', title: 'Troubleshooting 3D VR Viewer', category: 'Technical', views: 210, status: 'Published' },
    { id: '4', title: 'Updating billing information', category: 'Finance', views: 45, status: 'Draft' }
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('support.nav.knowledge') || 'Knowledge Base'}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">Manage support articles and FAQs.</p>
        </div>
        <Button variant="primary">Add New Article</Button>
      </div>

      <Card>
        <div className="space-y-4">
          {articles.map(article => (
            <div key={article.id} className="p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{article.title}</h4>
                <p className="text-sm font-medium text-luxury-500">{article.category} • {article.views} views</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${article.status === 'Published' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-gold-500/20 text-gold-600 dark:text-gold-400'}`}>
                  {article.status}
                </span>
                <Button variant="outline" className="px-3 py-1 text-sm">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const SupportLogs: React.FC = () => {
  const { t } = useAppContext();
  const logs = [
    { id: '1', action: 'Client Password Reset', user: 'Admin User', date: '2024-03-20 14:30', status: 'Success' },
    { id: '2', action: 'Refund Processed - Invoice #INV-1029', user: 'Support Staff', date: '2024-03-20 11:15', status: 'Success' },
    { id: '3', action: 'Failed Login Attempt', user: 'Unknown IP (192.168.1.1)', date: '2024-03-19 22:45', status: 'Warning' },
    { id: '4', action: 'Contract Signed - Project #PRJ-8821', user: 'Client: Ahmed A.', date: '2024-03-19 09:20', status: 'Success' },
    { id: '5', action: 'System Backup Complete', user: 'System', date: '2024-03-19 00:00', status: 'Success' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('support.nav.logs') || 'System Logs'}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">Audit trail and system activity.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-luxury-200 dark:border-luxury-800 text-luxury-500 dark:text-luxury-400 bg-luxury-50 dark:bg-luxury-950/50">
                <th className="py-4 px-6 font-bold text-sm">Date & Time</th>
                <th className="py-4 px-6 font-bold text-sm">Action</th>
                <th className="py-4 px-6 font-bold text-sm">User / Actor</th>
                <th className="py-4 px-6 font-bold text-sm text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-luxury-100 dark:border-luxury-900/50 hover:bg-luxury-50 dark:hover:bg-luxury-950/30 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-luxury-600 dark:text-luxury-400 whitespace-nowrap">{log.date}</td>
                  <td className="py-4 px-6 font-bold text-luxury-900 dark:text-luxury-200">{log.action}</td>
                  <td className="py-4 px-6 text-sm font-medium text-luxury-700 dark:text-luxury-300">{log.user}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${log.status === 'Success' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
