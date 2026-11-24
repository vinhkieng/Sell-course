// Danh mục khóa học (Phần 6 mục 6.6). Menu danh mục công khai ở api/khung.js.
import client from './client.js'

export const layTrangDanhMuc = (trang) => client.get('/quan-tri/danh-muc', { params: { trang } })
export const themDanhMuc = (ten) => client.post('/quan-tri/danh-muc', { ten })
export const doiTenDanhMuc = (id, ten) => client.put(`/quan-tri/danh-muc/${id}`, { ten })
export const xoaDanhMuc = (id) => client.delete(`/quan-tri/danh-muc/${id}`)
export const gopDanhMuc = (ids, tenMoi) => client.post('/quan-tri/danh-muc/gop', { ids, ten_moi: tenMoi })
// Mọi danh mục (id, tên) cho người đã đăng nhập, dùng khi tạo khóa (Phần 7)
export const layTatCaDanhMuc = () => client.get('/danh-muc')
