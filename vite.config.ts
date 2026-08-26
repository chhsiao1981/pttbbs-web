import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  input: {
    all: resolve(import.meta.dirname, "htmls/all.html"),
    home: resolve(import.meta.dirname, "htmls/home.html"),
    login: resolve(import.meta.dirname, "htmls/login.html"),
    register: resolve(import.meta.dirname, "htmls/register.html"),
    "user-info": resolve(import.meta.dirname, "htmls/user-info.html"),
    "change-email": resolve(import.meta.dirname, "htmls/change-email.html"),
    "attempt-change-email": resolve(
      import.meta.dirname,
      "htmls/attempt-change-email.html",
    ),
    init: resolve(import.meta.dirname, "htmls/init.html"),
    error: resolve(import.meta.dirname, "htmls/error.html"),
  },
});
