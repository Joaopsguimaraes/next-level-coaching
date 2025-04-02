"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageFile extends File {
  preview?: string;
  id: string;
}

interface ImagePickerProps {
  onImageSelect: (files: File[]) => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
}

export function ImagePicker({
  onImageSelect,
  className = "",
  accept = "image/*",
  maxSizeMB = 5,
  multiple = false,
}: ImagePickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    if (fileList.length === 0) return;

    const newFiles: ImageFile[] = [];

    Array.from(fileList).forEach((file) => {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select image files only");
        return;
      }

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      const imageFile = file as ImageFile;
      imageFile.id = `${file.name}-${Date.now()}`;

      reader.onload = () => {
        imageFile.preview = reader.result as string;

        if (multiple) {
          setSelectedFiles((prev) => [...prev, imageFile]);
        } else {
          setSelectedFiles([imageFile]);
        }
      };

      reader.readAsDataURL(file);
      newFiles.push(imageFile);
    });

    // Call the callback with all files
    if (multiple) {
      onImageSelect([...selectedFiles, ...newFiles]);
    } else {
      onImageSelect(newFiles);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = selectedFiles.filter((file) => file.id !== id);
    setSelectedFiles(updatedFiles);
    onImageSelect(updatedFiles);
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <div
        className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        } ${selectedFiles.length > 0 ? "p-4" : "h-full min-h-[200px]"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={selectedFiles.length > 0 ? undefined : handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={accept}
          multiple={multiple}
          className="hidden"
          aria-label="Upload image"
        />

        {selectedFiles.length === 0 ? (
          <>
            <Upload
              className="w-10 h-10 mb-2 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm text-center text-muted-foreground px-4">
              Arraste {multiple ? "imagens" : "imagem"} aqui ou clique para
              adicionar
            </p>
          </>
        ) : (
          <div
            className={`w-full ${multiple ? "flex flex-col w-full gap-4" : ""}`}
          >
            {multiple && (
              <div
                className="flex flex-col w-full items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={handleClick}
              >
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-center text-muted-foreground">
                  Adicione mais imagens
                </p>
              </div>
            )}

            <div className="flex flex-row w-full gap-5">
              {selectedFiles.map((file) => (
                <div
                  key={file.id}
                  className="relative min-w-xs border rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 z-10 hover:bg-black/70 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="relative aspect-square w-full">
                    {file.preview && (
                      <Image
                        src={file.preview || "/placeholder.svg"}
                        alt={file.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="p-3 bg-background">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
