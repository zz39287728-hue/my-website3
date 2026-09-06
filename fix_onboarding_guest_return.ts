import fs from 'fs';

// 1. Update Onboarding.tsx
const onboardPath = 'src/components/Onboarding.tsx';
let onboardContent = fs.readFileSync(onboardPath, 'utf8');

onboardContent = onboardContent.replace(
  `export const OnboardingWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {`,
  `export const OnboardingWizard: React.FC<{ onComplete: (isGuest?: boolean) => void }> = ({ onComplete }) => {`
);

onboardContent = onboardContent.replace(
  `    });
    onComplete();
  };`,
  `    });
    onComplete(true);
  };`
); // Note: This replacement might hit handleGuestLogin or handleComplete. Let's be specific.

// Let's do string replacement specifically.
const handleCompleteTarget = `  const handleComplete = () => {
    // Save preferences to the active client
    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      if (!client) return prev; // Just in case it's not client

      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            profile: {
              ...client.profile,
              onboardingCompleted: true,
              designPreferences: preferences
            }
          }
        }
      };
    });
    onComplete();
  };`;

const handleCompleteReplacement = `  const handleComplete = () => {
    // Save preferences to the active client
    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      if (!client) return prev; // Just in case it's not client

      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            profile: {
              ...client.profile,
              onboardingCompleted: true,
              designPreferences: preferences
            }
          }
        }
      };
    });
    onComplete(false);
  };`;

onboardContent = onboardContent.replace(handleCompleteTarget, handleCompleteReplacement);

const handleGuestLoginTarget = `      };

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
  };`;

const handleGuestLoginReplacement = `      };

      return {
        ...prev,
        activeClientId: guestId,
        clients: {
          ...prev.clients,
          [guestId]: guestClient
        }
      };
    });
    onComplete(true);
  };`;

onboardContent = onboardContent.replace(handleGuestLoginTarget, handleGuestLoginReplacement);

fs.writeFileSync(onboardPath, onboardContent);

// 2. Update App.tsx
const appPath = 'src/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

appContent = appContent.replace(
  `{showOnboarding && <OnboardingWizard onComplete={() => setShowOnboarding(false)} />}`,
  `{showOnboarding && <OnboardingWizard onComplete={(isGuest) => { setShowOnboarding(false); if(isGuest) setCurrentView(ViewModule.PACKAGES); }} />}`
);

fs.writeFileSync(appPath, appContent);
console.log('Fixed onComplete');
