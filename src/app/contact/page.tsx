'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // In production, implement API route or third-party form service (Resend, Formspree, etc.)
    await new Promise(r => setTimeout(r, 1000));
    setStatus('sent');
  };

  return (
    <div className="container-md py-12 lg:py-16">
      <div className="max-w-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Contact Us</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Found a bug? Missing a unit? Have feedback? We read every message.
        </p>

        {status === 'sent' ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message sent!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">We&apos;ll get back to you within 1–2 business days.</p>
            <button
              onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }); }}
              className="btn-secondary mt-6 mx-auto"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field text-base"
                  placeholder="Your name"
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field text-base"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Subject
              </label>
              <select
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="input-field text-base"
              >
                <option value="">Select a topic...</option>
                <option value="bug">Bug report</option>
                <option value="feature">Feature request</option>
                <option value="missing-unit">Missing unit/converter</option>
                <option value="accuracy">Accuracy issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="input-field text-base resize-none"
                rows={5}
                placeholder="Tell us more..."
                required
                minLength={10}
                maxLength={2000}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length}/2000</p>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {status === 'sending' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : 'Send Message'}
            </button>

            {status === 'error' && (
              <p className="text-sm text-red-500 text-center">
                Something went wrong. Please try again or email us directly.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
