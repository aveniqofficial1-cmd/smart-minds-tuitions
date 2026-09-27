import React from 'react';
import { ChatDesk } from '../../components/shared/ChatDesk';

export const CenterChat = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Admin Helpdesk & Center Coordination
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Direct real-time messaging channel with Smart Minds management for center verification, faculty allocation, and platform operations.
        </p>
      </div>

      <ChatDesk targetUserTitle="Smart Minds Operations Support" />
    </div>
  );
};
