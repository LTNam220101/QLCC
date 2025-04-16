"use client"

import { useState } from "react"
import { ResidentList } from "@/components/resident-list"
import { ResidentForm } from "@/components/resident-form"
import { ResidentDetail } from "@/components/resident-detail"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

type View = "list" | "add" | "edit" | "detail"

export default function ResidentManagement() {
  const [view, setView] = useState<View>("list")
  const [selectedResident, setSelectedResident] = useState<any>(null)

  const handleAddResident = () => {
    setSelectedResident(null)
    setView("add")
  }

  const handleEditResident = (resident: any) => {
    setSelectedResident(resident)
    setView("edit")
  }

  const handleViewResident = (resident: any) => {
    setSelectedResident(resident)
    setView("detail")
  }

  const handleBackToList = () => {
    setView("list")
    setSelectedResident(null)
  }

  return (
    <div className="space-y-6">
      {view === "list" && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Quản lý cư dân</h1>
            <Button onClick={handleAddResident} className="bg-emerald-600 hover:bg-emerald-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm cư dân
            </Button>
          </div>
          <ResidentList onView={handleViewResident} onEdit={handleEditResident} />
        </>
      )}

      {view === "add" && <ResidentForm mode="add" onCancel={handleBackToList} onSuccess={handleBackToList} />}

      {view === "edit" && selectedResident && (
        <ResidentForm
          mode="edit"
          resident={selectedResident}
          onCancel={handleBackToList}
          onSuccess={handleBackToList}
        />
      )}

      {view === "detail" && selectedResident && (
        <ResidentDetail
          resident={selectedResident}
          onBack={handleBackToList}
          onEdit={() => handleEditResident(selectedResident)}
        />
      )}
    </div>
  )
}
