<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const userSession = useUserSession();
const canReadUser = canPerformAction(
    userSession.user.value?.role,
    "USER",
    "READ",
);

const navigationMenuItems = computed<NavigationMenuItem[][]>(() => {
    const items: NavigationMenuItem[][] = [
        [
            {
                label: "หน้าหลัก",
                icon: "lucide:house",
                to: "/",
            },
        ],
        [
            {
                label: "ทรัพย์สิน",
                icon: "lucide:monitor",
                to: "/assets",
            },
            {
                label: "การซ่อม",
                icon: "lucide:tool-case",
                to: "/asset-repairs",
            },
            {
                label: "การจัดซื้อ",
                icon: "lucide:shopping-cart",
                to: "/asset-procurements",
            },
        ],
    ];

    if (canReadUser) {
        items.push([
            {
                label: "ผู้ใช้",
                icon: "lucide:users",
                to: "/users",
            },
        ]);
    }

    return items;
});
</script>

<template>
    <UDashboardGroup unit="rem" class="h-screen overflow-hidden">
        <UDashboardSidebar
            :default-size="16"
            collapsible
            :resizable="false"
            :ui="{ root: 'bg-elevated/25' }"
        >
            <template #header="{ collapsed }">
                <div v-if="collapsed" class="flex justify-center w-full">
                    <UDashboardSidebarCollapse />
                </div>
                <div v-else class="flex items-center justify-between w-full px-1">
                    <div class="flex items-center gap-2">
                        <div class="bg-sky-500 p-1.5 rounded-lg shrink-0">
                            <UIcon name="i-heroicons-cube-transparent" class="w-5 h-5 text-white" />
                        </div>
                        <span class="font-black text-lg uppercase dark:text-white truncate">Inventory</span>
                    </div>
                    <UDashboardSidebarCollapse />
                </div>
            </template>

            <template #default="{ collapsed }">
                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="navigationMenuItems"
                    orientation="vertical"
                />
            </template>

            <template #footer="{ collapsed }">
                <div class="flex w-full flex-col gap-1.5">
                    <div class="flex items-center" :class="{ 'justify-center': collapsed }">
                        <UColorModeButton />
                    </div>
                    <UserDropdownMenu :collapsed="collapsed" />
                </div>
            </template>
        </UDashboardSidebar>

        <main class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950 relative overflow-hidden">
            <slot />
        </main>
    </UDashboardGroup>
</template>