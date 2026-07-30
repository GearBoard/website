"use client";

import { useEffect, useMemo, useRef } from "react";
import PostCard from "@/features/feed/components/PostCard";
import { CreatePostCard } from "@/features/post/components/CreatePostCard";
import { useGetInfinitePostList } from "@/shared/hooks";
import { authClient } from "@/shared/libs/auth-client";

export default function Home() {
  const { data: session } = authClient.useSession();
  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useGetInfinitePostList(10);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const posts = useMemo(
    () =>
      Array.from(
        new Map((data ?? []).flatMap((page) => page.data).map((post) => [post.id, post])).values()
      ),
    [data]
  );
  const lastPage = data?.at(-1);
  const hasMore = lastPage ? lastPage.page < lastPage.totalPages : false;
  const isLoadingMore = isValidating && size > 1;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || isValidating) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void setSize((currentSize) => currentSize + 1);
      },
      { rootMargin: "300px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isValidating, setSize]);

  return (
    <section className="min-h-full bg-light-gray px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
        {session?.user ? (
          <CreatePostCard
            onPostCreated={async () => {
              await mutate((pages) => pages, {
                revalidate: (_page, key) =>
                  Array.isArray(key) &&
                  typeof key[1] === "object" &&
                  key[1] !== null &&
                  "page" in key[1] &&
                  key[1].page === "1",
              });
            }}
          />
        ) : null}

        {isLoading ? (
          <p className="rounded-lg bg-white p-6 text-center text-dark-gray">กำลังโหลดโพสต์...</p>
        ) : error ? (
          <div className="rounded-lg bg-white p-6 text-center">
            <p className="text-primary-red">ไม่สามารถโหลดโพสต์ได้</p>
            <button
              type="button"
              className="mt-2 font-medium text-primary-red underline"
              onClick={() => void mutate()}
            >
              ลองอีกครั้ง
            </button>
          </div>
        ) : posts.length === 0 ? (
          <p className="rounded-lg bg-white p-6 text-center text-dark-gray">ยังไม่มีโพสต์</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              description={post.description}
              tags={post.tags}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              authorInfo={post.authorInfo}
              createdAt={post.createdAt}
              imageUrl={post.images[0]}
              isOwner={session?.user?.id === post.authorInfo.id}
            />
          ))
        )}

        <div ref={loadMoreRef} className="h-px" aria-hidden="true" />
        {isLoadingMore ? (
          <p className="pb-4 text-center text-sm text-dark-gray">กำลังโหลดโพสต์เพิ่มเติม...</p>
        ) : null}
      </div>
    </section>
  );
}
