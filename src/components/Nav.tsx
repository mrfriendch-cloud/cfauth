import LogOutButton from "./LogOutButton";

type NavProps = {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  currentPath?: string;
};

export default function Nav({
  isLoggedIn,
  isAdmin = false,
  currentPath = "/",
}: NavProps) {
  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };
  return (
    <nav class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href={isLoggedIn ? "/posts" : "/"}
          class="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-tight shrink-0 hover:from-cyan-300 hover:to-blue-300 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-7 h-7 text-cyan-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          Negative
        </a>

        {/* Center links — hidden on mobile */}
        <div class="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "Home" },
            { href: "/services", label: "Services" },
            { href: "/news", label: "News" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <a
              href={link.href}
              class={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div class="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <a
              href="/login"
              class="text-sm bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:shadow-xl transform hover:scale-105"
            >
              Log in
            </a>
          ) : (
            <div class="flex items-center gap-4">
              <a
                href="/write"
                class="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:shadow-xl transform hover:scale-105"
              >
                Create
              </a>
              <LogOutButton />
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          class="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
          aria-label="Toggle menu"
          onclick="toggleMobileMenu()"
        >
          <svg
            id="hamburger-icon"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            id="close-icon"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 hidden transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu — animated with max-height transition */}
      <div
        id="mobile-menu"
        style="max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease; opacity: 0;"
        class="md:hidden border-t border-slate-700/0 bg-slate-800/95 backdrop-blur"
      >
        <div class="px-6 py-4 flex flex-col gap-3">
          {[
            { href: "/", label: "Home" },
            { href: "/services", label: "Services" },
            { href: "/news", label: "News" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <a
              href={link.href}
              class={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div class="border-t border-slate-700/50 pt-3 flex flex-col gap-3">
            {!isLoggedIn ? (
              <a
                href="/login"
                class="text-sm bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg text-center transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
              >
                Log in
              </a>
            ) : (
              <>
                <a
                  href="/write"
                  class="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold px-6 py-2.5 rounded-lg text-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
                >
                  Create
                </a>
                <LogOutButton />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop overlay for outside-click */}
      <div
        id="mobile-menu-overlay"
        onclick="closeMobileMenu()"
        style="display:none; position:fixed; inset:0; z-index:-1; background:transparent;"
      ></div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
        var menuOpen = false;
        var menu = document.getElementById('mobile-menu');
        var overlay = document.getElementById('mobile-menu-overlay');
        var hamburger = document.getElementById('hamburger-icon');
        var closeIcon = document.getElementById('close-icon');

        function openMobileMenu() {
          menuOpen = true;
          menu.style.maxHeight = menu.scrollHeight + 'px';
          menu.style.opacity = '1';
          menu.style.borderTopColor = 'rgba(100,116,139,0.5)';
          overlay.style.display = 'block';
          hamburger.classList.add('hidden');
          closeIcon.classList.remove('hidden');
        }

        function closeMobileMenu() {
          menuOpen = false;
          menu.style.maxHeight = '0';
          menu.style.opacity = '0';
          menu.style.borderTopColor = 'transparent';
          overlay.style.display = 'none';
          hamburger.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }

        function toggleMobileMenu() {
          if (menuOpen) { closeMobileMenu(); } else { openMobileMenu(); }
        }
      `,
        }}
      />
    </nav>
  );
}
