"use client";   

import { useAuthStore } from "@/stores";

const ProtectComponent = ({ children, requiredRoles, requiredPermission }: { children: React.ReactNode, requiredRoles: string[], requiredPermission?: string[] }) => {
    const { role, permissions } = useAuthStore();
    console.log(permissions)

    if (!role) {
        return null;
    }

    if (requiredRoles.includes(role)) {
        if (requiredPermission && permissions) {
            const hasAllPermissions = requiredPermission.every((p) =>
                permissions.includes(p)
            );
            return hasAllPermissions ? children : null;
        }
        return children;
    }

    return null;
};

export default ProtectComponent;