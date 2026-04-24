"use client"

import { useState, useEffect, useRef } from "react"
import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Shuffle,
  Repeat,
  Volume2,
  Music,
  Clock,
  TrendingUp,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Track {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  isPlaying?: boolean
}

interface MusicAppProps {
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
}

export default function MusicApp({ onBack, soundEnabled, sounds, accentColor }: MusicAppProps) {
  const [activeSection, setActiveSection] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const panoramaRef = useRef<HTMLDivElement>(null)

  // Sample music data
  const tracks: Track[] = [
    {
      id: 1,
      title: "Radioactive",
      artist: "Imagine Dragons",
      album: "Night Visions",
      duration: "3:06",
      cover: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      title: "Viva La Vida",
      artist: "Coldplay",
      album: "Viva la Vida",
      duration: "4:01",
      cover: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      title: "Counting Stars",
      artist: "OneRepublic",
      album: "Native",
      duration: "4:17",
      cover: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      title: "Demons",
      artist: "Imagine Dragons",
      album: "Night Visions",
      duration: "2:57",
      cover: "/placeholder.svg?height=300&width=300",
    },
  ]

  const albums = [
    { name: "Night Visions", artist: "Imagine Dragons", tracks: 11, cover: "/placeholder.svg?height=300&width=300" },
    { name: "Viva la Vida", artist: "Coldplay", tracks: 10, cover: "/placeholder.svg?height=300&width=300" },
    { name: "Native", artist: "OneRepublic", tracks: 13, cover: "/placeholder.svg?height=300&width=300" },
  ]

  const artists = [
    { name: "Imagine Dragons", albums: 3, cover: "/placeholder.svg?height=300&width=300" },
    { name: "Coldplay", albums: 2, cover: "/placeholder.svg?height=300&width=300" },
    { name: "OneRepublic", albums: 2, cover: "/placeholder.svg?height=300&width=300" },
  ]

  // Panorama sections
  const panoramaSections = [
    {
      title: "now playing",
      subtitle: "current track",
      content: "now-playing",
    },
    {
      title: "recent",
      subtitle: "recently played",
      content: "recent-tracks",
    },
    {
      title: "albums",
      subtitle: "your collection",
      content: "albums-grid",
    },
    {
      title: "artists",
      subtitle: "favorite musicians",
      content: "artists-grid",
    },
  ]

  // Handle panorama scroll
  useEffect(() => {
    const handleScroll = () => {
      if (panoramaRef.current) {
        const scrollLeft = panoramaRef.current.scrollLeft
        setScrollX(scrollLeft)

        const sectionWidth = panoramaRef.current.clientWidth
        const newActiveSection = Math.round(scrollLeft / sectionWidth)
        setActiveSection(Math.max(0, Math.min(newActiveSection, panoramaSections.length - 1)))
      }
    }

    const panoramaElement = panoramaRef.current
    if (panoramaElement) {
      panoramaElement.addEventListener("scroll", handleScroll)
      return () => panoramaElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (index: number) => {
    if (panoramaRef.current) {
      const sectionWidth = panoramaRef.current.clientWidth
      panoramaRef.current.scrollTo({
        left: index * sectionWidth,
        behavior: "smooth",
      })
    }
    if (soundEnabled) {
      sounds.navigation()
    }
  }

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    if (soundEnabled) {
      sounds.tileTap()
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (soundEnabled) {
      sounds.buttonPress()
    }
  }

  return (
    <div className="music-app-container h-full bg-black text-white flex flex-col animate-slide-in-left">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => {
              const element = document.querySelector(".music-app-container")
              if (element) {
                element.classList.add("animate-slide-out-right")
                setTimeout(() => {
                  onBack()
                }, 250)
              } else {
                onBack()
              }
              if (soundEnabled) {
                sounds.navigation()
              }
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Panorama Title with Parallax */}
        <div className="relative overflow-hidden">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-2"
            style={{
              transform: `translateX(${-scrollX * 0.3}px)`,
            }}
          >
            music
          </h1>
          <p
            className="text-sm text-gray-400"
            style={{
              transform: `translateX(${-scrollX * 0.2}px)`,
            }}
          >
            {tracks.length} songs in your library
          </p>
        </div>
      </div>

      {/* Section Indicators */}
      <div className="flex justify-center py-2 border-b border-gray-800">
        <div className="flex gap-2">
          {panoramaSections.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === index ? accentColor.bg : "bg-gray-600"
              }`}
              onClick={() => scrollToSection(index)}
            />
          ))}
        </div>
      </div>

      {/* Panorama Container */}
      <div
        ref={panoramaRef}
        className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {panoramaSections.map((section, sectionIndex) => (
          <div key={section.title} className="min-w-full h-full flex-shrink-0 snap-start">
            {/* Section Header */}
            <div className="p-4 pb-2">
              <h2
                className="text-3xl font-light mb-1"
                style={{
                  transform: `translateX(${(scrollX - sectionIndex * (panoramaRef.current?.clientWidth || 0)) * 0.1}px)`,
                }}
              >
                {section.title}
              </h2>
              <p
                className="text-sm text-gray-400"
                style={{
                  transform: `translateX(${(scrollX - sectionIndex * (panoramaRef.current?.clientWidth || 0)) * 0.05}px)`,
                }}
              >
                {section.subtitle}
              </p>
            </div>

            {/* Section Content */}
            <div className="flex-1 overflow-y-auto p-4 pt-2">
              {section.content === "now-playing" && (
                <div className="space-y-6">
                  {currentTrack ? (
                    <>
                      {/* Album Art */}
                      <div className="flex justify-center">
                        <div className="w-48 h-48 bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={currentTrack.cover || "/placeholder.svg"}
                            alt={currentTrack.album}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Track Info */}
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-medium">{currentTrack.title}</h3>
                        <p className="text-gray-400">{currentTrack.artist}</p>
                        <p className="text-sm text-gray-500">{currentTrack.album}</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div className={`${accentColor.bg} h-1 rounded-full`} style={{ width: "35%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>1:23</span>
                          <span>{currentTrack.duration}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-6">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Shuffle className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <SkipBack className="w-6 h-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`text-white hover:bg-white/20 w-12 h-12 ${accentColor.bg} rounded-full`}
                          onClick={togglePlayPause}
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <SkipForward className="w-6 h-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Repeat className="w-5 h-5" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <Music className="w-16 h-16 text-gray-600" />
                      <div>
                        <h3 className="text-lg font-medium mb-2">No music playing</h3>
                        <p className="text-gray-400">Select a track to start listening</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {section.content === "recent-tracks" && (
                <div className="space-y-3">
                  {tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center p-3 hover:bg-gray-800/50 cursor-pointer transition-colors rounded-lg group"
                      onClick={() => handlePlayTrack(track)}
                      style={{
                        transform: `translateX(${Math.max(0, (scrollX - sectionIndex * (panoramaRef.current?.clientWidth || 0)) * 0.02 - index * 8)}px)`,
                      }}
                    >
                      <div className="w-12 h-12 bg-gray-700 rounded mr-3 overflow-hidden group-hover:scale-105 transition-transform">
                        <img
                          src={track.cover || "/placeholder.svg"}
                          alt={track.album}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{track.title}</h4>
                        <p className="text-sm text-gray-400">{track.artist}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{track.duration}</p>
                        <Clock className="w-4 h-4 text-gray-500 ml-auto mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.content === "albums-grid" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {albums.map((album, index) => (
                    <div
                      key={album.name}
                      className="bg-gray-800/30 rounded-lg p-3 cursor-pointer hover:bg-gray-800/50 transition-colors group"
                      style={{
                        transform: `translateY(${Math.max(0, (scrollX - sectionIndex * (panoramaRef.current?.clientWidth || 0)) * 0.02 - index * 10)}px)`,
                      }}
                    >
                      <div className="aspect-square bg-gray-700 rounded-lg mb-3 overflow-hidden group-hover:scale-105 transition-transform">
                        <img
                          src={album.cover || "/placeholder.svg"}
                          alt={album.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-sm mb-1">{album.name}</h4>
                      <p className="text-xs text-gray-400">{album.artist}</p>
                      <p className="text-xs text-gray-500">{album.tracks} tracks</p>
                    </div>
                  ))}
                </div>
              )}

              {section.content === "artists-grid" && (
                <div className="space-y-4">
                  {artists.map((artist, index) => (
                    <div
                      key={artist.name}
                      className="flex items-center p-3 hover:bg-gray-800/50 cursor-pointer transition-colors rounded-lg group"
                      style={{
                        transform: `translateX(${Math.max(0, (scrollX - sectionIndex * (panoramaRef.current?.clientWidth || 0)) * 0.03 - index * 12)}px)`,
                      }}
                    >
                      <div className="w-16 h-16 bg-gray-700 rounded-full mr-4 overflow-hidden group-hover:scale-105 transition-transform">
                        <img
                          src={artist.cover || "/placeholder.svg"}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{artist.name}</h4>
                        <p className="text-sm text-gray-400">{artist.albums} albums</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
