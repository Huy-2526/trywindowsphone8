"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  Search,
  Phone,
  MessageSquare,
  Mail,
  Camera,
  Music,
  MapPin,
  Calendar,
  Settings,
  User,
  Globe,
  Calculator,
  Clock,
  Heart,
  RotateCcw,
  Volume2,
  VolumeX,
  Shuffle,
  Cloud,
  ShoppingCart,
  Gamepad2,
  Users,
  FileText,
  Cloud as CloudIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import PhotosApp from "./photos-app"
import SettingsApp from "./settings-app"
import MusicApp from "./music-app"
import SearchInterface from "./search-interface"

// Sound system for Windows Phone interactions
class WindowsPhoneSounds {
  private audioContext: AudioContext | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.1) {
    if (!this.audioContext) return
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = type
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  tileTap() { this.createTone(800, 0.1, "square", 0.05) }

  tileFlip() {
    if (!this.audioContext) return
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.4)
    oscillator.type = "sawtooth"
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(1200, this.audioContext.currentTime)
    filter.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.4)
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.04, this.audioContext.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4)
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.4)
  }

  navigation() {
    if (!this.audioContext) return
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
    oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.15)
    oscillator.type = "triangle"
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.04, this.audioContext.currentTime + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15)
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.15)
  }

  buttonPress() {
    this.createTone(1000, 0.08, "square", 0.03)
    setTimeout(() => this.createTone(800, 0.05, "square", 0.02), 50)
  }

  startup() {
    if (!this.audioContext) return
    const frequencies = [523, 659, 784, 1047]
    frequencies.forEach((freq, index) => {
      setTimeout(() => { this.createTone(freq, 0.3, "sine", 0.06) }, index * 100)
    })
  }
}

// ─── TILE DATA (unique IDs, no duplicates) ───────────────────────────────────
const tilesData = [
  {
    id: 1, size: "medium", color: "bg-blue-600", icon: MessageSquare, title: "Messaging",
    flipType: "horizontal",
    contents: [
      { primary: "2 new messages", secondary: "Hey! How are you?" },
      { primary: "Sarah Johnson", secondary: "See you tomorrow!" },
      { primary: "Group Chat", secondary: "3 unread messages" },
      { primary: "Mom", secondary: "Call me when you can" },
    ],
  },
  {
    id: 2, size: "small", color: "bg-blue-600", icon: Phone, title: "Phone",
    flipType: "fade",
    contents: [{ primary: "", secondary: "" }, { primary: "3 missed", secondary: "" }],
  },
  {
    id: 3, size: "small", color: "bg-blue-600", icon: Globe, title: "IE",
    flipType: "fade",
    contents: [{ primary: "", secondary: "" }],
  },
  {
    id: 4, size: "small", color: "bg-red-600", icon: Mail, title: "Mail",
    flipType: "fade",
    contents: [{ primary: "", secondary: "" }, { primary: "5 new", secondary: "" }],
  },
  {
    id: 5, size: "small", color: "bg-cyan-500", icon: Search, title: "Cortana",
    flipType: "fade",
    contents: [{ primary: "", secondary: "" }],
  },
  {
    id: 6, size: "wide", color: "bg-orange-600", icon: Music, title: "Music",
    flipType: "slide",
    contents: [
      { primary: "Now Playing", secondary: "Imagine Dragons - Radioactive", progress: 65 },
      { primary: "Recently Played", secondary: "Coldplay - Viva La Vida", progress: 0 },
      { primary: "Playlist", secondary: "My Favorites - 47 songs", progress: 0 },
    ],
  },
  {
    id: 7, size: "medium", color: "bg-blue-600", icon: Store, title: "Store",
    flipType: "vertical",
    contents: [
      { primary: "", secondary: "" },
      { primary: "3 updates", secondary: "" },
      { primary: "New apps", secondary: "" },
    ],
  },
  {
    id: 8, size: "medium", color: "bg-indigo-600", icon: Calendar, title: "Calendar",
    flipType: "flip3d",
    contents: [
      { primary: "Saturday", secondary: "", date: new Date().getDate() },
      { primary: "Meeting", secondary: "2 PM", date: new Date().getDate() },
      { primary: "3 events", secondary: "", date: new Date().getDate() },
    ],
  },
  {
    id: 9, size: "small", color: "bg-teal-600", icon: MapPin, title: "Maps",
    flipType: "zoom",
    contents: [{ primary: "Seattle, WA", secondary: "72°F" }, { primary: "Traffic", secondary: "Light" }],
  },
  {
    id: 10, size: "small", color: "bg-gray-600", icon: Settings, title: "Settings",
    flipType: "rotate",
    contents: [{ primary: "", secondary: "" }],
  },
  {
    id: 11, size: "medium", color: "bg-purple-600", icon: Camera, title: "Photos",
    flipType: "cube",
    contents: [
      { primary: "", secondary: "" },
      { primary: "12 photos", secondary: "" },
    ],
  },
  {
    id: 12, size: "medium", color: "bg-yellow-600", icon: Users, title: "People",
    flipType: "horizontal",
    contents: [
      { primary: "", secondary: "" },
      { primary: "Sarah updated", secondary: "her status" },
      { primary: "3 birthdays", secondary: "this week" },
    ],
  },
  {
    id: 13, size: "small", color: "bg-pink-600", icon: Calculator, title: "Calculator",
    flipType: "cube",
    contents: [{ primary: "", secondary: "" }],
  },
  {
    id: 14, size: "small", color: "bg-blue-500", icon: Clock, title: "Weather",
    flipType: "slide",
    contents: [{ primary: "72°F", secondary: "Partly Cloudy" }, { primary: "Tomorrow", secondary: "68°F" }],
  },
  {
    id: 15, size: "wide", color: "bg-slate-600", icon: Music, title: "Xbox Music",
    flipType: "horizontal",
    contents: [
      { primary: "Mix Radio", secondary: "Discover new music", progress: 0 },
      { primary: "Top Charts", secondary: "This week's hits", progress: 0 },
    ],
  },
  {
    id: 16, size: "medium", color: "bg-lime-600", icon: MessageSquare, title: "WhatsApp",
    flipType: "flip3d",
    contents: [
      { primary: "5 new messages", secondary: "Family Group" },
      { primary: "Work Chat", secondary: "Meeting at 3 PM" },
    ],
  },
  {
    id: 17, size: "small", color: "bg-rose-600", icon: Heart, title: "Health",
    flipType: "zoom",
    contents: [{ primary: "8,432", secondary: "steps today" }, { primary: "Goal: 10k", secondary: "84% done" }],
  },
  {
    id: 18, size: "small", color: "bg-sky-500", icon: Globe, title: "Skype",
    flipType: "fade",
    contents: [{ primary: "", secondary: "" }, { primary: "2 online", secondary: "" }],
  },
]

// Placeholder Store icon (not in lucide directly)
function Store(props: any) {
  return <ShoppingCart {...props} />
}

const apps = [
  { name: "Alarms", icon: Clock, color: "bg-emerald-600" },
  { name: "Calculator", icon: Calculator, color: "bg-gray-700" },
  { name: "Calendar", icon: Calendar, color: "bg-indigo-600" },
  { name: "Camera", icon: Camera, color: "bg-purple-600" },
  { name: "Cortana", icon: Search, color: "bg-cyan-500" },
  { name: "Files", icon: FileText, color: "bg-yellow-600" },
  { name: "Games", icon: Gamepad2, color: "bg-green-600" },
  { name: "Health", icon: Heart, color: "bg-rose-600" },
  { name: "Internet Explorer", icon: Globe, color: "bg-blue-500" },
  { name: "Mail", icon: Mail, color: "bg-red-600" },
  { name: "Maps", icon: MapPin, color: "bg-teal-600" },
  { name: "Messaging", icon: MessageSquare, color: "bg-green-600" },
  { name: "Music", icon: Music, color: "bg-orange-600" },
  { name: "News", icon: Globe, color: "bg-violet-600" },
  { name: "Office", icon: FileText, color: "bg-orange-500" },
  { name: "OneDrive", icon: Cloud, color: "bg-blue-600" },
  { name: "People", icon: Users, color: "bg-pink-600" },
  { name: "Phone", icon: Phone, color: "bg-blue-600" },
  { name: "Photos", icon: Camera, color: "bg-purple-500" },
  { name: "Settings", icon: Settings, color: "bg-gray-600" },
  { name: "Skype", icon: MessageSquare, color: "bg-sky-500" },
  { name: "Store", icon: ShoppingCart, color: "bg-green-500" },
  { name: "Weather", icon: Cloud, color: "bg-sky-600" },
  { name: "WhatsApp", icon: MessageSquare, color: "bg-lime-600" },
  { name: "Xbox", icon: Gamepad2, color: "bg-green-600" },
].sort((a, b) => a.name.localeCompare(b.name))

export default function WindowsPhoneEmulator() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [tileLayout, setTileLayout] = useState(tilesData)
  const [currentView, setCurrentView] = useState<"home" | "apps">("home")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [tileContents, setTileContents] = useState<{ [key: number]: number }>({})
  const [flippingTiles, setFlippingTiles] = useState<Set<number>>(new Set())
  const [bootStage, setBootStage] = useState<"logo" | "loading" | "complete">("logo")
  const [showBoot, setShowBoot] = useState(true)
  const [currentApp, setCurrentApp] = useState<string | null>(null)
  const [accentColor, setAccentColor] = useState<string>("lime")
  const [transitionState, setTransitionState] = useState<"idle" | "exiting" | "entering">("idle")
  const [wallpaper, setWallpaper] = useState<{ type: "color" | "image"; value: string }>({ type: "color", value: "bg-black" })
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null)
  const [tileOrder, setTileOrder] = useState<number[]>(tilesData.map((t) => t.id))
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [draggedTileId, setDraggedTileId] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [sounds] = useState(() => new WindowsPhoneSounds())
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null)
  const [swipeCurrentX, setSwipeCurrentX] = useState<number | null>(null)

  const accentColors: Record<string, { name: string; bg: string; text: string; border: string; hex: string }> = {
    lime: { name: "lime", bg: "bg-lime-500", text: "text-lime-500", border: "border-lime-500", hex: "#84cc16" },
    green: { name: "green", bg: "bg-green-500", text: "text-green-500", border: "border-green-500", hex: "#22c55e" },
    teal: { name: "teal", bg: "bg-teal-500", text: "text-teal-500", border: "border-teal-500", hex: "#14b8a6" },
    blue: { name: "blue", bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500", hex: "#3b82f6" },
    indigo: { name: "indigo", bg: "bg-indigo-500", text: "text-indigo-500", border: "border-indigo-500", hex: "#6366f1" },
    violet: { name: "violet", bg: "bg-violet-500", text: "text-violet-500", border: "border-violet-500", hex: "#8b5cf6" },
    purple: { name: "purple", bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500", hex: "#a855f7" },
    pink: { name: "pink", bg: "bg-pink-500", text: "text-pink-500", border: "border-pink-500", hex: "#ec4899" },
    rose: { name: "rose", bg: "bg-rose-500", text: "text-rose-500", border: "border-rose-500", hex: "#f43f5e" },
    red: { name: "red", bg: "bg-red-500", text: "text-red-500", border: "border-red-500", hex: "#ef4444" },
    orange: { name: "orange", bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500", hex: "#f97316" },
    amber: { name: "amber", bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500", hex: "#f59e0b" },
    yellow: { name: "yellow", bg: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500", hex: "#eab308" },
    cobalt: { name: "cobalt", bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-600", hex: "#2563eb" },
    steel: { name: "steel", bg: "bg-slate-500", text: "text-slate-500", border: "border-slate-500", hex: "#64748b" },
    magenta: { name: "magenta", bg: "bg-pink-600", text: "text-pink-600", border: "border-pink-600", hex: "#db2777" },
    crimson: { name: "crimson", bg: "bg-red-600", text: "text-red-600", border: "border-red-600", hex: "#dc2626" },
    emerald: { name: "emerald", bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500", hex: "#10b981" },
    cyan: { name: "cyan", bg: "bg-cyan-500", text: "text-cyan-500", border: "border-cyan-500", hex: "#06b6d4" },
    fuchsia: { name: "fuchsia", bg: "bg-fuchsia-500", text: "text-fuchsia-500", border: "border-fuchsia-500", hex: "#d946ef" },
  }

  const wallpaperOptions = {
    colors: [
      { name: "Black", value: "bg-black", preview: "#000000" },
      { name: "Dark Gray", value: "bg-gray-900", preview: "#111827" },
      { name: "Navy", value: "bg-blue-900", preview: "#1e3a8a" },
      { name: "Forest", value: "bg-green-900", preview: "#14532d" },
      { name: "Burgundy", value: "bg-red-900", preview: "#7f1d1d" },
      { name: "Purple", value: "bg-purple-900", preview: "#581c87" },
      { name: "Teal", value: "bg-teal-900", preview: "#134e4a" },
      { name: "Brown", value: "bg-amber-900", preview: "#78350f" },
    ],
    images: [
      { name: "Abstract Blue", value: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=800&fit=crop" },
      { name: "Geometric", value: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop" },
      { name: "Nature", value: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=800&fit=crop" },
      { name: "City Lights", value: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=800&fit=crop" },
      { name: "Ocean", value: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=800&fit=crop" },
    ],
  }

  const currentAccent = accentColors[accentColor] ?? accentColors.lime

  const swipeThreshold = 80

  // Keep tileOrder in sync
  useEffect(() => {
    const layoutIds = tileLayout.map((t) => t.id)
    const validOrder = tileOrder.filter((id) => layoutIds.includes(id))
    const newIds = layoutIds.filter((id) => !tileOrder.includes(id))
    if (validOrder.length !== tileOrder.length || newIds.length > 0) {
      setTileOrder([...validOrder, ...newIds])
    }
  }, [tileLayout])

  const handleSwipeStart = (clientX: number) => {
    if (currentApp) return
    setSwipeStartX(clientX)
    setSwipeCurrentX(clientX)
  }

  const handleSwipeMove = (clientX: number) => {
    if (swipeStartX === null || currentApp) return
    setSwipeCurrentX(clientX)
  }

  const handleSwipeEnd = () => {
    if (swipeStartX === null || swipeCurrentX === null || currentApp) {
      setSwipeStartX(null); setSwipeCurrentX(null); return
    }
    const swipeDistance = swipeStartX - swipeCurrentX
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && currentView === "home") { handleViewTransition("apps", null); if (soundEnabled) sounds.navigation() }
      else if (swipeDistance < 0 && currentView === "apps") { handleViewTransition("home", null); if (soundEnabled) sounds.navigation() }
    }
    setSwipeStartX(null); setSwipeCurrentX(null)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") { setSearchResults([]); return }
    const results = [
      ...apps.map((app) => ({ ...app, type: "app" })),
      ...tileLayout.map((tile) => ({ ...tile, type: "tile" })),
    ]
      .filter((item) => (item.name || (item as any).title || "").toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8)
    setSearchResults(results)
  }

  const randomizeTileLayout = () => {
    const shuffled = [...tileLayout].sort(() => Math.random() - 0.5)
    const sizes = ["medium", "medium", "wide", "small", "small", "medium", "small", "small", "wide", "medium", "medium", "small", "small", "small", "wide", "medium", "small", "small"]
    setTileLayout(shuffled.map((tile, i) => ({ ...tile, size: sizes[i % sizes.length] || tile.size })))
    if (soundEnabled) sounds.tileFlip()
  }

  useEffect(() => {
    if (!showBoot) return
    setTimeout(() => { setBootStage("loading") }, 2000)
    setTimeout(() => { setBootStage("complete") }, 4000)
    setTimeout(() => { setShowBoot(false); if (soundEnabled) sounds.startup() }, 5000)
  }, [showBoot])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const updateTileContent = () => {
      const activeTiles = tileLayout.filter((tile) => tile.contents.length > 1)
      if (!activeTiles.length) return
      const tileToUpdate = activeTiles[Math.floor(Math.random() * activeTiles.length)]
      setFlippingTiles((prev) => new Set([...prev, tileToUpdate.id]))
      if (soundEnabled) sounds.tileFlip()
      setTimeout(() => {
        setTileContents((prev) => ({
          ...prev,
          [tileToUpdate.id]: ((prev[tileToUpdate.id] ?? 0) + 1) % tileToUpdate.contents.length,
        }))
        setTimeout(() => {
          setFlippingTiles((prev) => { const s = new Set(prev); s.delete(tileToUpdate.id); return s })
        }, 400)
      }, 200)
    }
    const interval = setInterval(updateTileContent, 3000)
    return () => clearInterval(interval)
  }, [soundEnabled, tileLayout])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  // ─── TILE GRID CLASSES ───────────────────────────────────────────────────────
  // Grid is 4 columns. small=1col, medium=2col, wide=4col (full width)
  const getTileClasses = (size: string) => {
    switch (size) {
      case "small":
        return "col-span-1"   // 1 of 4 columns → square
      case "medium":
      case "square":
        return "col-span-2"   // 2 of 4 columns → square
      case "wide":
      case "large":
      case "extra-wide":
        return "col-span-4"   // full width → 2:1 ratio
      case "tiny":
        return "col-span-1"
      default:
        return "col-span-2"
    }
  }

  const getTileAspect = (size: string) => {
    switch (size) {
      case "small":
      case "tiny":
        return "aspect-square"
      case "medium":
      case "square":
        return "aspect-square"
      case "wide":
      case "large":
      case "extra-wide":
        return "aspect-[2/1]"
      default:
        return "aspect-square"
    }
  }

  const handleViewTransition = (newView: "home" | "apps", newApp: string | null = null) => {
    if (transitionState !== "idle") return
    setTransitionState("exiting")
    setTimeout(() => {
      setCurrentView(newView)
      setCurrentApp(newApp)
      setTransitionState("entering")
      setTimeout(() => { setTransitionState("idle") }, 300)
    }, 300)
  }

  const handleTileMouseDown = (tileId: number) => {
    const timer = setTimeout(() => {
      setIsEditMode(true)
      setSelectedTileId(tileId)
      setDraggedTileId(tileId)
      if (soundEnabled) sounds.buttonPress()
    }, 500)
    setPressTimer(timer)
  }

  const handleTileMouseUp = () => {
    if (pressTimer) { clearTimeout(pressTimer); setPressTimer(null) }
  }

  const handleDeleteTile = (tileId: number) => {
    setTileLayout(tileLayout.filter((t) => t.id !== tileId))
    setTileOrder(tileOrder.filter((id) => id !== tileId))
    setSelectedTileId(null)
    if (soundEnabled) sounds.buttonPress()
  }

  const handleTileDragOver = (tileId: number) => {
    if (draggedTileId !== null && draggedTileId !== tileId) {
      const draggedIndex = tileOrder.indexOf(draggedTileId)
      const targetIndex = tileOrder.indexOf(tileId)
      const newOrder = [...tileOrder]
      newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedTileId)
      setTileOrder(newOrder)
    }
  }

  const handleEditModeExit = () => {
    setIsEditMode(false)
    setSelectedTileId(null)
    setDraggedTileId(null)
  }

  const handleResizeTile = (tileId: number, newSize: string) => {
    setTileLayout(tileLayout.map((t) => t.id === tileId ? { ...t, size: newSize } : t))
    if (soundEnabled) sounds.tileFlip()
  }

  const tileSizeOptions = [
    { label: "S", value: "small" },
    { label: "M", value: "medium" },
    { label: "W", value: "wide" },
  ]

  const groupedApps = apps.reduce((acc, app) => {
    const letter = app.name[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(app)
    return acc
  }, {} as Record<string, typeof apps>)

  const handleTouchStart = (e: React.TouchEvent, tileId: number) => {
    const timer = setTimeout(() => {
      setIsEditMode(true)
      setSelectedTileId(tileId)
      setDraggedTileId(tileId)
      if (soundEnabled) sounds.buttonPress()
    }, 500)
    setPressTimer(timer)
  }

  const handleTouchEnd = () => {
    if (pressTimer) { clearTimeout(pressTimer); setPressTimer(null) }
    setDraggedTileId(null)
  }

  const openApp = (name: string) => {
    if (soundEnabled) sounds.tileTap()
    const n = name.toLowerCase()
    if (n === "photos" || n === "camera") handleViewTransition("home", "photos")
    else if (n === "settings") handleViewTransition("home", "settings")
    else if (n === "music" || n === "xbox music") handleViewTransition("home", "music")
    else handleViewTransition("home", n)
  }

  return (
    <div className="w-full h-screen bg-black">
      <div className="bg-black text-white overflow-hidden h-full relative max-w-lg mx-auto">
        {/* Wallpaper */}
        {wallpaper.type === "color" ? (
          <div className={`absolute inset-0 ${wallpaper.value}`} />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wallpaper.value})`, transform: `scale(1.05) translateY(${scrollY * 0.2}px)` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-3 py-1.5 text-xs bg-black/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="w-1 h-1 bg-gray-500 rounded-full" />
              <span className="ml-2">Verizon</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => { setShowBoot(true); setBootStage("logo"); if (soundEnabled) sounds.buttonPress() }} className="p-1 hover:text-blue-400 transition-colors" title="Restart">
                <RotateCcw className="w-3 h-3" />
              </button>
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1 hover:text-blue-400 transition-colors">
                {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              </button>
              <button onClick={randomizeTileLayout} className="p-1 hover:text-blue-400 transition-colors" title="Randomize">
                <Shuffle className="w-3 h-3" />
              </button>
              <span>{formatTime(currentTime)}</span>
              <div className="w-6 h-3 border border-white rounded-sm">
                <div className={`w-4 h-1.5 ${currentAccent.bg} rounded-sm m-0.5`} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div
            className="flex-1 min-h-0 overflow-hidden"
            onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleSwipeMove(e.touches[0].clientX)}
            onTouchEnd={handleSwipeEnd}
          >
            {showBoot ? (
              /* ── BOOT SCREEN ── */
              <div className="h-full flex items-center justify-center bg-black">
                {bootStage === "logo" && (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="grid grid-cols-2 gap-1 w-16 h-16">
                      {[0,1,2,3].map(i => <div key={i} className="bg-white animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                    </div>
                    <div className="mt-8 text-white text-lg font-light">Windows Phone</div>
                  </div>
                )}
                {bootStage === "loading" && (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="grid grid-cols-2 gap-1 w-12 h-12 mb-8">
                      {[0,1,2,3].map(i => <div key={i} className="bg-white" />)}
                    </div>
                    <div className="flex space-x-1">
                      {[0,0.1,0.2,0.3,0.4].map((delay, i) => (
                        <div key={i} className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                      ))}
                    </div>
                    <div className="mt-6 text-white text-sm font-light opacity-70">Loading...</div>
                  </div>
                )}
                {bootStage === "complete" && (
                  <div className="flex flex-col items-center justify-center h-full animate-fade-out">
                    <div className="grid grid-cols-2 gap-1 w-12 h-12 mb-4">
                      {[0,1,2,3].map(i => <div key={i} className="bg-white" />)}
                    </div>
                    <div className="text-white text-sm opacity-50">Ready</div>
                  </div>
                )}
              </div>
            ) : showSearch ? (
              <SearchInterface
                onBack={() => setShowSearch(false)}
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                searchResults={searchResults}
                soundEnabled={soundEnabled}
                sounds={sounds}
                accentColor={currentAccent}
              />
            ) : currentApp === "photos" ? (
              <PhotosApp onBack={() => setCurrentApp(null)} soundEnabled={soundEnabled} sounds={sounds} accentColor={currentAccent} />
            ) : currentApp === "settings" ? (
              <SettingsApp
                onBack={() => setCurrentApp(null)}
                soundEnabled={soundEnabled}
                sounds={sounds}
                accentColor={currentAccent}
                onAccentColorChange={setAccentColor}
                accentColors={accentColors}
                wallpaper={wallpaper}
                onWallpaperChange={setWallpaper}
                wallpaperOptions={wallpaperOptions}
              />
            ) : currentApp === "music" ? (
              <MusicApp onBack={() => setCurrentApp(null)} soundEnabled={soundEnabled} sounds={sounds} accentColor={currentAccent} />
            ) : currentApp ? (
              /* ── GENERIC APP ── */
              <div className="h-full flex flex-col bg-black overflow-y-auto">
                <div className="px-4 py-6">
                  <h1 className="text-4xl font-light text-white capitalize">{currentApp}</h1>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                  <div className={`w-20 h-20 ${currentAccent.bg} flex items-center justify-center mb-6`}>
                    <Settings className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-lg text-gray-400 mb-2">App Preview</p>
                  <p className="text-sm text-gray-500 max-w-xs mb-8">
                    This is a placeholder for the {currentApp} app.
                  </p>
                  <button
                    onClick={() => { setCurrentApp(null); if (soundEnabled) sounds.navigation() }}
                    className="w-full max-w-xs py-3 bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            ) : currentView === "home" ? (
              /* ── HOME / TILES ── */
              <div className="h-full flex flex-col">
                {isEditMode && (
                  <div className="bg-black/95 border-b border-gray-800 px-3 py-2 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white animate-pulse" />
                      <span className="text-xs text-gray-300">Long press to rearrange</span>
                    </div>
                    <button
                      onClick={handleEditModeExit}
                      className={`px-4 py-1.5 ${currentAccent.bg} text-white text-sm font-medium rounded-full`}
                    >
                      Done
                    </button>
                  </div>
                )}

                <div
                  className="flex-1 min-h-0 overflow-y-auto px-1.5 pt-1.5"
                  style={{ scrollbarWidth: "none" }}
                  onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
                  onClick={(e) => { if (isEditMode && e.target === e.currentTarget) handleEditModeExit() }}
                >
                  {/*
                    KEY FIX: 4-column grid. Tile sizes map to columns:
                      small  → col-span-1 + aspect-square  → 1/4 width square
                      medium → col-span-2 + aspect-square  → 1/2 width square
                      wide   → col-span-4 + aspect-[2/1]   → full width 2:1
                  */}
                  <div className="grid grid-cols-4 gap-1 pb-24">
                    {tileOrder
                      .map((id) => tileLayout.find((t) => t.id === id))
                      .filter(Boolean)
                      .map((tile) => {
                        if (!tile) return null
                        const IconComponent = tile.icon
                        const contentIndex = tileContents[tile.id] ?? 0
                        const currentContent = tile.contents[Math.min(contentIndex, tile.contents.length - 1)]
                        const isFlipping = flippingTiles.has(tile.id)
                        const isSelected = selectedTileId === tile.id
                        const isWide = tile.size === "wide" || tile.size === "large" || tile.size === "extra-wide"
                        const isSmall = tile.size === "small" || tile.size === "tiny"
                        const colClass = getTileClasses(tile.size)
                        const aspectClass = getTileAspect(tile.size)

                        return (
                          <div
                            key={tile.id}
                            data-tile-id={tile.id}
                            className={[
                              colClass,
                              aspectClass,
                              tile.color,
                              "relative overflow-hidden cursor-pointer select-none",
                              "transition-all duration-200",
                              isFlipping ? `animate-${tile.flipType}` : "",
                              isEditMode
                                ? isSelected
                                  ? "scale-[0.95] border-2 border-white"
                                  : "opacity-60 animate-wiggle"
                                : "hover:brightness-110 active:scale-[0.97]",
                            ].filter(Boolean).join(" ")}
                            draggable={isEditMode}
                            onDragStart={() => setDraggedTileId(tile.id)}
                            onDragOver={(e) => { e.preventDefault(); handleTileDragOver(tile.id) }}
                            onDragEnd={() => setDraggedTileId(null)}
                            onMouseDown={() => handleTileMouseDown(tile.id)}
                            onMouseUp={handleTileMouseUp}
                            onMouseLeave={handleTileMouseUp}
                            onTouchStart={(e) => handleTouchStart(e, tile.id)}
                            onTouchEnd={handleTouchEnd}
                            onClick={() => {
                              if (isEditMode) {
                                setSelectedTileId(isSelected ? null : tile.id)
                                if (soundEnabled) sounds.buttonPress()
                                return
                              }
                              openApp(tile.title)
                            }}
                          >
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                            {/* ── SMALL TILE CONTENT ── */}
                            {isSmall && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                                <IconComponent className="w-6 h-6 drop-shadow-sm shrink-0" />
                              </div>
                            )}

                            {/* ── MEDIUM / WIDE TILE CONTENT ── */}
                            {!isSmall && (
                              <div className={`absolute inset-0 flex flex-col p-2 ${isEditMode && isSelected ? "pb-8" : ""}`}>
                                {/* Icon row */}
                                <div className="flex items-start justify-between shrink-0">
                                  <IconComponent className={`${isWide ? "w-7 h-7" : "w-6 h-6"} drop-shadow-sm shrink-0`} />
                                  {/* Date badge for Calendar */}
                                  {(currentContent as any).date && (
                                    <div className="text-right leading-none">
                                      <div className="text-[10px] opacity-80">{currentContent.primary}</div>
                                      <div className="text-2xl font-light">{(currentContent as any).date}</div>
                                    </div>
                                  )}
                                </div>

                                {/* Dynamic content */}
                                {!(currentContent as any).date && currentContent.primary && (
                                  <div className="flex-1 flex flex-col justify-center min-h-0 mt-1">
                                    <p className={`${isWide ? "text-xs" : "text-[10px]"} font-medium leading-tight line-clamp-2`}>
                                      {currentContent.primary}
                                    </p>
                                    {currentContent.secondary && (
                                      <p className="text-[10px] opacity-70 leading-tight line-clamp-1 mt-0.5">
                                        {currentContent.secondary}
                                      </p>
                                    )}
                                    {/* Progress bar */}
                                    {(currentContent as any).progress !== undefined && (currentContent as any).progress > 0 && (
                                      <div className="mt-1.5 w-full bg-black/20 h-0.5 rounded">
                                        <div
                                          className="bg-white/70 h-full rounded transition-all duration-1000"
                                          style={{ width: `${(currentContent as any).progress}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Title at bottom */}
                                <div className="mt-auto shrink-0">
                                  <p className="text-[10px] font-semibold truncate leading-none">
                                    {tile.title}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Live indicator dot */}
                            {tile.contents.length > 1 && !isEditMode && (
                              <div className="absolute bottom-1 left-1.5">
                                <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse" />
                              </div>
                            )}

                            {/* Delete button */}
                            {isEditMode && isSelected && (
                              <button
                                className="absolute -top-0 -right-0 z-20 w-5 h-5 bg-red-600 flex items-center justify-center text-white text-xs font-bold"
                                onClick={(e) => { e.stopPropagation(); handleDeleteTile(tile.id) }}
                              >
                                ×
                              </button>
                            )}

                            {/* Resize bar */}
                            {isEditMode && isSelected && (
                              <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/90 p-1 flex justify-center gap-1">
                                {tileSizeOptions.map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={(e) => { e.stopPropagation(); handleResizeTile(tile.id, opt.value) }}
                                    className={`px-2.5 py-1 text-[10px] font-bold transition-all ${
                                      tile.size === opt.value
                                        ? `${currentAccent.bg} text-white`
                                        : "bg-gray-700 text-gray-300"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            ) : (
              /* ── APPS LIST ── */
              <div className="h-full overflow-y-auto pb-20" style={{ scrollbarWidth: "none" }}>
                <div className="flex items-center px-4 py-4 sticky top-0 bg-black z-10">
                  <button
                    onClick={() => { setShowSearch(true); if (soundEnabled) sounds.buttonPress() }}
                    className="w-12 h-12 border-2 border-white flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Search className="w-6 h-6" />
                  </button>
                </div>
                <div className="px-4">
                  {Object.keys(groupedApps).sort().map((letter) => (
                    <div key={letter}>
                      <div className="flex items-center py-2">
                        <div className={`w-12 h-12 ${currentAccent.border} border-2 flex items-center justify-center`}>
                          <span className={`text-xl font-semibold ${currentAccent.text}`}>{letter.toLowerCase()}</span>
                        </div>
                      </div>
                      {groupedApps[letter].map((app, i) => {
                        const IconComponent = app.icon
                        return (
                          <div
                            key={i}
                            className="flex items-center py-2 hover:bg-white/5 cursor-pointer transition-colors"
                            onClick={() => openApp(app.name)}
                          >
                            <div className={`w-12 h-12 ${app.color} flex items-center justify-center mr-4`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-light">{app.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Bar */}
          <div className="shrink-0 bg-black/90 backdrop-blur-sm border-t border-gray-800">
            <div className="flex justify-center py-3">
              <div className="flex gap-8">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                  onClick={() => {
                    if (soundEnabled) sounds.navigation()
                    if (currentApp) setCurrentApp(null)
                    else if (currentView === "apps") handleViewTransition("home", null)
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                  onClick={() => {
                    if (soundEnabled) sounds.navigation()
                    setCurrentApp(null)
                    handleViewTransition("home", null)
                  }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                    <rect x="2" y="2" width="8" height="8" />
                    <rect x="14" y="2" width="8" height="8" />
                    <rect x="2" y="14" width="8" height="8" />
                    <rect x="14" y="14" width="8" height="8" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                  onClick={() => { setShowSearch(true); if (soundEnabled) sounds.buttonPress() }}
                >
                  <Search className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes vertical { 0%{transform:rotateX(0deg)} 50%{transform:rotateX(90deg) scale(0.8)} 100%{transform:rotateX(0deg)} }
        @keyframes horizontal { 0%{transform:rotateY(0deg)} 50%{transform:rotateY(90deg) scale(0.8)} 100%{transform:rotateY(0deg)} }
        @keyframes cube { 0%{transform:rotateX(0deg) rotateY(0deg)} 50%{transform:rotateX(90deg) rotateY(90deg) scale(0.8)} 100%{transform:rotateX(0deg) rotateY(0deg)} }
        @keyframes slide { 0%{transform:translateX(0%)} 50%{transform:translateX(-100%) scale(0.9)} 100%{transform:translateX(0%)} }
        @keyframes zoom { 0%{transform:scale(1)} 50%{transform:scale(0.75)} 100%{transform:scale(1)} }
        @keyframes flip3d { 0%{transform:perspective(400px) rotateY(0deg)} 50%{transform:perspective(400px) rotateY(180deg) scale(0.8)} 100%{transform:perspective(400px) rotateY(360deg)} }
        @keyframes rotate { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(0.8)} 100%{transform:rotate(360deg) scale(1)} }
        @keyframes fade { 0%{opacity:1} 50%{opacity:0.4} 100%{opacity:1} }
        @keyframes wiggle { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
        @keyframes fade-in { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes fade-out { from{opacity:1} to{opacity:0} }

        .animate-vertical { animation: vertical 0.6s ease-in-out; }
        .animate-horizontal { animation: horizontal 0.6s ease-in-out; }
        .animate-cube { animation: cube 0.8s ease-in-out; }
        .animate-slide { animation: slide 0.5s ease-in-out; }
        .animate-zoom { animation: zoom 0.4s ease-in-out; }
        .animate-flip3d { animation: flip3d 0.7s ease-in-out; }
        .animate-rotate { animation: rotate 0.6s ease-in-out; }
        .animate-fade { animation: fade 0.4s ease-in-out; }
        .animate-wiggle { animation: wiggle 0.3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-out { animation: fade-out 0.5s ease-in forwards; }

        @keyframes slide-in-left { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
        @keyframes slide-out-right { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(100%)} }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out; }
        .animate-slide-out-right { animation: slide-out-right 0.25s ease-in forwards; }
      `}</style>
    </div>
  )
}
