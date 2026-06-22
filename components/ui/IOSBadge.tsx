interface IOSBadgeProps {
  label: string;
  color: string;
  icon?: string;
}

export function IOSBadge({ label, color, icon }: IOSBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {icon && <span className="text-[10px]">{icon}</span>}
      {label}
    </span>
  );
}
