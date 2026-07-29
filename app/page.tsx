export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Home Goods Manager
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Track and manage your household inventory with ease
          </p>
          <div className="space-x-4">
            <a
              href="/auth/login"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="inline-block rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-300"
            >
              Sign Up
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              📦 Track Inventory
            </h3>
            <p className="text-gray-600">
              Keep track of all your household items, expiration dates, and
              quantities.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              ⏰ Smart Alerts
            </h3>
            <p className="text-gray-600">
              Get notified when items are expiring or when opened items need to
              be used soon.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              🍳 Recipes
            </h3>
            <p className="text-gray-600">
              Manage recipes and track which items you use for each meal.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
