// components/LayoutWithSidebar.jsx
import Sidebar from './Sidebar';

export default function LayoutWithSidebar({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}