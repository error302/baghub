import Link from "next/link";

const shippingOptions = [
  {
    name: "Standard Shipping",
    price: "Free over $100",
    priceNote: "$9.99 for orders under $100",
    time: "5-7 business days",
    description: "Best for most orders",
  },
  {
    name: "Express Shipping",
    price: "$19.99",
    time: "2-3 business days",
    description: "When you need it faster",
  },
  {
    name: "Next Day Delivery",
    price: "$34.99",
    time: "Next business day",
    description: "Order by 2pm EST",
  },
];

const internationalZones = [
  { zone: "Canada", time: "7-10 business days", price: "$14.99" },
  { zone: "United Kingdom", time: "10-14 business days", price: "$24.99" },
  { zone: "European Union", time: "10-14 business days", price: "$24.99" },
  { zone: "Australia", time: "14-21 business days", price: "$29.99" },
  { zone: "Rest of World", time: "14-21 business days", price: "$34.99" },
];

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Shipping Information
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Fast, reliable shipping to get your bags to you quickly.
        </p>

        {/* Domestic Shipping */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">US Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option) => (
              <div
                key={option.name}
                className="border rounded-lg p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg mb-2">{option.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {option.price}
                </p>
                {option.priceNote && (
                  <p className="text-sm text-gray-500 mb-2">
                    {option.priceNote}
                  </p>
                )}
                <p className="text-gray-600 mb-2">{option.time}</p>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* International Shipping */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">International Shipping</h2>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Delivery Time
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Shipping Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {internationalZones.map((zone) => (
                  <tr key={zone.zone}>
                    <td className="px-6 py-4">{zone.zone}</td>
                    <td className="px-6 py-4 text-gray-600">{zone.time}</td>
                    <td className="px-6 py-4 font-medium">{zone.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            * International orders may be subject to customs duties and taxes
            upon arrival. These fees are the responsibility of the customer.
          </p>
        </section>

        {/* Order Processing */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Order Processing</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">1.</span>
                <div>
                  <strong>Order Placed</strong>
                  <p className="text-gray-600 text-sm">
                    You'll receive an order confirmation email immediately.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">2.</span>
                <div>
                  <strong>Processing</strong>
                  <p className="text-gray-600 text-sm">
                    Orders are processed within 1-2 business days.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">3.</span>
                <div>
                  <strong>Shipped</strong>
                  <p className="text-gray-600 text-sm">
                    You'll receive tracking information via email.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">4.</span>
                <div>
                  <strong>Delivered</strong>
                  <p className="text-gray-600 text-sm">
                    Your package arrives at your doorstep!
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Shipping FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Shipping FAQs</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                Can I change my shipping address after placing an order?
              </h3>
              <p className="text-gray-600">
                You can change your shipping address within 1 hour of placing
                your order. After that, the order enters processing and the
                address cannot be changed.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                Do you ship to P.O. boxes?
              </h3>
              <p className="text-gray-600">
                Yes, we ship to P.O. boxes for standard shipping. Express and
                next-day delivery require a physical address.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                What if my package is lost or damaged?
              </h3>
              <p className="text-gray-600">
                Contact us immediately if your package is lost or arrives
                damaged. We'll work with the carrier to resolve the issue and
                ensure you receive your order.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-gray-50 rounded-lg p-8">
          <h3 className="font-semibold text-lg mb-2">Ready to shop?</h3>
          <p className="text-gray-600 mb-4">
            Browse our collection of premium bags with fast, free shipping.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}