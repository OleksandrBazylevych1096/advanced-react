interface PasswordRequirement {
    key: string;
    test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
    {
        key: "register.password.requirements.minLength",
        test: (password: string) => password.length >= 8,
    },
    {
        key: "register.password.requirements.uppercase",
        test: (password: string) => /\p{Lu}/u.test(password),
    },
    {
        key: "register.password.requirements.lowercase",
        test: (password: string) => /\p{Ll}/u.test(password),
    },
    {
        key: "register.password.requirements.number",
        test: (password: string) => /\d/.test(password),
    },
    {
        key: "register.password.requirements.special",
        test: (password: string) => /[^\p{L}\d]/u.test(password),
    },
];

export const getPasswordRequirementsState = (password: string) =>
    passwordRequirements.map((requirement) => ({
        key: requirement.key,
        isMet: requirement.test(password),
    }));

export const isPasswordValid = (password: string) =>
    passwordRequirements.every((requirement) => requirement.test(password));
