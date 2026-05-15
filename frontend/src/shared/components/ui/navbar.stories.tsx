import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Navbar } from "./navbar";

const meta: Meta<typeof Navbar> = {
  title: "Shared/UI/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
