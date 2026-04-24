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
      this.audioContext = new (window.AudioContext || (window as any).webkitContext)()
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

  tileTap() {
    // Subtle click sound for tile interactions
    this.createTone(800, 0.1, "square", 0.05)
  }

  tileFlip() {
    // Enhanced whoosh sound for tile flips
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
    // Swipe/navigation sound
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
    // Subtle button press sound
    this.createTone(1000, 0.08, "square", 0.03)
    setTimeout(() => this.createTone(800, 0.05, "square", 0.02), 50)
  }

  startup() {
    // Windows Phone startup chime
    if (!this.audioContext) return

    const frequencies = [523, 659, 784, 1047] // C, E, G, C
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.3, "sine", 0.06)
      }, index * 100)
    })
  }
}

export default function WindowsPhoneEmulator() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [tileLayout, setTileLayout] = useState<typeof tilesData>([])
  const [currentView, setCurrentView] = useState<"home" | "apps">("home")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [tileContents, setTileContents] = useState<{ [key: number]: number }>({})
  const [flippingTiles, setFlippingTiles] = useState<Set<number>>(new Set())
  const [bootStage, setBootStage] = useState<"logo" | "loading" | "complete">("logo")
  const [showBoot, setShowBoot] = useState(true)
  const [currentApp, setCurrentApp] = useState<string | null>(null)
  const [accentColor, setAccentColor] = useState<string>("lime")
  const [transitionState, setTransitionState] = useState<"idle" | "exiting" | "entering">("idle")
  const [nextView, setNextView] = useState<{ view: "home" | "apps"; app: string | null } | null>(null)
  const [wallpaper, setWallpaper] = useState<{
    type: "color" | "image"
    value: string
  }>({ type: "color", value: "bg-black" })
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null)
  const [tileOrder, setTileOrder] = useState<number[]>([])
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [draggedTileId, setDraggedTileId] = useState<number | null>(null)
  const [dragOverTileId, setDragOverTileId] = useState<number | null>(null)

  const accentColors = {
    lime: { name: "lime", bg: "bg-lime-500", text: "text-lime-500", border: "border-lime-500", hex: "#84cc16" },
    green: { name: "green", bg: "bg-green-500", text: "text-green-500", border: "border-green-500", hex: "#22c55e" },
    emerald: {
      name: "emerald",
      bg: "bg-emerald-500",
      text: "text-emerald-500",
      border: "border-emerald-500",
      hex: "#10b981",
    },
    teal: { name: "teal", bg: "bg-teal-500", text: "text-teal-500", border: "border-teal-500", hex: "#14b8a6" },
    cyan: { name: "cyan", bg: "bg-cyan-500", text: "text-cyan-500", border: "border-cyan-500", hex: "#06b6d4" },
    blue: { name: "blue", bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500", hex: "#3b82f6" },
    indigo: {
      name: "indigo",
      bg: "bg-indigo-500",
      text: "text-indigo-500",
      border: "border-indigo-500",
      hex: "#6366f1",
    },
    violet: {
      name: "violet",
      bg: "bg-violet-500",
      text: "text-violet-500",
      border: "border-violet-500",
      hex: "#8b5cf6",
    },
    purple: {
      name: "purple",
      bg: "bg-purple-500",
      text: "text-purple-500",
      border: "border-purple-500",
      hex: "#a855f7",
    },
    fuchsia: {
      name: "fuchsia",
      bg: "bg-fuchsia-500",
      text: "text-fuchsia-500",
      border: "border-fuchsia-500",
      hex: "#d946ef",
    },
    pink: { name: "pink", bg: "bg-pink-500", text: "text-pink-500", border: "border-pink-500", hex: "#ec4899" },
    rose: { name: "rose", bg: "bg-rose-500", text: "text-rose-500", border: "border-rose-500", hex: "#f43f5e" },
    red: { name: "red", bg: "bg-red-500", text: "text-red-500", border: "border-red-500", hex: "#ef4444" },
    orange: {
      name: "orange",
      bg: "bg-orange-500",
      text: "text-orange-500",
      border: "border-orange-500",
      hex: "#f97316",
    },
    amber: { name: "amber", bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500", hex: "#f59e0b" },
    yellow: {
      name: "yellow",
      bg: "bg-yellow-500",
      text: "text-yellow-500",
      border: "border-yellow-500",
      hex: "#eab308",
    },
    magenta: { name: "magenta", bg: "bg-pink-600", text: "text-pink-600", border: "border-pink-600", hex: "#db2777" },
    cobalt: { name: "cobalt", bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-600", hex: "#2563eb" },
    crimson: { name: "crimson", bg: "bg-red-600", text: "text-red-600", border: "border-red-600", hex: "#dc2626" },
    steel: { name: "steel", bg: "bg-slate-500", text: "text-slate-500", border: "border-slate-500", hex: "#64748b" },
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
      {
        name: "Abstract Blue",
        value: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=800&fit=crop",
      },
      { name: "Geometric", value: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop" },
      { name: "Gradient", value: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=800&fit=crop" },
      { name: "Nature", value: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=800&fit=crop" },
      {
        name: "City Lights",
        value: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=800&fit=crop",
      },
      { name: "Ocean", value: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=800&fit=crop" },
    ],
  }

  const currentAccent = accentColors[accentColor as keyof typeof accentColors]

  const [sounds] = useState(() => new WindowsPhoneSounds())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  // Swipe gesture state
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null)
  const [swipeCurrentX, setSwipeCurrentX] = useState<number | null>(null)
  const swipeThreshold = 80 // minimum distance to trigger swipe

  const handleSwipeStart = (clientX: number) => {
    if (currentApp) return // Don't allow swipe when in an app
    setSwipeStartX(clientX)
    setSwipeCurrentX(clientX)
  }

  const handleSwipeMove = (clientX: number) => {
    if (swipeStartX === null || currentApp) return
    setSwipeCurrentX(clientX)
  }

  const handleSwipeEnd = () => {
    if (swipeStartX === null || swipeCurrentX === null || currentApp) {
      setSwipeStartX(null)
      setSwipeCurrentX(null)
      return
    }

    const swipeDistance = swipeStartX - swipeCurrentX

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && currentView === "home") {
        // Swiped left - go to apps
        handleViewTransition("apps", null)
        if (soundEnabled) sounds.navigation()
      } else if (swipeDistance < 0 && currentView === "apps") {
        // Swiped right - go to home
        handleViewTransition("home", null)
        if (soundEnabled) sounds.navigation()
      }
    }

    setSwipeStartX(null)
    setSwipeCurrentX(null)
  }

  useEffect(() => {
    setTileLayout(tilesData)
    setTileOrder(tilesData.map((tile) => tile.id))
  }, [])

  // Keep tileOrder in sync when tiles are added/removed
  useEffect(() => {
    const layoutIds = tileLayout.map((t) => t.id)
    const validOrder = tileOrder.filter((id) => layoutIds.includes(id))
    const newIds = layoutIds.filter((id) => !tileOrder.includes(id))
    if (validOrder.length !== tileOrder.length || newIds.length > 0) {
      setTileOrder([...validOrder, ...newIds])
    }
  }, [tileLayout])

  const randomizeTileLayout = () => {
    // Create layout patterns that ensure visual coherence
    const layoutPatterns = [
      // Pattern 1: Balanced mix
      [
        "medium",
        "medium",
        "wide",
        "small",
        "small",
        "small",
        "small",
        "medium",
        "small",
        "small",
        "wide",
        "medium",
        "medium",
        "small",
        "small",
        "small",
        "small",
        "wide",
        "medium",
        "medium",
      ],
      // Pattern 2: Wide-focused
      [
        "wide",
        "medium",
        "medium",
        "wide",
        "small",
        "small",
        "small",
        "small",
        "wide",
        "medium",
        "small",
        "small",
        "medium",
        "medium",
        "wide",
        "small",
        "small",
        "small",
        "small",
        "medium",
      ],
      // Pattern 3: Medium-heavy
      [
        "medium",
        "small",
        "small",
        "medium",
        "medium",
        "wide",
        "small",
        "small",
        "small",
        "small",
        "medium",
        "medium",
        "wide",
        "medium",
        "small",
        "small",
        "medium",
        "small",
        "small",
        "wide",
      ],
    ]

    const selectedPattern = layoutPatterns[Math.floor(Math.random() * layoutPatterns.length)]
    const shuffledTiles = [...tilesData].sort(() => Math.random() - 0.5)

    const newLayout = shuffledTiles.map((tile, index) => ({
      ...tile,
      size: selectedPattern[index] || tile.size,
    }))

    setTileLayout(newLayout)
    if (soundEnabled) {
      sounds.tileFlip()
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    // Search through apps, settings, and content
    const allSearchableItems = [
      ...apps.map((app) => ({ ...app, type: "app" })),
      ...tilesData.map((tile) => ({ ...tile, type: "tile" })),
      { name: "WiFi Settings", type: "setting", icon: "Wifi" },
      { name: "Bluetooth Settings", type: "setting", icon: "Bluetooth" },
      { name: "Display Settings", type: "setting", icon: "Monitor" },
      { name: "Sound Settings", type: "setting", icon: "Volume2" },
      { name: "Battery Settings", type: "setting", icon: "Battery" },
      { name: "Storage Settings", type: "setting", icon: "HardDrive" },
      { name: "Privacy Settings", type: "setting", icon: "Shield" },
      { name: "Update Settings", type: "setting", icon: "Download" },
    ]

    const results = allSearchableItems
      .filter(
        (item) =>
          item.name?.toLowerCase().includes(query.toLowerCase()) ||
          item.title?.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 8)

    setSearchResults(results)
  }

  useEffect(() => {
    // Boot sequence
    if (showBoot) {
      // Logo stage
      setTimeout(() => {
        if (soundEnabled) {
          // Windows Phone boot sound - deeper, more resonant
          if (sounds.audioContext) {
            const oscillator = sounds.audioContext.createOscillator()
            const gainNode = sounds.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(sounds.audioContext.destination)

            oscillator.frequency.setValueAtTime(220, sounds.audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(330, sounds.audioContext.currentTime + 0.8)
            oscillator.type = "sine"

            gainNode.gain.setValueAtTime(0, sounds.audioContext.currentTime)
            gainNode.gain.linearRampToValueAtTime(0.1, sounds.audioContext.currentTime + 0.1)
            gainNode.gain.exponentialRampToValueAtTime(0.001, sounds.audioContext.currentTime + 1.2)

            oscillator.start(sounds.audioContext.currentTime)
            oscillator.stop(sounds.audioContext.currentTime + 1.2)
          }
        }
        setBootStage("loading")
      }, 2000)

      // Loading stage
      setTimeout(() => {
        setBootStage("complete")
      }, 4000)

      // Complete boot
      setTimeout(() => {
        setShowBoot(false)
        if (soundEnabled) {
          sounds.startup()
        }
      }, 5000)
    }
  }, [showBoot, soundEnabled])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Enhanced live tile content updates
  useEffect(() => {
    const updateTileContent = () => {
      const activeTiles = tilesData.filter((tile) => tile.contents.length > 1)
      const tileToUpdate = activeTiles[Math.floor(Math.random() * activeTiles.length)]

      if (tileToUpdate) {
        setFlippingTiles((prev) => new Set([...prev, tileToUpdate.id]))

        // Play flip sound
        if (soundEnabled) {
          sounds.tileFlip()
        }

        setTimeout(() => {
          setTileContents((prev) => ({
            ...prev,
            [tileToUpdate.id]: (prev[tileToUpdate.id] + 1 || 1) % tileToUpdate.contents.length,
          }))

          setTimeout(() => {
            setFlippingTiles((prev) => {
              const newSet = new Set(prev)
              newSet.delete(tileToUpdate.id)
              return newSet
            })
          }, 400) // Increased duration for better animations
        }, 200)
      }
    }

    const interval = setInterval(updateTileContent, 3000) // More frequent updates
    return () => clearInterval(interval)
  }, [soundEnabled])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  // Authentic Windows Phone 8/10 tile layout - organized in real device grid
  const tilesData = [
    // Row 1: 1 medium (Messaging) + 4 small tiles
    {
      id: 1,
      size: "medium",
      color: "bg-blue-600",
      icon: MessageSquare,
      title: "Messaging",
      flipType: "horizontal",
      contents: [
        { primary: "2 new messages", secondary: "Hey! How are you?" },
        { primary: "Sarah Johnson", secondary: "See you tomorrow!" },
        { primary: "Group Chat", secondary: "3 unread messages" },
        { primary: "Mom", secondary: "Call me when you can" },
      ],
    },
    {
      id: 2,
      size: "small",
      color: "bg-blue-600",
      icon: Phone,
      title: "Phone",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "3 missed", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    {
      id: 3,
      size: "small",
      color: "bg-blue-600",
      icon: Globe,
      title: "IE",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    {
      id: 4,
      size: "small",
      color: "bg-blue-600",
      icon: Mail,
      title: "Mail",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "5 new", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    {
      id: 5,
      size: "small",
      color: "bg-blue-600",
      icon: Search,
      title: "Cortana",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    
    // Row 2: 1 medium (Store) + 4 small tiles  
    {
      id: 6,
      size: "medium",
      color: "bg-blue-600",
      icon: ShoppingCart,
      title: "Store",
      flipType: "vertical",
      contents: [
        { primary: "", secondary: "" },
        { primary: "3 updates", secondary: "" },
        { primary: "New apps", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    {
      id: 7,
      size: "small",
      color: "bg-blue-600",
      icon: Music,
      title: "Music",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    {
      id: 8,
      size: "small",
      color: "bg-green-600",
      icon: Gamepad2,
      title: "Games",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    {
      id: 9,
      size: "small",
      color: "bg-orange-600",
      icon: FileText,
      title: "Office",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    {
      id: 10,
      size: "small",
      color: "bg-purple-700",
      icon: FileText,
      title: "OneNote",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    
    // Row 3: 2 medium tiles (Calendar & People)
    {
      id: 11,
      size: "medium",
      color: "bg-blue-600",
      icon: Calendar,
      title: "Calendar",
      flipType: "flip3d",
      contents: [
        { primary: "Sat", secondary: "", date: new Date().getDate() },
        { primary: "Meeting", secondary: "2 PM", date: new Date().getDate() },
        { primary: "3 events", secondary: "", date: new Date().getDate() },
        { primary: "Tomorrow", secondary: "Dentist", date: new Date().getDate() + 1 },
      ],
    },
    {
      id: 12,
      size: "medium",
      color: "bg-blue-600",
      icon: Users,
      title: "People",
      flipType: "horizontal",
      contents: [
        { primary: "", secondary: "" },
        { primary: "Sarah updated", secondary: "her status" },
        { primary: "3 birthdays", secondary: "this week" },
        { primary: "", secondary: "" },
      ],
    },
    
    // Row 4: Additional tiles
    {
      id: 13,
      size: "medium",
      color: "bg-purple-600",
      icon: Camera,
      title: "Photos",
      flipType: "cube",
      contents: [
        { primary: "", secondary: "" },
        { primary: "12 photos", secondary: "" },
        { primary: "Ready", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    {
      id: 14,
      size: "small",
      color: "bg-gray-600",
      icon: Settings,
      title: "Settings",
      flipType: "rotate",
      contents: [
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },
    {
      id: 15,
      size: "small",
      color: "bg-teal-600",
      icon: MapPin,
      title: "Maps",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
        { primary: "", secondary: "" },
      ],
    },

    // Row 3: 1 wide tile (Music)
    {
      id: 7,
      size: "wide",
      color: "bg-orange-600",
      icon: Music,
      title: "Music",
      flipType: "slide",
      contents: [
        { primary: "Now Playing", secondary: "Imagine Dragons - Radioactive", progress: 65 },
        { primary: "Recently Played", secondary: "Coldplay - Viva La Vida", progress: 0 },
        { primary: "Playlist", secondary: "My Favorites - 47 songs", progress: 0 },
        { primary: "Top Charts", secondary: "#1 Trending Now", progress: 0 },
      ],
    },

    // Row 4: 4 square tiles
    {
      id: 8,
      size: "square",
      color: "bg-teal-600",
      icon: MapPin,
      title: "Maps",
      flipType: "zoom",
      contents: [
        { primary: "Seattle, WA", secondary: "72°F Partly Cloudy", weather: true },
        { primary: "Traffic", secondary: "Light traffic on I-5", weather: false },
        { primary: "Nearby", secondary: "Starbucks, McDonald's", weather: false },
        { primary: "Home", secondary: "15 min drive", weather: false },
      ],
    },
    {
      id: 9,
      size: "square",
      color: "bg-cyan-600",
      icon: Globe,
      title: "Internet Explorer",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "5 tabs open", secondary: "" },
        { primary: "Bookmarks", secondary: "12" },
        { primary: "History", secondary: "" },
      ],
    },
    {
      id: 10,
      size: "square",
      color: "bg-pink-600",
      icon: Calculator,
      title: "Calculator",
      flipType: "cube",
      contents: [
        { primary: "", secondary: "" },
        { primary: "Last: 1,234", secondary: "" },
        { primary: "History", secondary: "5 items" },
        { primary: "Scientific", secondary: "" },
      ],
    },

    // Row 5: 4 square tiles
    {
      id: 11,
      size: "square",
      color: "bg-blue-500",
      icon: Clock,
      title: "Weather",
      flipType: "slide",
      contents: [
        { primary: "72°F", secondary: "Partly Cloudy" },
        { primary: "Tomorrow", secondary: "68°F" },
        { primary: "This Week", secondary: "Mostly Sunny" },
        { primary: "Weekend", secondary: "78°F" },
      ],
    },
    {
      id: 12,
      size: "square",
      color: "bg-yellow-600",
      icon: User,
      title: "People",
      flipType: "horizontal",
      contents: [
        { primary: "Sarah updated", secondary: "her status" },
        { primary: "3 birthdays", secondary: "this week" },
        { primary: "Mike Johnson", secondary: "added photos" },
        { primary: "Contact sync", secondary: "completed" },
      ],
    },
    {
      id: 13,
      size: "square",
      color: "bg-violet-600",
      icon: MessageSquare,
      title: "News",
      flipType: "slide",
      contents: [
        { primary: "Breaking News", secondary: "Tech stocks surge" },
        { primary: "Weather Alert", secondary: "Rain expected" },
        { primary: "Sports Update", secondary: "Seahawks win" },
        { primary: "Local News", secondary: "New park opens" },
      ],
    },
    {
      id: 14,
      size: "square",
      color: "bg-emerald-600",
      icon: Clock,
      title: "Alarms",
      flipType: "vertical",
      contents: [
        { primary: "7:00 AM", secondary: "Weekdays" },
        { primary: "Next alarm", secondary: "in 8h 23m" },
        { primary: "3 alarms", secondary: "active" },
        { primary: "Timer", secondary: "5:00" },
      ],
    },

    // Row 6: 4 square tiles
    {
      id: 15,
      size: "square",
      color: "bg-rose-600",
      icon: Heart,
      title: "Health",
      flipType: "zoom",
      contents: [
        { primary: "8,432", secondary: "steps today" },
        { primary: "Goal: 10k", secondary: "84% done" },
        { primary: "Sleep", secondary: "7h 23m" },
        { primary: "Heart Rate", secondary: "72 bpm" },
      ],
    },
    {
      id: 16,
      size: "square",
      color: "bg-amber-600",
      icon: MapPin,
      title: "Store",
      flipType: "rotate",
      contents: [
        { primary: "", secondary: "" },
        { primary: "3 updates", secondary: "available" },
        { primary: "Featured", secondary: "new apps" },
        { primary: "Games", secondary: "on sale" },
      ],
    },
    {
      id: 17,
      size: "square",
      color: "bg-sky-600",
      icon: Globe,
      title: "Skype",
      flipType: "fade",
      contents: [
        { primary: "", secondary: "" },
        { primary: "2 contacts", secondary: "online" },
        { primary: "Video call", secondary: "ready" },
        { primary: "Messages", secondary: "3 unread" },
      ],
    },

    // Row 8: 1 wide tile
    {
      id: 18,
      size: "wide",
      color: "bg-slate-600",
      icon: Music,
      title: "Xbox Music",
      flipType: "horizontal",
      contents: [
        { primary: "Mix Radio", secondary: "Discover new music", progress: 0 },
        { primary: "Top Charts", secondary: "This week's hits", progress: 0 },
        { primary: "Your Music", secondary: "247 songs synced", progress: 0 },
        { primary: "Playlists", secondary: "8 custom playlists", progress: 0 },
      ],
    },

    // Row 9: 2 medium tiles
    {
      id: 19,
      size: "medium",
      color: "bg-lime-600",
      icon: MessageSquare,
      title: "WhatsApp",
      flipType: "flip3d",
      contents: [
        { primary: "5 new messages", secondary: "Family Group" },
        { primary: "Sarah is typing", secondary: "..." },
        { primary: "Work Chat", secondary: "Meeting at 3 PM" },
        { primary: "Mom", secondary: "Call me later" },
      ],
    },
    {
      id: 20,
      size: "medium",
      color: "bg-fuchsia-600",
      icon: Camera,
      title: "Instagram",
      flipType: "zoom",
      contents: [
        { primary: "", secondary: "" },
        { primary: "12 new likes", secondary: "" },
        { primary: "3 comments", secondary: "" },
        { primary: "Story views", secondary: "47" },
      ],
    },
  ]

const apps = [
  // A
  { name: "Alarms", icon: Clock, color: "bg-emerald-600" },
  // B
  { name: "Battery Saver", icon: Settings, color: "bg-green-700" },
  // C
  { name: "Calculator", icon: Calculator, color: "bg-gray-700" },
  { name: "Calendar", icon: Calendar, color: "bg-indigo-600" },
  { name: "Camera", icon: Camera, color: "bg-purple-600" },
  { name: "Clock", icon: Clock, color: "bg-blue-600" },
  { name: "Cortana", icon: Search, color: "bg-cyan-500" },
  // D
  { name: "Data Sense", icon: Settings, color: "bg-teal-600" },
  // F
  { name: "Files", icon: FileText, color: "bg-yellow-600" },
  // G
  { name: "Games", icon: Gamepad2, color: "bg-green-600" },
  // H
  { name: "Health", icon: Heart, color: "bg-rose-600" },
  // I
  { name: "Internet Explorer", icon: Globe, color: "bg-blue-500" },
  // M
  { name: "Mail", icon: Mail, color: "bg-red-600" },
  { name: "Maps", icon: MapPin, color: "bg-teal-600" },
  { name: "Messaging", icon: MessageSquare, color: "bg-green-600" },
  { name: "Music", icon: Music, color: "bg-orange-600" },
  // N
  { name: "News", icon: Globe, color: "bg-violet-600" },
  // O
  { name: "Office", icon: FileText, color: "bg-orange-500" },
  { name: "OneDrive", icon: Cloud, color: "bg-blue-600" },
  // P
  { name: "People", icon: Users, color: "bg-pink-600" },
  { name: "Phone", icon: Phone, color: "bg-blue-600" },
  { name: "Photos", icon: Camera, color: "bg-purple-500" },
  { name: "Podcasts", icon: Music, color: "bg-purple-600" },
  // S
  { name: "Settings", icon: Settings, color: "bg-gray-600" },
  { name: "Skype", icon: MessageSquare, color: "bg-sky-500" },
  { name: "Store", icon: ShoppingCart, color: "bg-green-500" },
  // W
  { name: "Wallet", icon: Settings, color: "bg-amber-600" },
  { name: "Weather", icon: Cloud, color: "bg-sky-600" },
  { name: "WhatsApp", icon: MessageSquare, color: "bg-lime-600" },
  // X
  { name: "Xbox", icon: Gamepad2, color: "bg-green-600" },
  ].sort((a, b) => a.name.localeCompare(b.name))

  // Group apps by first letter for alphabetical sections
  const groupedApps = apps.reduce((acc, app) => {
    const letter = app.name[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(app)
    return acc
  }, {} as Record<string, typeof apps>)

  const getTileClasses = (size: string) => {
    switch (size) {
      case "tiny":
        // Tiny tile: 1/4 of small (1 column in 8-col grid)
        return "col-span-1 aspect-square"
      case "small":
        // Small tile: 1/4 of medium (2 columns in 8-col grid)
        return "col-span-2 aspect-square"
      case "medium":
      case "square":
        // Medium tile: 1 full square (4 columns in 8-col grid)
        return "col-span-4 aspect-square"
      case "wide":
      case "large":
      case "extra-wide":
        // Wide tile: 2 squares wide (8 columns = full width)
        return "col-span-8 aspect-[2/1]"
      default:
        return "col-span-4 aspect-square"
    }
  }

  const handleViewTransition = (newView: "home" | "apps", newApp: string | null = null) => {
    if (transitionState !== "idle") return // Prevent multiple transitions

    setTransitionState("exiting")
    setNextView({ view: newView, app: newApp })

    setTimeout(() => {
      setCurrentView(newView)
      setCurrentApp(newApp)
      setTransitionState("entering")

      setTimeout(() => {
        setTransitionState("idle")
        setNextView(null)
      }, 300)
    }, 300)
  }

  // Tile editing handlers
  const handleTileMouseDown = (tileId: number) => {
    const timer = setTimeout(() => {
      setIsEditMode(true)
      setSelectedTileId(tileId)
      setDraggedTileId(tileId)
      if (soundEnabled) {
        sounds.buttonPress()
      }
    }, 500) // 500ms long press
    setPressTimer(timer)
  }

  const handleTileMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer)
      setPressTimer(null)
    }
  }

  const handleTileMouseLeave = () => {
    if (pressTimer && !isEditMode) {
      clearTimeout(pressTimer)
      setPressTimer(null)
    }
  }

  const handleDeleteTile = (tileId: number) => {
    setTileLayout(tileLayout.filter((tile) => tile.id !== tileId))
    setTileOrder(tileOrder.filter((id) => id !== tileId))
    setSelectedTileId(null)
    if (tileOrder.length <= 1) {
      setIsEditMode(false)
    }
    if (soundEnabled) {
      sounds.buttonPress()
    }
  }

  const handleTileDragStart = (tileId: number) => {
    setDraggedTileId(tileId)
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
    setDragOverTileId(null)
  }

  const handleResizeTile = (tileId: number, newSize: string) => {
    setTileLayout(tileLayout.map((tile) => 
      tile.id === tileId ? { ...tile, size: newSize } : tile
    ))
    if (soundEnabled) {
      sounds.tileFlip()
    }
  }

  const tileSizeOptions = [
    { label: "XS", value: "tiny" },
    { label: "S", value: "small" },
    { label: "M", value: "medium" },
    { label: "W", value: "wide" },
  ]

  // Touch drag handlers for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchDraggedTile, setTouchDraggedTile] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent, tileId: number) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    
    const timer = setTimeout(() => {
      setIsEditMode(true)
      setSelectedTileId(tileId)
      setTouchDraggedTile(tileId)
      if (soundEnabled) {
        sounds.buttonPress()
      }
    }, 500)
    setPressTimer(timer)
  }

  const handleTouchMove = (e: React.TouchEvent, tileId: number) => {
    if (!isEditMode || touchDraggedTile !== tileId) return
    
    const touch = e.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    const tileElement = element?.closest('[data-tile-id]')
    
    if (tileElement) {
      const targetId = parseInt(tileElement.getAttribute('data-tile-id') || '0')
      if (targetId && targetId !== tileId) {
        handleTileDragOver(targetId)
      }
    }
  }

  const handleTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer)
      setPressTimer(null)
    }
    setTouchStart(null)
    setTouchDraggedTile(null)
    setDraggedTileId(null)
  }

  return (
    <div className="w-full h-screen bg-black">
      <div className="bg-black text-white overflow-hidden h-full relative max-w-lg mx-auto md:max-w-xl lg:max-w-2xl">
        {/* Enhanced Wallpaper Background with Subtle Parallax */}
        {wallpaper.type === "color" ? (
          <div className={`absolute inset-0 ${wallpaper.value}`}></div>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-100 ease-out"
            style={{
              backgroundImage: `url(${wallpaper.value})`,
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
              transform: `scale(1.05) translateY(${scrollY * 0.2}px)`,
            }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}

        {/* Content overlay */}
        <div className="relative z-10 h-full">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm bg-black/80 backdrop-blur-sm safe-area-pt">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <span className="ml-2">Verizon</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowBoot(true)
                  setBootStage("logo")
                  if (soundEnabled) {
                    sounds.buttonPress()
                  }
                }}
                className="text-xs hover:text-blue-400 transition-colors p-1"
                title="Restart"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled)
                  if (!soundEnabled) {
                    sounds.buttonPress()
                  }
                }}
                className="text-xs hover:text-blue-400 transition-colors p-1"
                title={soundEnabled ? "Sound On" : "Sound Off"}
              >
                {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              </button>
              <button
                onClick={randomizeTileLayout}
                className="text-xs hover:text-blue-400 transition-colors p-1"
                title="Randomize Layout"
              >
                <Shuffle className="w-3 h-3" />
              </button>
              <span>{formatTime(currentTime)}</span>
              <div className="w-6 h-3 border border-white rounded-sm">
                <div className={`w-4 h-1.5 ${currentAccent.bg} rounded-sm m-0.5`}></div>
              </div>
            </div>
          </div>

          {/* Content Area with Swipe Gestures */}
          <div
            className={`flex-1 h-full transition-all duration-300 ease-in-out ${
              transitionState === "exiting"
                ? "opacity-0 scale-95 translate-x-4"
                : transitionState === "entering"
                  ? "opacity-100 scale-100 translate-x-0"
                  : "opacity-100 scale-100 translate-x-0"
            }`}
            onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleSwipeMove(e.touches[0].clientX)}
            onTouchEnd={handleSwipeEnd}
            onMouseDown={(e) => handleSwipeStart(e.clientX)}
            onMouseMove={(e) => e.buttons === 1 && handleSwipeMove(e.clientX)}
            onMouseUp={handleSwipeEnd}
            onMouseLeave={handleSwipeEnd}
          >
            {showBoot ? (
              <div className="h-full flex items-center justify-center bg-black relative overflow-hidden">
                {bootStage === "logo" && (
                  <div className="flex flex-col items-center animate-fade-in">
                    {/* Windows Phone Logo */}
                    <div className="relative">
                      <div className="grid grid-cols-2 gap-1 w-16 h-16 animate-logo-appear">
                        <div className="bg-white animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                        <div className="bg-white animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                        <div className="bg-white animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                        <div className="bg-white animate-pulse" style={{ animationDelay: "0.8s" }}></div>
                      </div>
                    </div>
                    <div className="mt-8 text-white text-lg font-light animate-text-appear">Windows Phone</div>
                  </div>
                )}

                {bootStage === "loading" && (
                  <div className="flex flex-col items-center animate-fade-in">
                    {/* Windows Phone Logo - smaller */}
                    <div className="grid grid-cols-2 gap-1 w-12 h-12 mb-8">
                      <div className="bg-white"></div>
                      <div className="bg-white"></div>
                      <div className="bg-white"></div>
                      <div className="bg-white"></div>
                    </div>

                    {/* Loading Animation */}
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>

                    <div className="mt-6 text-white text-sm font-light opacity-70">Loading...</div>
                  </div>
                )}

                {bootStage === "complete" && (
                  <div className="h-full w-full animate-fade-out">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="grid grid-cols-2 gap-1 w-12 h-12 mb-4">
                        <div className="bg-white"></div>
                        <div className="bg-white"></div>
                        <div className="bg-white"></div>
                        <div className="bg-white"></div>
                      </div>
                      <div className="text-white text-sm opacity-50">Ready</div>
                    </div>
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
              <PhotosApp
                onBack={() => {
                  setCurrentApp(null)
                  if (soundEnabled) {
                    sounds.navigation()
                  }
                }}
                soundEnabled={soundEnabled}
                sounds={sounds}
                accentColor={currentAccent}
              />
            ) : currentApp === "settings" ? (
              <SettingsApp
                onBack={() => {
                  setCurrentApp(null)
                  if (soundEnabled) {
                    sounds.navigation()
                  }
                }}
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
              <MusicApp
                onBack={() => {
                  setCurrentApp(null)
                  if (soundEnabled) {
                    sounds.navigation()
                  }
                }}
                soundEnabled={soundEnabled}
                sounds={sounds}
                accentColor={currentAccent}
              />
            ) : currentApp ? (
              // Generic App View for apps without dedicated components
              <div className="h-full flex flex-col bg-black">
                {/* App Header */}
                <div className="flex items-center px-4 py-6">
                  <h1 className="text-4xl sm:text-5xl font-light text-white capitalize">{currentApp}</h1>
                </div>
                
                {/* App Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                  {/* App Icon */}
                  <div className={`w-20 h-20 ${currentAccent.bg} flex items-center justify-center mb-6`}>
                    {currentApp === "phone" && <Phone className="w-10 h-10 text-white" />}
                    {currentApp === "messaging" && <MessageSquare className="w-10 h-10 text-white" />}
                    {currentApp === "mail" && <Mail className="w-10 h-10 text-white" />}
                    {currentApp === "calendar" && <Calendar className="w-10 h-10 text-white" />}
                    {currentApp === "maps" && <MapPin className="w-10 h-10 text-white" />}
                    {currentApp === "weather" && <Cloud className="w-10 h-10 text-white" />}
                    {currentApp === "store" && <ShoppingCart className="w-10 h-10 text-white" />}
                    {currentApp === "games" && <Gamepad2 className="w-10 h-10 text-white" />}
                    {currentApp === "people" && <Users className="w-10 h-10 text-white" />}
                    {currentApp === "office" && <FileText className="w-10 h-10 text-white" />}
                    {currentApp === "onedrive" && <CloudIcon className="w-10 h-10 text-white" />}
                    {!["phone", "messaging", "mail", "calendar", "maps", "weather", "store", "games", "people", "office", "onedrive"].includes(currentApp) && (
                      <div className="w-10 h-10 bg-white/20"></div>
                    )}
                  </div>
                  
                  <p className="text-lg text-gray-400 mb-2">App Preview</p>
                  <p className="text-sm text-gray-500 max-w-xs">
                    This is a placeholder for the {currentApp} app. Full functionality coming soon.
                  </p>
                  
                  {/* Demo Actions */}
                  <div className="mt-8 space-y-3 w-full max-w-xs">
                    <button
                      onClick={() => {
                        if (soundEnabled) sounds.buttonPress()
                      }}
                      className={`w-full py-3 ${currentAccent.bg} text-white font-medium hover:opacity-90 transition-opacity`}
                    >
                      Open {currentApp}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentApp(null)
                        if (soundEnabled) sounds.navigation()
                      }}
                      className="w-full py-3 bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            ) : currentView === "home" ? (
              <div className="h-full flex flex-col">
                {/* Edit Mode Toolbar */}
                {isEditMode && (
                  <div className="bg-black/95 backdrop-blur-sm border-b border-gray-800 px-3 py-2 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white animate-pulse"></div>
                      <span className="text-xs text-gray-300">Tap tile to resize</span>
                    </div>
                    <button
                      onClick={handleEditModeExit}
                      className={`px-4 py-1.5 ${currentAccent.bg} text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity`}
                    >
                      Done
                    </button>
                  </div>
                )}
                {/* Bento-style Tiles Grid with Enhanced Spacing */}
                <div
                  className="flex-1 overflow-y-auto px-2 pt-2 scrollbar-hide"
                  onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
                  onClick={(e) => {
                    if (isEditMode && e.target === e.currentTarget) {
                      handleEditModeExit()
                    }
                  }}
                >
                  <div className="grid grid-cols-8 gap-1 pb-24">
                    {tileOrder
                      .map((tileId) => tileLayout.find((t) => t.id === tileId))
                      .filter(Boolean)
                      .map((tile, index) => {
                      if (!tile) return null
                      const IconComponent = tile.icon
                      const contentIndex = tileContents[tile.id] || 0
                      const currentContent = tile.contents[contentIndex]
                      const isFlipping = flippingTiles.has(tile.id)

                      const isSelected = selectedTileId === tile.id
                      const isDragging = draggedTileId === tile.id

                      return (
                        <div
                          key={tile.id}
                          data-tile-id={tile.id}
                          className={`${tile.color} ${getTileClasses(tile.size)} ${tile.size === "small" ? "p-1.5" : "p-2.5"} cursor-pointer transition-all duration-300 relative overflow-hidden ${
                            isFlipping ? `animate-${tile.flipType}` : ""
                          } ${
                            isEditMode
                              ? isSelected
                                ? "opacity-100 scale-[0.95] border-2 border-white"
                                : "opacity-60 animate-wiggle"
                              : "hover:brightness-110 active:scale-[0.98]"
                          } ${isDragging ? "opacity-80 scale-[0.90] z-50" : ""}`}
                          style={{
                            transform: `translateY(${isEditMode ? 0 : Math.sin((index + scrollY * 0.01) * 0.1) * 2}px)`,
                          }}
                          draggable={isEditMode}
                          onDragStart={() => handleTileDragStart(tile.id)}
                          onDragOver={(e) => {
                            e.preventDefault()
                            handleTileDragOver(tile.id)
                          }}
                          onDragEnd={() => setDraggedTileId(null)}
                          onMouseDown={() => handleTileMouseDown(tile.id)}
                          onMouseUp={handleTileMouseUp}
                          onMouseLeave={handleTileMouseLeave}
                          onTouchStart={(e) => handleTouchStart(e, tile.id)}
                          onTouchMove={(e) => handleTouchMove(e, tile.id)}
                          onTouchEnd={handleTouchEnd}
                          onClick={() => {
                            if (isEditMode) {
                              // Toggle selection - if already selected, deselect; otherwise select
                              if (selectedTileId === tile.id) {
                                setSelectedTileId(null)
                              } else {
                                setSelectedTileId(tile.id)
                                if (soundEnabled) sounds.buttonPress()
                              }
                              return
                            }
                            if (soundEnabled) {
                              sounds.tileTap()
                            }
                            // Navigate based on tile title - all tiles are interactive
                            const tileTitle = tile.title.toLowerCase()
                            switch (tileTitle) {
                              case "camera":
                              case "photos":
                              case "gallery":
                                handleViewTransition("home", "photos")
                                break
                              case "settings":
                                handleViewTransition("home", "settings")
                                break
                              case "music":
                                handleViewTransition("home", "music")
                                break
                              case "phone":
                                handleViewTransition("home", "phone")
                                break
                              case "messaging":
                              case "messages":
                                handleViewTransition("home", "messaging")
                                break
                              case "mail":
                              case "email":
                                handleViewTransition("home", "mail")
                                break
                              case "calendar":
                                handleViewTransition("home", "calendar")
                                break
                              case "maps":
                                handleViewTransition("home", "maps")
                                break
                              case "weather":
                                handleViewTransition("home", "weather")
                                break
                              case "store":
                                handleViewTransition("home", "store")
                                break
                              case "games":
                                handleViewTransition("home", "games")
                                break
                              case "people":
                              case "contacts":
                                handleViewTransition("home", "people")
                                break
                              case "office":
                                handleViewTransition("home", "office")
                                break
                              case "onedrive":
                                handleViewTransition("home", "onedrive")
                                break
                              default:
                                // For any other tile, show a generic app view
                                handleViewTransition("home", tileTitle)
                                break
                            }
                          }}
                        >
                          {/* Background Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                          {/* Small Tile Layout - Icon centered */}
                          {tile.size === "small" && (
                            <div className={`relative z-10 h-full flex flex-col items-center justify-center transition-all duration-400 ${isFlipping ? "animate-content-flip" : ""} ${isEditMode && isSelected ? "pb-6" : ""}`}>
                              <IconComponent className="w-6 h-6 drop-shadow-sm" />
                            </div>
                          )}

                          {/* Medium & Wide Tile Layout */}
                          {tile.size !== "small" && (
                            <div className={`relative z-10 h-full flex flex-col transition-all duration-400 ${isFlipping ? "animate-content-flip" : ""} ${isEditMode && isSelected ? "pb-8" : ""}`}>
                              {/* Top Section: Icon */}
                              <div className="flex items-start justify-between">
                                <IconComponent className={`${tile.size === "wide" ? "w-8 h-8" : "w-7 h-7"} flex-shrink-0 drop-shadow-sm`} />
                                
                                {/* Date Badge for Calendar */}
                                {currentContent.date && (
                                  <div className="text-right">
                                    <div className="text-[10px] opacity-80">{currentContent.primary}</div>
                                    <div className="text-3xl font-light leading-none">{currentContent.date}</div>
                                  </div>
                                )}
                              </div>

                              {/* Middle Section: Dynamic Content */}
                              {!currentContent.date && (
                                <div className="flex-1 flex flex-col justify-center min-h-0">
                                  {currentContent.primary && (
                                    <div className="space-y-0.5">
                                      <p className={`${tile.size === "wide" ? "text-sm" : "text-xs"} font-medium leading-snug line-clamp-2`}>
                                        {currentContent.primary}
                                      </p>
                                      {currentContent.secondary && (
                                        <p className={`${tile.size === "wide" ? "text-xs" : "text-[10px]"} opacity-70 leading-snug line-clamp-1`}>
                                          {currentContent.secondary}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {/* Progress Bar */}
                                  {currentContent.progress !== undefined && currentContent.progress > 0 && (
                                    <div className="mt-2">
                                      <div className="w-full bg-black/20 h-1">
                                        <div
                                          className="bg-white/70 h-full transition-all duration-1000"
                                          style={{ width: `${currentContent.progress}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Bottom Section: Title */}
                              <div className="mt-auto">
                                <p className={`${tile.size === "wide" ? "text-sm" : "text-xs"} font-semibold truncate ${isFlipping ? "animate-title-slide" : ""}`}>
                                  {tile.title}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Enhanced Flip Animation Overlays */}
                          {isFlipping && (
                            <>
                              {tile.flipType === "vertical" && (
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/15 to-transparent animate-vertical-sweep"></div>
                              )}
                              {tile.flipType === "horizontal" && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-horizontal-sweep"></div>
                              )}
                              {tile.flipType === "cube" && (
                                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent animate-cube-rotate"></div>
                              )}
                              {tile.flipType === "slide" && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-white/15 animate-slide-sweep"></div>
                              )}
                              {tile.flipType === "zoom" && (
                                <div className="absolute inset-0 bg-radial-gradient from-white/25 to-transparent animate-zoom-pulse"></div>
                              )}
                              {tile.flipType === "flip3d" && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-white/15 to-black/25 animate-flip3d-shine"></div>
                              )}
                              {tile.flipType === "rotate" && (
                                <div className="absolute inset-0 bg-conic-gradient from-white/25 to-transparent animate-rotate-sweep"></div>
                              )}
                              {tile.flipType === "fade" && (
                                <div className="absolute inset-0 bg-white/10 animate-fade-pulse"></div>
                              )}
                            </>
                          )}

                          {/* Live Indicator */}
                          {tile.contents.length > 1 && !isEditMode && (
                            <div className="absolute bottom-2 left-2">
                              <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse drop-shadow-sm"></div>
                            </div>
                          )}

                          {/* Delete Button in Edit Mode */}
                          {isEditMode && isSelected && (
                            <div className="absolute -top-1 -right-1 z-20">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTile(tile.id)
                                }}
                                className="w-6 h-6 bg-red-600 flex items-center justify-center text-white text-sm font-bold hover:bg-red-700 transition-colors"
                                title="Unpin"
                              >
                                ×
                              </button>
                            </div>
                          )}

                          {/* Resize Options in Edit Mode - Inside tile at bottom */}
                          {isEditMode && isSelected && (
                            <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-sm p-1.5 flex justify-center gap-1">
                              {tileSizeOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleResizeTile(tile.id, option.value)
                                  }}
                                  className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                                    tile.size === option.value || 
                                    (option.value === "medium" && (tile.size === "square" || tile.size === "medium")) ||
                                    (option.value === "wide" && (tile.size === "wide" || tile.size === "large" || tile.size === "extra-wide"))
                                      ? `${currentAccent.bg} text-white`
                                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                                  }`}
                                  title={`Resize to ${option.label}`}
                                >
                                  {option.label}
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
              <div className="h-full overflow-y-auto scrollbar-hide pb-20">
                {/* Apps Header - Windows Phone Style */}
                <div className="flex items-center px-4 py-4 sticky top-0 bg-black z-10">
                  <button
                    onClick={() => {
                      setShowSearch(true)
                      if (soundEnabled) sounds.buttonPress()
                    }}
                    className="w-12 h-12 border-2 border-white flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Search className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Apps List with Alphabetical Sections */}
                <div className="px-4">
                  {Object.keys(groupedApps).sort().map((letter) => (
                    <div key={letter}>
                      {/* Letter Header */}
                      <div className="flex items-center py-2">
                        <div className={`w-12 h-12 ${currentAccent.border} border-2 flex items-center justify-center`}>
                          <span className={`text-xl font-semibold ${currentAccent.text}`}>{letter.toLowerCase()}</span>
                        </div>
                      </div>

                      {/* Apps in this letter group */}
                      {groupedApps[letter].map((app, index) => {
                        const IconComponent = app.icon
                        return (
                          <div
                            key={`${letter}-${index}`}
                            className="flex items-center py-2 hover:bg-white/5 cursor-pointer transition-colors"
                            onClick={() => {
                              if (soundEnabled) sounds.tileTap()
                              const appName = app.name.toLowerCase()
                              handleViewTransition("home", appName === "camera" ? "photos" : appName)
                            }}
                          >
                            <div className={`w-12 h-12 ${app.color} flex items-center justify-center mr-4`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-light text-white">{app.name}</span>
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
          <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 safe-area-pb">
            <div className="flex justify-center py-3 sm:py-4">
              <div className="flex gap-6 sm:gap-8 md:gap-12">
                {/* Back Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                  onClick={() => {
                    if (soundEnabled) sounds.navigation()
                    // Go back: from app to home, from apps to home, from home do nothing
                    if (currentApp) {
                      setCurrentApp(null)
                    } else if (currentView === "apps") {
                      handleViewTransition("home", null)
                    }
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                {/* Start/Windows Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                  onClick={() => {
                    if (soundEnabled) sounds.navigation()
                    // Start button always goes to home (Live Tiles)
                    setCurrentApp(null)
                    handleViewTransition("home", null)
                  }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="8" height="8" />
                    <rect x="14" y="2" width="8" height="8" />
                    <rect x="2" y="14" width="8" height="8" />
                    <rect x="14" y="14" width="8" height="8" />
                  </svg>
                </Button>

                {/* Search Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                  onClick={() => {
                    setShowSearch(true)
                    if (soundEnabled) sounds.buttonPress()
                  }}
                >
                  <Search className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
      /* Enhanced Flip Animations */
      @keyframes vertical {
        0% { transform: rotateX(0deg); }
        50% { transform: rotateX(90deg) scale(0.8); }
        100% { transform: rotateX(0deg); }
      }
      
      @keyframes horizontal {
        0% { transform: rotateY(0deg); }
        50% { transform: rotateY(90deg) scale(0.8); }
        100% { transform: rotateY(0deg); }
      }

      @keyframes cube {
        0% { transform: rotateX(0deg) rotateY(0deg); }
        25% { transform: rotateX(90deg) rotateY(0deg) scale(0.9); }
        50% { transform: rotateX(90deg) rotateY(90deg) scale(0.8); }
        75% { transform: rotateX(0deg) rotateY(90deg) scale(0.9); }
        100% { transform: rotateX(0deg) rotateY(0deg); }
      }

      @keyframes slide {
        0% { transform: translateX(0%); }
        50% { transform: translateX(-100%) scale(0.9); }
        100% { transform: translateX(0%); }
      }

      @keyframes zoom {
        0% { transform: scale(1); }
        50% { transform: scale(0.7) rotate(5deg); }
        100% { transform: scale(1); }
      }

      @keyframes flip3d {
        0% { transform: perspective(400px) rotateY(0deg); }
        50% { transform: perspective(400px) rotateY(180deg) scale(0.8); }
        100% { transform: perspective(400px) rotateY(360deg); }
      }

      @keyframes rotate {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(0.8); }
        100% { transform: rotate(360deg) scale(1); }
      }

      @keyframes fade {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }

      /* Animation Classes */
      .animate-vertical { animation: vertical 0.6s ease-in-out; }
      .animate-horizontal { animation: horizontal 0.6s ease-in-out; }
      .animate-cube { animation: cube 0.8s ease-in-out; }
      .animate-slide { animation: slide 0.5s ease-in-out; }
      .animate-zoom { animation: zoom 0.4s ease-in-out; }
      .animate-flip3d { animation: flip3d 0.7s ease-in-out; }
      .animate-rotate { animation: rotate 0.6s ease-in-out; }
      .animate-fade { animation: fade 0.4s ease-in-out; }

      /* Content Animations */
      @keyframes content-flip {
        0% { opacity: 1; transform: translateY(0px); }
        50% { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0px); }
      }

      @keyframes title-slide {
        0% { transform: translateX(0px); }
        50% { transform: translateX(-5px); }
        100% { transform: translateX(0px); }
      }

      .animate-content-flip { animation: content-flip 0.4s ease-in-out; }
      .animate-title-slide { animation: title-slide 0.4s ease-in-out; }

      /* Sweep Effects */
      @keyframes vertical-sweep {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }

      @keyframes horizontal-sweep {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      @keyframes cube-rotate {
        0% { transform: rotate(0deg) scale(0); }
        50% { transform: rotate(180deg) scale(1); }
        100% { transform: rotate(360deg) scale(0); }
      }

      @keyframes slide-sweep {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
      }

      @keyframes zoom-pulse {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }

      @keyframes flip3d-shine {
        0% { transform: translateX(-100%) skewX(-15deg); }
        100% { transform: translateX(100%) skewX(-15deg); }
      }

      @keyframes rotate-sweep {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes fade-pulse {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }

      .animate-vertical-sweep { animation: vertical-sweep 0.6s ease-in-out; }
      .animate-horizontal-sweep { animation: horizontal-sweep 0.6s ease-in-out; }
      .animate-cube-rotate { animation: cube-rotate 0.8s ease-in-out; }
      .animate-slide-sweep { animation: slide-sweep 0.5s ease-in-out; }
      .animate-zoom-pulse { animation: zoom-pulse 0.4s ease-in-out; }
      .animate-flip3d-shine { animation: flip3d-shine 0.7s ease-in-out; }
      .animate-rotate-sweep { animation: rotate-sweep 0.6s ease-in-out; }
      .animate-fade-pulse { animation: fade-pulse 0.4s ease-in-out; }

      /* Edit Mode Wiggle Animation */
      @keyframes wiggle {
        0%, 100% { transform: rotate(-1deg); }
        50% { transform: rotate(1deg); }
      }

      .animate-wiggle {
        animation: wiggle 0.3s ease-in-out infinite;
      }

      /* Existing animations */
      @keyframes flip {
        0% { transform: rotateY(0deg); }
        50% { transform: rotateY(90deg); }
        100% { transform: rotateY(0deg); }
      }
      
      .animate-flip {
        animation: flip 0.6s ease-in-out;
      }
      
      @keyframes slideIn {
        from {
          transform: translateY(-10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .animate-slide-in {
        animation: slideIn 0.3s ease-out;
      }

      @keyframes fade-in {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes fade-out {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      @keyframes logo-appear {
        0% {
          opacity: 0;
          transform: scale(0.5) rotate(-10deg);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.1) rotate(5deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }

      @keyframes text-appear {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fade-in 1s ease-out;
      }

      .animate-fade-out {
        animation: fade-out 0.5s ease-in;
      }

      .animate-logo-appear {
        animation: logo-appear 1.5s ease-out;
      }

      .animate-text-appear {
        animation: text-appear 1s ease-out 1s both;
      }

      @keyframes slide-in-left {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slide-out-right {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100%);
        }
      }

      .animate-slide-in-left {
        animation: slide-in-left 0.3s ease-out;
      }

      .animate-slide-out-right {
        animation: slide-out-right 0.25s ease-in;
      }

      /* Hide scrollbars */
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `}</style>
    </div>
  )
}
