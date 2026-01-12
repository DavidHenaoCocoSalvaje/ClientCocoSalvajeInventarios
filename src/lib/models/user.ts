import { CSRequest, formatDate, SortDirection } from '$lib';

export interface IUser {
    id: number;
    username: string;
    is_active: boolean;
    created_at: string;
    password_hash?: string;
}

export interface IUserCreate {
    username: string;
}

export interface IUserCreateResponse {
    user: IUser;
    temp_password: string;
}

export interface IUserResetPasswordResponse {
    user: IUser;
    new_password: string;
}

export interface IPermission {
    id: number;
    slug: string;
    resource: string | null;
    access_mode: string;
    is_active: boolean;
    description: string | null;
    system: boolean;
}

export interface IAssignPermissionRequest {
    permission_id: number;
}

interface IUserFormat extends Omit<IUser, 'created_at' | 'password_hash'> {
    created_at: string;
}

export class UserFormat {
    static users(users: IUser[]): IUserFormat[] {
        return users.map((user) => ({
            id: user.id,
            username: user.username,
            is_active: user.is_active,
            created_at: user.created_at ? formatDate({ date: user.created_at, hora: true }) : '-'
        }));
    }
}

export class User {
    static async getList({
        url,
        accessToken,
        skip = 0,
        limit = 100,
        sort = SortDirection.DESC
    }: {
        url: string;
        accessToken: string;
        skip?: number;
        limit?: number;
        sort?: SortDirection;
    }) {
        const request = new CSRequest(url);
        return await request.get<IUser[]>({
            primaryRoute: '/identity',
            path: '/useres',
            accessToken,
            query: {
                skip: skip.toString(),
                limit: limit.toString(),
                sort
            }
        });
    }

    static async create({
        url,
        accessToken,
        username
    }: {
        url: string;
        accessToken: string;
        username: string;
    }) {
        const request = new CSRequest(url);
        return await request.post<IUserCreateResponse>({
            primaryRoute: '/identity',
            path: '/user',
            accessToken,
            body: { username }
        });
    }

    static async delete({
        url,
        accessToken,
        userId
    }: {
        url: string;
        accessToken: string;
        userId: number;
    }) {
        const request = new CSRequest(url);
        return await request.delete<IUser>({
            primaryRoute: '/identity',
            path: '/user/{user-id}',
            accessToken,
            query: { resource_id: userId.toString() }
        });
    }

    static async resetPassword({
        url,
        accessToken,
        userId
    }: {
        url: string;
        accessToken: string;
        userId: number;
    }) {
        const request = new CSRequest(url);
        return await request.post<IUserResetPasswordResponse>({
            primaryRoute: '/identity',
            path: `/user/reset-password/${userId}`,
            accessToken
        });
    }

    static async getMe({
        url,
        accessToken
    }: {
        url: string;
        accessToken: string;
    }) {
        const request = new CSRequest(url);
        return await request.get<IUser>({
            primaryRoute: '/identity',
            path: '/user/me',
            accessToken
        });
    }

    static async updatePassword({
        url,
        accessToken,
        currentPassword,
        newPassword
    }: {
        url: string;
        accessToken: string;
        currentPassword: string;
        newPassword: string;
    }) {
        const request = new CSRequest(url);
        return await request.put<IUser>({
            primaryRoute: '/identity',
            path: '/user/me/password',
            accessToken,
            body: {
                current_password: currentPassword,
                new_password: newPassword
            }
        });
    }
}

export interface IRole {
    id: number;
    name: string;
    description: string | null;
    system: boolean;
}

export interface IGroup {
    id: number;
    name: string;
    description: string | null;
    system: boolean;
}

export class UserPermissions {
    static async getAll({
        url,
        accessToken,
        userId
    }: {
        url: string;
        accessToken: string;
        userId: number;
    }) {
        const request = new CSRequest(url);
        return await request.get<IPermission[]>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/permissions/all`,
            accessToken
        });
    }

    static async getDirect({
        url,
        accessToken,
        userId
    }: {
        url: string;
        accessToken: string;
        userId: number;
    }) {
        const request = new CSRequest(url);
        return await request.get<IPermission[]>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/permissions`,
            accessToken
        });
    }

    static async getRoles({
        url,
        accessToken,
        userId
    }: {
        url: string;
        accessToken: string;
        userId: number;
    }) {
        const request = new CSRequest(url);
        return await request.get<IRole[]>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/roles`,
            accessToken
        });
    }

    static async getGroups({
        url,
        accessToken,
        userId
    }: {
        url: string;
        accessToken: string;
        userId: number;
    }) {
        const request = new CSRequest(url);
        return await request.get<IGroup[]>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/groups`,
            accessToken
        });
    }

    static async assign({
        url,
        accessToken,
        userId,
        permissionId
    }: {
        url: string;
        accessToken: string;
        userId: number;
        permissionId: number;
    }) {
        const request = new CSRequest(url);
        return await request.post<Record<string, string>>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/permissions`,
            accessToken,
            body: { permission_id: permissionId }
        });
    }

    static async unassign({
        url,
        accessToken,
        userId,
        permissionId
    }: {
        url: string;
        accessToken: string;
        userId: number;
        permissionId: number;
    }) {
        const request = new CSRequest(url);
        return await request.delete<void>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/permissions/${permissionId}`,
            accessToken
        });
    }

    static async assignRole({
        url,
        accessToken,
        userId,
        roleId
    }: {
        url: string;
        accessToken: string;
        userId: number;
        roleId: number;
    }) {
        const request = new CSRequest(url);
        return await request.post<Record<string, string>>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/roles`,
            accessToken,
            body: { role_id: roleId }
        });
    }

    static async unassignRole({
        url,
        accessToken,
        userId,
        roleId
    }: {
        url: string;
        accessToken: string;
        userId: number;
        roleId: number;
    }) {
        const request = new CSRequest(url);
        return await request.delete<void>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/roles/${roleId}`,
            accessToken
        });
    }

    static async assignGroup({
        url,
        accessToken,
        userId,
        groupId
    }: {
        url: string;
        accessToken: string;
        userId: number;
        groupId: number;
    }) {
        const request = new CSRequest(url);
        return await request.post<Record<string, string>>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/groups`,
            accessToken,
            body: { group_id: groupId }
        });
    }

    static async unassignGroup({
        url,
        accessToken,
        userId,
        groupId
    }: {
        url: string;
        accessToken: string;
        userId: number;
        groupId: number;
    }) {
        const request = new CSRequest(url);
        return await request.delete<void>({
            primaryRoute: '/user-permissions',
            path: `/${userId}/groups/${groupId}`,
            accessToken
        });
    }
}

export class Permission {
    static async getAll({
        url,
        accessToken
    }: {
        url: string;
        accessToken: string;
    }) {
        const request = new CSRequest(url);
        return await request.get<IPermission[]>({
            primaryRoute: '/permissions',
            path: '/',
            accessToken
        });
    }
}

export class Role {
    static async getAll({
        url,
        accessToken
    }: {
        url: string;
        accessToken: string;
    }) {
        const request = new CSRequest(url);
        return await request.get<IRole[]>({
            primaryRoute: '/permissions',
            path: '/roles',
            accessToken
        });
    }
}

export class Group {
    static async getAll({
        url,
        accessToken
    }: {
        url: string;
        accessToken: string;
    }) {
        const request = new CSRequest(url);
        return await request.get<IGroup[]>({
            primaryRoute: '/permissions',
            path: '/groups',
            accessToken
        });
    }
}

