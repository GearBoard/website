"use client";

import Image from "next/image";
import { Heart, MessageCircle, Bookmark, MoreVertical } from "lucide-react";
import { cn, formatRelativeTime } from "@/shared/libs/utils";

export interface PostCardAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface PostCardProps {
  title: string;
  description: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  authorInfo: PostCardAuthor;
  createdAt: string;
  imageUrl?: string | null;
  isLiked?: boolean;
  isSaved?: boolean;
  isOwner?: boolean;
  /** Show the full title/description instead of clamping to 3 lines — used on the post detail page. */
  expanded?: boolean;
  /** Strip the card's own background/padding so it can be nested inside a parent that already provides them — used on the post detail page. */
  bare?: boolean;
  className?: string;
  onClick?: () => void;
  onLikeClick?: () => void;
  onCommentClick?: () => void;
  onSaveClick?: () => void;
  onMenuClick?: () => void;
}

const TAG_COLOR_CLASSES = [
  "bg-[#44ADE2]/50 text-[#008ACF]",
  "bg-[#9533F0]/50 text-[#9755D5]",
  "bg-[#248F53]/50 text-[#248F53]",
];

export default function PostCard({
  title,
  description,
  tags,
  likeCount,
  commentCount,
  authorInfo,
  createdAt,
  imageUrl,
  isLiked = false,
  isSaved = false,
  isOwner = false,
  expanded = false,
  bare = false,
  className,
  onClick,
  onLikeClick,
  onCommentClick,
  onSaveClick,
  onMenuClick,
}: PostCardProps) {
  const stop = (handler?: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    handler?.();
  };

  const inset = bare ? "px-0" : "px-5";

  return (
    <article
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3.5 w-full",
        !bare && "bg-white rounded-lg overflow-hidden py-4",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className={cn("flex items-center justify-between gap-2", inset)}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative size-10 shrink-0 rounded-full overflow-hidden">
            <Image
              src={authorInfo.image || "/profile.svg"}
              alt={authorInfo.name}
              fill
              sizes="40px"
              className="object-cover"
              unoptimized={!!authorInfo.image}
            />
          </div>
          <div className="flex flex-col min-w-0 mt-1">
            <span className="font-medium text-sm leading-[135%] text-black truncate">
              {authorInfo.name}
            </span>
            <span className="font-medium text-xs leading-[135%] text-dark-gray truncate">
              @{authorInfo.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <time className="font-medium text-xs leading-[135%] text-dark-gray" dateTime={createdAt}>
            {formatRelativeTime(createdAt)}
          </time>
          {isOwner && (
            <button
              type="button"
              onClick={stop(onMenuClick)}
              className="-mr-1.5 text-black cursor-pointer"
              aria-label="ตัวเลือกเพิ่มเติม"
            >
              <MoreVertical className="size-6" />
            </button>
          )}
        </div>
      </div>

      <div className={cn("flex flex-col gap-1.5 -mb-1", inset)}>
        <h3 className="font-semibold text-xl leading-[135%] text-black">{title}</h3>
        <p
          className={cn(
            "font-medium text-base leading-[135%] text-black",
            !expanded && "line-clamp-3"
          )}
        >
          {description}
        </p>
      </div>

      {imageUrl && (
        <div className={inset}>
          {/* eslint-disable-next-line @next/next/no-img-element -- post image dimensions aren't known ahead of time (not stored in the schema), so next/image's required width/height can't be set; a plain img lets the browser size it to its natural aspect ratio */}
          <img src={imageUrl} alt="" className="w-full h-auto" />
        </div>
      )}

      <div className={bare ? "px-0" : "px-7"}>
        <div className="border-t border-gray" />
      </div>

      <div className={cn("flex items-center justify-between gap-2.5 -mt-1", inset)}>
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {tags.map((tag, i) => (
            <span
              key={tag}
              className={cn(
                "px-2 py-1 rounded-lg font-semibold text-base leading-[135%]",
                TAG_COLOR_CLASSES[i % TAG_COLOR_CLASSES.length]
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={stop(onLikeClick)}
            className="group flex items-center gap-2 text-black cursor-pointer"
            aria-label="ถูกใจ"
            aria-pressed={isLiked}
          >
            <Heart
              className={cn(
                "size-5 transition-colors",
                isLiked ? "text-primary-red" : "text-black group-hover:text-primary-red"
              )}
              fill={isLiked ? "currentColor" : "none"}
            />
            <span className="font-inter font-semibold text-base leading-[135%]">{likeCount}</span>
          </button>
          <button
            type="button"
            onClick={stop(onCommentClick)}
            className="group flex items-center gap-2 text-black cursor-pointer"
            aria-label="แสดงความคิดเห็น"
          >
            <MessageCircle className="size-5 text-black transition-colors group-hover:text-primary-red" />
            <span className="font-inter font-semibold text-base leading-[135%]">
              {commentCount}
            </span>
          </button>
          <button
            type="button"
            onClick={stop(onSaveClick)}
            className={cn(
              "cursor-pointer transition-colors hover:text-primary-red",
              isSaved ? "text-primary-red" : "text-black"
            )}
            aria-label="บันทึกโพสต์"
            aria-pressed={isSaved}
          >
            <Bookmark className="size-6" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}
