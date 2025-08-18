import { webRoutes } from "../routes";

export async function getShortUrl(restaurantId: string): Promise<string> {
    const url = `${window.location.origin}${webRoutes.menu.replace(":restaurantId", restaurantId)}`;
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    return await res.text();
}