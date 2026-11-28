// Một ô của form tạo khóa (.fd trong thiet_ke/tao_khoa_hoc/): nhãn (kèm dấu * và chữ nhỏ bên cạnh),
// ô nhập, chữ lỗi đỏ rồi chữ gợi ý bên dưới. Kiểu ở TrangTaoKhoaHoc.css.
function OTruong({ nhan, htmlFor, batBuoc = false, phu, loi, goiY, children }) {
  return (
    <div className={`tkh-o${loi ? ' co-loi' : ''}`}>
      <label className="tkh-nhan" htmlFor={htmlFor}>
        {nhan}
        {batBuoc && <i>*</i>}
        {phu && <span>{phu}</span>}
      </label>
      {children}
      {loi && <span className="tkh-loi">{loi}</span>}
      {goiY && <span className="tkh-goi-y">{goiY}</span>}
    </div>
  )
}

export default OTruong
