import { useRef, type ChangeEvent } from 'react'
import { Camera, X } from 'lucide-react'
import { Avatar } from '@/components/shared/Avatar'

interface AvatarPickerProps {
  name: string
  imageUrl?: string
  previewUrl: string | null
  selectedFile: File | null
  onFileSelect: (file: File) => void
  onCancelPick: () => void
}

export function AvatarPicker({
  name,
  imageUrl,
  previewUrl,
  selectedFile,
  onFileSelect,
  onCancelPick,
}: AvatarPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <>
      <div className="relative">
        <Avatar name={name || 'Super Admin'} src={previewUrl || imageUrl} size="lg"  />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 transition cursor-pointer"
          aria-label="Change photo"
          title="Upload profile photo"
        >
          <Camera className="h-4 w-4" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-50 border border-brand-100 px-3.5 py-2 text-xs text-brand-800">
          <span className="truncate">
            Staged photo: <strong>{selectedFile.name}</strong> (click Save to update)
          </span>
          <button
            type="button"
            onClick={onCancelPick}
            className="ml-2 p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
            title="Discard photo"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  )
}

