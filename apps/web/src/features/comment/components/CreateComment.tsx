import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Image as ImageIcon, Send } from "lucide-react";

const avatarSize = {
  sm: 24,
  md: 28,
  lg: 48,
};

export type CommentUser = {
  name: string;
  username: string;
  avatar?: string;
};

export type CreateCommentProps = {
  user: CommentUser;
  onSubmit: (data: { content: string; image?: File }) => Promise<void> | void;
  placeholder?: string;
};

type CommentAvatarProps = {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

type CommentUserInfoProps = {
  name: string;
  username: string;
};

type CommentInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
};

type CommentActionsProps = {
  onUpload?: (file: File) => void;
  onSubmit?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
};

type CommentImageUploadProps = {
  onUpload?: (file: File) => void;
};

function CommentAvatar({ src, alt = "Avatar", size = "md", className }: CommentAvatarProps) {
  const dimension = avatarSize[size];
  const wrapperClassName = ["overflow-hidden rounded-full bg-gray-200", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={wrapperClassName}
      style={className ? undefined : { width: dimension, height: dimension }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={dimension}
          height={dimension}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">👤</div>
      )}
    </div>
  );
}

function CommentUserInfo({ name, username }: CommentUserInfoProps) {
  return (
    <div className="flex flex-col">
      <span className="md:text-sm text-xs font-medium font-satoshi">{name}</span>

      <span className="md:text-xs text-[10px] text-neutral-500 font-medium font-satoshi">
        @{username}
      </span>
    </div>
  );
}

function CommentInput({ value, onChange, onFocus, placeholder }: CommentInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);

    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      placeholder={placeholder}
      rows={1}
      className="w-full md:text-md text-sm text-gray-800 font-medium font-noto outline-none resize-none leading-5"
    />
  );
}

function CommentImageUpload({ onUpload }: CommentImageUploadProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onUpload?.(file);
  };

  return (
    <label className="flex cursor-pointer items-center">
      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <ImageIcon className="h-4 w-4 md:h-[18px] md:w-[18px]" strokeWidth={1.8} aria-hidden="true" />
    </label>
  );
}

function CommentActions({
  onUpload,
  onSubmit,
  disabled = false,
  loading = false,
}: CommentActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <CommentImageUpload onUpload={onUpload} />

      <button
        type="button"
        onClick={() => onSubmit?.()}
        disabled={disabled || loading}
        className="flex items-center justify-center md:w-[85px] md:h-[38px] w-[88px] h-[31px] gap-3 rounded-lg bg-primary-red md:text-md text-sm font-semi-bold text-white"
      >
        {loading ? (
          <span className="text-xs">กำลังส่ง...</span>
        ) : (
          <>
            <Send size={16} strokeWidth={2.5} />
            <span>ส่ง</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function CreateComment({
  user,
  onSubmit,
  placeholder = "เขียนความคิดเห็น...",
}: CreateCommentProps) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = comment.trim().length > 0 || image !== null;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        content: comment.trim(),
        image: image ?? undefined,
      });

      setComment("");
      setImage(null);
      setExpanded(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-5 md:py-4 py-2.5">
      {/*
        โครงสร้างแบบสลับสถานะ (Conditional Layout)
      */}
      {!expanded ? (
        // 1. สถานะเริ่มต้น (Default): แสดง Avatar ขนานคู่ไปกับ Input ในแนวนอน
        <div className="flex items-center gap-2.5">
          <CommentAvatar
            src={user.avatar}
            alt={user.name}
            className="h-[24px] w-[24px] md:h-[28px] md:w-[28px]"
          />
          <div className="flex items-center">
            <CommentInput
              value={comment}
              onChange={setComment}
              onFocus={() => setExpanded(true)}
              placeholder={placeholder}
            />
          </div>
        </div>
      ) : (
        // 2. สถานะกดเปิด (Expanded): แยกการทำงานเป็น 2 แถวชัดเจนตามภาพดีไซน์
        <div className="flex flex-col gap-3">
          {/* แถวบน: Avatar คู่กับ User Info เสมอ */}
          <div className="flex flex-row items-center gap-2.5">
            <CommentAvatar
              src={user.avatar}
              alt={user.name}
              className="h-[24px] w-[24px] md:h-[28px] md:w-[28px]"
            />
            <CommentUserInfo name={user.name} username={user.username} />
          </div>

          {/* แถวล่าง: กล่องกรอกข้อมูลชิ้นใหม่ที่มีทั้ง Input และ Image Upload Preview */}
          <div className="w-full md:pl-10">
            <div className="flex flex-col gap-3 rounded-lg">
              <CommentInput
                value={comment}
                onChange={setComment}
                onFocus={() => setExpanded(true)}
                placeholder={placeholder}
              />

              <div className="border-t border-gray"></div>

              {/* ย้าย CommentActions เข้ามาอยู่ด้านในกล่อง Border นี้ */}
              <CommentActions
                onUpload={setImage}
                onSubmit={handleSubmit}
                disabled={!canSubmit}
                loading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
