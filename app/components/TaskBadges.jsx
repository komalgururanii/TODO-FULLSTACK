import { Badge } from "@/components/ui/badge";

const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: "⬇️",
  },
  medium: {
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: "➖",
  },
  high: {
    label: "High",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: "⬆️",
  },
};

const CATEGORY_COLORS = {
  work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  personal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  shopping:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  learning:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  general: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;

  return (
    <Badge className={`${config.color} border-0`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}

export function CategoryBadge({ category }) {
  const colorClass =
    CATEGORY_COLORS[category?.toLowerCase()] || CATEGORY_COLORS.general;

  return (
    <Badge className={`${colorClass} border-0`}>{category || "General"}</Badge>
  );
}

export function TagBadge({ tag }) {
  return (
    <Badge variant="outline" className="text-xs">
      #{tag}
    </Badge>
  );
}
