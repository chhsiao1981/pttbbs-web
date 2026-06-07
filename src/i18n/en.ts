import type { I18n } from "./types";

export default {
  header: {
    loginRegister: "Login/Register",
  },
  register: {
    title: "Register New Account",
    emailAddress: "Email Address",
    registerAccount: "Register",
    info: "Please check email for the pass-link.",
  },
  login: {
    login: "Login",
    register: "Register",
    forgotPassword: "Forgot Password～",
    titlePrefix: "\\Welcome to Login ",
    titlePostfix: " ～/",
    info: "Please check email for the pass-code.",
    submit: "Login",
  },
  init: {
    title: "Setup My Profile",
    username: "Username",
    realName: "My real name",
    birthDate: "My birthday",
    submit: "Setup",
  },
  error: {
    title: "Something Unexpected",
    prompt: "We are sorry something unexpected happened～",
    backHome: "Back to",
  },
} satisfies I18n;
