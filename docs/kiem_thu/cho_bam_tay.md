# Danh sách bấm tay còn chờ

File này theo dõi các trường hợp "Cách kiểm: Bấm tay" chưa kiểm được trọn vì cần trang hoặc dữ liệu của phần làm sau. Mã trường hợp tra trong docs/kiem_thu/phan_XX_<tên>.md.

Cách cập nhật (Claude Code làm mỗi khi xong một phần):
- Thêm vào đúng nhóm "Chờ Phần N" các trường hợp bấm tay của phần vừa làm mà chưa kiểm được trọn.
- Xem lại mọi trường hợp trong file: trường hợp nào nay đã kiểm được nhờ phần vừa làm thì đưa vào hướng dẫn bấm tay của lần đó và chuyển xuống nhóm "Đã kiểm được, chờ người dùng báo đạt".
- Chỉ xóa một trường hợp khỏi file sau khi người dùng báo đã kiểm đạt.
- Nhóm nào hết trường hợp thì xóa luôn tiêu đề nhóm đó.

Đã soát sau: Phần 7 đợt 3. Người dùng đã báo đạt bấm tay đợt 3: P07-25, P07-27 (phần trắc nghiệm) và đăng thử khóa có bài trắc nghiệm (P07-28). Phần 7 đợt 3: phần trắc nghiệm của P07-25, P07-27 nay kiểm được, chuyển xuống nhóm chờ báo đạt; không thêm trường hợp chờ mới; P01-19 không có trang mới (trang soạn bài trắc nghiệm vẫn là /nguoi-cung-cap/tao-khoa-hoc). Phần 7 đợt 2. Người dùng đã báo đạt bấm tay đợt 2: P07-23 đến P07-29 (phần video và tài liệu), P05-17, P01-23, P06-12 (phần cần khóa học), P01-18, P01-16 (phần menu Danh mục), P01-19 cho trang tạo khóa. Phần 7 đợt 2: mở khóa P05-17, P01-18, phần cần khóa học của P06-12 (trừ dòng lịch sử gộp, chờ Phần 19), phần menu của P01-16 (trừ "danh mục chỉ có khóa bị ẩn", chờ Phần 8); P01-23 (ô "Đã đăng khóa học" hiện sau khi chuyển về hồ sơ); thêm phần trắc nghiệm của P07-25, P07-27 vào nhóm chờ Phần 7 đợt 3; P01-19 cần kiểm thêm trang /nguoi-cung-cap/tao-khoa-hoc (có chân trang, cả lúc thêm và sửa bài). Phần 6: thêm phần cần khóa học của P06-12 vào nhóm chờ Phần 7 (phần còn lại kiểm được ngay); không mở khóa trường hợp nào (P01-16, P01-18 vẫn cần khóa đang bán của Phần 7); P01-19 cần kiểm thêm trang /quan-tri/danh-muc (không có chân trang). Phần 4: không có trường hợp phải chờ, không trường hợp nào được mở khóa; P01-19 đã kiểm đạt cho các trang tới hết Phần 4. Phần 5: P03-28 đã kiểm đạt; thêm P05-17 vào nhóm chờ Phần 7; P01-19 đã kiểm đạt cho trang /ho-so (học viên, người cung cấp có chân trang, admin không có).

## Chờ Phần 8 (ẩn khóa học)
| Mã | Tên ngắn | Việc cần làm khi tới lúc |
| --- | --- | --- |
| P01-16 | Menu "Danh mục" (phần khóa bị ẩn) | Có một danh mục chỉ có khóa bị ẩn: menu không hiện danh mục đó. Phần còn lại của P01-16 đã kiểm đạt ở Phần 7. |

## Chờ Phần 19 (lịch sử khóa học)
| Mã | Tên ngắn | Việc cần làm khi tới lúc |
| --- | --- | --- |
| P06-12 | Dòng lịch sử khi gộp danh mục | Gộp danh mục có khóa: xem lịch sử của khóa ở /quan-tri/khoa-hoc/:id có dòng đổi danh mục. Phần còn lại của P06-12 đã kiểm đạt ở Phần 7. |

## Chờ Phần 12 (giỏ hàng)
| Mã | Tên ngắn | Việc cần làm khi tới lúc |
| --- | --- | --- |
| P03-23 | Đăng nhập từ nút Mua (phần đi tiếp) | Khách bấm "Mua" hoặc "Mua ngay", đăng nhập ở /dang-nhap?tu=mua: đi tiếp theo Phần 12 mục 12.3 (gộp giỏ tạm). Phần hiển thị dòng vàng và các lỗi đã kiểm được từ Phần 3. |

## Kiểm lại mỗi khi làm xong một phần có trang mới
| Mã | Tên ngắn | Việc cần làm khi tới lúc |
| --- | --- | --- |
| P01-19 | Trang có và không có chân trang | Mở các trang mới của phần vừa làm: đúng danh sách có hoặc không có chân trang ở Phần chung C9. Giữ dòng này tới khi làm xong mọi phần có trang. |

## Đã kiểm được, chờ người dùng báo đạt
Các trường hợp này trước đây chờ phần sau và đã có trong hướng dẫn bấm tay của phần mở khóa chúng (ghi ở cột Ghi chú nếu không phải Phần 3).

| Mã | Tên ngắn | Ghi chú |
| --- | --- | --- |
| P01-06 | Bị khóa hoặc đăng nhập nơi khác thì về trang đăng nhập | Trường hợp đăng nhập nơi khác kiểm cùng P03-25. |
| P01-14 | Đầu trang theo bốn kiểu người xem | |
| P01-15 | Ảnh đại diện khi chưa có ảnh | Từ Phần 5 điền họ tên ở trang hồ sơ, không cần phpMyAdmin. |
| P01-17 | Logo về trang chủ (admin ở khu quản trị) | Phần khách ở /chinh-sach đã kiểm từ Phần 1. |
| P01-21 | Trang 403 hiện tại chỗ | |
| P01-22 | Khung khu quản trị | |
| P01-28 | Khu quản trị ở ba độ rộng | Trang Chính sách, 404 ở ba độ rộng đã kiểm từ Phần 1. |
| P02-19 | Đăng ký thành công (phần còn lại) | |
| P02-20 | Người đã đăng nhập mở trang đăng ký | |
