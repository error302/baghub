import { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  maxHeight?: string
}

interface ToolbarButton {
  icon: React.ReactNode
  action: () => void
  active?: boolean
  title: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter description...',
  minHeight = '200px',
  maxHeight = '400px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateValue()
  }

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const handleImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      execCommand('insertImage', url)
    }
  }

  const toolbarButtons: ToolbarButton[] = [
    { icon: <Bold className="w-4 h-4" />, action: () => execCommand('bold'), title: 'Bold' },
    { icon: <Italic className="w-4 h-4" />, action: () => execCommand('italic'), title: 'Italic' },
    { icon: <Underline className="w-4 h-4" />, action: () => execCommand('underline'), title: 'Underline' },
    { icon: <span className="w-px h-4 bg-border-default" />, action: () => {}, title: '' },
    { icon: <AlignLeft className="w-4 h-4" />, action: () => execCommand('justifyLeft'), title: 'Align Left' },
    { icon: <AlignCenter className="w-4 h-4" />, action: () => execCommand('justifyCenter'), title: 'Align Center' },
    { icon: <AlignRight className="w-4 h-4" />, action: () => execCommand('justifyRight'), title: 'Align Right' },
    { icon: <span className="w-px h-4 bg-border-default" />, action: () => {}, title: '' },
    { icon: <List className="w-4 h-4" />, action: () => execCommand('insertUnorderedList'), title: 'Bullet List' },
    { icon: <ListOrdered className="w-4 h-4" />, action: () => execCommand('insertOrderedList'), title: 'Numbered List' },
    { icon: <span className="w-px h-4 bg-border-default" />, action: () => {}, title: '' },
    { icon: <LinkIcon className="w-4 h-4" />, action: handleLink, title: 'Insert Link' },
    { icon: <ImageIcon className="w-4 h-4" />, action: handleImage, title: 'Insert Image' },
    { icon: <span className="w-px h-4 bg-border-default" />, action: () => {}, title: '' },
    { icon: <Undo className="w-4 h-4" />, action: () => execCommand('undo'), title: 'Undo' },
    { icon: <Redo className="w-4 h-4" />, action: () => execCommand('redo'), title: 'Redo' },
  ]

  return (
    <div
      className={cn(
        'border rounded-elegant overflow-hidden transition-all duration-luxury',
        isFocused ? 'border-gold ring-1 ring-gold/20' : 'border-border-default'
      )}
    >
      {/* Toolbar */}
      <div className="bg-cream/50 border-b border-border-subtle px-3 py-2 flex flex-wrap items-center gap-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            title={button.title}
            className={cn(
              'p-1.5 rounded-elegant transition-colors duration-luxury',
              button.title === ''
                ? 'pointer-events-none mx-1'
                : 'hover:bg-white hover:text-gold text-muted'
            )}
          >
            {button.icon}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'w-full px-4 py-3 text-sm text-charcoal bg-white focus:outline-none',
          'prose prose-sm max-w-none'
        )}
        style={{
          minHeight,
          maxHeight,
          overflowY: 'auto',
        }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />

      {/* Character Count */}
      <div className="bg-cream/50 border-t border-border-subtle px-4 py-2 flex items-center justify-between text-xs text-muted">
        <span>Rich Text Editor</span>
        <span>{value.replace(/<[^>]*>/g, '').length} characters</span>
      </div>
    </div>
  )
}

// Simple text editor variant (for short descriptions)
interface SimpleEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  rows?: number
}

export function SimpleEditor({
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 4,
}: SimpleEditorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const charCount = value.length

  return (
    <div className="space-y-1">
      <div
        className={cn(
          'relative border rounded-elegant overflow-hidden transition-all duration-luxury bg-white',
          isFocused ? 'border-gold ring-1 ring-gold/20' : 'border-border-default'
        )}
      >
        <textarea
          value={value}
          onChange={(e) => {
            if (!maxLength || e.target.value.length <= maxLength) {
              onChange(e.target.value)
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 text-sm text-charcoal bg-transparent focus:outline-none resize-y"
          style={{ minHeight: `${rows * 24}px` }}
        />
      </div>
      {maxLength && (
        <div className="flex justify-end">
          <span
            className={cn(
              'text-xs',
              charCount > maxLength * 0.9 ? 'text-status-warning' : 'text-muted'
            )}
          >
            {charCount}/{maxLength}
          </span>
        </div>
      )}
    </div>
  )
}
