import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how BagHub collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <p className="text-gray-600 mb-8">Last updated: January 15, 2025</p>

      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700">
            Welcome to BagHub ("we," "our," or "us"). We are committed to
            protecting your personal information and your right to privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit our website baghub.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            We collect information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Register for an account</li>
            <li>Place an order</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact our customer support</li>
            <li>Participate in promotions or surveys</li>
          </ul>
          <p className="text-gray-700 mt-4">
            This information may include your name, email address, shipping
            address, phone number, and payment information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Send you order confirmations and shipping updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Detect and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Information Sharing
          </h2>
          <p className="text-gray-700">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except as
            necessary to provide our services (e.g., payment processing, shipping
            carriers).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="text-gray-700 mt-2">
            Email: privacy@baghub.com
            <br />
            Address: 123 Fashion Street, New York, NY 10001
          </p>
        </section>
      </div>
    </div>
  );
}