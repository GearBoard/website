import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Searchbar } from "./searchbar";

const meta: Meta<typeof Searchbar> = {
  title: "Shared/UI/Searchbar",
  component: Searchbar,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "focus"],
    },
    disabled: { control: "boolean" },
    hidePlaceholderOnFocus: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Searchbar>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};

// Hovered state is now handled by standard CSS hover classes

export const Focused: Story = {
  args: {
    variant: "focus",
    autoFocus: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-gray-500 mb-2">Default</p>
        <Searchbar />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Hover (CSS only)</p>
        <Searchbar />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Focus (Manual)</p>
        <Searchbar variant="focus" />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Disabled</p>
        <Searchbar disabled />
      </div>
    </div>
  ),
};
