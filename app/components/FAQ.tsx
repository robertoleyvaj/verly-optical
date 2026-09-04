'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'How does Verly Optical work?',
    answer:
      'Choose your frames, customize your lenses, upload your prescription, and place your order online. We prepare your glasses and ship them to your address.',
  },
  {
    question: 'Do I need health insurance?',
    answer:
      'No. You can order directly from Verly Optical without health insurance.',
  },
  {
    question: 'How do I upload my prescription?',
    answer:
      'You can upload a photo, PDF, or screenshot of your prescription during the lens customization process.',
  },
  {
    question: 'What if I don’t have my prescription right now?',
    answer:
      'You can continue customizing your glasses and add your prescription later before checkout.',
  },
  {
    question: 'Can I order glasses without prescription?',
    answer:
      'Yes. You can order non-prescription lenses, blue light lenses, or fashion lenses.',
  },
  {
    question: 'Do you offer progressive lenses?',
    answer:
      'Yes. We offer single vision, bifocal, and progressive lenses.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Most orders are prepared and shipped within a few business days. Delivery time depends on your location and lens options.',
  },
  {
    question: 'Do you ship across the United States?',
    answer:
      'Yes. We ship within the United States.',
  },
  {
    question: 'Can I use my insurance?',
    answer:
      'At the moment, we do not process insurance directly. However, we can provide an order receipt if you want to request reimbursement from your insurance provider.',
  },
  {
    question: 'What if I enter my prescription incorrectly?',
    answer:
      'If we notice something unusual, we may contact you before processing your order. Please make sure your prescription is accurate and valid.',
  },
  {
    question: 'Can I return my glasses?',
    answer:
      'Because prescription glasses are custom-made, returns may be limited. However, please contact us if there is any issue with your order.',
  },
  {
    question: 'Are your lenses anti-reflective?',
    answer:
      'Some packages include anti-reflective coating, and you can also add it as an upgrade depending on your selection.',
  },
  {
    question: 'Do you offer blue light lenses?',
    answer:
      'Yes. Blue light protection is available for people who use computers, phones, or screens often.',
  },
  {
    question: 'How do I know which lenses are best for me?',
    answer:
      'VerlyBot can help recommend lens options based on your prescription, lifestyle, and daily needs.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept credit and debit cards through Stripe.',
  },
  {
    question: 'Is my payment secure?',
    answer:
      'Yes. Payments are processed securely through Stripe.',
  },
];