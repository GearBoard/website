import type { Meta, StoryObj } from "@storybook/react";
import { CreatePostCard } from "./CreatePostCard";

const meta = {
  title: "Features/Post/CreatePostCard",
  component: CreatePostCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CreatePostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="w-[800px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] max-w-full">
        <Story />
      </div>
    ),
  ],
};
