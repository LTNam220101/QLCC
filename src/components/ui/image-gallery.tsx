"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  ZoomIn,
  ZoomOut
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageItem {
  id: string
  url: string
  alt?: string
  name?: string
}

interface ImageGalleryProps {
  images: ImageItem[]
  className?: string
  thumbnailClassName?: string
  showRemoveButton?: boolean
  onRemove?: (imageId: string) => void
}

export function ImageGallery({
  images,
  className,
  thumbnailClassName,
  showRemoveButton = false,
  onRemove
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  )
  const [zoom, setZoom] = useState(1)

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setZoom(1)
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
    setZoom(1)
  }

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
      setZoom(1)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
      setZoom(1)
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleDownload = () => {
    if (selectedImageIndex !== null) {
      const image = images[selectedImageIndex]
      const link = document.createElement("a")
      link.href = image.url
      link.download = image.name || `image-${selectedImageIndex + 1}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePrint = () => {
    if (selectedImageIndex !== null) {
      const image = images[selectedImageIndex]
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Image</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                img { width: 100%; height: 100%; }
              </style>
            </head>
            <body>
              <img src="${image.url}" alt="${image.alt || ""}" />
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleRemove = (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation()
    onRemove?.(imageId)
  }

  if (images.length === 0) {
    return null
  }

  const selectedImage =
    selectedImageIndex !== null ? images[selectedImageIndex] : null

  return (
    <>
      {/* Thumbnail Gallery */}
      <div
        className={cn(
          "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4",
          className
        )}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors",
              thumbnailClassName
            )}
            onClick={() => openLightbox(index)}
          >
            <div className="aspect-square relative">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || `Image ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {showRemoveButton && onRemove && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleRemove(e, image.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="w-[100vw] !max-w-[100vw] h-[100vh] p-0 bg-gray-900 border-0">
          {selectedImage && (
            <div className="relative w-full h-full">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-sm font-medium">
                    Ảnh đính kèm {selectedImageIndex || 0 + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={closeLightbox}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Image Container */}
              <div className="flex items-center justify-center h-full p-8">
                <div
                  className="relative w-[90vw] h-[90vh] overflow-auto"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <Image
                    src={selectedImage.url || "/placeholder.svg"}
                    alt={
                      selectedImage.alt ||
                      `Image ${selectedImageIndex || 0 + 1}`
                    }
                    width={1200}
                    height={800}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-50"
                    onClick={goToPrevious}
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-50"
                    onClick={goToNext}
                    disabled={selectedImageIndex === images.length - 1}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Zoom Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-lg p-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 disabled:opacity-50"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-white text-sm min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 disabled:opacity-50"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 rounded-lg px-3 py-1">
                  <span className="text-white text-sm">
                    {selectedImageIndex || 0 + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
