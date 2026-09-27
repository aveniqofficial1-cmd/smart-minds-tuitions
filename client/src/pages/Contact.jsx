import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';

export const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="bg-cream-100 min-h-screen text-navy-950">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold font-sans tracking-widest text-gold-400 uppercase">
            WE ARE HERE TO HELP
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            Get in Touch with Smart Minds
          </h1>
          <p className="text-sand-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Have questions regarding tutor matching, demo scheduling, or academy registration? Reach out to our dedicated support team.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 bg-white space-y-6">
              <h3 className="font-serif font-bold text-xl text-navy-950">
                Official Head Office
              </h3>

              <div className="space-y-4 text-sm text-navy-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold-100 rounded-xl text-gold-800 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-950">Location</p>
                    <p className="text-xs text-navy-600 mt-0.5">
                      Smart Minds Academy, 4th Floor, Tech Hub Avenue, Hitech City, Hyderabad, Telangana 500081, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold-100 rounded-xl text-gold-800 shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-950">Phone Numbers</p>
                    <p className="text-xs text-navy-600 mt-0.5">
                      +91 98765 43210 / +91 98765 43211
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold-100 rounded-xl text-gold-800 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-950">Email Address</p>
                    <p className="text-xs text-navy-600 mt-0.5">
                      support@smartmindstuitions.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold-100 rounded-xl text-gold-800 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-950">Office Working Hours</p>
                    <p className="text-xs text-navy-600 mt-0.5">
                      Monday to Saturday: 9:00 AM – 8:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Action */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Need Instant Help?</h4>
                  <p className="text-xs text-emerald-700">Message on official WhatsApp desk</p>
                </div>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </Card>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 bg-white">
              <h3 className="font-serif font-bold text-xl text-navy-950 mb-2">
                Send Us an Inquiry
              </h3>
              <p className="text-xs text-navy-600 mb-6">
                Fill in the details below and an academic counselor will connect with you shortly.
              </p>

              {formSubmitted ? (
                <div className="p-8 text-center bg-gold-50 rounded-2xl border border-gold-300 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-navy-950">
                    Message Received Successfully!
                  </h4>
                  <p className="text-xs text-navy-700 max-w-md mx-auto">
                    Thank you for reaching out to Smart Minds Tuitions. A representative has received your request and will call you within 2 working hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Full Name"
                      placeholder="e.g. Ramesh Sharma"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />

                  <Textarea
                    label="How Can We Assist You?"
                    rows={4}
                    placeholder="Please specify subject requirements, grade level, or center query..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      icon={Send}
                      iconPosition="right"
                      className="w-full sm:w-auto"
                    >
                      Submit Inquiry
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
