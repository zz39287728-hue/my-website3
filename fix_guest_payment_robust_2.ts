import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const confirmStart = lines.findIndex(l => l.includes('const confirmGuestBooking = () => {'));
const confirmEnd = lines.findIndex((l, i) => i > confirmStart && l.includes('executeBooking()'));

if (confirmEnd !== -1) {
    lines[confirmEnd] = lines[confirmEnd].replace('executeBooking()', 'executeBooking(guestPaymentMethod)');
}

const executeStart = lines.findIndex(l => l.includes('const executeBooking = () => {'));

if (executeStart !== -1) {
    lines[executeStart] = '  const executeBooking = (paymentChoice: "now" | "after" = "now") => {';
    
    // Find cost
    const costIdx = lines.findIndex((l, i) => i > executeStart && l.includes('const cost = calculateCost();'));
    lines.splice(costIdx + 1, 0, '    const requiresImmediatePayment = cost > 0 && paymentChoice === "now";');
    
    // Replace status logic
    const statusIdx = lines.findIndex((l, i) => i > executeStart && l.includes('status: (cost > 0 ? \'Awaiting Payment\''));
    if (statusIdx !== -1) {
        lines[statusIdx] = '      status: (requiresImmediatePayment ? \'Awaiting Payment\' : (isAdmin ? \'Confirmed\' : \'Awaiting Confirmation\')) as \'Awaiting Payment\' | \'Awaiting Confirmation\' | \'Confirmed\',';
    }
    
    // Replace if (cost > 0)
    const ifCostIdx = lines.findIndex((l, i) => i > executeStart && l.includes('if (cost > 0) {'));
    if (ifCostIdx !== -1) {
        lines[ifCostIdx] = '      if (requiresImmediatePayment) {';
    }
    
    // Replace else {
    const elseCostIdx = lines.findIndex((l, i) => i > ifCostIdx && l.includes('} else {'));
    if (elseCostIdx !== -1) {
        lines[elseCostIdx] = '      } else if (cost === 0) {';
    }

    // Add setView logic at end of executeBooking
    const executeEnd = lines.findIndex((l, i) => i > elseCostIdx && l.trim() === '  };' && lines[i-1].trim() === '});');
    
    if (executeEnd !== -1) {
        lines.splice(executeEnd, 0, '    if (requiresImmediatePayment && setView) {', '      setView(ViewModule.INVOICE);', '    }');
    }
}

fs.writeFileSync(path, lines.join('\n'));
