import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/access";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

async function createLiveClass(formData: FormData) {
  "use server";
  const admin = await requireAdmin();

  const title = (formData.get("title") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";
  const startTime = formData.get("startTime") as string;
  const duration = Number(formData.get("duration") ?? 60);
  const status = (formData.get("status") as "SCHEDULED" | "COMPLETED") ?? "SCHEDULED";
  const recordingUrl = (formData.get("recordingUrl") as string) || null;

  await prisma.liveClass.create({
    data: {
      title,
      description,
      startTime: startTime ? new Date(startTime) : new Date(),
      duration,
      status,
      recordingUrl,
      createdById: admin.user.id
    }
  });

  revalidatePath("/app/live");
  redirect("/app/live");
}

export default async function NewLiveClassPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Create live class</h1>
      <Card className="p-6">
        <form action={createLiveClass} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Title</label>
              <Input name="title" required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Start time</label>
              <Input type="datetime-local" name="startTime" required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Duration (minutes)</label>
              <Input type="number" name="duration" defaultValue={60} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Status</label>
              <Select name="status" defaultValue="SCHEDULED" className="mt-1">
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <Textarea name="description" rows={4} required className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Recording URL (optional)</label>
            <Input name="recordingUrl" className="mt-1" />
          </div>
          <Button type="submit">Create class</Button>
        </form>
      </Card>
    </div>
  );
}
