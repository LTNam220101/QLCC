"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Pencil, Trash2, MoreHorizontal, Power, PowerOff, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const mockResidents = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    apartment: "A1-1201",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "nguyenvana@example.com",
    dob: "1985-05-15",
    apartments: ["A1-1201"],
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    apartment: "B2-0502",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "tranthib@example.com",
    dob: "1990-10-20",
    apartments: ["B2-0502"],
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    apartment: "C3-0803",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "levanc@example.com",
    dob: "1978-03-25",
    apartments: ["C3-0803", "A1-0505"],
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0934567890",
    apartment: "D4-1004",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "phamthid@example.com",
    dob: "1995-12-10",
    apartments: ["D4-1004"],
  },
]

interface ResidentListProps {
  onView: (resident: any) => void
  onEdit: (resident: any) => void
}

export function ResidentList({ onView, onEdit }: ResidentListProps) {
  const [residents, setResidents] = useState(mockResidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [residentToDelete, setResidentToDelete] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleDelete = (resident: any) => {
    setResidentToDelete(resident)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setResidents(residents.filter((r) => r.id !== residentToDelete.id))
    setDeleteDialogOpen(false)
    setResidentToDelete(null)
  }

  const toggleStatus = (resident: any) => {
    setResidents(
      residents.map((r) => {
        if (r.id === resident.id) {
          return { ...r, status: r.status === "active" ? "inactive" : "active" }
        }
        return r
      }),
    )
  }

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch =
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.phone.includes(searchTerm) ||
      resident.apartment.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || resident.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage)
  const paginatedResidents = filteredResidents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Tìm kiếm cư dân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:w-auto w-full">
          <Filter className="mr-2 h-4 w-4" />
          Bộ lọc
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-gray-50">
          <div>
            <label className="text-sm font-medium">Trạng thái</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên cư dân</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Căn hộ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResidents.length > 0 ? (
              paginatedResidents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell className="font-medium">{resident.name}</TableCell>
                  <TableCell>{resident.phone}</TableCell>
                  <TableCell>{resident.apartment}</TableCell>
                  <TableCell>
                    <Badge
                      variant={resident.status === "active" ? "default" : "secondary"}
                      className={resident.status === "active" ? "bg-emerald-500" : "bg-gray-500"}
                    >
                      {resident.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(resident)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(resident)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(resident)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(resident)}>
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
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Không tìm thấy cư dân nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa cư dân</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa cư dân {residentToDelete?.name}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
