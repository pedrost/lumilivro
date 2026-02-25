import { cookies } from "next/headers";

const ADMIN_COOKIE = "lumus_livro_admin";

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE);
  return token?.value === process.env.ADMIN_PASSWORD;
}
