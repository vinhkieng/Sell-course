// Mục "Thông tin cá nhân" của trang hồ sơ (Phần 5 mục 5.3, 5.4). Kiểu ở TrangHoSo.css.
import { useRef, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.js'
import { useThongBao } from '../../../hooks/useThongBao.js'
import { capNhatHoSo, doiAnhDaiDien } from '../../../api/hoSo.js'
import { VAI_TRO } from '../../../constants/vaiTro.js'
import {
  chuanHoaHoTen,
  homQua,
  kiemTraThongTin,
  ngayHienThiSangLuu,
  ngayLuuSangHienThi,
} from '../../../utils/kiemTraHoSo.js'
import AnhDaiDien from '../../../components/hien_thi/AnhDaiDien.jsx'
import ONhap from '../../../components/bieu_mau/ONhap.jsx'

const ANH_SAI = 'Ảnh phải là jpg hoặc png, tối đa 2MB'

// Giá trị các ô lấy từ hồ sơ đang lưu (nút "Hủy" cũng trả về đây)
const oTuHoSo = (hs) => ({
  ho_ten: hs.ho_ten ?? '',
  gmail: hs.gmail,
  so_dien_thoai: hs.so_dien_thoai ?? '',
  nghe_nghiep: hs.nghe_nghiep ?? '',
  ngay_sinh: ngayLuuSangHienThi(hs.ngay_sinh),
})

function HoSoThongTinCaNhan({ hoSo, setHoSo }) {
  const { taiLai } = useAuth()
  const hienThongBao = useThongBao()
  const [form, setForm] = useState(() => oTuHoSo(hoSo))
  const [loi, setLoi] = useState({})
  const [loiAnh, setLoiAnh] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const oChonAnh = useRef(null)
  const oChonNgay = useRef(null)

  const laHocVien = hoSo.vai_tro === VAI_TRO.HOC_VIEN
  // Người cung cấp đã đăng khóa: không đổi được họ tên, số điện thoại (mục 5.3)
  const khoaHoTen = hoSo.da_dang_khoa_hoc === true
  const doi = (ten, giaTri) => setForm((cu) => ({ ...cu, [ten]: giaTri }))

  async function luu(e) {
    e.preventDefault()
    const loiTruoc = kiemTraThongTin(form, hoSo.vai_tro)
    setLoi(loiTruoc)
    if (Object.keys(loiTruoc).length > 0) return

    setDangGui(true)
    try {
      const moi = await capNhatHoSo({
        ...form,
        ho_ten: chuanHoaHoTen(form.ho_ten),
        ngay_sinh: ngayHienThiSangLuu(form.ngay_sinh),
      })
      setHoSo(moi)
      setForm(oTuHoSo(moi))
      hienThongBao('Đã cập nhật thông tin')
      taiLai() // đầu trang cập nhật tên, chữ cái đầu
    } catch (loiGoi) {
      if (Object.keys(loiGoi.cacO).length > 0) setLoi(loiGoi.cacO)
      else hienThongBao(loiGoi.message, 'loi')
    } finally {
      setDangGui(false)
    }
  }

  function huy() {
    setForm(oTuHoSo(hoSo))
    setLoi({})
  }

  // Chọn file là gửi lên ngay (mục 5.3); kiểm trước loại và dung lượng
  async function chonAnh(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setLoiAnh(ANH_SAI)
      return
    }
    try {
      const { anh_dai_dien: anhMoi } = await doiAnhDaiDien(file)
      setHoSo((cu) => ({ ...cu, anh_dai_dien: anhMoi }))
      setLoiAnh('')
      taiLai() // ảnh mới hiện ngay ở đầu trang
    } catch (loiGoi) {
      setLoiAnh(loiGoi.cacO.anh_dai_dien ?? loiGoi.message)
    }
  }

  // Bộ chọn ngày của trình duyệt chỉ cho chọn từ 01/01/1900 đến hôm qua
  function moLich() {
    try {
      oChonNgay.current?.showPicker()
    } catch {
      // trình duyệt không hỗ trợ thì vẫn gõ tay được
    }
  }

  return (
    <section id="thong-tin-ca-nhan" className="hop ho-so-muc">
      <h2>Thông tin cá nhân</h2>
      <div className="hs-anh">
        <AnhDaiDien nguoiDung={hoSo} co={88} />
        <div className="hs-anh-nut">
          <button type="button" className="hs-nut-phu hs-nut-nho" onClick={() => oChonAnh.current?.click()}>
            Đổi ảnh
          </button>
          <input ref={oChonAnh} type="file" accept="image/jpeg,image/png" hidden onChange={chonAnh} />
          <span className={loiAnh ? 'hs-loi-anh' : 'hs-goi-y-anh'}>{loiAnh || 'JPG hoặc PNG, tối đa 2 MB'}</span>
        </div>
      </div>

      <form onSubmit={luu} noValidate>
        <div className="hs-luoi">
          <ONhap nhan="Tên đăng nhập" value={hoSo.ten_dang_nhap} disabled />
          <ONhap
            nhan="Họ và tên"
            loi={loi.ho_ten}
            placeholder="Họ và tên"
            maxLength={100}
            value={form.ho_ten}
            disabled={khoaHoTen}
            onChange={(e) => doi('ho_ten', e.target.value)}
          />
          <ONhap
            nhan="Gmail"
            loi={loi.gmail}
            type="email"
            placeholder="ten@gmail.com"
            value={form.gmail}
            onChange={(e) => doi('gmail', e.target.value)}
          />
          <ONhap
            nhan="Số điện thoại"
            loi={loi.so_dien_thoai}
            inputMode="numeric"
            placeholder="Số điện thoại"
            maxLength={10}
            value={form.so_dien_thoai}
            disabled={khoaHoTen}
            onChange={(e) => doi('so_dien_thoai', e.target.value)}
          />
          {laHocVien && (
            <>
              <ONhap
                nhan={
                  <span>
                    Nghề nghiệp<span className="hs-khong-bat-buoc">Không bắt buộc</span>
                  </span>
                }
                loi={loi.nghe_nghiep}
                placeholder="Ví dụ: Sinh viên"
                maxLength={100}
                value={form.nghe_nghiep}
                onChange={(e) => doi('nghe_nghiep', e.target.value)}
              />
              <div className={`tk-o${loi.ngay_sinh ? ' co-loi' : ''}`}>
                <label htmlFor="hs-ngay-sinh">
                  Ngày sinh<span className="hs-khong-bat-buoc">Không bắt buộc</span>
                </label>
                <div className="hs-ngay">
                  <input
                    id="hs-ngay-sinh"
                    className="tk-o-nhap"
                    placeholder="dd/mm/yyyy"
                    maxLength={10}
                    value={form.ngay_sinh}
                    onChange={(e) => doi('ngay_sinh', e.target.value)}
                  />
                  <button type="button" className="hs-nut-lich" aria-label="Chọn ngày sinh" onClick={moLich}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
                  </button>
                  <input
                    ref={oChonNgay}
                    type="date"
                    className="hs-chon-ngay"
                    tabIndex={-1}
                    aria-hidden="true"
                    min="1900-01-01"
                    max={homQua()}
                    value={ngayHienThiSangLuu(form.ngay_sinh) || ''}
                    onChange={(e) => doi('ngay_sinh', ngayLuuSangHienThi(e.target.value))}
                  />
                </div>
                {loi.ngay_sinh && <span className="tk-goi-y loi">{loi.ngay_sinh}</span>}
              </div>
            </>
          )}
        </div>
        {khoaHoTen && (
          <p className="hs-ghi-chu">Đã đăng khóa học nên không đổi được họ tên và số điện thoại.</p>
        )}
        <div className="hs-hang-nut">
          <button type="submit" className="hs-nut-chinh" disabled={dangGui}>Lưu thay đổi</button>
          <button type="button" className="hs-nut-phu" onClick={huy}>Hủy</button>
        </div>
      </form>
    </section>
  )
}

export default HoSoThongTinCaNhan
