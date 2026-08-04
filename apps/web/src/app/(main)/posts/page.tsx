"use client";

import { Loader2 } from "lucide-react";
import { AboutCard, EmptyState, PostCard } from "@/features/feed";
import type { PostCardProps } from "@/features/feed";
import { useGetPostList } from "@/shared/hooks/posts";
import { useSession } from "@/shared/libs/auth-client";
import { cn } from "@/shared/libs/utils";

export default function MyPosts() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = useGetPostList(userId ? { userId } : null);

  const myPosts: (PostCardProps & { id: string })[] = (data?.data ?? []).map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    tags: post.tags,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    authorInfo: post.authorInfo,
    createdAt: post.createdAt,
    imageUrl: post.images?.[0] ?? null,
    isOwner: true,
  }));

  const hasPosts = myPosts.length > 0;

  return (
    <div className="flex h-full flex-col md:flex-row">
      <section
        className={cn(
          "flex flex-1 flex-col gap-4 bg-bg-white p-6 md:gap-6 md:p-9",
          (isLoading || !hasPosts) && "items-center justify-center"
        )}
      >
        {isLoading ? (
          <Loader2 className="size-8 animate-spin text-primary-red" />
        ) : hasPosts ? (
          myPosts.map((post) => <PostCard key={post.id} {...post} className="w-full" />)
        ) : (
          <EmptyState title="ไม่มีโพสต์" description="เริ่มสร้างโพสต์แรกกันเลย" />
        )}
      </section>

      <aside className="hidden shrink-0 bg-bg-white p-9 pr-24 md:flex">
        <AboutCard />
      </aside>
    </div>
  );
}
