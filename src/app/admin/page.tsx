import { redirect } from "next/navigation";

export default function AdminIndexPage() {
    // 重定向到 dashboard
    redirect("/admin/dashboard");
}
