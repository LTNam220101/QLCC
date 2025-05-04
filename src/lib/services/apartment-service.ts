import { getClientToken } from "../../../utils/auth"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const downloadApartmentTemplate = async () => {
  try {
    const token = await getClientToken()
    const response = await fetch(`${apiUrl}/apartment/get-template`, {
      method: "GET",
      headers: new Headers({
        // "content-type": "application/json",
        // Thêm Authorization header nếu token được cung cấp
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      })
    })
    if (!response.ok) {
      throw new Error("Lỗi khi tải file mẫu")
    }

    // Lấy filename từ header Content-Disposition
    const contentDisposition = response.headers.get("Content-Disposition")
    let filename = "mau-can-ho.xlsx"
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=([^;]+)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/"/g, "")
      }
    }

    // Tạo blob từ response
    const blob = await response.blob()

    // Tạo URL cho blob
    const url = window.URL.createObjectURL(blob)

    // Tạo thẻ a để download
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    return true
  } catch (error) {
    console.error("Lỗi khi tải file mẫu:", error)
    throw error
  }
}
