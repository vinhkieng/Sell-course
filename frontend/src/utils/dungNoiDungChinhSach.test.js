// Kiểm luật gõ nội dung chính sách (Phần 24 mục 24.4), dùng ở trang Chính sách Phần 1.
import { expect, test } from 'vitest'
import { dungNoiDungChinhSach } from './dungNoiDungChinhSach.js'

test('Khoản đánh số, gạch con và đoạn thụt vào (như Điều 8 khoản 3)', () => {
  const noiDung = '3. Mỗi lần ẩn gồm:\n  - quản trị viên ẩn;\n  - hệ thống ẩn.\n  Tự ẩn thì không tính.\n4. Lần hai.'
  expect(dungNoiDungChinhSach(noiDung)).toEqual([
    {
      loai: 'ds-so',
      muc: [
        {
          so: 3,
          chu: 'Mỗi lần ẩn gồm:',
          con: [
            { loai: 'gach', muc: ['quản trị viên ẩn;', 'hệ thống ẩn.'] },
            { loai: 'doan', chu: 'Tự ẩn thì không tính.' },
          ],
        },
        { so: 4, chu: 'Lần hai.', con: [] },
      ],
    },
  ])
})

test('Tiêu đề nhỏ, đoạn nối dòng, gạch đầu dòng và "1.000" không phải khoản', () => {
  const noiDung = '## 7.1. Đăng khóa học\n\nDòng một\ndòng hai\n\n- gạch\n1.000 học viên'
  expect(dungNoiDungChinhSach(noiDung)).toEqual([
    { loai: 'tieu-de', chu: '7.1. Đăng khóa học' },
    { loai: 'doan', chu: 'Dòng một dòng hai' },
    { loai: 'ds-gach', muc: [{ chu: 'gạch', con: [] }] },
    { loai: 'doan', chu: '1.000 học viên' },
  ])
})
