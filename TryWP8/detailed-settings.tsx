"use client"
import { ChevronLeft, Wifi, Battery, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DetailedSettingsProps {
  sectionId: string
  onBack: () => void
  settingsData: any
  onSettingsChange: (key: string, value: any) => void
  soundEnabled: boolean
  sounds: any
  accentColor: any
}

export default function DetailedSettings({
  sectionId,
  onBack,
  settingsData,
  onSettingsChange,
  soundEnabled,
  sounds,
  accentColor,
}: DetailedSettingsProps) {
  const renderWifiSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
        <div className="flex items-center gap-3">
          <Wifi className="w-6 h-6" />
          <div>
            <h3 className="font-medium">WiFi</h3>
            <p className="text-sm text-gray-400">Connect to wireless networks</p>
          </div>
        </div>
        <button
          className={`w-12 h-6 rounded-full transition-colors ${
            settingsData.wifi.enabled ? accentColor.bg : "bg-gray-600"
          }`}
          onClick={() => {
            onSettingsChange("wifi", { ...settingsData.wifi, enabled: !settingsData.wifi.enabled })
            if (soundEnabled) sounds.buttonPress()
          }}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              settingsData.wifi.enabled ? "translate-x-6" : "translate-x-0.5"
            }`}
          ></div>
        </button>
      </div>

      {settingsData.wifi.enabled && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-300">Available Networks</h4>
          {["Home-WiFi", "Office-5G", "Starbucks-WiFi", "xfinitywifi"].map((network, index) => (
            <div
              key={network}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                network === settingsData.wifi.network ? accentColor.bg + " bg-opacity-20" : "hover:bg-gray-800/50"
              }`}
              onClick={() => {
                onSettingsChange("wifi", { ...settingsData.wifi, network })
                if (soundEnabled) sounds.tileTap()
              }}
            >
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5" />
                <div>
                  <p className="font-medium">{network}</p>
                  <p className="text-xs text-gray-400">
                    {network === settingsData.wifi.network ? "Connected" : "Available"}
                  </p>
                </div>
              </div>
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 mx-0.5 rounded ${
                      i < (network === "Home-WiFi" ? 4 : Math.floor(Math.random() * 4) + 1) ? "bg-white" : "bg-gray-600"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      {/* Brightness Slider */}
      <div className="p-4 bg-gray-800/30 rounded-lg">
        <h3 className="font-medium mb-4">Brightness</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={settingsData.brightness}
            onChange={(e) => {
              onSettingsChange("brightness", Number.parseInt(e.target.value))
              if (soundEnabled) sounds.buttonPress()
            }}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>0%</span>
            <span className="font-medium">{settingsData.brightness}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Auto-rotate */}
      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
        <div>
          <h3 className="font-medium">Auto-rotate screen</h3>
          <p className="text-sm text-gray-400">Rotate screen when device is rotated</p>
        </div>
        <button
          className={`w-12 h-6 rounded-full transition-colors ${
            settingsData.autoRotate ? accentColor.bg : "bg-gray-600"
          }`}
          onClick={() => {
            onSettingsChange("autoRotate", !settingsData.autoRotate)
            if (soundEnabled) sounds.buttonPress()
          }}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              settingsData.autoRotate ? "translate-x-6" : "translate-x-0.5"
            }`}
          ></div>
        </button>
      </div>

      {/* Screen timeout */}
      <div className="p-4 bg-gray-800/30 rounded-lg">
        <h3 className="font-medium mb-3">Screen timeout</h3>
        <div className="space-y-2">
          {[15, 30, 60, 120, 300].map((seconds) => (
            <div
              key={seconds}
              className={`p-3 rounded cursor-pointer transition-colors ${
                settingsData.screenTimeout === seconds ? accentColor.bg + " bg-opacity-20" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                onSettingsChange("screenTimeout", seconds)
                if (soundEnabled) sounds.tileTap()
              }}
            >
              <span>{seconds < 60 ? `${seconds} seconds` : `${seconds / 60} minute${seconds > 60 ? "s" : ""}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBatterySettings = () => (
    <div className="space-y-6">
      {/* Battery Level Display */}
      <div className="p-4 bg-gray-800/30 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <Battery className="w-8 h-8" />
          <div>
            <h3 className="text-2xl font-bold">{settingsData.batteryLevel}%</h3>
            <p className="text-sm text-gray-400">
              {settingsData.batteryLevel > 80
                ? "Excellent"
                : settingsData.batteryLevel > 50
                  ? "Good"
                  : settingsData.batteryLevel > 20
                    ? "Fair"
                    : "Low"}
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              settingsData.batteryLevel > 20 ? accentColor.bg : "bg-red-500"
            }`}
            style={{ width: `${settingsData.batteryLevel}%` }}
          ></div>
        </div>
      </div>

      {/* Battery Saver */}
      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
        <div>
          <h3 className="font-medium">Battery saver</h3>
          <p className="text-sm text-gray-400">Extend battery life by limiting background activity</p>
        </div>
        <button
          className={`w-12 h-6 rounded-full transition-colors ${
            settingsData.batterySaver ? accentColor.bg : "bg-gray-600"
          }`}
          onClick={() => {
            onSettingsChange("batterySaver", !settingsData.batterySaver)
            if (soundEnabled) sounds.buttonPress()
          }}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              settingsData.batterySaver ? "translate-x-6" : "translate-x-0.5"
            }`}
          ></div>
        </button>
      </div>

      {/* Battery Usage */}
      <div className="p-4 bg-gray-800/30 rounded-lg">
        <h3 className="font-medium mb-4">Battery usage by app</h3>
        <div className="space-y-3">
          {[
            { name: "Screen", usage: 35 },
            { name: "Music", usage: 18 },
            { name: "Phone", usage: 12 },
            { name: "Messaging", usage: 8 },
            { name: "Camera", usage: 6 },
            { name: "Other", usage: 21 },
          ].map((app) => (
            <div key={app.name} className="flex items-center justify-between">
              <span className="text-sm">{app.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${accentColor.bg}`}
                    style={{ width: `${(app.usage / 35) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400 w-8">{app.usage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStorageSettings = () => (
    <div className="space-y-6">
      {/* Storage Overview */}
      <div className="p-4 bg-gray-800/30 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <HardDrive className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">{settingsData.availableStorage}</h3>
            <p className="text-sm text-gray-400">available of {settingsData.totalStorage}</p>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div className={`h-3 rounded-full ${accentColor.bg}`} style={{ width: "61%" }}></div>
        </div>
        <p className="text-sm text-gray-400">{settingsData.usedStorage} used</p>
      </div>

      {/* Storage Breakdown */}
      <div className="p-4 bg-gray-800/30 rounded-lg">
        <h3 className="font-medium mb-4">Storage usage</h3>
        <div className="space-y-3">
          {[
            { category: "Apps", size: "8.2 GB", color: "bg-blue-500" },
            { category: "Photos & Videos", size: "4.8 GB", color: "bg-green-500" },
            { category: "Music", size: "3.1 GB", color: "bg-purple-500" },
            { category: "System", size: "2.8 GB", color: "bg-gray-500" },
            { category: "Documents", size: "0.6 GB", color: "bg-yellow-500" },
          ].map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span>{item.category}</span>
              </div>
              <span className="text-gray-400">{item.size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Actions */}
      <div className="space-y-3">
        <button className="w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left">
          <h4 className="font-medium">Clean up temporary files</h4>
          <p className="text-sm text-gray-400">Free up 1.2 GB of space</p>
        </button>
        <button className="w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left">
          <h4 className="font-medium">Move apps to SD card</h4>
          <p className="text-sm text-gray-400">Free up internal storage</p>
        </button>
      </div>
    </div>
  )

  const getSectionContent = () => {
    switch (sectionId) {
      case "wifi":
        return renderWifiSettings()
      case "display":
        return renderDisplaySettings()
      case "battery":
        return renderBatterySettings()
      case "storage":
        return renderStorageSettings()
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">Settings for {sectionId} coming soon...</p>
          </div>
        )
    }
  }

  const getSectionTitle = () => {
    const titles: { [key: string]: string } = {
      wifi: "WiFi Settings",
      display: "Display Settings",
      battery: "Battery Settings",
      storage: "Storage Settings",
    }
    return titles[sectionId] || sectionId
  }

  return (
    <div className="h-full bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => {
              onBack()
              if (soundEnabled) sounds.navigation()
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-light">{getSectionTitle()}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{getSectionContent()}</div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${accentColor.hex};
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${accentColor.hex};
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
