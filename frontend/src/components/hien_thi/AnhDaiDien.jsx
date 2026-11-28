// Ảnh đại diện tròn: có ảnh thì hiện ảnh, chưa có thì hiện chữ cái đầu in hoa (Phần chung C9)
import { layChuCaiDau } from '../../utils/dinhDang.js'

function AnhDaiDien({ nguoiDung, co = 44 }) {
  // Cỡ chữ theo thiết kế: ảnh 88px (hồ sơ) chữ 34px, 44 và 48px chữ 18px, 40px chữ 16px
  const kichThuoc = { width: co, height: co, fontSize: co >= 88 ? 34 : co >= 44 ? 18 : 16 }
  if (nguoiDung.anh_dai_dien) {
    return <img className="anh-dai-dien" src={nguoiDung.anh_dai_dien} alt="" style={kichThuoc} />
  }
  return (
    <span className="anh-dai-dien" style={kichThuoc}>
      {layChuCaiDau(nguoiDung.ho_ten, nguoiDung.ten_dang_nhap)}
    </span>
  )
}

export default AnhDaiDien
