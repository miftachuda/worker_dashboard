import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        lime: { value: "#00FF00" }, // Define your custom 'lime' here
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
