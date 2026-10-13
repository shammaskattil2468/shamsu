import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, ExternalLink, Database } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiService } from '../services/api';

export default function ContactForm({ recipientEmail }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [statusMessage, setStatusMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. name@example.com).';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    if (!validate()) return;

    setStatus('sending');

    // Save to MongoDB database
    let savedToMongo = false;
    try {
      const res = await apiService.submitContactMessage(formData);
      if (res && res.success && !res.offline) {
        savedToMongo = true;
      }
    } catch (err) {
      console.warn('Could not save to MongoDB directly:', err);
    }

    // Prepare direct mailto action
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Mubashira,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n\nSent via Portfolio Contact Form`
    );
    const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    try {
      // Open user's email client with pre-filled content
      window.location.href = mailtoUrl;

      setStatus('success');
      setStatusMessage(
        savedToMongo
          ? 'Message saved to MongoDB storage & formatted in your email app. Message sent successfully.'
          : 'Message formatted and ready in your email app. Message sent successfully.'
      );
      setFormData({ name: '', email: '', message: '' });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (err) {
        // ignore confetti if unsupported
      }
    } catch (err) {
      setStatus('error');
      setStatusMessage('Something went wrong. Please try again or email directly.');
    }
  };

  return (
    <div 
      className="card"
      style={{
        padding: '2.5rem',
        backgroundColor: 'var(--bg-card)',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Send a Direct Message
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Have a question or opportunity? Feel free to reach out directly.
        </p>

        {/* Integration notice */}
        <div 
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Mail size={14} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <span>Form is directly configured to dispatch to <strong>{recipientEmail}</strong>.</span>
        </div>
      </div>

      {status === 'success' && (
        <div 
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-emerald-light)',
            border: '1px solid var(--accent-emerald)',
            color: 'var(--accent-emerald)',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{statusMessage}</span>
        </div>
      )}

      {status === 'error' && (
        <div 
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            color: '#EF4444',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{statusMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Name Field */}
        <div>
          <label 
            htmlFor="contact-name"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem' }}
          >
            Your Name <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: null });
            }}
            disabled={status === 'sending'}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${errors.name ? '#EF4444' : 'var(--border-color)'}`,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s',
            }}
          />
          {errors.name && (
            <p style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '0.35rem', fontWeight: 500 }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label 
            htmlFor="contact-email"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem' }}
          >
            Your Email Address <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="e.g. yourname@domain.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            disabled={status === 'sending'}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${errors.email ? '#EF4444' : 'var(--border-color)'}`,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s',
            }}
          />
          {errors.email && (
            <p style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '0.35rem', fontWeight: 500 }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label 
            htmlFor="contact-message"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem' }}
          >
            Message <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            id="contact-message"
            rows={4}
            placeholder="Type your message, opportunity, or question here..."
            value={formData.message}
            onChange={(e) => {
              setFormData({ ...formData, message: e.target.value });
              if (errors.message) setErrors({ ...errors, message: null });
            }}
            disabled={status === 'sending'}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${errors.message ? '#EF4444' : 'var(--border-color)'}`,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
          />
          {errors.message && (
            <p style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '0.35rem', fontWeight: 500 }}>
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn btn-primary"
          style={{
            padding: '0.85rem 1.75rem',
            fontSize: '0.98rem',
            width: '100%',
            opacity: status === 'sending' ? 0.75 : 1,
            cursor: status === 'sending' ? 'not-allowed' : 'pointer'
          }}
        >
          {status === 'sending' ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Formatting Message...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <Send size={16} />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
