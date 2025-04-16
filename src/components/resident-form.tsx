"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResidentFormProps {
  mode: "add" | "edit"
  resident?: any
  onCancel: () => void
  onSuccess: () => void
}

export function ResidentForm({ mode, resident, onCancel, onSuccess }: ResidentFormProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [date, setDate] = useState<Date | undefined>(resident?.dob ? new Date(resident.dob) : undefined)
  const [avatarPreview, setAvatarPreview] = useState<string>(
    resident?.avatar || "/placeholder.svg?height=200&width=200",
  )
  const [linkedApartments, setLinkedApartments] = useState<string[]>(resident?.apartments || [])
  const [newApartment, setNewApartment] = useState("")

  const handleAddApartment = () => {
    if (newApartment && !linkedApartments.includes(newApartment)) {
      setLinkedApartments([...linkedApartments, newApartment])
      setNewApartment("")
    }
  }

  const handleRemoveApartment = (apartment: string) => {
    setLinkedApartments(linkedApartments.filter((a) => a !== apartment))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally submit the form data to your API
    onSuccess()
  }

  const title = mode === "add" ? "Thêm cư dân" : "Chỉnh sửa cư dân"

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button type="button" variant="ghost" onClick={onCancel} className="mr-4">
            &larr; Quay lại
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[600px]">
            <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="contact">Liên hệ</TabsTrigger>
            <TabsTrigger value="apartment">Căn hộ liên kết</TabsTrigger>
          </TabsList>

          <Card className="mt-4 border-t-0 rounded-tl-none">
            <CardContent className="pt-6">
              <TabsContent value="personal" className="space-y-4">
                <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                  <div className="relative w-40 h-40">
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      className="w-40 h-40 rounded-md object-cover border"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                      <Label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center text-white">
                        <Upload className="h-6 w-6 mb-1" />
                        <span className="text-sm">Tải ảnh lên</span>
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Họ</Label>
                        <Input id="firstName" defaultValue={resident?.firstName || ""} placeholder="Nguyễn Văn" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Tên</Label>
                        <Input id="lastName" defaultValue={resident?.lastName || ""} placeholder="A" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Ngày sinh</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày sinh"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={vi} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber">Số CMND/CCCD</Label>
                      <Input id="idNumber" defaultValue={resident?.idNumber || ""} placeholder="012345678910" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" defaultValue={resident?.phone || ""} placeholder="0901234567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Địa chỉ email</Label>
                  <Input id="email" type="email" defaultValue={resident?.email || ""} placeholder="example@email.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Liên hệ khẩn cấp</Label>
                  <Input
                    id="emergencyContact"
                    defaultValue={resident?.emergencyContact || ""}
                    placeholder="0901234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Tên người liên hệ khẩn cấp</Label>
                  <Input id="emergencyName" defaultValue={resident?.emergencyName || ""} placeholder="Nguyễn Văn B" />
                </div>
              </TabsContent>

              <TabsContent value="apartment" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newApartment">Thêm căn hộ</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="newApartment"
                      value={newApartment}
                      onChange={(e) => setNewApartment(e.target.value)}
                      placeholder="Ví dụ: A1-1201"
                    />
                    <Button type="button" onClick={handleAddApartment}>
                      Thêm
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Danh sách căn hộ liên kết</Label>
                  <ScrollArea className="h-[200px] border rounded-md p-4">
                    {linkedApartments.length > 0 ? (
                      <div className="space-y-2">
                        {linkedApartments.map((apartment, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <Badge variant="outline" className="px-3 py-1 text-sm">
                              {apartment}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveApartment(apartment)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">Chưa có căn hộ nào được liên kết</div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
              <div className="flex space-x-2">
                {activeTab !== "personal" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabs = ["personal", "contact", "apartment"]
                      const currentIndex = tabs.indexOf(activeTab)
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1])
                      }
                    }}
                  >
                    Quay lại
                  </Button>
                )}
                {activeTab !== "apartment" ? (
                  <Button
                    type="button"
                    onClick={() => {
                      const tabs = ["personal", "contact", "apartment"]
                      const currentIndex = tabs.indexOf(activeTab)
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1])
                      }
                    }}
                  >
                    Tiếp theo
                  </Button>
                ) : (
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    {mode === "add" ? "Thêm cư dân" : "Cập nhật"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </div>
    </form>
  )
}
