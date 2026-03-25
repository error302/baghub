import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the BagHub website and services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <p className="text-gray-600 mb-8">Last updated: January 15, 2025</p>

      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700">
            By accessing and using the BagHub website (baghub.com), you accept
            and agree to be bound by these Terms of Service. If you do not agree
            to these terms, please do not use our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Website</h2>
          <p className="text-gray-700 mb-4">
            You agree to use our website only for lawful purposes and in a way
            that does not infringe upon the rights of others. You agree not to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Use the website for any fraudulent or unlawful purpose</li>
            <li>Interfere with or disrupt the website's operation</li>
            <li>Attempt to gain unauthorized access to any part of the website</li>
            <li>Use any automated means to access or collect data from the website</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
          <p className="text-gray-700">
            When you create an account with us, you must provide accurate and
            complete information. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Products and Purchases
          </h2>
          <p className="text-gray-700">
            All products displayed on our website are subject to availability. We
            reserve the right to discontinue any product at any time. Prices for
            our products are subject to change without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Payment and Billing
          </h2>
          <p className="text-gray-700">
            By providing payment information, you represent and warrant that you
            are authorized to use the payment method. All payments are processed
            securely through our payment providers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Intellectual Property
          </h2>
          <p className="text-gray-700">
            All content on this website, including text, graphics, logos, images,
            and software, is the property of BagHub or its content suppliers and
            is protected by intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Limitation of Liability
          </h2>
          <p className="text-gray-700">
            BagHub shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of or
            inability to use the website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Changes to Terms
          </h2>
          <p className="text-gray-700">
            We reserve the right to modify these Terms of Service at any time.
            Changes will be effective immediately upon posting on the website.
            Your continued use of the website constitutes acceptance of any
            changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms of Service, please
            contact us at:
          </p>
          <p className="text-gray-700 mt-2">
            Email: legal@baghub.com
            <br />
            Address: 123 Fashion Street, New York, NY 10001
          </p>
        </section>
      </div>
    </div>
  );
}