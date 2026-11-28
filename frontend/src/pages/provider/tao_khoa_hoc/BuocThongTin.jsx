// Bước 1 "Thông tin khóa học" (mục 7.3, thiet_ke/tao_khoa_hoc/buoc_1.html, buoc_1_bao_loi.html).
// Dữ liệu và lỗi nằm ở trang cha (TrangTaoKhoaHoc) để còn giữ khi sang bước 2 rồi quay lại.
// lanBaoLoi tăng mỗi lần trang cha báo lỗi: cuộn tới ô lỗi đầu tiên.
import { useEffect } from 'react'
import {
  DANH_MUC_DA_CO,
  DANH_MUC_KHAC,
  TEN_TOI_DA,
  dinhDangGiaKhiGo,
  laTrungDanhMuc,
  soKyTu,
} from '../../../utils/soanKhoaHoc.js'
import OTruong from './OTruong.jsx'
import ChonAnhBia from './ChonAnhBia.jsx'

const BA_O_DAI = [
  ['hoc_duoc_gi', 'Bạn sẽ học được gì', 'Ví dụ:\nBiết dựng một trang web hoàn chỉnh\nHiểu cách dùng HTML và CSS'],
  ['yeu_cau', 'Yêu cầu trước khi học', 'Ví dụ:\nBiết dùng máy tính cơ bản'],
  ['danh_cho_ai', 'Dành cho ai', 'Ví dụ:\nNgười mới bắt đầu'],
]

function BuocThongTin({ thongTin, doi, loi, setLoi, lanBaoLoi, danhMuc, anhBia, setAnhBia, onTiepTuc, onHuy }) {
  useEffect(() => {
    if (lanBaoLoi) document.querySelector('.tkh-o.co-loi')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [lanBaoLoi])

  const laKhac = thongTin.id_danh_muc === DANH_MUC_KHAC

  // Tên danh mục mới trùng danh mục có sẵn thì báo ngay khi gõ (mục 7.3)
  function kiemTrungDanhMuc(ten) {
    setLoi((cu) => ({ ...cu, ten_danh_muc_moi: ten.trim() && laTrungDanhMuc(ten, danhMuc) ? DANH_MUC_DA_CO : '' }))
  }

  return (
    <div className="hop tkh-hop">
      <div className="tkh-form">
        <OTruong
          nhan="Tên khóa học"
          htmlFor="tkh-ten"
          batBuoc
          phu={`${soKyTu(thongTin.ten_khoa_hoc)}/200 ký tự`}
          loi={loi.ten_khoa_hoc}
        >
          <input
            id="tkh-ten"
            className="tkh-nhap"
            placeholder="Ví dụ: Lập trình web từ con số 0"
            maxLength={TEN_TOI_DA}
            value={thongTin.ten_khoa_hoc}
            onChange={(e) => doi('ten_khoa_hoc', e.target.value)}
          />
        </OTruong>

        <OTruong nhan="Mô tả" htmlFor="tkh-mo-ta" batBuoc loi={loi.mo_ta}>
          <textarea
            id="tkh-mo-ta"
            className="tkh-nhap"
            rows={5}
            placeholder="Giới thiệu ngắn gọn về nội dung và lợi ích của khóa học"
            value={thongTin.mo_ta}
            onChange={(e) => doi('mo_ta', e.target.value)}
          />
        </OTruong>

        <OTruong nhan="Danh mục" htmlFor="tkh-danh-muc" batBuoc loi={loi.id_danh_muc}>
          <select
            id="tkh-danh-muc"
            className="tkh-nhap tkh-chon"
            value={thongTin.id_danh_muc}
            onChange={(e) => {
              doi('id_danh_muc', e.target.value)
              if (e.target.value === DANH_MUC_KHAC) kiemTrungDanhMuc(thongTin.ten_danh_muc_moi)
            }}
          >
            <option value="" disabled>Chọn danh mục</option>
            {danhMuc.map((dm) => (
              <option key={dm.id} value={String(dm.id)}>{dm.ten}</option>
            ))}
            <option value={DANH_MUC_KHAC}>Khác</option>
          </select>
        </OTruong>

        {laKhac && (
          <div className="tkh-danh-muc-moi">
            <OTruong
              nhan="Tên danh mục mới"
              htmlFor="tkh-danh-muc-moi"
              batBuoc
              loi={loi.ten_danh_muc_moi}
              goiY="2-50 ký tự; gồm chữ có dấu hoặc không dấu, chữ số, khoảng trắng và các ký tự + # . / -."
            >
              <input
                id="tkh-danh-muc-moi"
                className="tkh-nhap"
                placeholder="Ví dụ: Nấu Ăn"
                maxLength={200}
                value={thongTin.ten_danh_muc_moi}
                onChange={(e) => {
                  doi('ten_danh_muc_moi', e.target.value)
                  kiemTrungDanhMuc(e.target.value)
                }}
              />
            </OTruong>
          </div>
        )}

        <OTruong
          nhan="Giá bán (VND)"
          htmlFor="tkh-gia"
          batBuoc
          loi={loi.gia_ban}
          goiY="Từ 10.000đ đến 50.000.000đ."
        >
          <input
            id="tkh-gia"
            className="tkh-nhap"
            inputMode="numeric"
            placeholder="Từ 10.000 đến 50.000.000"
            maxLength={15}
            value={thongTin.gia_ban}
            onChange={(e) => doi('gia_ban', dinhDangGiaKhiGo(e.target.value))}
          />
        </OTruong>
        <p className="tkh-goi-y">Bạn nhận 60% giá bán, hoặc 90% khi học viên mua qua link giới thiệu của bạn.</p>

        {BA_O_DAI.map(([ten, nhan, goiY]) => (
          <OTruong key={ten} nhan={nhan} htmlFor={`tkh-${ten}`} phu="Mỗi dòng một ý" loi={loi[ten]}>
            <textarea
              id={`tkh-${ten}`}
              className="tkh-nhap"
              rows={4}
              placeholder={goiY}
              value={thongTin[ten]}
              onChange={(e) => doi(ten, e.target.value)}
            />
          </OTruong>
        ))}

        <ChonAnhBia
          anhBia={anhBia}
          setAnhBia={setAnhBia}
          loi={loi.anh_bia}
          datLoi={(cau) => setLoi((cu) => ({ ...cu, anh_bia: cau }))}
        />

        <div className="tkh-hang-nut">
          <button type="button" className="nut-dam tkh-nut-lon" onClick={onTiepTuc} disabled={anhBia?.dangTai}>
            Tiếp tục
          </button>
          <button type="button" className="nut-vien tkh-nut-lon" onClick={onHuy}>Hủy</button>
        </div>
      </div>
    </div>
  )
}

export default BuocThongTin
