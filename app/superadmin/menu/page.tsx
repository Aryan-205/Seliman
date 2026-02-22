import { getMenuItemsAction } from "@/app/actions/menu";
import { MenuManagement } from "@/components/shared/MenuManagement";

export const dynamic = "force-dynamic";

export default async function SuperadminMenuPage() {
  const { items } = await getMenuItemsAction();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Menu management</h1>
      <MenuManagement initialItems={items} />
    </div>
  );
}
