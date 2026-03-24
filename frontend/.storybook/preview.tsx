import React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { Noto_Sans_Thai } from "next/font/google";
import "../src/app/globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-thai",
  weight: ["300", "400", "500", "700"],
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={notoSansThai.variable}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
