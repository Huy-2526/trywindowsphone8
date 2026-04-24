"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Search, X, Clock, Smartphone, Settings, Globe, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchResult {
  name?: string
  title?: string
  type: "app" | "tile" | "setting"
  icon?: any
  color?: string
}

interface SearchInterfaceProps {
  onBack: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  searchResults: SearchResult[]
  soundEnabled: boolean
  sounds: any
  accentColor: {
    name: string
    bg: string
    text: string
    border: string
    hex: string
  }
}

export default function SearchInterface({
  onBack,
  searchQuery,
  onSearchChange,
  searchResults,
  soundEnabled,
  sounds,
  accentColor,
}: SearchInterfaceProps) {
  const [recentSearches] = useState(["weather", "settings", "photos", "music", "calculator"])
  const [suggestions] = useState([
    "Open Calculator",
    "Turn on WiFi",
    "Check Battery",
    "Open Camera",
    "Play Music",
    "View Photos",
    "Send Message",
    "Make Call",
  ])

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus search input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleResultClick = (result: SearchResult) => {
    if (soundEnabled) {
      sounds.tileTap()
    }
    // Simulate opening the result
    console.log("Opening:", result.name || result.title)
  }

  const handleRecentSearch = (query: string) => {
    onSearchChange(query)
    if (soundEnabled) {
      sounds.buttonPress()
    }
  }

  const clearSearch = () => {
    onSearchChange("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
    if (soundEnabled) {
      sounds.buttonPress()
    }
  }

  return (
    <div className="search-interface h-full bg-black text-white flex flex-col animate-slide-in-left">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => {
              onBack()
              if (soundEnabled) {
                sounds.navigation()
              }
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search apps, settings, and more..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="ml-2 text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Content */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery ? (
          // Search Results
          <div className="p-4">
            {searchResults.length > 0 ? (
              <>
                <h3 className="text-lg font-medium mb-4 text-gray-300">Results</h3>
                <div className="space-y-2">
                  {searchResults.map((result, index) => {
                    const IconComponent = result.icon || Smartphone
                    return (
                      <div
                        key={index}
                        className="flex items-center p-3 hover:bg-gray-800/50 cursor-pointer transition-colors rounded-lg group"
                        onClick={() => handleResultClick(result)}
                      >
                        <div
                          className={`w-10 h-10 ${result.color || "bg-gray-600"} rounded-sm flex items-center justify-center mr-3 group-hover:scale-105 transition-transform`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{result.name || result.title}</h4>
                          <p className="text-sm text-gray-400 capitalize">{result.type}</p>
                        </div>
                        <div
                          className={`w-2 h-2 ${accentColor.bg} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                        ></div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-gray-400">Try searching for apps, settings, or features</p>
              </div>
            )}
          </div>
        ) : (
          // Default Search State
          <div className="p-4 space-y-6">
            {/* Recent Searches */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-300 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-300">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <Settings className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Open Settings</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <Calculator className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Calculator</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <Globe className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Browse Web</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <Smartphone className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Phone</p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-300">Suggestions</h3>
              <div className="space-y-2">
                {suggestions.slice(0, 4).map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 hover:bg-gray-800/30 cursor-pointer transition-colors rounded"
                    onClick={() => handleRecentSearch(suggestion.toLowerCase())}
                  >
                    <Search className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
