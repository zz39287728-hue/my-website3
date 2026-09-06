import fs from 'fs';
const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                    <div className="flex justify-between items-center pt-1">
                      <p className={\`text-sm font-bold flex items-center gap-1.5 \${
                        b.status === 'Confirmed' ? 'text-green-600 dark:text-green-500' : 
                        b.status === 'Awaiting Payment' ? 'text-rose-600 dark:text-rose-500' : 
                        'text-gold-600 dark:text-gold-500'
                      }\`}>
                        {b.status === 'Confirmed' && <Check size={16} />}
                        {b.status === 'Confirmed' ? t('booking.confirmed') : b.status === 'Awaiting Payment' ? t('booking.awaiting_payment') : b.status === 'Awaiting Confirmation' ? t('booking.awaiting_confirmation') : t('booking.pending')}
                      </p>
                      <p className="text-xs text-luxury-500 font-medium">Ref: {b.id.toUpperCase()}</p>
                    </div>
                    {isAdmin && (b.status === 'Awaiting Confirmation' || b.status === 'Pending') && (
                      <div className="mt-2 pt-4 border-t border-luxury-100 dark:border-luxury-800">
                        <Button 
                          variant="primary" 
                          className="w-full py-2 text-sm"
                          onClick={() => handleStatusChange(b.id, 'Confirmed')}
                        >
                          <Check size={16} className="mr-2 inline" />
                          {isAr ? 'تأكيد الموعد' : 'Confirm Booking'}
                        </Button>
                      </div>
                    )}`;

const replacement = `                    <div className="flex justify-between items-center pt-1">
                      <p className={\`text-sm font-bold flex items-center gap-1.5 \${
                        b.status === 'Confirmed' ? 'text-green-600 dark:text-green-500' : 
                        b.status === 'Rejected' ? 'text-red-600 dark:text-red-500' :
                        b.status === 'Awaiting Payment' ? 'text-rose-600 dark:text-rose-500' : 
                        'text-gold-600 dark:text-gold-500'
                      }\`}>
                        {b.status === 'Confirmed' && <Check size={16} />}
                        {b.status === 'Rejected' && <X size={16} />}
                        {b.status === 'Confirmed' ? t('booking.confirmed') : b.status === 'Rejected' ? (isAr ? 'مرفوض' : 'Rejected') : b.status === 'Awaiting Payment' ? t('booking.awaiting_payment') : b.status === 'Awaiting Confirmation' ? t('booking.awaiting_confirmation') : t('booking.pending')}
                      </p>
                      <p className="text-xs text-luxury-500 font-medium">Ref: {b.id.toUpperCase()}</p>
                    </div>
                    {isAdmin && b.isGuestBooking && (
                      <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex flex-col gap-1">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{isAr ? 'حجز ضيف' : 'Guest Booking'}</span>
                        {b.guestPhone && <span className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2"><Phone size={14}/> {b.guestPhone}</span>}
                      </div>
                    )}
                    {isAdmin && (b.status === 'Awaiting Confirmation' || b.status === 'Pending') && (
                      <div className="mt-2 pt-4 border-t border-luxury-100 dark:border-luxury-800 flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 py-2 text-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                          onClick={() => handleStatusChange(b.id, 'Rejected')}
                        >
                          <X size={16} className="mr-2 inline" />
                          {isAr ? 'رفض' : 'Reject'}
                        </Button>
                        <Button 
                          variant="primary" 
                          className="flex-1 py-2 text-sm"
                          onClick={() => handleStatusChange(b.id, 'Confirmed')}
                        >
                          <Check size={16} className="mr-2 inline" />
                          {isAr ? 'تأكيد' : 'Confirm'}
                        </Button>
                      </div>
                    )}`;

if (content.includes('t(\'booking.confirmed\')')) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content);
  console.log('Replaced block successfully');
} else {
  console.log('Could not find target');
}
