import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Return Policy",
  description:
    "Learn about BagHub's return and exchange policy. Easy 30-day returns on all orders.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Return Policy</h1>

      <p className="text-gray-600 mb-8">Last updated: January 15, 2025</p>

      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">30-Day Returns</h2>
          <p className="text-gray-700">
            We want you to love your purchase. If you're not completely
            satisfied, you can return most items within 30 days of delivery for a
            full refund.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Eligibility Requirements
          </h2>
          <p className="text-gray-700 mb-4">
            To be eligible for a return, your item must be:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Unused and in the same condition that you received it</li>
            <li>In the original packaging</li>
            <li>Accompanied by the receipt or proof of purchase</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Non-Returnable Items
          </h2>
          <p className="text-gray-700 mb-4">
            The following items cannot be returned:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Gift cards</li>
            <li>Personalized or custom items</li>
            <li>Sale items marked as final sale</li>
            <li>Items damaged through normal wear and tear</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <ol className="list-decimal pl-6 text-gray-700 space-y-4">
              <li>
                <strong>Start your return:</strong> Log into your account and go
                to Order History. Select the order and click "Return Items."
              </li>
              <li>
                <strong>Print shipping label:</strong> We'll email you a prepaid
                shipping label. Print it and attach it to your package.
              </li>
              <li>
                <strong>Ship your return:</strong> Drop off your package at any
                authorized shipping location.
              </li>
              <li>
                <strong>Receive refund:</strong> Once we receive and inspect your
                return, we'll process your refund within 5-7 business days.
              </li>
            </ol>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Method</h2>
          <p className="text-gray-700">
            Refunds will be issued to the original payment method used for the
            purchase. Please allow 5-10 business days for the refund to appear on
            your statement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
          <p className="text-gray-700">
            We currently do not offer direct exchanges. If you'd like a different
            size or color, please return your original item and place a new order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Damaged or Defective Items
          </h2>
          <p className="text-gray-700">
            If you receive a damaged or defective item, please contact us
            immediately at support@baghub.com with photos of the damage. We'll
            arrange a replacement or full refund at no additional cost.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            Have questions about returns? We're here to help:
          </p>
          <p className="text-gray-700 mt-2">
            Email: returns@baghub.com
            <br />
            Phone: 1-800-BAGHUB
            <br />
            Hours: Monday - Friday, 9am - 6pm EST
          </p>
        </section>

        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-2">Need to start a return?</h3>
          <p className="text-gray-600 mb-4">
            Log into your account to initiate a return request.
          </p>
          <Link
            href="/account/orders"
            className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}