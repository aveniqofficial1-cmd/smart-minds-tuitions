import React from 'react';
import { ChatDesk } from '../../components/shared/ChatDesk';

export const ParentChat = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Support Desk & Admin Messaging
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Direct, real-time messaging channel with the Smart Minds academic management team.
        </p>
      </div>

      <ChatDesk targetUserTitle="Smart Minds Academic Support" />
    </div>
  );
};
