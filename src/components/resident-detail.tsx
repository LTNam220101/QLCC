"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Pencil, Trash2, Power, PowerOff } from "lucide-react"

interface ResidentDetailProps {
  resident: any
  onBack: () => void
  onEdit: () => void
}

export function ResidentDetail({ resident, onBack, onEdit }: ResidentDetailProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  const handleDelete = () => {
    // Here you would normally delete the resident via API
    setDeleteDialogOpen(false)
    onBack()
  }

  const handleToggleStatus = () => {
    // Here you would normally update the resident status via API
    setStatusDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          &larr; Quay lại
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Chi tiết cư dân</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto w-32 h-32 mb-2">
              <img
                src={resident.avatar || "/placeholder.svg?height=128&width=128"}
                alt={resident.name}
                className="rounded-full w-32 h-32 object-cover border-4 border-gray-100"
              />
            </div>
            <CardTitle className="text-xl">{resident.name}</CardTitle>
            <Badge
              variant={resident.status === "active" ? "default" : "secondary"}
              className={resident.status === "active" ? "bg-emerald-500" : "bg-gray-500"}
            >
              {resident.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
            </Badge>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center space-x-2 mt-4">
              <Button onClick={onEdit} className="flex items-center">
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="flex items-center">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(true)}
              className="w-full mt-2 flex items-center justify-center"
            >
              {resident.status === "active" ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Hủy kích hoạt
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Kích hoạt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Họ và tên</h3>
                <p className="mt-1">{resident.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ngày sinh</h3>
                <p className="mt-1">
                  {resident.dob ? format(new Date(resident.dob), "dd/MM/yyyy", { locale: vi }) : "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Số điện thoại</h3>
                <p className="mt-1">{resident.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{resident.email || "Chưa cập nhật"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Căn hộ liên kết</h3>
              <div className="flex flex-wrap gap-2">
                {resident.apartments && resident.apartments.length > 0 ? (
                  resident.apartments.map((apartment: string, index: number) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {apartment}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có căn hộ nào được liên kết</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Thông tin liên hệ khẩn cấp</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs text-gray-500">Tên người liên hệ</h4>
                  <p className="mt-1">{resident.emergencyName || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500">Số điện thoại</h4>
                  <p className="mt-1">{resident.emergencyContact || "Chưa cập nhật"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa cư dân</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa cư dân {resident.name}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resident.status === "active" ? "Xác nhận hủy kích hoạt tài khoản" : "Xác nhận kích hoạt tài khoản"}
            </DialogTitle>
            <DialogDescription>
              {resident.status === "active"
                ? `Bạn có chắc chắn muốn hủy kích hoạt tài khoản của cư dân ${resident.name}?`
                : `Bạn có chắc chắn muốn kích hoạt tài khoản của cư dân ${resident.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleToggleStatus}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
