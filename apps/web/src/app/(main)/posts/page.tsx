"use client";

import { useState } from "react";
import { PostCard } from "@/features/feed";
import EmptyState from "@/features/feed/components/EmptyState";
import { CreatePostCard } from "@/features/post/components/CreatePostCard";
import Loading from "@/shared/components/ui/Loading";
import { useGetMe, useGetPostList, useUpdatePost } from "@/shared/hooks";

export default function MyPosts() {
  const { data: me } = useGetMe();
  const {
    data: postList,
    isLoading,
    mutate,
  } = useGetPostList(me?.id ? { userId: me.id } : undefined);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const posts = postList?.data ?? [];

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full py-6">
      {isLoading ? (
        <Loading />
      ) : posts.length === 0 ? (
        <EmptyState title="คุณยังไม่มีโพสต์" />
      ) : (
        posts.map((post) =>
          editingPostId === post.id ? (
            <EditingPostCard
              key={post.id}
              post={post}
              onDone={() => {
                setEditingPostId(null);
                mutate();
              }}
              onCancel={() => setEditingPostId(null)}
            />
          ) : (
            <PostCard
              key={post.id}
              postId={post.id}
              title={post.title}
              description={post.description}
              tags={post.tags}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              authorInfo={post.authorInfo}
              createdAt={post.createdAt}
              imageUrl={post.images[0] ?? null}
              isOwner
              onEditClick={() => setEditingPostId(post.id)}
              onDeleted={mutate}
            />
          )
        )
      )}
    </div>
  );
}

interface EditingPostCardProps {
  post: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    images: string[];
  };
  onDone: () => void;
  onCancel: () => void;
}

function EditingPostCard({ post, onDone }: EditingPostCardProps) {
  const { trigger: updatePost, isMutating } = useUpdatePost(post.id);

  return (
    <CreatePostCard
      mode="edit"
      initialTitle={post.title}
      initialDescription={post.description}
      initialTags={post.tags}
      initialImage={post.images[0] ?? null}
      loading={isMutating}
      onSubmit={async ({ title, description, tags }) => {
        await updatePost({ title, description, tags });
        onDone();
      }}
    />
  );
}
