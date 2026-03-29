import { SelectPost } from "../db/schema";
import Post from "./Post";

type PostsListProps = {
  posts: SelectPost[];
};

export default function PostsList({ posts }: PostsListProps) {
  return (
    <div id="posts-list" class="w-full">
      {posts.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
}
