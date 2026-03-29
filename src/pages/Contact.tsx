import MainLayout from "../layouts/MainLayout";

export default function Contact({
  isLoggedIn = false,
  isAdmin = false,
  userEmail = "",
}: {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  userEmail?: string;
}) {
  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      isAdmin={isAdmin}
      currentPath="/contact"
    >
      <div class="pb-16">
        {/* Two-column layout */}
        <div class="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left column - Form */}
          <div class="flex-1 min-w-0">
            <h1 class="text-3xl md:text-4xl font-extrabold text-blue-900 leading-tight mb-4">
              Contact Our Technical Team
            </h1>
            <p class="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              Our engineering experts are available to discuss system
              integration, technical specifications, and global partnership
              opportunities. Use the precision inquiry form below.
            </p>

            {!isLoggedIn ? (
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p class="text-sm text-blue-900">
                  Please{" "}
                  <a href="/login" class="font-semibold hover:underline">
                    log in
                  </a>{" "}
                  to send an inquiry.
                </p>
              </div>
            ) : (
              <form
                method="post"
                action="/api/inquiries"
                class="space-y-6 bg-white"
              >
                {/* Full Name and Organization */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-semibold tracking-widest uppercase text-slate-600 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Marcus Chen"
                      required
                      class="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold tracking-widest uppercase text-slate-600 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      placeholder="Company Name"
                      class="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Email and Subject */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-semibold tracking-widest uppercase text-slate-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="m.chen@corporate.com"
                      required
                      value={userEmail}
                      class="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold tracking-widest uppercase text-slate-600 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      required
                      class="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="Technical Support">
                        Technical Support
                      </option>
                      <option value="System Integration">
                        System Integration
                      </option>
                      <option value="Partnership">Partnership</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label class="block text-xs font-semibold tracking-widest uppercase text-slate-600 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Detailed technical requirements or inquiry details..."
                    required
                    rows={6}
                    class="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white resize-none"
                  ></textarea>
                </div>

                {/* Security note and button */}
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-2 text-xs text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Encrypted transmission via SSL
                  </div>
                  <button
                    type="submit"
                    class="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded transition-colors"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right column - Contact Info */}
          <aside class="w-full lg:w-80 shrink-0">
            {/* Quick Connect */}
            <div class="mb-8">
              <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">
                Quick Connect
              </p>
              <p class="text-xs font-semibold tracking-widest uppercase text-slate-600 mb-6">
                INKSPEC GLOBAL HUB
              </p>

              <div class="space-y-4">
                {/* Office Locations */}
                <div class="flex gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-blue-900 shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <p class="text-xs font-semibold tracking-widest uppercase text-slate-600 mb-2">
                      Office Locations
                    </p>
                  </div>
                </div>

                {/* Direct Contact */}
                <div class="flex gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-blue-900 shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <div>
                    <p class="text-xs font-semibold tracking-widest uppercase text-slate-600 mb-2">
                      Direct Contact
                    </p>
                  </div>
                </div>

                {/* Technical Support */}
                <div class="flex gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-blue-900 shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M18 21H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z" />
                    <polyline points="10 19 14 19 12 15" />
                  </svg>
                  <div>
                    <p class="text-xs font-semibold tracking-widest uppercase text-slate-600 mb-2">
                      Technical Support
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Hubs */}
            <div class="mb-8">
              <p class="text-xs font-semibold tracking-widest uppercase text-blue-900 mb-4">
                Global Hubs
              </p>

              <div class="space-y-6">
                {/* North America */}
                <div>
                  <p class="font-semibold text-slate-900 mb-1">North America</p>
                  <p class="text-xs text-slate-600 leading-relaxed mb-2">
                    7800 Trans-Canada Hwy, Montreal, QC H4T 1A5, Canada
                  </p>
                  <a
                    href="tel:+15143330000"
                    class="text-xs font-semibold text-blue-900 hover:underline"
                  >
                    +1 (514) 333-0000
                  </a>
                </div>

                {/* Europe */}
                <div>
                  <p class="font-semibold text-slate-900 mb-1">Europe</p>
                  <p class="text-xs text-slate-600 leading-relaxed mb-2">
                    Parc d'Activités de la Plaine, Impasse du Mas, 34470 Pérols,
                    France
                  </p>
                  <a
                    href="tel:+33487000000"
                    class="text-xs font-semibold text-blue-900 hover:underline"
                  >
                    +33 (0)4 87 00 00 00
                  </a>
                </div>

                {/* Asia Pacific */}
                <div>
                  <p class="font-semibold text-slate-900 mb-1">Asia Pacific</p>
                  <p class="text-xs text-slate-600 leading-relaxed mb-2">
                    Technopark @ Chai Chee, 7508 Chai Chee Rd, Singapore 469002
                  </p>
                  <a
                    href="tel:+6567000000"
                    class="text-xs font-semibold text-blue-900 hover:underline"
                  >
                    +65 6700 0000
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Support */}
            <div>
              <p class="text-xs font-semibold tracking-widest uppercase text-blue-900 mb-4">
                Direct Support
              </p>

              <div class="space-y-3 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-600">Technical Help</span>
                  <a
                    href="mailto:support@inkspec.com"
                    class="text-blue-900 hover:underline font-semibold"
                  >
                    SUPPORT@INKSPEC.COM
                  </a>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Sales & Quotes</span>
                  <a
                    href="mailto:sales@inkspec.com"
                    class="text-blue-900 hover:underline font-semibold"
                  >
                    SALES@INKSPEC.COM
                  </a>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Partnerships</span>
                  <a
                    href="mailto:partners@inkspec.com"
                    class="text-blue-900 hover:underline font-semibold"
                  >
                    PARTNERS@INKSPEC.COM
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
