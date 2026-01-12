export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface TimeBlock {
  hour: number;
  categoryId: string | null;
}

export interface Day {
  date: string; // YYYY-MM-DD format
  blocks: TimeBlock[];
}

export interface AppData {
  categories: Category[];
  days: Record<string, Day>;
}
