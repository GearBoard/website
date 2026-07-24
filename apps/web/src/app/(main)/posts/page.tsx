"use client";

import { useState } from "react";
import { PostCard } from "@/features/feed";
import { CreatePostCard } from "@/features/post/components/CreatePostCard";
import { useGetMe, useGetPostList, useUpdatePost } from "@/shared/hooks";

export default function MyPosts() {
  const { data: me, isLoading: isLoadingMe } = useGetMe();
  const {
    data: postList,
    isLoading: isLoadingPosts,
    mutate,
  } = useGetPostList(me?.id ? { userId: me.id } : undefined, !!me?.id);
  const isLoading = isLoadingMe || isLoadingPosts;
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const posts = postList?.data ?? [];

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full py-6">
      {isLoading ? (
        <p className="text-center text-dark-gray">กำลังโหลด...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-dark-gray">คุณยังไม่มีโพสต์</p>
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

function EditingPostCard({ post, onDone, onCancel }: EditingPostCardProps) {
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
      onCancel={onCancel}
    />
  );
}
