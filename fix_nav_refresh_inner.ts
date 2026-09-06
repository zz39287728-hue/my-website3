import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// The user wants the ability to reset the inner state of a view by clicking the nav item again.
// To achieve this, we can dispatch a custom event when a nav item is clicked.
// The inner components (like Booking, Collections, etc.) can listen for this event and reset their internal state.
// OR, we can just remove the check `if (currentView !== item.id)` and instead do something like:
// If it IS the same view, we can temporarily set it to something else and back? No, that causes a flash.
// A better way is to pass a "reset key" or dispatch an event.
// Let's use a custom event: `window.dispatchEvent(new CustomEvent('reset-view', { detail: item.id }))`

// Let's first restore the `setCurrentView` call even if it's the same, AND dispatch an event.
// Actually, React doesn't re-render if we set state to the same value.
// So we just dispatch an event!

const target1 = `                if (currentView !== item.id) {
                  setCurrentView(item.id);
                }`;
const rep1 = `                if (currentView !== item.id) {
                  setCurrentView(item.id);
                } else {
                  window.dispatchEvent(new CustomEvent('reset-view', { detail: item.id }));
                }`;
content = content.replace(target1, rep1);

fs.writeFileSync(path, content);
