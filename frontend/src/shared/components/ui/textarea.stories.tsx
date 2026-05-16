import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Shared/UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-[478px]">
      <Textarea placeholder="Type your message here..." />
    </div>
  ),
};

export const Hovered: Story = {
  render: () => (
    <div className="w-full max-w-[478px]">
      <Textarea placeholder="Hovered state" />
    </div>
  ),
};

export const Focused: Story = {
  render: () => (
    <div className="w-full max-w-[478px]">
      <Textarea placeholder="Focused state" autoFocus />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="w-full max-w-[478px]">
      <Textarea placeholder="Error state" aria-invalid />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-[478px]">
      <Textarea placeholder="Disabled" disabled />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-[478px]">
      <Textarea placeholder="Default" />
      <Textarea placeholder="Hovered" />
      <Textarea placeholder="Focused" autoFocus />
      <Textarea placeholder="Error" aria-invalid />
      <Textarea placeholder="Disabled" disabled />
    </div>
  ),
};
