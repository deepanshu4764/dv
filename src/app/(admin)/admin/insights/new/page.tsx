import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/access";
import { slugify } from "@/lib/slugify";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

async function createInsight(formData: FormData) {
  "use server";
  const admin = await requireAdmin();

  const title = (formData.get("title") as string) ?? "";
  const bookName = (formData.get("bookName") as string) ?? "";
  const author = (formData.get("author") as string) ?? "";
  const shortSummary = (formData.get("shortSummary") as string) ?? "";
  const content = (formData.get("content") as string) ?? "";
  const takeawaysRaw = (formData.get("keyTakeaways") as string) ?? "";
  const publishAt = formData.get("publishAt") as string;
  const status = (formData.get("status") as "DRAFT" | "PUBLISHED") ?? "DRAFT";

  await prisma.insight.create({
    data: {
      slug: slugify(title),
      title,
      bookName,
      author,
      shortSummary,
      content,
      keyTakeaways: takeawaysRaw
        .split("\n")
        .map((v) => v.trim())
        .filter(Boolean),
      publishAt: publishAt ? new Date(publishAt) : new Date(),
      status,
      createdById: admin.user.id
    }
  });

  revalidatePath("/app/insights");
  revalidatePath("/book-insights");
  redirect("/app/insights");
}

export default async function NewInsightPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Create insight</h1>
      <Card className="p-6">
        <form action={createInsight} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Title</label>
              <Input name="title" required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Book name</label>
              <Input name="bookName" required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Author</label>
              <Input name="author" required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Publish at</label>
              <Input name="publishAt" type="datetime-local" className="mt-1" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Short summary</label>
            <Textarea name="shortSummary" required rows={2} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Content (markdown)</label>
            <Textarea name="content" required rows={8} className="mt-1 font-mono" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Key takeaways (one per line)
            </label>
            <Textarea name="keyTakeaways" rows={4} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Status</label>
            <Select name="status" defaultValue="DRAFT" className="mt-1">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </Select>
          </div>
          <Button type="submit">Create insight</Button>
        </form>
      </Card>
    </div>
  );
}
