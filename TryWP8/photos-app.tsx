"use client"

import { useState, useEffect, useRef } from "react"
import {
  ChevronLeft,
  Share,
  Heart,
  MoreHorizontal,
  Search,
  Camera,
  Grid3X3,
  MapPin,
  Play,
  Users,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Photo {
  id: number
  url: string
  title: string
  date: string
  location?: string
  album: string
}

interface PhotosAppProps {
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

export default function PhotosApp({ onBack, soundEnabled, sounds, accentColor }: PhotosAppProps) {
  const [activeSection, setActiveSection] = useState(0)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [scrollX, setScrollX] = useState(0)
  const panoramaRef = useRef<HTMLDivElement>(null)

  // Real photos from Unsplash
  const photos: Photo[] = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      title: "Sunset Beach",
      date: "Today",
      location: "Santa Monica, CA",
      album: "Camera Roll",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=400&fit=crop",
      title: "City Lights",
      date: "Yesterday",
      location: "Downtown LA",
      album: "Camera Roll",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop",
      title: "Morning Coffee",
      date: "2 days ago",
      album: "Food",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      title: "Mountain View",
      date: "Last week",
      location: "Yosemite",
      album: "Travel",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      title: "Concert Night",
      date: "Last week",
      album: "Events",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=500&fit=crop",
      title: "Family Dinner",
      date: "2 weeks ago",
      album: "Family",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
      title: "Nature Walk",
      date: "3 days ago",
      location: "Central Park",
      album: "Travel",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop",
      title: "Lake Reflection",
      date: "1 week ago",
      location: "Lake Tahoe",
      album: "Travel",
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop",
      title: "Brunch Time",
      date: "5 days ago",
      album: "Food",
    },
    {
      id: 10,
      url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop",
      title: "Starry Night",
      date: "1 week ago",
      location: "Joshua Tree",
      album: "Travel",
    },
    {
      id: 11,
      url: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=500&h=500&fit=crop",
      title: "Pizza Night",
      date: "4 days ago",
      album: "Food",
    },
    {
      id: 12,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      title: "Golden Hour",
      date: "6 days ago",
      location: "Malibu Beach",
      album: "Camera Roll",
    },
    {
      id: 13,
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      title: "Forest Path",
      date: "1 week ago",
      location: "Redwood National Park",
      album: "Travel",
    },
    {
      id: 14,
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop",
      title: "Homemade Pasta",
      date: "3 days ago",
      album: "Food",
    },
    {
      id: 15,
      url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop",
      title: "Group Photo",
      date: "2 weeks ago",
      album: "Family",
    },
    {
      id: 16,
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop",
      title: "Sunset Drive",
      date: "1 week ago",
      location: "Pacific Coast Highway",
      album: "Travel",
    },
    {
      id: 17,
      url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=500&fit=crop",
      title: "Fresh Salad",
      date: "2 days ago",
      album: "Food",
    },
    {
      id: 18,
      url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop",
      title: "Birthday Party",
      date: "1 week ago",
      album: "Events",
    },
  ]

  const albums = [
    { name: "Camera Roll", count: 24, cover: photos[0] },
    { name: "Travel", count: 12, cover: photos[3] },
    { name: "Food", count: 8, cover: photos[2] },
    { name: "Family", count: 15, cover: photos[5] },
    { name: "Events", count: 6, cover: photos[4] },
  ]

  const favorites = photos.filter((_, index) => index % 3 === 0)

  // Panorama sections
  const panoramaSections = [
    {
      title: "recent",
      subtitle: "your latest photos",
      content: "recent-photos",
    },
    {
      title: "albums",
      subtitle: "organized collections",
      content: "albums-grid",
    },
    {
      title: "favorites",
      subtitle: "your best shots",
      content: "favorites-grid",
    },
    {
      title: "people",
      subtitle: "tagged friends",
      content: "people-photos",
    },
  ]

  // Handle panorama scroll
  useEffect(() => {
    const handleScroll = () => {
      if (panoramaRef.current) {
        const scrollLeft = panoramaRef.current.scrollLeft
        setScrollX(scrollLeft)

        // Update active section based on scroll position
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

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
    if (soundEnabled) {
      sounds.tileTap()
    }
  }

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

  if (selectedPhoto) {
    return (
      <div className="h-full bg-black text-white relative">
        {/* Photo Viewer Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => {
                setSelectedPhoto(null)
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
                <Share className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="h-full flex items-center justify-center">
          <img
            src={selectedPhoto.url || "/placeholder.svg"}
            alt={selectedPhoto.title}
            className="max-w-full max-h-full object-contain"
            crossOrigin="anonymous"
          />
        </div>

        {/* Photo Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-lg font-medium mb-1">{selectedPhoto.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>{selectedPhoto.date}</span>
            {selectedPhoto.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{selectedPhoto.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="photos-app-container h-full bg-black text-white flex flex-col animate-slide-in-left">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => {
              const element = document.querySelector(".photos-app-container")
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
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Camera className="w-5 h-5" />
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
            photos
          </h1>
          <p
            className="text-sm text-gray-400"
            style={{
              transform: `translateX(${-scrollX * 0.2}px)`,
            }}
          >
            {photos.length} photos in your collection
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
              {section.content === "recent-photos" && (
                <div className="space-y-4">
                  {/* Hero Photo */}
                  <div
                    className="relative h-48 bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handlePhotoClick(photos[0])}
                  >
                    <img
                      src={photos[0].url || "/placeholder.svg"}
                      alt={photos[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-lg font-medium">{photos[0].title}</h3>
                      <p className="text-sm text-gray-300">{photos[0].date}</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Play className="w-6 h-6 opacity-80" />
                    </div>
                  </div>

                  {/* Recent Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                    {photos.slice(1, 13).map((photo, index) => (
                      <div
                        key={photo.id}
                        className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handlePhotoClick(photo)}
                        style={{
                          transform: `translateY(${Math.max(0, (scrollX - sectionIndex * (panoramaRef.current?.clientWidth || 0)) * 0.02 - index * 5)}px)`,
                        }}
                      >
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.content === "albums-grid" && (
                <div className="space-y-4">
                  {albums.map((album, index) => (
                    <div
                      key={album.name}
                      className="flex items-center p-3 hover:bg-gray-800/50 cursor-pointer transition-colors rounded-lg group"
                      onClick={() => handlePhotoClick(album.cover)}
                      style={{
                        transform: `translateX(${Math.max(0, (scrollX - sectionIndex * (panoramaRef.current?.clientWidth || 0)) * 0.03 - index * 10)}px)`,
                      }}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 bg-gray-700 group-hover:scale-105 transition-transform">
                        <img
                          src={album.cover.url || "/placeholder.svg"}
                          alt={album.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{album.name}</h3>
                        <p className="text-sm text-gray-400">{album.count} photos</p>
                      </div>
                      <Grid3X3 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {section.content === "favorites-grid" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {favorites.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => handlePhotoClick(photo)}
                      style={{
                        transform: `translateY(${Math.max(0, (scrollX - sectionIndex * (panoramaRef.current?.clientWidth || 0)) * 0.02 - index * 8)}px)`,
                      }}
                    >
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        crossOrigin="anonymous"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-2 right-2">
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      </div>
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs font-medium">{photo.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.content === "people-photos" && (
                <div className="space-y-4">
                  {/* People Header */}
                  <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                    <Users className="w-6 h-6 text-gray-400" />
                    <div>
                      <h3 className="text-base font-medium">Tagged People</h3>
                      <p className="text-sm text-gray-400">Photos with friends and family</p>
                    </div>
                  </div>

                  {/* People Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {photos.slice(14, 18).map((photo, index) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => handlePhotoClick(photo)}
                        style={{
                          transform: `translateX(${Math.max(0, (scrollX - sectionIndex * (panoramaRef.current?.clientWidth || 0)) * 0.04 - index * 12)}px)`,
                        }}
                      >
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                              <Users className="w-3 h-3" />
                            </div>
                            <span className="text-xs">2 people</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Activity
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-gray-800/20 rounded">
                        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">Sarah tagged you in 3 photos</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-gray-800/20 rounded">
                        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">Mike liked your photo</p>
                          <p className="text-xs text-gray-400">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
