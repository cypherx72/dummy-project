import { errorToast } from "@/components/ui/toast";
import { UploadUrlConfigType } from "./types-args";

interface CloudinaryUploadResult {
  bytes: number;
  resourceType: string;
  publicId: string;
  name: string;
  cloudinaryUrl: string;
  fileExtension: string;
}

interface HandleFileSubmitArgs {
  data: { attachments?: File | File[] | null };
  configData: UploadUrlConfigType;
  fetchConfig: () => Promise<{ data: { GetUploadSignature: UploadUrlConfigType } }>;
}

export const uploadToCloudinary = async (
  file: File,
  config: UploadUrlConfigType,
): Promise<CloudinaryUploadResult | undefined> => {
  if (!config) {
    errorToast("Upload configuration is missing. Please try again.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", config.timestamp?.toString());
  formData.append("signature", config.signature);
  formData.append("folder", config.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: ${res.statusText}`);
  }

  const responseData = await res.json();

  return {
    bytes: responseData.bytes,
    resourceType: responseData.resource_type,
    publicId: responseData.public_id,
    name: responseData.display_name,
    cloudinaryUrl: responseData.secure_url,
    fileExtension: (responseData.display_name as string).split(".").pop() ?? "",
  };
};

export const handleFileSubmit = async ({
  data,
  configData,
  fetchConfig,
}: HandleFileSubmitArgs): Promise<CloudinaryUploadResult[]> => {
  const files: File[] = Array.isArray(data.attachments)
    ? data.attachments
    : data.attachments
      ? [data.attachments]
      : [];

  if (files.length === 0) return [];

  let resolvedConfig = configData;

  if (!resolvedConfig || Object.keys(resolvedConfig).length === 0) {
    const { data: fetchData } = await fetchConfig();
    resolvedConfig = fetchData.GetUploadSignature;
  }

  const uploads = files.map((file) => uploadToCloudinary(file, resolvedConfig));
  const results = await Promise.all(uploads);

  return results.filter(Boolean) as CloudinaryUploadResult[];
};
