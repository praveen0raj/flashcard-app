export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Flashcard App
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Learn Smarter with Spaced Repetition
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
