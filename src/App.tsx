import { LanguageSwitcher, GreetForm } from "./components";

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        {/* Greet Form */}
        <GreetForm />
      </div>
    </main>
  );
}

export default App;
