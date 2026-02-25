import { Shield, CreditCard, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <span className="text-black font-bold text-sm">L</span>
              </div>
              <span className="font-serif text-xl font-bold text-white">
                LumiRead
              </span>
            </div>
            <p className="text-sm text-neutral-500">
              Rechargeable Book Light
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contato"
                  className="text-sm text-neutral-400 hover:text-amber-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm text-neutral-400 hover:text-amber-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Get In Touch
            </h4>
            <a
              href="mailto:hello@lumi-read.com"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@lumi-read.com
            </a>
            <div className="flex items-center gap-4 text-neutral-500 mt-4">
              <div className="flex items-center gap-1">
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Card</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-5 h-5" />
                <span className="text-xs">SSL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 text-center">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} LumiRead. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
