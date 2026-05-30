import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminTopNavbar from './AdminTopNavbar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">

      {/* ── Desktop Sidebar ───────────────────────────────────────── */}
      <div className="hidden lg:block">
        <AdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(v => !v)}
        />
      </div>

      {/* ── Mobile Sidebar Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <AdminSidebar
                isOpen={true}
                onToggle={() => setMobileMenuOpen(false)}
                isMobile
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Top Navbar ────────────────────────────────────────────── */}
      <AdminTopNavbar
        onMenuClick={() => setMobileMenuOpen(true)}
        sidebarOpen={sidebarOpen}
      />

      {/* ── Main Content ──────────────────────────────────────────── */}
      {/*
        The margin-left matches the sidebar width so content doesn't
        go under the sidebar. Sidebar z-30, content stays at z-0,
        so there is no overlap / click blocking.
      */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
        style={{ position: 'relative', zIndex: 0 }}
      >
        {/* pt-16 = exact navbar height (h-16 = 64px) */}
        <main className="pt-16 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
