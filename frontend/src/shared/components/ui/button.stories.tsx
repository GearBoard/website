import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Download, ArrowRight } from "lucide-react";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Shared/UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["red", "navy", "yellow"],
    },
    size: {
      control: "select",
      options: ["default", "md", "sm", "xs"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Click me",
    color: "red",
    size: "default",
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button color="red">Red</Button>
      <Button color="navy">Navy</Button>
      <Button color="yellow">Yellow</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="default">Default</Button>
      <Button size="md">Medium</Button>
      <Button size="sm">Small</Button>
      <Button size="xs">XSmall</Button>
    </div>
  ),
};

export const WithIconLeft: Story = {
  args: {
    children: "Download",
    iconLeft: <Download />,
    color: "navy",
    size: "md",
  },
};

export const WithIconRight: Story = {
  args: {
    children: "Next",
    iconRight: <ArrowRight />,
    color: "red",
    size: "md",
  },
};

export const WithBothIcons: Story = {
  args: {
    children: "Download",
    iconLeft: <Download />,
    iconRight: <ArrowRight />,
    color: "navy",
    size: "md",
  },
};

export const Loading: Story = {
  args: {
    children: "Saving…",
    loading: true,
    iconLeft: <Download />,
    color: "red",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
    color: "navy",
  },
};
