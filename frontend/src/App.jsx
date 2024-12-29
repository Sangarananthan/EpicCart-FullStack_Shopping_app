import { Analytics } from "@vercel/analytics/react";
const App = () => {
  return (
    <div className="min-h-screen bg-green-100">
      <Analytics />
      <h1 className="text-3xl font-bold text-center py-8">My Shopping App</h1>
    </div>
  );
};

export default App;
