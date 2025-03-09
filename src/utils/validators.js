export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
export const OBJECT_ID_RULE_MESSAGE =
  "Your string fails to match the Object Id pattern!";

export const FIELD_REQUIRED_MESSAGE = "This field is required";
export const EMAIL_RULE = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const EMAIL_RULE_MESSAGE = "Email is invalid.";
export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const PASSWORD_RULE_MESSAGE =
  "Password must include at least 1 letter, a number, and at least 8 characters.";
