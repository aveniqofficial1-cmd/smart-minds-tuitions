import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppWidget = ({ phoneNumber = '919876543210', message = 'Hello Smart Minds Tuitions! I would like to inquire about home tutoring services.' }) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-current group-hover:animate-bounce" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-400 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-400 rounded-full"></span>
      </div>
      <span className="font-semibold text-sm hidden sm:inline-block tracking-wide">
        Chat with Us
      </span>
    </a>
  );
};
