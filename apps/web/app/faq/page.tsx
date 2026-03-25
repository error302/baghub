"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    category: "Orders",
    questions: [
      {
        question: "How do I track my order?",
        answer:
          "Once your order ships, you'll receive an email with a tracking number. You can also view your order status in your account under 'Order History'.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "You can modify or cancel your order within 1 hour of placing it. After that, the order enters processing and cannot be changed. Please contact us immediately if you need to make changes.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and PayPal. All payments are processed securely through Stripe.",
      },
    ],
  },
  {
    category: "Shipping",
    questions: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Next-day delivery is available for select locations.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes! We ship to over 50 countries worldwide. International shipping times vary by location, typically 7-14 business days.",
      },
      {
        question: "Is shipping free?",
        answer:
          "We offer free standard shipping on all orders over $100 within the US. For orders under $100, shipping is $9.99.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy on all unused items in original packaging. Returns are free for US customers.",
      },
      {
        question: "How do I start a return?",
        answer:
          "Log into your account, go to Order History, select the order, and click 'Return Items'. We'll email you a prepaid shipping label.",
      },
      {
        question: "How long does it take to get my refund?",
        answer:
          "Once we receive your return, refunds are processed within 5-7 business days. Please allow an additional 5-10 days for the refund to appear on your statement.",
      },
    ],
  },
  {
    category: "Products",
    questions: [
      {
        question: "Are your products authentic?",
        answer:
          "Yes, all our products are 100% authentic. We work directly with brands and authorized distributors to ensure authenticity.",
      },
      {
        question: "How do I care for my leather bag?",
        answer:
          "We recommend using a leather conditioner every 3-6 months, avoiding prolonged sun exposure, and storing your bag in a dust bag when not in use.",
      },
      {
        question: "Do you offer product warranties?",
        answer:
          "All our products come with a 1-year warranty against manufacturing defects. Premium brands may have extended warranties.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Find answers to common questions about orders, shipping, returns, and
          more.
        </p>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={category.category}>
              <h2 className="text-xl font-semibold mb-4">
                {category.category}
              </h2>
              <div className="space-y-2">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <div key={index} className="border rounded-lg">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                      >
                        <span className="font-medium">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
          <h3 className="font-semibold text-lg mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you with any questions.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}