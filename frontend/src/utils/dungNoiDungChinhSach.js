// Đổi chữ nội dung một điều chính sách thành các khối theo luật gõ ở Phần 24 mục 24.4.
// Dùng cho trang Chính sách (Phần 1) và khung "Xem trước" (Phần 24).
// Kết quả là mảng khối:
//   { loai: 'tieu-de', chu }                 dòng "## ..."
//   { loai: 'doan', chu }                    đoạn văn
//   { loai: 'ds-so', muc: [{ so, chu, con }] } các khoản "1. ..."
//   { loai: 'ds-gach', muc: [{ chu, con }] }   các gạch đầu dòng "- ..."
// con của một mục, giữ đúng thứ tự gõ: { loai: 'gach', muc: [chữ...] } (các gạch con liền nhau)
// hoặc { loai: 'doan', chu } (đoạn thụt vào).
export function dungNoiDungChinhSach(noiDung) {
  const khoi = []
  let doanDangGo = null // đoạn đang nối các dòng liền nhau
  let mucCuoi = null // khoản hoặc gạch đầu dòng gần nhất, nơi gắn gạch con và đoạn thụt vào

  const themMuc = (loai, muc) => {
    const cuoi = khoi[khoi.length - 1]
    if (cuoi?.loai === loai) cuoi.muc.push(muc)
    else khoi.push({ loai, muc: [muc] })
    mucCuoi = muc
    doanDangGo = null
  }

  for (const dong of noiDung.split(/\r?\n/)) {
    let m
    if (dong.trim() === '') {
      doanDangGo = null
      mucCuoi = null
    } else if ((m = dong.match(/^## (.*)$/))) {
      khoi.push({ loai: 'tieu-de', chu: m[1].trim() })
      doanDangGo = null
      mucCuoi = null
    } else if ((m = dong.match(/^(\d+)\. (.*)$/))) {
      themMuc('ds-so', { so: Number(m[1]), chu: m[2].trim(), con: [] })
    } else if ((m = dong.match(/^- (.*)$/))) {
      themMuc('ds-gach', { chu: m[1].trim(), con: [] })
    } else if ((m = dong.match(/^ {2}- (.*)$/)) && mucCuoi) {
      const cuoi = mucCuoi.con[mucCuoi.con.length - 1]
      if (cuoi?.loai === 'gach') cuoi.muc.push(m[1].trim())
      else mucCuoi.con.push({ loai: 'gach', muc: [m[1].trim()] })
    } else if (dong.startsWith('  ') && mucCuoi) {
      mucCuoi.con.push({ loai: 'doan', chu: dong.trim() })
    } else if (doanDangGo) {
      doanDangGo.chu += ` ${dong.trim()}`
    } else {
      doanDangGo = { loai: 'doan', chu: dong.trim() }
      khoi.push(doanDangGo)
      mucCuoi = null
    }
  }
  return khoi
}
