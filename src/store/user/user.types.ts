export enum PLAN_SELECTION_ITEMS {
  FREE = 1,
  MONTHLY = 2,
  ANNUAL = 3,
}

export enum UserType {
  EMPLOYER = "employer",
  JOB_HUNTER = "job_hunter",
}

export type UserDataState = {
  selectedUserType?: UserType;
  email: string;
  userId: string | number;
  selectedSkills?: string[];
  tempLoginEmail?: string;
  tempLoginPassword?: string;
  currentSelectedPlan?: PLAN_SELECTION_ITEMS;
  selectedExperience?: string; // Added selectedExperience
  selectedSkillIds: number[]; // Array of skill IDs/numbers
};

export type UserResetDataState = {
  currentResetPasswordEmail?: string;
  isResetPasswordSuccesful?: boolean;
};

export type UserTempCredentials = Pick<
  UserDataState,
  "tempLoginEmail" | "tempLoginPassword"
>;

export type UserCredentials = Pick<
  UserDataState,
  "selectedUserType" | "email" | "userId"
>;