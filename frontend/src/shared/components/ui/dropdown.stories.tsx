import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Dropdown } from "./dropdown";

const OPTIONS = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
  { value: "4", label: "Option 4" },
];

const meta: Meta<typeof Dropdown> = {
  title: "Shared/UI/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-56 w-64 items-start p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

function SingleDefaultDemo() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return <Dropdown options={OPTIONS} value={value} onChange={setValue} />;
}

function SingleWithSelectionDemo() {
  const [value, setValue] = useState("1");
  return <Dropdown options={OPTIONS} value={value} onChange={setValue} />;
}

function MultiDefaultDemo() {
  const [values, setValues] = useState<string[]>([]);
  return <Dropdown multiple options={OPTIONS} values={values} onChange={setValues} />;
}

function MultiWithSelectionDemo() {
  const [values, setValues] = useState(["1", "3"]);
  return <Dropdown multiple options={OPTIONS} values={values} onChange={setValues} />;
}

function AllVariantsDemo() {
  const [single, setSingle] = useState<string | undefined>(undefined);
  const [multi, setMulti] = useState<string[]>([]);

  return (
    <div className="flex w-full gap-8 p-6">
      <div className="flex w-48 flex-col gap-2">
        <span className="text-xs text-gray-400">Single-Dropdown</span>
        <Dropdown options={OPTIONS} value={single} onChange={setSingle} />
      </div>
      <div className="flex w-48 flex-col gap-2">
        <span className="text-xs text-gray-400">Multi-Dropdown</span>
        <Dropdown multiple options={OPTIONS} values={multi} onChange={setMulti} />
      </div>
    </div>
  );
}

export const SingleDefault: Story = {
  render: () => <SingleDefaultDemo />,
};

export const SingleWithSelection: Story = {
  render: () => <SingleWithSelectionDemo />,
};

export const MultiDefault: Story = {
  render: () => <MultiDefaultDemo />,
};

export const MultiWithSelection: Story = {
  render: () => <MultiWithSelectionDemo />,
};

export const AllVariants: Story = {
  render: () => <AllVariantsDemo />,
};
