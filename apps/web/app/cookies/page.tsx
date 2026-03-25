import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn about how BagHub uses cookies and similar technologies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>

      <p className="text-gray-600 mb-8">Last updated: January 15, 2025</p>

      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
          <p className="text-gray-700">
            Cookies are small text files that are placed on your computer or
            mobile device when you visit a website. They are widely used to make
            websites work more efficiently and to provide information to the
            owners of the site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            How We Use Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> These cookies are necessary for
              the website to function properly. They enable basic functions like
              page navigation and access to secure areas of the website.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> These cookies help us understand
              how visitors interact with our website by collecting and reporting
              information anonymously.
            </li>
            <li>
              <strong>Functional Cookies:</strong> These cookies enable the website
              to provide enhanced functionality and personalization, such as
              remembering your preferences.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> These cookies are used to track
              visitors across websites to display relevant advertisements.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-3 text-left">Cookie</th>
                  <th className="border p-3 text-left">Type</th>
                  <th className="border p-3 text-left">Purpose</th>
                  <th className="border p-3 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">session</td>
                  <td className="border p-3">Essential</td>
                  <td className="border p-3">Maintains your session</td>
                  <td className="border p-3">Session</td>
                </tr>
                <tr>
                  <td className="border p-3">cart</td>
                  <td className="border p-3">Essential</td>
                  <td className="border p-3">Stores your cart items</td>
                  <td className="border p-3">30 days</td>
                </tr>
                <tr>
                  <td className="border p-3">csrf-token</td>
                  <td className="border p-3">Essential</td>
                  <td className="border p-3">Security protection</td>
                  <td className="border p-3">1 hour</td>
                </tr>
                <tr>
                  <td className="border p-3">cookie-consent</td>
                  <td className="border p-3">Essential</td>
                  <td className="border p-3">Stores your cookie preference</td>
                  <td className="border p-3">1 year</td>
                </tr>
                <tr>
                  <td className="border p-3">_ga</td>
                  <td className="border p-3">Analytics</td>
                  <td className="border p-3">Google Analytics</td>
                  <td className="border p-3">2 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
          <p className="text-gray-700 mb-4">
            In addition to our own cookies, we may also use various third-party
            cookies to report usage statistics of the website and to deliver
            advertisements on and through the website.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Stripe:</strong> Used for payment processing
            </li>
            <li>
              <strong>Google Analytics:</strong> Used for website analytics
            </li>
            <li>
              <strong>Cloudinary:</strong> Used for image delivery
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Managing Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            Most web browsers allow you to control cookies through their settings
            preferences. However, if you limit the ability of websites to set
            cookies, you may impact your overall user experience.
          </p>
          <p className="text-gray-700 mb-4">
            To manage cookies in your browser:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Chrome:</strong> Settings → Privacy and Security → Cookies
            </li>
            <li>
              <strong>Firefox:</strong> Settings → Privacy & Security → Cookies
            </li>
            <li>
              <strong>Safari:</strong> Preferences → Privacy → Cookies
            </li>
            <li>
              <strong>Edge:</strong> Settings → Privacy, Search, and Services →
              Cookies
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
          <p className="text-gray-700">
            We may update this Cookie Policy from time to time. Any changes will
            be posted on this page with an updated revision date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about our use of cookies, please contact
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