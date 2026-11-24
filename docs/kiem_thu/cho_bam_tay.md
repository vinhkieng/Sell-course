# Danh sách bấm tay còn chờ

File này theo dõi các trường hợp "Cách kiểm: Bấm tay" chưa kiểm được trọn vì cần trang hoặc dữ liệu của phần làm sau. Mã trường hợp tra trong docs/kiem_thu/phan_XX_<tên>.md.

Cách cập nhật (Claude Code làm mỗi khi xong một phần):
- Thêm vào đúng nhóm "Chờ Phần N" các trường hợp bấm tay của phần vừa làm mà chưa kiểm được trọn.
- Xem lại mọi trường hợp trong file: trường hợp nào nay đã kiểm được nhờ phần vừa làm thì đưa vào hướng dẫn bấm tay của lần đó và chuyển xuống nhóm "Đã kiểm được, chờ người dùng báo đạt".
- Chỉ xóa một trường hợp khỏi file sau khi người dùng báo đã kiểm đạt.
- Nhóm nào hết trường hợp thì xóa luôn tiêu đề nhóm đó.

Đã soát sau: Phần 6. Phần 6: thêm phần cần khóa học của P06-12 vào nhóm chờ Phần 7 (phần còn lại kiểm được ngay); không mở khóa trường hợp nào (P01-16, P01-18 vẫn cần khóa đang bán của Phần 7); P01-19 cần kiểm thêm trang /quan-tri/danh-muc (không có chân trang). Phần 4: không có trường hợp phải chờ, không trường hợp nào được mở khóa; P01-19 đã kiểm đạt cho các trang tới hết Phần 4. Phần 5: P03-28 đã kiểm đạt; thêm P05-17 vào nhóm chờ Phần 7; P01-19 đã kiểm đạt cho trang /ho-so (học viên, người cung cấp có chân trang, admin không có).

## Chờ Phần 7 (có khóa học đang bán)
| Mã | Tên ngắn | Việc cần làm khi tới lúc |
| --- | --- | --- |
| P01-16 | Menu "Danh mục" (phần bấm danh mục) | Tạo khóa đang bán ở 2 danh mục, có 1 danh mục chỉ có khóa bị ẩn: menu chỉ hiện 2 danh mục theo thứ tự tên; bấm một danh mục mở /khoa-hoc?danh_muc=<id>. Phần ô tìm kiếm và "Xem tất cả khóa học" đã kiểm được từ Phần 1. |
| P01-18 | Cột "Danh mục" ở chân trang | Có 6 danh mục có khóa đang bán với số khóa khác nhau: cột "Danh mục" hiện đúng 5 danh mục nhiều khóa nhất, bằng nhau thì theo tên. Các mục khác của chân trang đã kiểm được từ Phần 1. |
| P06-12 | Trang quản trị danh mục (phần cần khóa học) | Có danh mục chứa khóa (Phần 7): cột "Số khóa" đúng; nút "Xóa" của danh mục đó mờ, rê chuột hiện "Danh mục đang có N khóa học"; gộp danh mục có khóa thì khóa chuyển sang danh mục mới (lịch sử xem ở Phần 19). Phần còn lại của P06-12 đã kiểm được từ Phần 6. |
| P05-17 | Người cung cấp đã đăng khóa thấy ô mờ | Người cung cấp tạo và đăng một khóa (Phần 7), mở /ho-so: ô Họ và tên, Số điện thoại mờ kèm dòng "Đã đăng khóa học nên không đổi được họ tên và số điện thoại." Phía máy chủ đã có kiểm thử tự động P05-07. |

## Chờ Phần 11 hoặc 12 (phần đầu tiên có thông báo sau khi chuyển trang)
| Mã | Tên ngắn | Việc cần làm khi tới lúc |
| --- | --- | --- |
| P01-23 | Ô thông báo nhỏ | Làm thao tác có thông báo (ví dụ "Đã thêm vào giỏ hàng") rồi chuyển trang: ô nhỏ hiện ở góc dưới phải, tự tắt sau khoảng 5 giây, vẫn hiện ở trang mới. |

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