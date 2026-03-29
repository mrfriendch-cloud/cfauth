import { SelectPost } from "../db/schema";

export default function Post({ post }: { post: SelectPost }) {
  const containerId = `post-content-${post.id}`;
  const safeContent = JSON.stringify(post.content);

  return (
    <div
      key={post.id}
      class="block min-w-96 mb-2 p-6 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <h5 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <a href={`/posts/${post.id}`} class="hover:underline">
          {post.title}
        </a>
      </h5>
      {post.description && (
        <p class="mb-2 text-sm text-gray-400 italic">{post.description}</p>
      )}
      {post.tags && (
        <div class="flex flex-wrap gap-1 mb-3">
          {post.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .map((tag) => (
              <span class="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
        </div>
      )}
      <div
        id={containerId}
        class="font-normal text-gray-300 prose-headings:font-bold prose-headings:text-white [&_h1]:text-3xl [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1 [&_a]:text-blue-400 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:bg-gray-700 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-gray-700 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_img]:max-w-full [&_iframe]:max-w-full"
      ></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
  var rawContent = ${safeContent};
  var container = document.getElementById(${JSON.stringify(containerId)});
  if(container && typeof marked !== 'undefined'){
    container.innerHTML = marked.parse(rawContent, { breaks: true });
  }
})();`,
        }}
      />
    </div>
  );
}
