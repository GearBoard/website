import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { UserDropdown } from "./user-dropdown";

const mockUser = {
  name: "Sarus Yeen",
  handle: "@sarus",
  email: "sarus2549@gmail.com",
  image: null,
};

const mockUserWithImage = {
  name: "Sarus Yeen",
  handle: "@sarus",
  email: "sarus2549@gmail.com",
  image: "https://avatars.githubusercontent.com/u/583231",
};

const meta: Meta<typeof UserDropdown> = {
  title: "Shared/UI/UserDropdown",
  component: UserDropdown,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-40 items-start justify-end p-6">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    user: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof UserDropdown>;

export const Guest: Story = {
  args: {
    user: null,
  },
};

export const LoggedIn: Story = {
  args: {
    user: mockUser,
  },
};

export const LoggedInWithAvatar: Story = {
  args: {
    user: mockUserWithImage,
  },
};

export const LoggedInNoHandle: Story = {
  args: {
    user: { ...mockUser, handle: null },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-start justify-end gap-8 p-6">
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-gray-400">Guest</span>
        <UserDropdown user={null} />
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-gray-400">Logged in (initials)</span>
        <UserDropdown user={mockUser} />
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-gray-400">Logged in (avatar)</span>
        <UserDropdown user={mockUserWithImage} />
      </div>
    </div>
  ),
};
