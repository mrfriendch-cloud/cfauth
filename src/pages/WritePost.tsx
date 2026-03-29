import MainLayout from "../layouts/MainLayout";
import NewPost from "../components/NewPost";

const easymdeAssets = (
  <>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js"></script>
  </>
);

export default function WritePost({
  isAdmin = false,
  existingTags = [],
}: {
  isAdmin?: boolean;
  existingTags?: string[];
}) {
  return (
    <MainLayout
      isLoggedIn
      isAdmin={isAdmin}
      extraHeadAssets={easymdeAssets}
      currentPath="/write"
      fullWidth={true}
    >
      <div class="mt-6 pb-16">
        <a href="/posts" class="text-sm text-slate-500 hover:underline">
          ← Back to posts
        </a>
        <div class="mt-4">
          <NewPost existingTags={existingTags} />
        </div>
      </div>
    </MainLayout>
  );
}
