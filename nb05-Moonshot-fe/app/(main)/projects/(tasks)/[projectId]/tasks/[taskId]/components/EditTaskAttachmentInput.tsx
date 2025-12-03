"use client";

import { toast } from "react-toastify";
import FileInput from "@/shared/components/FileInput";
import { updateTask } from "../actions";

const EditTaskAttachmentInput = ({
  taskId,
  urls,
}: {
  taskId: number;
  urls: string[];
}) => {
  const handleChange = async (urls: string[]) => {
    const { error, success, data } = await updateTask(taskId, {
      attachments: urls,
    });
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
    if (data) {
      return data.attachments ?? [];
    }
  };

  return <FileInput urls={urls} onChange={handleChange} />;
};

export default EditTaskAttachmentInput;
