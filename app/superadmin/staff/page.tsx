"use client";

import { useEffect, useState } from "react";
import { getStaffAction, createStaffAction, updateStaffAction } from "@/app/actions/staff";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Pencil, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

type StaffMember = Awaited<ReturnType<typeof getStaffAction>>["staff"][0];

export default function SuperadminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { staff: s, error: e } = await getStaffAction();
    setStaff(s);
    setError(e ?? null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement).value;
    const email = (form.querySelector('[name="email"]') as HTMLInputElement).value;
    const role = (form.querySelector('[name="role"]') as HTMLSelectElement).value as "STAFF" | "SUPERADMIN";
    const result = await createStaffAction({ name, email, role });
    if (result.error) setError(result.error);
    else {
      setAdding(false);
      setError(null);
      await load();
    }
  }

  async function handleUpdate(member: StaffMember, updates: { name?: string; email?: string; role?: string; isActive?: boolean }) {
    const result = await updateStaffAction({ id: member.id, ...updates });
    if (result.error) setError(result.error);
    else {
      setEditingId(null);
      setError(null);
      await load();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Staff management</h1>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Staff list</h2>
          {!adding && (
            <Button size="sm" onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add staff
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {adding && (
            <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4 rounded-lg border p-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" placeholder="Name" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" placeholder="email@example.com" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Role</label>
                <select name="role" className="rounded border px-3 py-2 text-sm">
                  <option value="STAFF">Staff</option>
                  <option value="SUPERADMIN">Superadmin</option>
                </select>
              </div>
              <Button type="submit">Create</Button>
              <Button type="button" variant="outline" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </form>
          )}
          {staff.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No staff yet. Add someone to get started.
            </p>
          ) : (
            <ul className="space-y-2">
              {staff.map((member) => (
                <li
                  key={member.id}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4",
                    !member.isActive && "opacity-60 bg-muted/30"
                  )}
                >
                  {editingId === member.id ? (
                    <EditForm
                      member={member}
                      onSave={(updates) => handleUpdate(member, updates)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <span className="text-xs font-medium text-muted-foreground">
                          {member.role} {!member.isActive && "· Inactive"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingId(member.id)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {member.isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => handleUpdate(member, { isActive: false })}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Deactivate
                          </Button>
                        )}
                        {!member.isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdate(member, { isActive: true })}
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EditForm({
  member,
  onSave,
  onCancel,
}: {
  member: StaffMember;
  onSave: (u: { name?: string; email?: string; role?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [role, setRole] = useState(member.role);

  return (
    <form
      className="flex flex-wrap items-end gap-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, email, role });
      }}
    >
      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value as "STAFF" | "SUPERADMIN")} className="rounded border px-3 py-2 text-sm">
          <option value="STAFF">Staff</option>
          <option value="SUPERADMIN">Superadmin</option>
        </select>
      </div>
      <Button type="submit">Save</Button>
      <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
    </form>
  );
}
