import React from 'react';
import { ChatDesk } from '../../components/shared/ChatDesk';

export const AdminChat = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Real-Time Operations & Support Desk
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Manage live inquiries and coordinate directly with parents, educators, and tuition centers.
        </p>
      </div>

      <ChatDesk targetUserTitle="Live User Channel" />
    </div>
  );
};
