import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileArchive,
  Presentation,
} from "lucide-react";
import { HiDotsVertical } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { VscPreview } from "react-icons/vsc";
import { FaDownload } from "react-icons/fa6";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

type FileType = "pdf" | "docx" | "pptx" | "xlsx" | "image" | "video" | "zip";

interface FileMeta {
  id: string;
  name: string;
  type: FileType;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  downloads?: number;
}

const fileIconMap: Record<FileType, Element["className"]> = {
  pdf: <FileText className={"text-red-500"} />,
  docx: <FileText className="text-blue-500" />,
  pptx: <Presentation className="text-orange-500" />,
  xlsx: <FileSpreadsheet className="text-green-500" />,
  image: <FileImage className="text-purple-500" />,
  video: <FileVideo className="text-pink-500" />,
  zip: <FileArchive className="text-yellow-500" />,
};

export function FileCard({ file }: { file: FileMeta }) {
  return (
    <Item>
      <ItemMedia variant="icon">{fileIconMap[file.type]}</ItemMedia>
      <ItemContent>
        <ItemTitle>{file.name}</ItemTitle>
        <ItemDescription className="flex flex-row justify-between items-center w-full font-sans font-light text-xs">
          <span>{file.size}</span>
          <span>•</span>
          <span>{file.uploadedAt}</span>
          <span>•</span>
          <span>By {file.uploadedBy}</span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              className="rounded-sm size-6"
              variant="secondary"
            >
              <HiDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" align="center">
            <DropdownMenuItem>
              <VscPreview />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FaDownload />
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
}
