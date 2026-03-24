"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const user = session?.user;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{user?.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium capitalize">
                  {user?.role || "Customer"}
                </p>
              </div>
            </div>
            <Link
              href="/account/edit"
              className="mt-4 block text-center border border-gray-900 py-2 rounded-lg hover:bg-gray-50"
            >
              Edit Profile
            </Link>
          </div>

          {/* Orders Card */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">No orders yet</p>
              <Link
                href="/shop"
                className="text-gray-900 font-semibold hover:underline"
              >
                Start shopping
              </Link>
            </div>
          </div>

          {/* Addresses Card */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Addresses</h2>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">No addresses saved</p>
              <Link
                href="/account/addresses"
                className="text-gray-900 font-semibold hover:underline"
              >
                Add address
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/account/orders"
              className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">📦</div>
              <p className="font-medium">Orders</p>
            </Link>
            <Link
              href="/account/wishlist"
              className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">❤️</div>
              <p className="font-medium">Wishlist</p>
            </Link>
            <Link
              href="/account/addresses"
              className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">📍</div>
              <p className="font-medium">Addresses</p>
            </Link>
            <Link
              href="/account/settings"
              className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <p className="font-medium">Settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}