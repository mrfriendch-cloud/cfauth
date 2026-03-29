export default function Footer({
  isLoggedIn = false,
  isAdmin = false,
}: {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 text-slate-300 mt-16">
      <div class="max-w-7xl mx-auto px-6 py-12">
        {/* Main grid - responsive */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Brand - spans full width on mobile */}
          <div class="col-span-2 md:col-span-1">
            <h3 class="text-white font-bold text-lg mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Nega
            </h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              A place for technical writing, ideas, and deep dives.
            </p>
            {/* Social icons - mobile friendly */}
            <div class="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                title="GitHub"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                title="Twitter"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.5 5M9 19c1 0 1-1 1-1" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 class="text-white font-semibold text-sm mb-4">Navigation</h4>
            <ul class="space-y-2.5 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/news", label: "News" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li>
                  <a
                    href={link.href}
                    class="text-slate-400 hover:text-cyan-400 transition-colors duration-300 inline-flex items-center gap-1"
                  >
                    <span class="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 class="text-white font-semibold text-sm mb-4">Account</h4>
            <ul class="space-y-2.5 text-sm">
              {isLoggedIn ? (
                <>
                  <li>
                    <a
                      href="/posts"
                      class="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      My Posts
                    </a>
                  </li>
                  <li>
                    <a
                      href="/write"
                      class="text-slate-400 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Write Post
                    </a>
                  </li>
                  {isAdmin && (
                    <li>
                      <a
                        href="/admin"
                        class="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-semibold"
                      >
                        Admin Panel
                      </a>
                    </li>
                  )}
                  <li>
                    <a
                      href="/api/auth/logout"
                      class="text-slate-400 hover:text-red-400 transition-colors duration-300"
                    >
                      Log Out
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href="/login"
                      class="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      Log In
                    </a>
                  </li>
                  <li>
                    <a
                      href="/signup"
                      class="text-slate-400 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Sign Up
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 class="text-white font-semibold text-sm mb-4">Info</h4>
            <ul class="space-y-2.5 text-sm">
              {[
                { href: "/", label: "About" },
                { href: "/", label: "Privacy" },
                { href: "/", label: "Terms" },
              ].map((link) => (
                <li>
                  <a
                    href={link.href}
                    class="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div class="border-t border-slate-700/50 pt-8">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p class="text-sm text-slate-400 order-2 sm:order-1">
              © {currentYear} Nega. All rights reserved.
            </p>
            <div class="text-xs text-slate-500 space-x-4 order-1 sm:order-2">
              <a href="/" class="hover:text-cyan-400 transition-colors">
                Sitemap
              </a>
              <span class="text-slate-700">•</span>
              <a href="/" class="hover:text-cyan-400 transition-colors">
                Status
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
