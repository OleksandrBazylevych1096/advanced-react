interface PasswordRequirements {
  key: string;
  test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirements[] = [
  {
    key: "register.password.requirements.minLength",
    test: (password: string) => password.length >= 8,
  },
  {
    key: "register.password.requirements.uppercase",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    key: "register.password.requirements.noSpaces",
    test: (password: string) => !/\s/.test(password),
  },
  {
    key: "register.password.requirements.number",
    test: (password: string) => /\d/.test(password),
  },
];
