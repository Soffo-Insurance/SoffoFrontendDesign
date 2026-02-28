import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'

export interface LibraryFile {
  id: string
  name: string
}

export interface SavedPrompt {
  id: string
  title: string
  body: string
  createdAt: string
}

const LIBRARY_STORAGE_KEY = 'soffo-library'

interface StoredLibrary {
  files: LibraryFile[]
  prompts: SavedPrompt[]
}

function loadLibrary(): StoredLibrary {
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY)
    if (!raw) return { files: [], prompts: [] }
    const parsed = JSON.parse(raw) as StoredLibrary
    return {
      files: Array.isArray(parsed.files) ? parsed.files : [],
      prompts: Array.isArray(parsed.prompts) ? parsed.prompts : [],
    }
  } catch {
    return { files: [], prompts: [] }
  }
}

function saveLibrary(data: StoredLibrary) {
  try {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

interface LibraryContextValue {
  libraryFiles: LibraryFile[]
  savedPrompts: SavedPrompt[]
  addLibraryFile: (name: string, id?: string) => LibraryFile
  removeLibraryFile: (id: string) => void
  addSavedPrompt: (payload: { title: string; body: string }) => SavedPrompt
  removeSavedPrompt: (id: string) => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredLibrary>(loadLibrary)

  useEffect(() => {
    saveLibrary(data)
  }, [data])

  const addLibraryFile = useCallback((name: string, id?: string): LibraryFile => {
    const file: LibraryFile = {
      id: id ?? `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
    }
    setData((prev) => ({
      ...prev,
      files: prev.files.some((f) => f.id === file.id) ? prev.files : [...prev.files, file],
    }))
    return file
  }, [])

  const removeLibraryFile = useCallback((id: string) => {
    setData((prev) => ({ ...prev, files: prev.files.filter((f) => f.id !== id) }))
  }, [])

  const addSavedPrompt = useCallback((payload: { title: string; body: string }): SavedPrompt => {
    const prompt: SavedPrompt = {
      id: `prompt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: payload.title,
      body: payload.body,
      createdAt: new Date().toISOString(),
    }
    setData((prev) => ({
      ...prev,
      prompts: [prompt, ...prev.prompts],
    }))
    return prompt
  }, [])

  const removeSavedPrompt = useCallback((id: string) => {
    setData((prev) => ({ ...prev, prompts: prev.prompts.filter((p) => p.id !== id) }))
  }, [])

  const value: LibraryContextValue = {
    libraryFiles: data.files,
    savedPrompts: data.prompts,
    addLibraryFile,
    removeLibraryFile,
    addSavedPrompt,
    removeSavedPrompt,
  }

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}

export function useLibraryOptional() {
  return useContext(LibraryContext)
}
