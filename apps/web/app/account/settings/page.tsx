"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    reviews: true,
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setLoading(false);
  };

  const handlePasswordChange = async () => {
    if (password.new !== password.confirm) {
      alert("New passwords don't match");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Password updated successfully");
    setPassword({ current: "", new: "", confirm: "" });
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/account"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to Account
          </Link>
          <h1 className="text-3xl font-bold mt-2">Account Settings</h1>
        </div>

        {/* Profile Section */}
        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

          {saved && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
              Changes saved successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <button
              onClick={handleProfileSave}
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>

        {/* Password Section */}
        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={password.current}
                onChange={(e) =>
                  setPassword({ ...password, current: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password.new}
                onChange={(e) =>
                  setPassword({ ...password, new: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) =>
                  setPassword({ ...password, confirm: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={loading || !password.current || !password.new}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-gray-500">
                  Receive updates about your orders
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.orderUpdates}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    orderUpdates: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotions</p>
                <p className="text-sm text-gray-500">
                  Receive special offers and discounts
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    promotions: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-gray-500">
                  Weekly updates on new arrivals
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.newsletter}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    newsletter: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Review Reminders</p>
                <p className="text-sm text-gray-500">
                  Reminders to review purchased products
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.reviews}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    reviews: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </label>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Danger Zone
          </h2>
          <p className="text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
}