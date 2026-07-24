"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Image as ImageIcon, Tag, SquarePen, X } from "lucide-react";
import { Popover } from "radix-ui";
import { Button } from "@/shared/components";
import { useGetMe, useGetTags, useUploadImage, type TagOption } from "@/shared/hooks";
import { cn } from "@/shared/libs/utils";

interface CreatePostCardProps {
  mode?: "create" | "edit";
  initialExpanded?: boolean;
  initialTitle?: string;
  initialDescription?: string;
  initialImage?: string | null;
  initialTags?: string[];
  className?: string;
  onSubmit?: (input: {
    title: string;
    description: string;
    tags?: string[];
    images?: string[];
  }) => Promise<void> | void;
  onCancel?: () => void;
  loading?: boolean;
}

const TAG_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
];

export function CreatePostCard({
  mode = "create",
  initialExpanded = false,
  initialTitle = "",
  initialDescription = "",
  initialImage = null,
  initialTags = [],
  className,
  onSubmit,
  onCancel,
  loading = false,
}: CreatePostCardProps) {
  const { data: me } = useGetMe();
  const [isExpanded, setIsExpanded] = useState(initialExpanded || mode === "edit");
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialDescription);
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: availableTags, isLoading: isLoadingTags } = useGetTags();
  const { trigger: uploadImage, isMutating: isUploadingImage } = useUploadImage();

  const name = me?.name || "John doe";
  const username = me?.name ? me.name.toLowerCase().replace(/\s+/g, ".") : "john.doe";
  const avatarUrl = me?.image;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const toggleTag = (tagName: string) => {
    setTags((current) =>
      current.includes(tagName) ? current.filter((tag) => tag !== tagName) : [...current, tagName]
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!title.trim() || !content.trim()) {
      setSubmitError("Please add a title and post content before publishing.");
      return;
    }

    try {
      const uploadedImage = imageFile ? await uploadImage(imageFile) : null;
      await onSubmit?.({
        title: title.trim(),
        description: content.trim(),
        tags: tags.map((tag) => tag.trim()).filter(Boolean),
        images: uploadedImage ? [uploadedImage.url] : previewImage ? [previewImage] : [],
      });
      if (mode !== "edit") {
        setTitle("");
        setContent("");
        setTags([]);
        setPreviewImage(null);
        setImageFile(null);
        setIsExpanded(false);
      }
    } catch {
      setSubmitError("Unable to publish your post right now.");
    }
  };

  return (
    <div
      className={cn(
        "flex w-full gap-3 rounded-xl border-[1.5px] border-gray bg-white p-4 shadow-sm md:gap-4 md:p-6",
        className
      )}
    >
      <div className="shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={48}
            height={48}
            className="size-10 md:size-12 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <Image
            src="/profile.svg"
            alt="Default Avatar"
            width={48}
            height={48}
            className="size-10 md:size-12 object-cover rounded-full"
          />
        )}
      </div>

      <div className="flex flex-col flex-1">
        {!isExpanded ? (
          <div className="flex items-center h-10 md:h-12">
            <input
              type="text"
              readOnly
              placeholder="คุณอยากพูดคุยเรื่องอะไร?"
              className="w-full text-sm md:text-base text-black placeholder:text-dark-gray outline-none bg-transparent cursor-text"
              onClick={() => setIsExpanded(true)}
            />
          </div>
        ) : (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-3 md:mb-4">
              <span className="text-black font-semibold text-sm md:text-base leading-tight">
                {name}
              </span>
              <span className="text-dark-gray text-xs md:text-sm">@{username}</span>
            </div>

            <input
              type="text"
              placeholder="ชื่อเรื่อง"
              className="w-full text-lg md:text-xl font-bold text-black placeholder:text-dark-gray outline-none mb-2 bg-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="ป้อนข้อความ..."
              className="w-full text-sm md:text-base text-black placeholder:text-dark-gray outline-none resize-none min-h-[60px] bg-transparent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {previewImage && (
              <div className="mt-3 w-full  overflow-hidden relative group">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto object-cover max-h-[400px]"
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-4 md:size-5" />
                </button>
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => {
                  const fallbackColor = TAG_COLORS[index % TAG_COLORS.length];
                  const tagDetails = (availableTags as TagOption[] | undefined)?.find(
                    (availableTag) => availableTag.name === tag
                  );
                  return (
                    <span
                      key={tag}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium md:text-sm",
                        !tagDetails && fallbackColor
                      )}
                      style={
                        tagDetails
                          ? { color: tagDetails.color, backgroundColor: tagDetails.backgroundColor }
                          : undefined
                      }
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="hover:opacity-70 transition-opacity outline-none"
                      >
                        <X className="size-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {submitError ? <p className="mt-3 text-sm text-primary-red">{submitError}</p> : null}

            <hr className="border-gray my-3 md:my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-6">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer flex items-center gap-1.5 md:gap-2 text-black font-medium text-sm md:text-base hover:text-primary-red transition-colors outline-none focus-visible:text-primary-red"
                >
                  <ImageIcon className="size-4 md:size-5" />
                  <span>รูปภาพ</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Popover.Root open={isTagMenuOpen} onOpenChange={setIsTagMenuOpen}>
                  <Popover.Trigger asChild>
                    <button
                      type="button"
                      className="cursor-pointer flex items-center gap-1.5 md:gap-2 text-black font-medium text-sm md:text-base hover:text-primary-red transition-colors outline-none focus-visible:text-primary-red"
                    >
                      <Tag className="size-4 md:size-5" />
                      <span>แท็ก</span>
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      align="start"
                      sideOffset={8}
                      className="z-50 w-56 rounded-lg bg-white p-2 shadow-primary-red"
                    >
                      {isLoadingTags ? (
                        <p className="px-3 py-2 text-sm text-dark-gray">Loading tags...</p>
                      ) : (availableTags as TagOption[] | undefined)?.length ? (
                        (availableTags as TagOption[]).map((tag) => {
                          const isSelected = tags.includes(tag.name);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleTag(tag.name)}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-light-gray"
                            >
                              <span
                                className="size-3 rounded-full"
                                style={{ backgroundColor: tag.color }}
                                aria-hidden="true"
                              />
                              <span className="flex-1 text-black">{tag.name}</span>
                              {isSelected ? <X className="size-4 text-primary-red" /> : null}
                            </button>
                          );
                        })
                      ) : (
                        <p className="px-3 py-2 text-sm text-dark-gray">No tags available</p>
                      )}
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>

              <div className="flex items-center gap-2">
                {mode === "edit" && (
                  <Button
                    type="button"
                    color="gray"
                    onClick={onCancel}
                    disabled={loading || isUploadingImage}
                  >
                    ยกเลิก
                  </Button>
                )}
                <Button
                  type="submit"
                  iconLeft={<SquarePen className="size-4" />}
                  loading={loading || isUploadingImage}
                  disabled={!title.trim() || !content.trim() || loading || isUploadingImage}
                >
                  {mode === "edit" ? "แก้ไข" : "โพสต์"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
