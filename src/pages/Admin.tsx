import { SelectUser, SelectInquiry } from "../db/schema";
import MainLayout from "../layouts/MainLayout";

export default function Admin({
  users,
  inquiries,
}: {
  users: SelectUser[];
  inquiries: SelectInquiry[];
}) {
  return (
    <MainLayout isLoggedIn currentPath="/admin">
      <div class="pb-16">
        <h1 class="text-3xl md:text-4xl font-extrabold text-blue-900 mb-8">
          Admin Panel
        </h1>

        {/* Tabs */}
        <div class="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onclick="document.getElementById('users-tab').classList.remove('hidden'); document.getElementById('inquiries-tab').classList.add('hidden'); this.classList.add('border-b-2', 'border-blue-900'); document.querySelector('[data-tab=inquiries]').classList.remove('border-b-2', 'border-blue-900');"
            data-tab="users"
            class="px-4 py-2 font-semibold text-slate-600 hover:text-blue-900 border-b-2 border-blue-900 transition-colors"
          >
            Users
          </button>
          <button
            onclick="document.getElementById('inquiries-tab').classList.remove('hidden'); document.getElementById('users-tab').classList.add('hidden'); this.classList.add('border-b-2', 'border-blue-900'); document.querySelector('[data-tab=users]').classList.remove('border-b-2', 'border-blue-900');"
            data-tab="inquiries"
            class="px-4 py-2 font-semibold text-slate-600 hover:text-blue-900 transition-colors"
          >
            Inquiries
          </button>
        </div>

        {/* Users Tab */}
        <div id="users-tab">
          {/* Desktop Table */}
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50">
                  <th class="px-4 py-3 font-semibold text-slate-700">Email</th>
                  <th class="px-4 py-3 font-semibold text-slate-700">ID</th>
                  <th class="px-4 py-3 font-semibold text-slate-700">Role</th>
                  <th class="px-4 py-3 font-semibold text-slate-700">Status</th>
                  <th class="px-4 py-3 font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    class="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td class="px-4 py-3 text-slate-900">{user.email}</td>
                    <td class="px-4 py-3 text-slate-500 text-xs font-mono">
                      {user.id}
                    </td>
                    <td class="px-4 py-3">
                      <form
                        hx-patch={`/api/admin/users/${user.id}/role`}
                        hx-target="closest tr"
                        hx-swap="outerHTML"
                        class="flex items-center gap-2"
                      >
                        <select
                          name="role"
                          class="bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                        >
                          <option value="user" selected={user.role === "user"}>
                            user
                          </option>
                          <option
                            value="admin"
                            selected={user.role === "admin"}
                          >
                            admin
                          </option>
                        </select>
                        <button
                          type="submit"
                          class="bg-blue-900 hover:bg-blue-800 text-white text-xs px-2 py-1 rounded transition-colors"
                        >
                          Save
                        </button>
                      </form>
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class={`text-xs font-semibold px-2 py-1 rounded ${
                          user.banned
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <button
                        hx-patch={`/api/admin/users/${user.id}/ban`}
                        hx-vals={`{"banned": "${!user.banned}"}`}
                        hx-target="closest tr"
                        hx-swap="outerHTML"
                        class={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
                          user.banned
                            ? "bg-green-100 hover:bg-green-200 text-green-700"
                            : "bg-red-100 hover:bg-red-200 text-red-700"
                        }`}
                      >
                        {user.banned ? "Unban" : "Ban"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div class="md:hidden space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                class="border border-slate-200 rounded-lg p-4 bg-white"
              >
                <div class="mb-4">
                  <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-1">
                    Email
                  </p>
                  <p class="text-slate-900 font-semibold break-all">
                    {user.email}
                  </p>
                </div>

                <div class="mb-4">
                  <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-1">
                    ID
                  </p>
                  <p class="text-slate-500 text-xs font-mono break-all">
                    {user.id}
                  </p>
                </div>

                <div class="mb-4">
                  <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
                    Role
                  </p>
                  <form
                    hx-patch={`/api/admin/users/${user.id}/role`}
                    hx-target="closest div"
                    hx-swap="outerHTML"
                    class="flex items-center gap-2"
                  >
                    <select
                      name="role"
                      class="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="user" selected={user.role === "user"}>
                        user
                      </option>
                      <option value="admin" selected={user.role === "admin"}>
                        admin
                      </option>
                    </select>
                    <button
                      type="submit"
                      class="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded transition-colors whitespace-nowrap"
                    >
                      Save
                    </button>
                  </form>
                </div>

                <div class="mb-4">
                  <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
                    Status
                  </p>
                  <span
                    class={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                      user.banned
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.banned ? "Banned" : "Active"}
                  </span>
                </div>

                <div>
                  <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
                    Action
                  </p>
                  <button
                    hx-patch={`/api/admin/users/${user.id}/ban`}
                    hx-vals={`{"banned": "${!user.banned}"}`}
                    hx-target="closest div"
                    hx-swap="outerHTML"
                    class={`w-full text-xs font-semibold px-3 py-2 rounded transition-colors ${
                      user.banned
                        ? "bg-green-100 hover:bg-green-200 text-green-700"
                        : "bg-red-100 hover:bg-red-200 text-red-700"
                    }`}
                  >
                    {user.banned ? "Unban" : "Ban"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiries Tab */}
        <div id="inquiries-tab" class="hidden overflow-x-auto">
          {inquiries.length === 0 ? (
            <div class="text-center py-12 text-slate-500">
              No inquiries yet.
            </div>
          ) : (
            <div class="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  class="border border-slate-200 rounded-lg p-4 md:p-6 bg-white hover:shadow-md transition-shadow"
                >
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-1">
                        Full Name
                      </p>
                      <p class="text-slate-900 font-semibold">
                        {inquiry.fullName}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${inquiry.email}`}
                        class="text-blue-900 hover:underline break-all"
                      >
                        {inquiry.email}
                      </a>
                    </div>
                    <div>
                      <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-1">
                        Organization
                      </p>
                      <p class="text-slate-900">
                        {inquiry.organization || "—"}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-1">
                        Subject
                      </p>
                      <p class="text-slate-900 font-semibold">
                        {inquiry.subject}
                      </p>
                    </div>
                  </div>

                  <div class="mb-4">
                    <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
                      Message
                    </p>
                    <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {inquiry.message}
                    </p>
                  </div>

                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-4 border-t border-slate-200">
                    <p class="text-xs text-slate-500">
                      Submitted: {new Date(inquiry.createdAt).toLocaleString()}
                    </p>
                    <p class="text-xs text-slate-500">
                      User ID: <span class="font-mono">{inquiry.userId}</span>
                    </p>
                  </div>

                  <div class="mt-4 pt-4 border-t border-slate-200">
                    <button
                      hx-delete={`/api/admin/inquiries/${inquiry.id}`}
                      hx-target="closest div"
                      hx-swap="outerHTML swap:1s"
                      hx-confirm="Are you sure you want to delete this inquiry?"
                      class="w-full md:w-auto bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-4 py-2 rounded transition-colors"
                    >
                      Delete Inquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
