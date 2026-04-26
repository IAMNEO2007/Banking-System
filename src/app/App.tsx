import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
