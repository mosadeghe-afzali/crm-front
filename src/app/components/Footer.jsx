"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">درباره دیوار</h3>
            <p className="text-gray-300 text-sm mb-4">
              دیوار سامانه خرید و فروش آسان و سریع در سراسر ایران است که با
              هدف تسهیل ارتباط بین خریداران و فروشندگان راه‌اندازی شده است.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">لینک‌های سریع</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  خانه
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  ثبت آگهی
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  ورود
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  قوانین و مقررات
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">دسته‌بندی‌ها</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  املاک
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  خودرو
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  لوازم خانگی
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  موبایل و تبلت
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">تماس با ما</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>
                <i className="fas fa-phone ml-2"></i>
                تلفن پشتیبانی: 021-12345678
              </p>
              <p>
                <i className="fas fa-envelope ml-2"></i>
                ایمیل: support@divar-clone.ir
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <i className="fab fa-telegram text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300 text-sm">
            <p>© ۱۴۰۳ دیوار کلون. تمامی حقوق محفوظ است.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">
                حریم خصوصی
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                شرایط استفاده
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

