// Thanh hai bước ở đầu trang tạo khóa (thiet_ke/tao_khoa_hoc/buoc_1.html, buoc_2_chua_du_3_bai.html).
// Ở bước 1, "2. Bài học" mờ kèm ổ khóa (phải bấm "Tiếp tục" để kiểm bước 1); ở bước 2 bấm "1. Thông tin khóa học" để quay lại.
function ThanhBuoc({ buoc, onVeBuoc1 }) {
  if (buoc === 1) {
    return (
      <div className="tkh-buoc">
        <div className="tkh-buoc-o dang" aria-current="step">1. Thông tin khóa học</div>
        <div className="tkh-buoc-o khoa" aria-disabled="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          2. Bài học
        </div>
      </div>
    )
  }
  return (
    <div className="tkh-buoc">
      <button type="button" className="tkh-buoc-o" onClick={onVeBuoc1}>1. Thông tin khóa học</button>
      <div className="tkh-buoc-o dang" aria-current="step">2. Bài học</div>
    </div>
  )
}

export default ThanhBuoc
