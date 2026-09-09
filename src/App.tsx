import React from 'react';
import { EventProvider, useEventStore } from './store/eventStore';

// 17 Screens Imports
import { LoginScreen } from './components/screens/01_LoginScreen';
import { DashboardScreen } from './components/screens/02_DashboardScreen';
import { EventsListScreen } from './components/screens/03_EventsListScreen';
import { WizardBasicInfoScreen } from './components/screens/04_WizardBasicInfo';
import { WizardFormBuilderScreen } from './components/screens/05_WizardFormBuilder';
import { WizardThemeBuilderScreen } from './components/screens/06_WizardThemeBuilder';
import { WizardSettingsScreen } from './components/screens/07_WizardSettings';
import { WizardPreviewPublishScreen } from './components/screens/08_WizardPreviewPublish';
import { PublishConfirmationScreen } from './components/screens/09_PublishConfirmationScreen';
import { EventOverviewScreen } from './components/screens/10_EventOverviewScreen';
import { RegistrationsScreen } from './components/screens/11_RegistrationsScreen';
import { RegistrationDetailScreen } from './components/screens/12_RegistrationDetailScreen';
import { AnalyticsScreen } from './components/screens/13_AnalyticsScreen';
import { StaffManagementScreen } from './components/screens/14_StaffManagementScreen';
import { PublicRegistrationScreen } from './components/screens/15_PublicRegistrationScreen';
import { RegistrationSuccessScreen } from './components/screens/16_RegistrationSuccessScreen';
import { RegistrationClosedScreen } from './components/screens/17_RegistrationClosedScreen';

const MainRouter: React.FC = () => {
  const { currentScreen, toastMessage } = useEventStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case '01_login':
        return <LoginScreen />;
      case '02_dashboard':
        return <DashboardScreen />;
      case '03_events_list':
        return <EventsListScreen />;
      case '04_create_basic':
        return <WizardBasicInfoScreen />;
      case '05_create_form':
        return <WizardFormBuilderScreen />;
      case '06_create_theme':
        return <WizardThemeBuilderScreen />;
      case '07_create_settings':
        return <WizardSettingsScreen />;
      case '08_create_preview':
        return <WizardPreviewPublishScreen />;
      case '09_publish_confirm':
        return <PublishConfirmationScreen />;
      case '10_event_overview':
        return <EventOverviewScreen />;
      case '11_registrations':
        return <RegistrationsScreen />;
      case '12_registration_detail':
        return <RegistrationDetailScreen />;
      case '13_analytics':
        return <AnalyticsScreen />;
      case '14_staff_management':
        return <StaffManagementScreen />;
      case '15_public_registration':
        return <PublicRegistrationScreen />;
      case '16_registration_success':
        return <RegistrationSuccessScreen />;
      case '17_registration_closed':
        return <RegistrationClosedScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Active Screen Component */}

      {/* Active Screen Component */}
      <div className="flex-1">
        {renderScreen()}
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-slate-700 animate-slide-down flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <EventProvider>
      <MainRouter />
    </EventProvider>
  );
}

export default App;
