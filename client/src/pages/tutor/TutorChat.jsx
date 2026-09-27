import React from 'react';
import { ChatDesk } from '../../components/shared/ChatDesk';

export const TutorChat = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Admin Helpdesk & Tutor Support
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Direct real-time messaging channel with the Smart Minds counselor and operations team for demo coordination and payment verification.
        </p>
      </div>

      <ChatDesk targetUserTitle="Smart Minds Academic Support" />
    </div>
  );
};
