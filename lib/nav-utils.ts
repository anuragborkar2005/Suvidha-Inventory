type NavItem = {
    title: string;
    url: string;
    icon?: any;
    items?: { title: string; url: string }[];
    roles: string[];
};

export function filterNavByRole<T extends { roles: string[] }>(
    items: T[],
    role: string,
): T[] {
    return items.filter((item) => item.roles.includes(role));
}
