"use client"

import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { menuItemsByRole } from "@/lib/dashboard-menu"

export function DashboardSidebar() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const role = session?.user?.role ?? "seeker"
    const items = menuItemsByRole[role]

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map((item) => {
                            const isActive =
                                pathname === item.url ||
                                (item.id !== "dashboard" &&
                                    pathname.startsWith(`${item.url}/`))

                            return (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        render={<a href={item.url} />}
                                        isActive={isActive}
                                    >
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
