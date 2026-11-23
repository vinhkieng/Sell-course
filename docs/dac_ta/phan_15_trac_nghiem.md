# PHẦN 15. BÀI TRẮC NGHIỆM (HỌC VIÊN LÀM BÀI)

Làm sau Phần 14.

## 15.1 Mục đích và ai dùng
- Học viên có quyền học làm bài trắc nghiệm, xem điểm, xem đáp án ngay sau khi nộp, làm lại không giới hạn.
- Chủ khóa và admin mở bài trắc nghiệm trên trang học thì thấy câu hỏi kèm nhãn "Đáp án đúng" (giống hộp xem ở Phần 11), không làm bài, không thấy điểm học viên.

## 15.2 Màn thiết kế
- thiet_ke/trac_nghiem/gioi_thieu_chua_lam.html (màn "Trang học - Bài trắc nghiệm (giới thiệu, chưa làm)"): trang giới thiệu khi chưa làm lần nào.
- thiet_ke/trac_nghiem/gioi_thieu_da_lam.html (màn "Trang học - Bài trắc nghiệm (giới thiệu, đã làm)"): trang giới thiệu khi đã có điểm (nút đổi thành "Làm lại").
- thiet_ke/trac_nghiem/dang_lam.html (màn "Trang học - Bài trắc nghiệm (đang làm)"): đang làm bài.
- thiet_ke/trac_nghiem/hoi_lai_khi_nop.html (màn "Trang học - Bài trắc nghiệm (hỏi lại khi nộp)"): hỏi lại khi còn câu chưa làm.
- thiet_ke/trac_nghiem/hoan_thanh.html (màn "Trang học - Bài trắc nghiệm (hoàn thành)"): hộp "Hoàn thành bài tập".
- thiet_ke/trac_nghiem/xem_dap_an.html (màn "Trang học - Bài trắc nghiệm (xem đáp án)"): xem đáp án.

## 15.3 Giao diện và hành vi
- Trang giới thiệu: "06. Tên bài", "N câu, M phút", "Điểm cao nhất: 8,00/10" (chỉ khi đã có điểm), dòng "Đồng hồ bắt đầu chạy khi bạn bấm nút bên dưới. Tắt trang thì thời gian vẫn chạy.", nút "Bắt đầu làm bài" (chưa làm lần nào) hoặc "Làm lại" (đã có điểm). Cột danh sách bài, "Báo cáo bài học này", "Bài tiếp theo" như Phần 14.
- Bấm "Bắt đầu làm bài" hoặc "Làm lại": tạo lượt làm, đồng hồ bắt đầu chạy, chuyển sang trang làm bài.
- Trang làm bài: đầu trang có "Còn lại mm:ss" và "Đã làm x/y câu"; cả bài trên một trang, câu theo so_thu_tu, mỗi câu "Câu 1." kèm nội dung và 4 nút tròn A, B, C, D; nút "Nộp bài" cuối trang; vẫn giữ cột danh sách bài.
- Mỗi lần chọn một lựa chọn, trang gửi ngay lên máy chủ để lưu vào luot_lam_bai.cau_tra_loi (dạng { "1": "A", "3": "C" }, khóa là so_thu_tu của câu). Chọn lại thì ghi đè.
- Bấm "Nộp bài" khi còn câu chưa làm: hộp hỏi "Bạn còn N câu chưa làm. Câu chưa làm sẽ tính là sai. Nộp bài?" với nút "Làm tiếp" và "Nộp bài". Làm hết thì nộp luôn.
- Hết giờ: trang tự nộp. Hộp kết quả thêm dòng "Đã hết giờ, bài được tự nộp." ngay dưới tiêu đề.
- Rời trang hoặc bấm sang bài khác khi đang làm: không hỏi lại, đồng hồ vẫn chạy.
- Mở lại bài trắc nghiệm khi đang có lượt làm:
  - Lượt còn giờ: vào thẳng trang làm bài với các câu đã chọn và đồng hồ chạy tiếp.
  - Lượt đã hết giờ: máy chủ chấm lượt đó theo các câu đã lưu, rồi trang hiện trang giới thiệu kèm hộp "Hoàn thành bài tập" có dòng "Đã hết giờ, bài được tự nộp.".
- Hộp "Hoàn thành bài tập" (nút ✕ ở góc phải để đóng, về trang giới thiệu): "Điểm lần này: 6,00/10", "Đúng 3/5 câu", "Điểm cao nhất: 8,00/10", "Thời gian làm: mm:ss" (tự nộp do hết giờ thì bằng đúng thời gian làm bài), nút "Xem đáp án" bên trái và "Làm lại" bên phải.
- "Xem đáp án": trang liệt kê mọi câu, dòng đầu "Điểm lần này: 6,00/10, đúng 3/5 câu"; lựa chọn đúng tô xanh kèm nhãn "Đáp án đúng"; lựa chọn học viên chọn sai tô đỏ; câu bỏ trống có chữ "Bạn chưa chọn"; nút "Làm lại" cuối trang. Chỉ xem được ngay sau khi nộp: dữ liệu đáp án đi kèm câu trả lời của lần nộp và chỉ giữ trên trang; rời trang là mất, không có đường nào khác để xem lại.
- Nút "Làm lại" (trong hộp kết quả và ở trang xem đáp án): tạo lượt mới và vào thẳng trang làm bài, đồng hồ chạy ngay.

## 15.4 Quy tắc
- Mỗi học viên ở mỗi bài chỉ có một lượt đang làm (luot_lam_bai không trùng id_hoc_vien và id_bai_hoc). Bấm bắt đầu khi đang có lượt còn giờ thì trả lại lượt đó; có lượt đã hết giờ thì chấm lượt đó trước rồi mới tạo lượt mới.
- Thời gian còn lại = thoi_gian_lam_bai (phút) nhân 60 trừ số giây từ thoi_diem_bat_dau tới NOW(), tính ở máy chủ. Trang chỉ hiển thị đồng hồ theo số máy chủ trả về.
- Chấm bài theo các câu trả lời đã lưu trong luot_lam_bai (lệnh nộp không mang theo đáp án; trang phải chờ các lần lưu đang gửi xong rồi mới gửi lệnh nộp). Lưu câu trả lời khi đã hết giờ thì máy chủ từ chối (409) và trang tự nộp.
- Câu chưa làm tính sai. Điểm = số câu đúng chia tổng số câu nhân 10, làm tròn 2 chữ số thập phân (tính bằng số nguyên: Math.round(dung * 1000 / tong) / 100 để tránh sai số).
- Thời gian làm = số giây từ thoi_diem_bat_dau tới lúc nộp, không vượt quá thời gian làm bài.
- Nộp xong, trong một giao dịch: thêm hoặc cập nhật tien_do_hoc (da_hoc_xong = 1, diem_cao_nhat = điểm lớn hơn giữa điểm cũ và điểm lần này, lan_mo_gan_nhat = NOW()), xóa dòng luot_lam_bai. Chỉ lưu điểm cao nhất, không lưu từng lần làm.
- Nộp lần đầu là bài tính học xong, tính vào tiến độ và mốc 30% khi xét hoàn tiền.
- Người cung cấp đăng bản sửa của bài khi học viên đang làm: lượt hết giờ được chấm theo đề cũ rồi xóa; lượt còn giờ bị xóa (Phần 8). Học viên đang làm mà lượt bị xóa thì lần lưu câu trả lời hoặc lần nộp kế tiếp nhận 409 mã LUOT_DA_HUY; trang báo "Bài trắc nghiệm vừa được người cung cấp cập nhật, lượt làm này đã bị hủy. Vui lòng làm lại." rồi về trang giới thiệu.
- Học viên mất quyền học giữa chừng (hoàn tiền, khóa bị gỡ, tài khoản người cung cấp bị khóa): lưu và nộp đều bị từ chối, trang đi theo Phần 14 mục 14.3.

## 15.5 Đường xử lý ở máy chủ (chỉ học viên có quyền học, trừ đường xem của chủ khóa và admin)
- GET /api/bai-hoc/:id/trac-nghiem: thông tin trang giới thiệu (tên, số câu, thời gian, điểm cao nhất), và trạng thái lượt: không có lượt; có lượt còn giờ (kèm câu hỏi không có đáp án đúng, câu đã chọn, số giây còn lại); hoặc lượt vừa được chấm do hết giờ (kèm kết quả như đường nộp).
- POST /api/bai-hoc/:id/lam-bai: bắt đầu hoặc làm lại. Trả câu hỏi (không có đáp án đúng), câu đã chọn, số giây còn lại.
- PUT /api/bai-hoc/:id/lam-bai/cau-tra-loi: nhận { so_thu_tu, lua_chon: "A" | "B" | "C" | "D" }.
- POST /api/bai-hoc/:id/lam-bai/nop: chấm và trả { diem, so_cau_dung, tong_so_cau, diem_cao_nhat, thoi_gian_lam_giay, het_gio, dap_an: [ { so_thu_tu, noi_dung, cac_lua_chon, dap_an_dung, lua_chon_cua_ban } ] }.
- GET /api/khoa-hoc/:id/bai/:idBai/trac-nghiem-xem: chủ khóa và admin xem câu hỏi kèm đáp án (đã có ở Phần 11).
- Máy chủ không bao giờ gửi đáp án đúng cho học viên trước khi bài được nộp.

## 15.6 Bảng dữ liệu dùng
- bai_hoc (loai 'Trắc nghiệm', thoi_gian_lam_bai), cau_hoi_bai_tap, luot_lam_bai, tien_do_hoc.

## 15.7 Câu thông báo
- "Đồng hồ bắt đầu chạy khi bạn bấm nút bên dưới. Tắt trang thì thời gian vẫn chạy."
- "Bạn còn N câu chưa làm. Câu chưa làm sẽ tính là sai. Nộp bài?"
- "Đã hết giờ, bài được tự nộp."
- "Bạn chưa chọn"
- "Bài trắc nghiệm vừa được người cung cấp cập nhật, lượt làm này đã bị hủy. Vui lòng làm lại."

## 15.8 Kiểm tra khi làm xong
- Làm 5 câu đúng 3: điểm 6,00/10; làm lại đúng 2: điểm cao nhất vẫn 6,00/10.
- Bắt đầu làm, chọn 2 câu, đóng trang, mở lại khi còn giờ: thấy đúng 2 câu đã chọn và đồng hồ chạy tiếp.
- Bắt đầu làm, đóng trang, chờ quá thời gian rồi mở lại: hộp kết quả có dòng "Đã hết giờ, bài được tự nộp.", thời gian làm bằng đúng thời gian làm bài.
- Xem mã trang (công cụ của trình duyệt) khi đang làm: không thấy đáp án đúng trong dữ liệu nhận về.
- Người cung cấp đăng bản sửa khi học viên đang làm còn giờ: học viên bấm chọn tiếp thì nhận câu báo lượt đã hủy.
- Chủ khóa mở bài trắc nghiệm trên trang học: thấy đáp án, không có nút làm bài, không có dòng luot_lam_bai nào được tạo.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_15_trac_nghiem.md
