"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Camera from "@/icons/camera.svg"

interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  maxFileSize?: number // in MB
  acceptedFileTypes?: string[]
  className?: string
}

export function ImageUpload({
  onImagesChange,
  maxImages = 10,
  maxFileSize = 5,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
  className
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages: UploadedImage[] = []

      acceptedFiles.forEach((file) => {
        if (file.size <= maxFileSize * 1024 * 1024) {
          const id = Math.random().toString(36).substr(2, 9)
          const url = URL.createObjectURL(file)
          newImages.push({
            id,
            file,
            url,
            name: file.name
          })
        }
      })

      const updatedImages = [...images, ...newImages].slice(0, maxImages)
      setImages(updatedImages)
      onImagesChange(updatedImages)
    },
    [images, maxImages, maxFileSize, onImagesChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages
  })

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter((img) => {
      if (img.id === imageId) {
        URL.revokeObjectURL(img.url)
        return false
      }
      return true
    })
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group rounded-lg overflow-hidden border border-gray-200"
          >
            <div className="aspect-square relative">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <Button
                type="button"
                size="sm"
                variant="gray"
                className="absolute top-2 !rounded-full right-2 h-10 w-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(image.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        <div
          {...getRootProps()}
          className={cn(
            "aspect-square flex flex-col items-center justify-center gap-2.5 border-2 border-dashed border-green text-green rounded-lg p-6 text-center cursor-pointer transition-colors"
          )}
        >
          <input {...getInputProps()} />
          <Camera />
          Tải lên hình ảnh
        </div>
      </div>

      {images.length >= maxImages && (
        <p className="text-sm text-gray-500 text-center">
          Đã đạt giới hạn tối đa {maxImages} ảnh
        </p>
      )}
    </div>
  )
}
