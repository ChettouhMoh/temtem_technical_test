export class Role {
  static Owner = 'Owner';
  static Guest = 'Guest';
}
export class UserContext {
  userId: string;
  role: Role;
  constructor(id: string, role: Role) {
    this.userId = id;
    this.role = role;
  }

  public hasAnyOfRoles(roles: Role[]): boolean {
    return roles.includes(this.role);
  }
}
