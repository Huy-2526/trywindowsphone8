"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Wifi,
  Bluetooth,
  Volume2,
  Smartphone,
  Lock,
  Camera,
  Palette,
  Monitor,
  Shield,
  MapPin,
  Mic,
  Cloud,
  RefreshCw,
  Info,
  HardDrive,
  Download,
  Eye,
  Hand,
  Battery,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface SettingsAppProps {
  onBack: () => void
  soundEnabled: boolean
  sounds: any
  accentColor: {
    name: string
    bg: string
    text: string
    border: string
    hex: string
  }
  onAccentColorChange: (color: string) => void
  accentColors: Record<string, any>
  wallpaper: {
    type: "color" | "image"
    value: string
  }
  onWallpaperChange: (wallpaper: { type: "color" | "image"; value: string }) => void
  wallpaperOptions: {
    colors: Array<{ name: string; value: string; preview: string }>
    images: Array<{ name: string; value: string }>
  }
}

export default function SettingsApp({
  onBack,
  soundEnabled,
  sounds,
  accentColor,
  onAccentColorChange,
  accentColors,
  wallpaper,
  onWallpaperChange,
  wallpaperOptions,
}: SettingsAppProps) {
  const [scrollY, setScrollY] = useState(0)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false)
  const [wallpaperTab, setWallpaperTab] = useState<"colors" | "images">("colors")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [settingsData, setSettingsData] = useState({
    // System settings
    wifi: { enabled: true, network: "Home-WiFi", strength: 3 },
    bluetooth: { enabled: true, devices: ["AirPods Pro", "Wireless Mouse"] },
    cellular: { enabled: true, carrier: "Verizon", signal: 4, dataUsage: "2.3 GB" },
    airplaneMode: false,

    // Display settings
    brightness: 75,
    autoRotate: true,
    screenTimeout: 30,

    // Sound settings
    ringtone: "Nokia Tune",
    volume: 80,
    vibrate: true,
    keyboardSounds: true,

    // Privacy settings
    location: true,
    camera: true,
    microphone: true,
    contacts: false,

    // Battery settings
    batteryLevel: 85,
    batterySaver: false,
    batteryOptimization: true,

    // Storage settings
    totalStorage: "32 GB",
    usedStorage: "19.5 GB",
    availableStorage: "12.5 GB",

    // Account settings
    microsoftAccount: "user@outlook.com",
    backupEnabled: true,
    syncContacts: true,
    syncCalendar: true,

    // Update settings
    autoUpdate: true,
    lastUpdate: "2 days ago",
    pendingUpdates: 3,

    // Accessibility settings
    fontSize: "Medium",
    highContrast: false,
    screenReader: false,
    magnifier: false,
  })

  const settingsSections = [
    {
      id: "system",
      title: "system",
      icon: Smartphone,
      items: [
        {
          id: "wifi",
          name: "wifi",
          icon: Wifi,
          description: settingsData.wifi.enabled ? `Connected to ${settingsData.wifi.network}` : "Off",
        },
        {
          id: "bluetooth",
          name: "bluetooth",
          icon: Bluetooth,
          description: settingsData.bluetooth.enabled ? `${settingsData.bluetooth.devices.length} devices` : "Off",
        },
        {
          id: "cellular",
          name: "cellular + SIM",
          icon: Smartphone,
          description: `${settingsData.cellular.carrier} • ${settingsData.cellular.dataUsage} used`,
        },
        {
          id: "airplane",
          name: "airplane mode",
          icon: Smartphone,
          description: settingsData.airplaneMode ? "On" : "Off",
        },
      ],
    },
    {
      id: "personalization",
      title: "personalization",
      icon: Palette,
      items: [
        { id: "theme", name: "theme", icon: Palette, description: `Accent: ${accentColor.name}`, special: "theme" },
        {
          id: "wallpaper",
          name: "wallpaper",
          icon: Camera,
          description: wallpaper.type === "color" ? "Solid color" : "Custom image",
          special: "wallpaper",
        },
        { id: "display", name: "display", icon: Monitor, description: `Brightness: ${settingsData.brightness}%` },
        { id: "sounds", name: "sounds", icon: Volume2, description: `Volume: ${settingsData.volume}%` },
      ],
    },
    {
      id: "privacy",
      title: "privacy & security",
      icon: Shield,
      items: [
        { id: "location", name: "location", icon: MapPin, description: settingsData.location ? "On" : "Off" },
        { id: "camera", name: "camera", icon: Camera, description: settingsData.camera ? "Allowed" : "Blocked" },
        {
          id: "microphone",
          name: "microphone",
          icon: Mic,
          description: settingsData.microphone ? "Allowed" : "Blocked",
        },
        { id: "lock-screen", name: "lock screen", icon: Lock, description: "PIN required" },
      ],
    },
    {
      id: "accounts",
      title: "accounts & backup",
      icon: User,
      items: [
        { id: "microsoft", name: "Microsoft account", icon: User, description: settingsData.microsoftAccount },
        {
          id: "backup",
          name: "backup",
          icon: Cloud,
          description: settingsData.backupEnabled ? "Last backup: today" : "Off",
        },
        { id: "sync", name: "sync settings", icon: RefreshCw, description: "Contacts, Calendar, Settings" },
      ],
    },
    {
      id: "system-info",
      title: "system info",
      icon: Info,
      items: [
        {
          id: "battery",
          name: "battery",
          icon: Battery,
          description: `${settingsData.batteryLevel}% • ${settingsData.batterySaver ? "Battery saver on" : "Normal"}`,
        },
        {
          id: "storage",
          name: "storage",
          icon: HardDrive,
          description: `${settingsData.availableStorage} available of ${settingsData.totalStorage}`,
        },
        {
          id: "updates",
          name: "phone update",
          icon: Download,
          description: `${settingsData.pendingUpdates} updates available`,
        },
        { id: "about", name: "about", icon: Info, description: "Windows Phone 8.1 Update 2" },
      ],
    },
    {
      id: "accessibility",
      title: "ease of access",
      icon: Eye,
      items: [
        { id: "vision", name: "vision", icon: Eye, description: `Font size: ${settingsData.fontSize}` },
        { id: "hearing", name: "hearing", icon: Volume2, description: "Vibration alerts on" },
        { id: "interaction", name: "interaction", icon: Hand, description: "Touch accommodations" },
      ],
    },
  ]

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollY(scrollRef.current.scrollTop)
      }
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll)
      return () => scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleThemeClick = () => {
    setShowColorPicker(!showColorPicker)
    if (soundEnabled) {
      sounds.tileTap()
    }
  }

  const handleColorSelect = (colorKey: string) => {
    onAccentColorChange(colorKey)
    setShowColorPicker(false)
    if (soundEnabled) {
      sounds.tileTap()
    }
  }

  const handleWallpaperClick = () => {
    setShowWallpaperPicker(!showWallpaperPicker)
    if (soundEnabled) {
      sounds.tileTap()
    }
  }

  const handleWallpaperSelect = (type: "color" | "image", value: string) => {
    onWallpaperChange({ type, value })
    setShowWallpaperPicker(false)
    if (soundEnabled) {
      sounds.tileTap()
    }
  }

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "wifi":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">Wi-Fi Settings</h2>
            <div className="flex items-center justify-between">
              <span>Wi-Fi</span>
              <Switch
                checked={settingsData.wifi.enabled}
                onCheckedChange={(checked) =>
                  setSettingsData({ ...settingsData, wifi: { ...settingsData.wifi, enabled: checked } })
                }
              />
            </div>
            {settingsData.wifi.enabled && (
              <>
                <p>Connected to: {settingsData.wifi.network}</p>
                <p>Signal Strength: {settingsData.wifi.strength}</p>
              </>
            )}
          </div>
        )
      case "bluetooth":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">Bluetooth Settings</h2>
            <div className="flex items-center justify-between">
              <span>Bluetooth</span>
              <Switch
                checked={settingsData.bluetooth.enabled}
                onCheckedChange={(checked) =>
                  setSettingsData({ ...settingsData, bluetooth: { ...settingsData.bluetooth, enabled: checked } })
                }
              />
            </div>
            {settingsData.bluetooth.enabled && (
              <>
                <p>Paired Devices:</p>
                <ul>
                  {settingsData.bluetooth.devices.map((device, index) => (
                    <li key={index}>{device}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )
      case "cellular":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">Cellular Settings</h2>
            <div className="flex items-center justify-between">
              <span>Cellular Data</span>
              <Switch
                checked={settingsData.cellular.enabled}
                onCheckedChange={(checked) =>
                  setSettingsData({ ...settingsData, cellular: { ...settingsData.cellular, enabled: checked } })
                }
              />
            </div>
            {settingsData.cellular.enabled && (
              <>
                <p>Carrier: {settingsData.cellular.carrier}</p>
                <p>Data Usage: {settingsData.cellular.dataUsage}</p>
              </>
            )}
          </div>
        )
      case "airplane":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">Airplane Mode</h2>
            <div className="flex items-center justify-between">
              <span>Airplane Mode</span>
              <Switch
                checked={settingsData.airplaneMode}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, airplaneMode: checked })}
              />
            </div>
          </div>
        )
      case "display":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">Display Settings</h2>
            <div>
              <p>Brightness: {settingsData.brightness}%</p>
              <Slider
                defaultValue={[settingsData.brightness]}
                max={100}
                step={1}
                onValueChange={(value) => setSettingsData({ ...settingsData, brightness: value[0] })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto Rotate</span>
              <Switch
                checked={settingsData.autoRotate}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, autoRotate: checked })}
              />
            </div>
            <div>
              <p>Screen Timeout: {settingsData.screenTimeout} seconds</p>
              {/* Implement screen timeout options */}
            </div>
          </div>
        )
      case "sounds":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">Sound Settings</h2>
            <div>
              <p>Volume: {settingsData.volume}%</p>
              <Slider
                defaultValue={[settingsData.volume]}
                max={100}
                step={1}
                onValueChange={(value) => setSettingsData({ ...settingsData, volume: value[0] })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Vibrate</span>
              <Switch
                checked={settingsData.vibrate}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, vibrate: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Keyboard Sounds</span>
              <Switch
                checked={settingsData.keyboardSounds}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, keyboardSounds: checked })}
              />
            </div>
          </div>
        )
      case "privacy":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">Privacy Settings</h2>
            <div className="flex items-center justify-between">
              <span>Location</span>
              <Switch
                checked={settingsData.location}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, location: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Camera Access</span>
              <Switch
                checked={settingsData.camera}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, camera: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Microphone Access</span>
              <Switch
                checked={settingsData.microphone}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, microphone: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Contacts Access</span>
              <Switch
                checked={settingsData.contacts}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, contacts: checked })}
              />
            </div>
          </div>
        )
      case "accounts":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">Account Settings</h2>
            <p>Microsoft Account: {settingsData.microsoftAccount}</p>
            <div className="flex items-center justify-between">
              <span>Backup Enabled</span>
              <Switch
                checked={settingsData.backupEnabled}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, backupEnabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Sync Contacts</span>
              <Switch
                checked={settingsData.syncContacts}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, syncContacts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Sync Calendar</span>
              <Switch
                checked={settingsData.syncCalendar}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, syncCalendar: checked })}
              />
            </div>
          </div>
        )
      case "system-info":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">System Information</h2>
            <p>Battery Level: {settingsData.batteryLevel}%</p>
            <div className="flex items-center justify-between">
              <span>Battery Saver</span>
              <Switch
                checked={settingsData.batterySaver}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, batterySaver: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Battery Optimization</span>
              <Switch
                checked={settingsData.batteryOptimization}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, batteryOptimization: checked })}
              />
            </div>
            <p>
              Storage: {settingsData.availableStorage} available of {settingsData.totalStorage}
            </p>
            <p>Last Update: {settingsData.lastUpdate}</p>
            <p>Pending Updates: {settingsData.pendingUpdates}</p>
          </div>
        )
      case "accessibility":
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-light">Accessibility Settings</h2>
            <p>Font Size: {settingsData.fontSize}</p>
            <div className="flex items-center justify-between">
              <span>High Contrast</span>
              <Switch
                checked={settingsData.highContrast}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, highContrast: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Screen Reader</span>
              <Switch
                checked={settingsData.screenReader}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, screenReader: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Magnifier</span>
              <Switch
                checked={settingsData.magnifier}
                onCheckedChange={(checked) => setSettingsData({ ...settingsData, magnifier: checked })}
              />
            </div>
          </div>
        )
      default:
        return <p>No settings available for this section.</p>
    }
  }

  return (
    <div className="settings-app-container h-full bg-black text-white flex flex-col animate-slide-in-left">
      {currentSection ? (
        <div className="h-full bg-black text-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  setCurrentSection(null)
                  if (soundEnabled) {
                    sounds.navigation()
                  }
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>
            <h1 className="text-3xl font-light mb-2">
              {settingsSections.find((section) => section.id === currentSection)?.title}
            </h1>
            <p className="text-sm text-gray-400">Customize your settings</p>
          </div>
          <div className="flex-1 overflow-y-auto">{renderSectionContent(currentSection)}</div>
        </div>
      ) : showWallpaperPicker ? (
        // Wallpaper picker content
        <div className="h-full bg-black text-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  setShowWallpaperPicker(false)
                  if (soundEnabled) {
                    sounds.navigation()
                  }
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>
            <h1 className="text-3xl font-light mb-2">wallpaper</h1>
            <p className="text-sm text-gray-400">Choose your background</p>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-gray-800">
            <button
              className={`flex-1 py-3 px-4 text-center transition-colors ${
                wallpaperTab === "colors" ? `${accentColor.bg} text-white` : "text-gray-400 hover:text-white"
              }`}
              onClick={() => {
                setWallpaperTab("colors")
                if (soundEnabled) sounds.tileTap()
              }}
            >
              Colors
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center transition-colors ${
                wallpaperTab === "images" ? `${accentColor.bg} text-white` : "text-gray-400 hover:text-white"
              }`}
              onClick={() => {
                setWallpaperTab("images")
                if (soundEnabled) sounds.tileTap()
              }}
            >
              Images
            </button>
          </div>

          {/* Wallpaper Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {wallpaperTab === "colors" ? (
              <div className="grid grid-cols-2 gap-4">
                {wallpaperOptions.colors.map((color) => (
                  <div
                    key={color.name}
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => handleWallpaperSelect("color", color.value)}
                  >
                    <div
                      className={`w-full h-24 rounded-lg ${color.value} group-hover:scale-105 transition-transform duration-200 flex items-center justify-center relative border-2 ${
                        wallpaper.type === "color" && wallpaper.value === color.value
                          ? accentColor.border
                          : "border-transparent"
                      }`}
                    >
                      {wallpaper.type === "color" && wallpaper.value === color.value && (
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <span className="text-sm mt-2 text-gray-400 group-hover:text-white transition-colors">
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {wallpaperOptions.images.map((image) => (
                  <div
                    key={image.name}
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => handleWallpaperSelect("image", image.value)}
                  >
                    <div
                      className={`w-full h-32 rounded-lg bg-cover bg-center group-hover:scale-105 transition-transform duration-200 relative border-2 ${
                        wallpaper.type === "image" && wallpaper.value === image.value
                          ? accentColor.border
                          : "border-transparent"
                      }`}
                      style={{ backgroundImage: `url(${image.value})` }}
                    >
                      {wallpaper.type === "image" && wallpaper.value === image.value && (
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-black rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-sm mt-2 text-gray-400 group-hover:text-white transition-colors">
                      {image.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Preview Section */}
            <div className="mt-8 p-4 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div className="relative h-32 rounded-lg overflow-hidden">
                {wallpaper.type === "color" ? (
                  <div className={`w-full h-full ${wallpaper.value}`}></div>
                ) : (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${wallpaper.value})` }}
                  >
                    <div className="absolute inset-0 bg-black/40"></div>
                  </div>
                )}

                {/* Sample tiles overlay */}
                <div className="absolute inset-0 p-2">
                  <div className="grid grid-cols-4 gap-1 h-full">
                    <div className="bg-blue-600 rounded-sm opacity-90"></div>
                    <div className="bg-green-600 rounded-sm opacity-90"></div>
                    <div className="bg-red-600 rounded-sm opacity-90"></div>
                    <div className="bg-purple-600 rounded-sm opacity-90"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : showColorPicker ? (
        // Color picker content remains the same
        <div className="h-full bg-black text-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  setShowColorPicker(false)
                  if (soundEnabled) {
                    sounds.navigation()
                  }
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>
            <h1 className="text-3xl font-light mb-2">accent color</h1>
            <p className="text-sm text-gray-400">Choose your accent color</p>
          </div>

          {/* Color Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(accentColors).map(([key, color]) => (
                <div
                  key={key}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => handleColorSelect(key)}
                >
                  <div
                    className={`w-16 h-16 rounded-lg ${color.bg} group-hover:scale-110 transition-transform duration-200 flex items-center justify-center relative`}
                  >
                    {accentColor.name === key && (
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <span className="text-xs mt-2 text-gray-400 group-hover:text-white transition-colors">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Preview Section */}
            <div className="mt-8 p-4 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${accentColor.bg} rounded-sm`}></div>
                  <span>Accent color in tiles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-1 ${accentColor.bg} rounded`}></div>
                  <span>Active tab indicators</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 border-2 ${accentColor.border} rounded-sm`}></div>
                  <span>Selection borders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  const element = document.querySelector(".settings-app-container")
                  if (element) {
                    element.classList.add("animate-slide-out-right")
                    setTimeout(() => {
                      onBack()
                    }, 250)
                  } else {
                    onBack()
                  }
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>

            {/* Panorama Title with Parallax */}
            <div className="relative overflow-hidden">
              <h1
                className="text-6xl font-light text-white mb-2"
                style={{
                  transform: `translateX(${-scrollY * 0.1}px)`,
                }}
              >
                settings
              </h1>
              <p
                className="text-sm text-gray-400"
                style={{
                  transform: `translateX(${-scrollY * 0.05}px)`,
                }}
              >
                Customize your phone
              </p>
            </div>
          </div>

          {/* Settings Content with Panorama Effect */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-8">
              {settingsSections.map((group, groupIndex) => (
                <div
                  key={group.title}
                  className="space-y-2"
                  style={{
                    transform: `translateX(${Math.max(0, (scrollY - groupIndex * 30) * 0.02)}px)`,
                  }}
                >
                  <h2
                    className="text-2xl font-light text-gray-300 mb-4"
                    style={{
                      transform: `translateX(${Math.max(0, (scrollY - groupIndex * 25) * 0.03)}px)`,
                    }}
                  >
                    {group.title}
                  </h2>

                  {group.items.map((item, itemIndex) => {
                    const IconComponent = item.icon
                    return (
                      <div
                        key={item.name}
                        className="flex items-center p-4 hover:bg-gray-800/50 cursor-pointer transition-colors rounded-lg group"
                        onClick={() => {
                          if (item.special === "theme") {
                            handleThemeClick()
                          } else if (item.special === "wallpaper") {
                            handleWallpaperClick()
                          } else {
                            if (soundEnabled) {
                              sounds.tileTap()
                            }
                            setCurrentSection(item.id)
                          }
                        }}
                        style={{
                          transform: `translateX(${Math.max(0, (scrollY - (groupIndex * 4 + itemIndex) * 20) * 0.01)}px)`,
                        }}
                      >
                        <div
                          className={`w-12 h-12 ${accentColor.bg} rounded-sm flex items-center justify-center mr-4 group-hover:scale-105 transition-transform`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-base font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    )
                  })}
                </div>
              ))}

              {/* Footer spacing */}
              <div className="h-20"></div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
