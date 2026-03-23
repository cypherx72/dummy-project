"use client";
import { Button } from "@/components/ui/button";
import { FaFileContract } from "react-icons/fa";
import { useState, DragEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fileSchema } from "@/config/ZodSchema";
// import { PreviewModalButton } from "@/components/preview";
import { showToast } from "@/components/ui/toast";
import { useParams, useRouter } from "next/navigation";

const problemStatement = `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non iure quia numquam ab unde repudiandae possimus, nisi impedit. Corrupti error quae quis, nam eveniet repudiandae delectus iste autem earum! Ipsam?
  Soluta laboriosam pariatur aut facere est numquam cupiditate accusamus, consequatur nulla, quisquam voluptate ipsum. Odio cum in fugit, quas earum nisi ipsam aut, cupiditate architecto aperiam autem atque, sit pariatur!`;

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string[]>([]);
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId;

  const handleFileSubmit = async () => {
    if (!file) return;

    const operations = JSON.stringify({
      query: `
        mutation UploadFile($input: UploadFileInput!) {
          submitFile(input: $input)
        }
      `,
      variables: {
        input: {
          taskId,
          userId: "1",
          file: null,
        },
      },
    });

    const map = JSON.stringify({
      "0": ["variables.input.file"], // <-- file index "0" maps to input.file
    });

    const formData = new FormData();
    formData.append("operations", operations);
    formData.append("map", map);
    formData.append("0", file); // <-- actual file stream

    console.log(file);
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (data?.data?.submitFile) {
        showToast("File Upload", "File uploaded successfully.");
        setFile(null);
        router.back();
      } else {
        showToast("File upload error!", "Failed to upload file.");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error", "Unable to reach server.");
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError([]);
    const files = e.dataTransfer.files;

    if (!files || files.length !== 1 || !files[0]) {
      setError((prevErr) => [...prevErr, "Please select only one file."]);
      return;
    }

    if (files.length > 0) {
      const file = files[0];

      const result = fileSchema.safeParse(file);
      if (!result.success) {
        const errObj = JSON.parse(result.error.message);
        for (const err of errObj) {
          setError((prevErr) => [...prevErr, err?.message]);
        }
        return;
      }
      result.data.name = "aa";

      setFile(result.data);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError([]);
    const files = e.target.files;

    if (!files || files.length !== 1 || !files[0]) {
      setError((prevErr) => [...prevErr, "Please select at least one file."]);
      return;
    }

    const file = files[0];

    // Validate file
    const result = fileSchema.safeParse(file);
    if (!result.success) {
      const errObj = JSON.parse(result.error.message);
      for (const err of errObj) {
        setError((prevErr) => [...prevErr, err?.message]);
      }
      return;
    }

    setFile(result.data);
  };

  // const handleFileDelete = async () => {

  // }

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="flex flex-row justify-center items-center bg-muted px-12 py-8 max-w-4xl h-max-[600px]">
        {/* upload card */}
        <form
          className="grid md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleFileSubmit();
          }}
        >
          <Card
            className="flex justify-center items-center border-2 border-blue-500 border-dashed rounded-r-none w-1/2 sm:w-full h-[500px]"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <CardContent className="flex flex-col justify-center items-center gap-y-4">
              <FaCloudUploadAlt size={72} className="block" />
              <p className="block font-semibold text-3xl">Drop file here</p>
              <p className="font-semibold text-gray-500 text-2xl">or</p>
              <Button variant="outline" size="lg" className="text-md">
                <label htmlFor="fileUpload">
                  Upload File
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    name="fileUpload"
                    onChange={handleFileUpload}
                  />
                </label>
              </Button>
              {error.length > 0 ? (
                <Alert className="border-muted">
                  <AlertDescription className="border-none text-red-500">
                    {error.map((err, idx) => (
                      <ul className="text-sm list-disc list-inside" key={idx}>
                        <li>{err}</li>
                      </ul>
                    ))}
                  </AlertDescription>
                </Alert>
              ) : null}
            </CardContent>
            <CardFooter className="">
              <Alert className="border-muted">
                <AlertDescription className="px-4 border-none text-amber-600">
                  <ul className="text-sm list-disc list-outside">
                    <li>Your file must be in PDF, JPG, or PNG format.</li>
                    <li>The file size must not exceed 10MB.</li>
                    <li>
                      Ensure your document is legible (especially for scanned or
                      handwritten work).
                    </li>
                    <li>
                      Submissions must be done before the deadline — late
                      uploads will be rejected.
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>

          {/* details page */}
          <Card className="flex flex-col flex-1 justify-center items-center gap-y-12 px-4 border-none rounded-l-none w-1/2 sm:w-full h-[500px]">
            <CardContent className="flex flex-col justify-center items-center">
              <FaFileContract size={72} />
              <Badge variant="secondary" className="my-3">
                {file ? file.name : ""}
              </Badge>
            </CardContent>

            <section className="flex flex-col gap-3 font-semibold text-md">
              <h4 className="left-0 font-semibold text-white/60 text-lg">
                Problem Statement
              </h4>
              <Alert className="border-muted">
                <AlertDescription className="border-none text-white/85">
                  {problemStatement.length < 200
                    ? problemStatement
                    : problemStatement.slice(0, 200).concat("...")}
                </AlertDescription>
              </Alert>
            </section>

            <CardFooter className="flex justify-center items-center gap-x-4 font-semibold">
              <Button
                type="submit"
                disabled={file ? false : true}
                className="bg-green-900 hover:bg-green-800 text-white"
                variant="default"
              >
                Submit
              </Button>
              {/* <PreviewModalButton file={file} /> */}
              <Button
                type="button"
                variant="destructive"
                disabled={file ? false : true}
                onClick={() => setFile(null)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
