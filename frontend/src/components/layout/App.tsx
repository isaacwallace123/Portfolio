import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="app-container flex-1 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
