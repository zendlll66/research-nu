import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "HOME", href: "/" },
  { name: "RESEARCH", href: "/research" },
  { name: "EBOOK", href: "/ebook" },
  { name: "DASHBOARD", href: "/dashboard" },
];

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation(); // ใช้เพื่อเช็ค pathname
  const navigate = useNavigate(); // ใช้สำหรับนำทางไปยังหน้า logout

  const isLoggedIn = localStorage.getItem("token"); // ตรวจสอบว่า login แล้วหรือยัง

  // ตรวจสอบว่าอยู่ในหน้า `/dashboard` หรือไม่
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token"); // ลบ token เมื่อทำการ logout
    navigate("/"); // นำทางไปหน้า home
  };

  return (
    <div>
      {/* ซ่อน Header หากอยู่ในหน้า /dashboard */}
      {!isDashboard && (
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            aria-label="Global"
            className="flex items-center justify-between p-6 lg:px-8"
          >
            <div className="flex lg:flex-1">
              <a href="/" className="-m-1.5 p-1.5">
                <img
                  alt=""
                  src="/assets/logo.png"
                  className="h-14 w-auto mt-[-20px]"
                />
              </a>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              {/* เปลี่ยนจาก Login เป็น Logout */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-sm/6 font-semibold text-red-400"
                >
                  Logout
                </button>
              ) : (
                <a
                  href="/foradmin"
                  className="text-sm/6 font-semibold text-green-400"
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </div>
          </nav>
          <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="/logo.png"
                    className="h-8 w-auto"
                  />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    ) : (
                      <a
                        href="/foradmin"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
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

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
