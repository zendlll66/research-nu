import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "HOME", href: "/" },
  { name: "RESEARCH", href: "/research" },
  { name: "EBOOK", href: "/ebook" },
  { name: "DASHBOARD", href: "/dashboard/managenews" },
];

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token");
  const isDashboard = location.pathname.startsWith("/dashboard"); // ✅ Check if it's `/dashboard` or any child

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      {/* Render Header only if not on Dashboard or its child */}
      {!isDashboard && (
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            aria-label="Global"
            className="flex items-center justify-between p-6 lg:px-8 text-white"
          >
            <div className="flex lg:flex-1">
              <a href="/" className="-m-1.5 p-1.5">
                <img
                  alt="Logo"
                  src="/assets/logo.png"
                  className="h-14 w-auto mt-[-20px]"
                />
              </a>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="text-black h-6 w-6" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm/6 font-semibold text-gray-700 hover:text-orange-400"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-sm/6 font-semibold text-red-500 "
                >
                  Logout
                </button>
              ) : (
                <a
                  href="/foradmin"
                  className="text-sm/6 font-semibold text-green-500"
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </div>
          </nav>
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50 bg-white" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-orange-500 ">
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <img alt="Logo" src="/assets/logo.png" className="h-8 w-auto" />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-black"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-black hover:bg-orange-500"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-black "
                      >
                        Logout
                      </button>
                    ) : (
                      <a
                        href="/foradmin"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white bg-green-500 hover:bg-green-600"
                      >
                        Log in
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </header>
      )}

      {/* Render main content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
