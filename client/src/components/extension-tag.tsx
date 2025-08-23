import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ExtensionTagProps {
  extension: string;
  onDelete: (extension: string) => void;
  isDeleting?: boolean;
}

export function ExtensionTag({ extension, onDelete, isDeleting = false }: ExtensionTagProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200 group hover:bg-blue-100 transition-colors duration-200">
      <span>.{extension}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 text-blue-500 hover:text-blue-700 hover:bg-transparent"
        onClick={() => onDelete(extension)}
        disabled={isDeleting}
        data-testid={`button-delete-${extension}`}
        aria-label={`${extension} 확장자 삭제`}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
