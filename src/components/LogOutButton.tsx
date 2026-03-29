export default function LogOutButton() {
  return (
    <form method="post" action="/api/auth/logout">
      <button class="text-sm text-slate-600 hover:text-blue-900 transition-colors">
        Log out
      </button>
    </form>
  );
}
