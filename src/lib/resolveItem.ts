/**
 * resolveItem.ts
 * Shared utility to look up an item from the correct table
 * based on item_type ('book' | 'uniform' | 'school_supply').
 */
import { supabase } from "@/integrations/supabase/client";

export type ItemType = "book" | "uniform" | "school_supply";

export interface ResolvedItem {
  id: string;
  title: string;
  price: number;
  condition?: string;
  description?: string;
  image_url?: string;
  seller_id: string;
  sold?: boolean;
  available_quantity?: number;
  sold_quantity?: number;
  // book-specific
  author?: string;
  isbn?: string;
  publisher?: string;
  language?: string;
  curriculum?: string;
  grade?: string;
  category?: string;
  item_type_field?: string;
  province?: string;
  // uniform-specific
  school_name?: string;
  gender?: string;
  size?: string;
  color?: string;
  // supply-specific
  subject?: string;
  quantity?: number;
  tableSource: ItemType;
}

/** Map item_type string → Supabase table name */
export function itemTypeToTable(itemType: string | null | undefined): string {
  switch (itemType) {
    case "uniform": return "uniforms";
    case "school_supply": return "school_supplies";
    case "book":
    default: return "books";
  }
}

/** Resolve item_type from the DB table name */
export function tableToItemType(table: string): ItemType {
  switch (table) {
    case "uniforms": return "uniform";
    case "school_supplies": return "school_supply";
    default: return "book";
  }
}

/**
 * Fetch an item from the correct table.
 * If item_type is known, queries only that table.
 * If not, tries all three (fallback for legacy orders).
 */
export async function fetchItem(
  itemId: string,
  itemType?: string | null
): Promise<ResolvedItem | null> {
  if (itemType && itemType !== "book" && itemType !== "uniform" && itemType !== "school_supply") {
    itemType = null; // unknown type — fall through to search all
  }

  if (itemType) {
    const table = itemTypeToTable(itemType);
    const { data, error } = await supabase
      .from(table as any)
      .select("*")
      .eq("id", itemId)
      .maybeSingle();

    if (error || !data) return null;
    return { ...(data as any), tableSource: tableToItemType(table) } as ResolvedItem;
  }

  // Fallback: search all tables for legacy orders that have no item_type
  const tables: [string, ItemType][] = [
    ["books", "book"],
    ["uniforms", "uniform"],
    ["school_supplies", "school_supply"],
  ];

  for (const [table, type] of tables) {
    const { data } = await supabase
      .from(table as any)
      .select("*")
      .eq("id", itemId)
      .maybeSingle();

    if (data) return { ...(data as any), tableSource: type } as ResolvedItem;
  }

  return null;
}

/**
 * Mark an item as sold. Works across all three tables.
 */
export async function markItemSold(
  itemId: string,
  itemType: string | null | undefined,
  item: { sold?: boolean; available_quantity?: number; sold_quantity?: number }
) {
  if (item.sold) return; // already sold
  const table = itemTypeToTable(itemType);
  await supabase
    .from(table as any)
    .update({
      sold: true,
      availability: "sold",
      sold_at: new Date().toISOString(),
      sold_quantity: (item.sold_quantity || 0) + 1,
      available_quantity: Math.max(0, (item.available_quantity || 1) - 1),
    })
    .eq("id", itemId)
    .eq("sold", false);
}

/** Human-readable label for each item type */
export function itemTypeLabel(type: ItemType | string): string {
  switch (type) {
    case "uniform": return "Uniform";
    case "school_supply": return "School Supply";
    default: return "Book";
  }
}
