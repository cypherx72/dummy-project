import { errorToast } from "@/components/ui/toast";
import { UploadUrlConfigType } from "./types-args";
import { FileAttachements } from "./schema";
import { showToast } from "@/components/ui/toast";

export const uploadToCloudinary = async (
  file: File,
  config: UploadUrlConfigType,
) => {
  if (!config) {
    errorToast();
    return;
  }
  const formData = new FormData();

  console.log("config", config);
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

  const data = await res.json();

  console.log(data);

  return {
    bytes: data.bytes,
    resourceType: data.resource_type,
    publicId: data.public_id,
    name: data.display_name,
    cloudinaryUrl: data.secure_url,
    fileExtension: data.display_name.split(".").pop(),
  };
};

export const handleFileSubmit = async ({ data, configData, fetchConfig }) => {
  console.log("Data received during submission: ", data);

  const files = Array.isArray(data.attachments)
    ? data.attachments
    : data.attachments
      ? [data.attachments]
      : [];

  if (files.length === 0) return;

  console.log("Normalized files:", files);

  if (Object.keys(configData).length === 0) {
    console.log("fetching data...");
    const { data } = await fetchConfig();
    configData = data.GetUploadSignature;
    console.log(configData);
  }

  const uploads = files.map((file) => uploadToCloudinary(file, configData));

  const results = await Promise.all(uploads);

  console.log("Submitted Task:", results);

  return results;
};
