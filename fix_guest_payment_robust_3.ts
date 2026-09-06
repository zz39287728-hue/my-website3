import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const executeEnd = lines.findIndex(l => l.includes('if (cost > 0 && !isAdmin) {'));
if (executeEnd !== -1) {
    // Remove the old block
    lines.splice(executeEnd, 4);

    // Insert the new logic
    lines.splice(executeEnd, 0,
      '    if (requiresImmediatePayment && !isAdmin) {',
      '      if (setView) setView(ViewModule.INVOICE);',
      '    } else if (cost > 0 && !isAdmin) {',
      '      setToastMessage(isAr ? "تم إرسال الطلب بنجاح، سيتم تأكيد الموعد" : "Request sent successfully, appointment will be confirmed");',
      '      setTimeout(() => setToastMessage(null), 6000);',
      '    }'
    );
}

fs.writeFileSync(path, lines.join('\n'));
