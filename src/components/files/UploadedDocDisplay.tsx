import { useMutation } from "@tanstack/react-query";
import UploadFile from "./UploadFile";
import UploadedDoc from "./UploadedDoc";
import { useUser } from "@/hooks/useUser";
import { deleteFile } from "@/services/user.service";
import { IProfileFileInterface } from "@/interface/file";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import { IUser } from "@/interface/user";
import { revalidateCurrentUser } from "@/actions/user";

interface UploadedDocDisplayProps {
  uploadedFiles: IProfileFileInterface[];
  files: File[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
  token: string;
}

const UploadedDocDisplay: React.FC<UploadedDocDisplayProps> = ({
  uploadedFiles,
  files,
  setFiles,
  token,
}) => {
  const { updateUser, user, refetchUser } = useUser();

  const mutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: (data) => {
      if (!data?.data) return;
      const userInfo = {
        ...user,
        ...data?.data,
      };
      showToaster("File deleted successfully", "success");
      updateUser(userInfo as IUser, token);
      revalidateCurrentUser().catch((error) => {
        console.error("Failed to revalidate user-info tag:", error);
      });
      refetchUser(token);
    },
    onError: (error) => {
      const errorMessage =
        extractServerErrorMessage(error) || "An error occurred";
      showToaster(errorMessage, "destructive");
    },
  });

  const handleDeleteFile = async (file: IProfileFileInterface) => {
    try {
      await mutation.mutateAsync({
        fileId: file.id,
        token,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };

  const handleViewFile = (file: IProfileFileInterface) => {
    window.open(file.fileUrl, '_blank');
  };

  return (
    <div className="mb-6">
      {uploadedFiles.length > 0 ? (
        uploadedFiles.map((file) => (
          <UploadedDoc
            key={file.id}
            fileName={JSON.parse(file.meta as string)?.clientName}
            fileSize={JSON.parse(file.meta as string)?.size}
            wrapperClass="mb-6"
            deleteUploadedFile={() => handleDeleteFile(file)}
            viewFile={() => handleViewFile(file)}
          />
        ))
      ) : (
        <UploadFile wrapperClass="mb-6" files={files} setFiles={setFiles} />
      )}
    </div>
  );
};

export default UploadedDocDisplay;
