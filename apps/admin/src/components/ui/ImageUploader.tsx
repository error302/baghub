import { useState, useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  maxSizeMB?: number
  accept?: string
}

export function ImageUploader({
  images = [],
  onChange,
  maxImages = 5,
  maxSizeMB = 5,
  accept = 'image/jpeg,image/png,image/webp',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Only image files are allowed' }
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, error: `File size must be less than ${maxSizeMB}MB` }
    }
    return { valid: true }
  }

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const filesArray = Array.from(files)
      const remainingSlots = maxImages - images.length
      const filesToProcess = filesArray.slice(0, remainingSlots)

      if (filesToProcess.length === 0) {
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      const newImages: string[] = []

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i]
        const validation = validateFile(file)

        if (!validation.valid) {
          console.error(validation.error)
          continue
        }

        // Simulate file upload and create preview URL
        // In production, this would upload to your storage service
        await new Promise((resolve) => setTimeout(resolve, 300))
        const imageUrl = URL.createObjectURL(file)
        newImages.push(imageUrl)
        setUploadProgress(((i + 1) / filesToProcess.length) * 100)
      }

      onChange([...images, ...newImages])
      setIsUploading(false)
      setUploadProgress(0)
    },
    [images, maxImages, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
      e.target.value = '' // Reset input
    },
    [handleFiles]
  )

  const removeImage = useCallback(
    (index: number) => {
      const newImages = [...images]
      newImages.splice(index, 1)
      onChange(newImages)
    },
    [images, onChange]
  )

  const reorderImages = useCallback(
    (dragIndex: number, dropIndex: number) => {
      const newImages = [...images]
      const [removed] = newImages.splice(dragIndex, 1)
      newImages.splice(dropIndex, 0, removed)
      onChange(newImages)
    },
    [images, onChange]
  )

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('dragIndex', String(index))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'))
                reorderImages(dragIndex, index)
              }}
              className={cn(
                'relative aspect-square group rounded-elegant overflow-hidden border border-border-default',
                index === 0 && 'ring-2 ring-gold'
              )}
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity duration-luxury flex flex-col items-center justify-center gap-2">
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-gold text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="p-2 bg-white rounded-full text-error hover:bg-error hover:text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                {index !== 0 && (
                  <span className="text-white text-xs">Drag to reorder</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-elegant p-8 transition-all duration-luxury cursor-pointer',
            isDragging
              ? 'border-gold bg-gold/5'
              : 'border-border-default hover:border-gold/50 hover:bg-cream/30'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <div className="w-48 h-1 bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center">
                {isDragging ? (
                  <ImageIcon className="w-6 h-6 text-gold" />
                ) : (
                  <Upload className="w-6 h-6 text-muted" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-charcoal font-medium">
                  {isDragging ? 'Drop images here' : 'Click or drag images to upload'}
                </p>
                <p className="text-xs text-muted mt-1">
                  JPEG, PNG, WebP up to {maxSizeMB}MB ({images.length}/{maxImages} images)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
