// Tính các số trang hiện ở thanh phân trang (components/PhanTrang.jsx).
// Từ 7 trang trở xuống hiện hết; nhiều hơn thì hiện trang đầu, trang cuối và các trang quanh trang đang xem.
// Trả mảng số trang, null là chỗ bị lược (hiện "...").
export function cacSoTrang(trang, soTrang) {
  if (soTrang <= 7) return Array.from({ length: soTrang }, (_, i) => i + 1)
  const hien = new Set([1, soTrang, trang - 1, trang, trang + 1])
  if (trang <= 3) [2, 3].forEach((s) => hien.add(s))
  if (trang >= soTrang - 2) [soTrang - 2, soTrang - 1].forEach((s) => hien.add(s))
  const cacSo = [...hien].filter((s) => s >= 1 && s <= soTrang).sort((a, b) => a - b)
  const ketQua = []
  cacSo.forEach((s, i) => {
    if (i > 0 && s - cacSo[i - 1] > 1) ketQua.push(null)
    ketQua.push(s)
  })
  return ketQua
}

// Dòng mô tả dưới bảng, ví dụ "Hiển thị 1-13 trên 13 danh mục (20 dòng mỗi trang)";
// không có dòng nào thì "Hiển thị 0 danh mục (20 dòng mỗi trang)" (theo thiet_ke/quan_tri_don_hang/)
export function moTaPhanTrang(trang, tong, soDongMoiTrang, donVi) {
  const duoi = `(${soDongMoiTrang} dòng mỗi trang)`
  if (tong === 0) return `Hiển thị 0 ${donVi} ${duoi}`
  const tu = (trang - 1) * soDongMoiTrang + 1
  const den = Math.min(trang * soDongMoiTrang, tong)
  return `Hiển thị ${tu}-${den} trên ${tong} ${donVi} ${duoi}`
}
