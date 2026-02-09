export default defineAppConfig({
  ui: {
    colors: {
      primary: "sky",
      neutral: "gray",
    },
    table: {
      slots: {
        th: "whitespace-nowrap",
      },
    },
    input: {
      slots: {
        root: "w-full",
      },
    },
    select: {
      slots: {
        base: "w-full",
      },
    },
    selectMenu: {
      slots: {
        base: "w-full",
      },
    },
    textarea: {
      slots: {
        root: "w-full",
      },
    },
  },
});
