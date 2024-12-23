'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import Image from "next/image"
import { Location } from '@/types'
import { getLocations } from '@/services/api'

export default function LocationSelector() {
  const [open, setOpen] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleOpenChange = async (open: boolean) => {
    setOpen(open)
    if (open && locations.length === 0) {
      const fetchedLocations = await getLocations()
      setLocations(fetchedLocations)
    }
  }

  const filteredLocations = locations.filter(location =>
    location.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLocationSelect = (location: Location) => {
    router.push(`/movies?city=${location.city}`)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
      >
        <Search className="h-4 w-4" />
        <span>Select your city</span>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select your city</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for your city"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-4">
            {filteredLocations.map((location) => (
              <button
                key={location.id}
                className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-accent"
                onClick={() => handleLocationSelect(location)}
              >
                <Image
                  src={`/placeholder.svg?height=48&width=48`}
                  alt={location.city}
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
                <span className="text-sm font-medium">{location.city}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

