// Phần soạn bài trắc nghiệm ở trang thêm hoặc sửa bài (mục 7.3, 7.4; thiet_ke/tao_khoa_hoc/them_bai_trac_nghiem.html,
// them_bai_trac_nghiem_bao_loi.html): ô "Thời gian làm bài (phút)", các câu tự đánh số theo lúc thêm,
// bốn lựa chọn A, B, C, D và nút tròn chọn đáp án đúng, "+ Thêm câu hỏi" (tối đa 50), thùng rác xóa một câu.
// Dữ liệu nằm ở TrangSoanBai để còn giữ khi đổi qua loại bài khác rồi đổi lại.
// loi: kết quả kiemTraBai (utils/soanKhoaHoc.js).
import {
  CAC_LUA_CHON,
  CAU_HOI_TOI_DA,
  LUA_CHON_TOI_DA,
  SO_CAU_TOI_DA,
  taoCauMoi,
} from '../../../utils/soanKhoaHoc.js'
import OTruong from './OTruong.jsx'

function SoanTracNghiem({ thoiGian, setThoiGian, cauHoi, setCauHoi, loi }) {
  const doiCau = (khoa, o, giaTri) =>
    setCauHoi((ds) => ds.map((c) => (c.khoa === khoa ? { ...c, [o]: giaTri } : c)))

  return (
    <>
      <OTruong
        nhan="Thời gian làm bài (phút)"
        htmlFor="tkh-thoi-gian"
        batBuoc
        loi={loi.thoi_gian_lam_bai}
        goiY={loi.thoi_gian_lam_bai ? undefined : 'Từ 1 đến 180 phút.'}
      >
        <input
          id="tkh-thoi-gian"
          className="tkh-nhap"
          inputMode="numeric"
          maxLength={3}
          value={thoiGian}
          onChange={(e) => setThoiGian(e.target.value.replace(/\D/g, ''))}
        />
      </OTruong>

      <div className="tkh-cac-cau">
        <div className={loi.cau_hoi ? 'co-loi' : undefined}>
          <div className="tkh-cac-cau-dau">
            <b>Câu hỏi</b>
            <span className="tkh-goi-y">{cauHoi.length}/50 câu</span>
          </div>
          {loi.cau_hoi && <span className="tkh-loi tkh-loi-khoi">{loi.cau_hoi}</span>}
        </div>

        {cauHoi.map((cau, i) => {
          const loiCau = loi.cac_cau?.[cau.khoa] ?? {}
          return (
            <div key={cau.khoa} className="tkh-cau">
              <div className="tkh-cau-dau">
                <b>Câu {i + 1}</b>
                <button
                  type="button"
                  className="tkh-nut-xoa-cau"
                  aria-label="Xóa câu hỏi"
                  onClick={() => setCauHoi((ds) => ds.filter((c) => c.khoa !== cau.khoa))}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" /></svg>
                </button>
              </div>

              <OTruong nhan="Nội dung câu hỏi" htmlFor={`tkh-cau-${cau.khoa}`} batBuoc loi={loiCau.noi_dung}>
                <textarea
                  id={`tkh-cau-${cau.khoa}`}
                  className="tkh-nhap"
                  rows={2}
                  maxLength={CAU_HOI_TOI_DA}
                  value={cau.noi_dung}
                  onChange={(e) => doiCau(cau.khoa, 'noi_dung', e.target.value)}
                />
              </OTruong>

              <div className="tkh-lua-chon">
                {CAC_LUA_CHON.map(([chu, o]) => (
                  <div
                    key={o}
                    className={`tkh-lua-chon-dong${loiCau.lua_chon_trong?.includes(o) ? ' co-loi' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`dap-an-${cau.khoa}`}
                      aria-label={`Đáp án đúng ${chu}`}
                      checked={cau.dap_an_dung === chu}
                      onChange={() => doiCau(cau.khoa, 'dap_an_dung', chu)}
                    />
                    <b>{chu}</b>
                    <input
                      className="tkh-nhap"
                      aria-label={`Lựa chọn ${chu} của câu ${i + 1}`}
                      maxLength={LUA_CHON_TOI_DA}
                      value={cau[o]}
                      onChange={(e) => doiCau(cau.khoa, o, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              {loiCau.lua_chon && <span className="tkh-loi">{loiCau.lua_chon}</span>}
              {loiCau.dap_an && <span className="tkh-loi">{loiCau.dap_an}</span>}
              {!loiCau.lua_chon && !loiCau.dap_an && (
                <span className="tkh-goi-y">Chọn nút tròn ở lựa chọn đúng.</span>
              )}
            </div>
          )
        })}

        <div>
          <button
            type="button"
            className="tkh-nut-nho"
            disabled={cauHoi.length >= SO_CAU_TOI_DA}
            onClick={() => setCauHoi((ds) => [...ds, taoCauMoi()])}
          >
            + Thêm câu hỏi
          </button>
        </div>
      </div>
    </>
  )
}

export default SoanTracNghiem
