export type Role = "staff" | "admin" | "superadmin";

export const permissions = {
  staff: {
    viewProducts: true,
    editProducts: false,
    manageUsers: false,
    accessSettings: false,
  },
  admin: {
    viewProducts: true,
    editProducts: true,
    manageUsers: false,
    accessSettings: false,
  },
  superadmin: {
    viewProducts: true,
    editProducts: true,
    manageUsers: true,
    accessSettings: true,
  },
};

export function hasPermission(
  role: Role,
  permission: keyof (typeof permissions)["staff"]
) {
  return permissions[role]?.[permission] ?? false;
}
