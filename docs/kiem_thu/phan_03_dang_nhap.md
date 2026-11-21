# Danh sách kiểm thử Phần 3. Đăng nhập, xác nhận địa chỉ mạng, đăng xuất

- Đặc tả: docs/dac_ta/phan_03_dang_nhap.md
- Code kiểm thử tự động: backend/tests/phan_03_dang_nhap.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: học viên "hv01" (gmail "hv01@gmail.com", mật khẩu "123456", dia_chi_ip trống); người cung cấp "ncc01"; admin kiểm thử có sẵn. Muốn giả địa chỉ IP thì gửi tiêu đề X-Forwarded-For (máy chủ tin máy trung gian loopback, Phần chung C4). Email dùng hộp thư giả: kiểm thử đọc được thư đã "gửi".
- Bộ đếm sai mật khẩu nằm trong bộ nhớ: mỗi trường hợp cần bộ đếm sạch thì dùng tên đăng nhập và địa chỉ IP riêng.

## P03-01 Học viên đăng nhập lần đầu
- Mục tiêu: lần đầu không hỏi mã, lưu địa chỉ IP.
- Dữ liệu: hv01, dia_chi_ip trống, IP 127.0.0.1.
- Các bước: gọi POST /api/tai-khoan/dang-nhap với "hv01", "123456".
- Kết quả mong đợi: 200 kèm thông tin người dùng, có cookie ava_phien (httpOnly, SameSite=Lax); hoc_vien.dia_chi_ip = "127.0.0.1"; không có thư nào trong hộp thư giả.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 bước 5, 6; mục 3.8

## P03-02 Tên đăng nhập không phân biệt hoa thường
- Mục tiêu: "HV01" đăng nhập được tài khoản "hv01".
- Dữ liệu: hv01 đã có địa chỉ 127.0.0.1.
- Các bước: đăng nhập với "HV01", "123456" từ 127.0.0.1.
- Kết quả mong đợi: 200, có phiên.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 bước 3

## P03-03 Để trống và mật khẩu sai định dạng
- Mục tiêu: lỗi bước 1 trả 400, không tính lần sai.
- Dữ liệu: tên trống; mật khẩu trống; mật khẩu "12345".
- Các bước: gọi POST /api/tai-khoan/dang-nhap với từng bộ.
- Kết quả mong đợi: 400 với "Vui lòng nhập tên đăng nhập", "Vui lòng nhập mật khẩu", "Mật khẩu phải gồm đúng 6 chữ số"; bộ đếm sai không tăng.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 bước 1; mục 3.7

## P03-04 Sai tên hoặc sai mật khẩu cùng một câu
- Mục tiêu: không lộ tên đăng nhập có tồn tại hay không.
- Dữ liệu: "khongcoai", "123456"; "hv01", "000000".
- Các bước: gọi POST /api/tai-khoan/dang-nhap với từng bộ.
- Kết quả mong đợi: cả hai 400, cùng câu "Tên đăng nhập hoặc mật khẩu không đúng".
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 bước 3; mục 3.7

## P03-05 Sai 5 lần liên tiếp thì chặn tên 5 phút
- Mục tiêu: chặn theo tên đăng nhập, kể cả khi sau đó nhập đúng.
- Dữ liệu: học viên "hv05", mật khẩu đúng "123456".
- Các bước: đăng nhập sai 5 lần, rồi đăng nhập đúng.
- Kết quả mong đợi: 5 lần đầu 400; lần đúng trả 429 với "Bạn đã nhập sai nhiều lần, vui lòng thử lại sau 5 phút"; không tạo phiên.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 bước 2, giới hạn sai; mục 3.7, 3.8

## P03-06 Chặn theo tên không phân biệt hoa thường
- Mục tiêu: bộ đếm tính theo tên viết thường.
- Dữ liệu: "hv06".
- Các bước: sai 3 lần với "HV06", sai 2 lần với "hv06", rồi đăng nhập đúng với "hv06".
- Kết quả mong đợi: lần đúng bị 429 (đã đủ 5 lần sai).
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 bước 2

## P03-07 Đăng nhập đúng đặt lại số lần sai về 0
- Mục tiêu: sai liên tiếp chỉ tính khi chưa có lần đúng xen giữa.
- Dữ liệu: "hv07".
- Các bước: sai 4 lần, đúng 1 lần, sai 4 lần, rồi đúng.
- Kết quả mong đợi: lần cuối 200 (không bị chặn).
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 bước 6, giới hạn sai

## P03-08 Chặn theo địa chỉ IP
- Mục tiêu: một IP sai 20 lần trong 15 phút thì bị chặn 15 phút.
- Dữ liệu: IP 10.9.9.9; dùng nhiều tên đăng nhập khác nhau để không chạm giới hạn theo tên.
- Các bước: gửi 20 lần sai từ 10.9.9.9; rồi đăng nhập đúng một tài khoản khác từ 10.9.9.9; rồi đăng nhập đúng tài khoản đó từ IP khác.
- Kết quả mong đợi: lần thứ 21 trả 429 với "Bạn đã nhập sai nhiều lần, vui lòng thử lại sau 15 phút"; từ IP khác thì đăng nhập được.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 giới hạn sai; mục 3.7; Phần chung C13

## P03-09 Tài khoản bị khóa, mật khẩu đúng
- Mục tiêu: câu bị khóa chỉ hiện khi mật khẩu đúng.
- Dữ liệu: học viên "hv09" có khoa = 1, ly_do_khoa "Chia sẻ tài khoản".
- Các bước: đăng nhập sai mật khẩu; rồi đăng nhập đúng mật khẩu.
- Kết quả mong đợi: lần sai 400 "Tên đăng nhập hoặc mật khẩu không đúng"; lần đúng 401, ma "TAI_KHOAN_BI_KHOA", câu "Tài khoản đã bị khóa. Lý do: Chia sẻ tài khoản. Liên hệ hỗ trợ nếu bạn cho rằng có nhầm lẫn."; không có phiên.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 bước 4; mục 3.5, 3.7

## P03-10 Học viên đăng nhập từ địa chỉ mới phải xác nhận
- Mục tiêu: địa chỉ khác thì gửi mã, chưa có phiên.
- Dữ liệu: hv01 có dia_chi_ip 127.0.0.1; IP mới 192.168.1.20.
- Các bước: đăng nhập đúng từ 192.168.1.20.
- Kết quả mong đợi: 200 với { "can_xac_nhan": true, "gmail_che": "h***@gmail.com", "giay_cho_gui_lai": 60 }; không có cookie ava_phien; có cookie ava_cho_xac_nhan (có chữ ký, httpOnly); có đúng một dòng xac_minh_ip của hv01 với dia_chi_ip_moi "192.168.1.20", so_lan_nhap_ma_sai 0, ma_xac_minh_da_bam không phải mã thô; hộp thư giả có một thư tới "hv01@gmail.com", tiêu đề "Mã xác nhận đăng nhập AVA", nội dung đúng câu ở mục 3.4 kèm mã 6 chữ số.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4, 3.5

## P03-11 Nhập đúng mã
- Mục tiêu: xác nhận xong thì lưu IP mới và tạo phiên.
- Dữ liệu: tiếp P03-10, lấy mã trong hộp thư giả.
- Các bước: gọi POST /api/tai-khoan/xac-nhan-dang-nhap kèm cookie tạm và mã đúng.
- Kết quả mong đợi: 200 kèm thông tin người dùng, có cookie ava_phien; hoc_vien.dia_chi_ip = "192.168.1.20"; dòng xac_minh_ip bị xóa; cookie tạm bị xóa.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4, 3.5

## P03-12 Phiên ở nơi cũ bị đẩy ra
- Mục tiêu: sau khi xác nhận ở nơi mới, phiên cũ hết hiệu lực ở lần gọi kế tiếp.
- Dữ liệu: phiên cũ của hv01 ghi IP 127.0.0.1 (lấy ở P03-01), sau P03-11.
- Các bước: gọi GET /api/tai-khoan/toi bằng phiên cũ.
- Kết quả mong đợi: 401, ma "DANG_NHAP_NOI_KHAC".
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4; Phần chung C4

## P03-13 Mã sai, sai đủ 5 lần
- Mục tiêu: đếm lần sai mã và khóa mã ở lần thứ 5.
- Dữ liệu: một lượt chờ xác nhận mới.
- Các bước: gửi mã sai 5 lần; rồi gửi mã đúng.
- Kết quả mong đợi: lần 1 đến 4 báo "Mã xác nhận không đúng." và so_lan_nhap_ma_sai tăng dần; lần 5 báo "Bạn đã nhập sai quá nhiều lần, vui lòng bấm Gửi lại mã."; lần gửi mã đúng sau đó vẫn báo sai quá nhiều lần, không tạo phiên. Các lần sai mã không làm tăng bộ đếm sai mật khẩu.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4, 3.5, 3.7

## P03-14 Mã hết hạn sau 10 phút
- Mục tiêu: mã quá 10 phút thì báo hết hạn.
- Dữ liệu: lượt chờ xác nhận; sửa thoi_diem_gui_ma lùi 11 phút trong database.
- Các bước: gửi mã đúng.
- Kết quả mong đợi: báo "Mã đã hết hạn, vui lòng bấm Gửi lại mã."; không tạo phiên.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4, 3.5, 3.7

## P03-15 Không có cookie tạm
- Mục tiêu: xác nhận mà không có lượt chờ thì trả 400.
- Dữ liệu: không có cookie ava_cho_xac_nhan (hoặc cookie bị sửa chữ ký).
- Các bước: gọi POST /api/tai-khoan/xac-nhan-dang-nhap.
- Kết quả mong đợi: 400.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.5

## P03-16 Gửi lại mã trước 60 giây
- Mục tiêu: phải đợi 60 giây kể từ lần gửi gần nhất.
- Dữ liệu: lượt chờ vừa gửi mã.
- Các bước: gọi POST /api/tai-khoan/gui-lai-ma-dang-nhap ngay.
- Kết quả mong đợi: 429 kèm số giây còn lại (lớn hơn 0, không quá 60); không gửi thư mới.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4, 3.5

## P03-17 Gửi lại mã hợp lệ
- Mục tiêu: mã mới thay mã cũ.
- Dữ liệu: lượt chờ; sửa thoi_diem_gui_ma lùi 61 giây.
- Các bước: gọi gửi lại; rồi xác nhận bằng mã cũ; rồi xác nhận bằng mã mới.
- Kết quả mong đợi: gửi lại 200, dòng xac_minh_ip được ghi đè (so_lan_nhap_ma_sai 0), có thư mới; mã cũ báo "Mã xác nhận không đúng."; mã mới tạo được phiên.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4, 3.5

## P03-18 Gửi mã tối đa 5 lần trong 1 giờ
- Mục tiêu: tính cả lần gửi đầu.
- Dữ liệu: học viên "hv18", mỗi lần gửi lại đều lùi thoi_diem_gui_ma 61 giây.
- Các bước: đăng nhập từ IP mới (lần gửi 1), gửi lại 4 lần (lần 2 đến 5), gửi lại lần nữa; rồi đăng nhập lại từ một IP mới khác.
- Kết quả mong đợi: lần gửi thứ 6 trả 429 "Bạn đã yêu cầu gửi mã quá nhiều lần. Vui lòng thử lại sau.", không có thư mới; lần đăng nhập lại cũng trả 429 cùng câu và không gửi thư.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4, 3.5, 3.7; Phần chung C13

## P03-19 Người cung cấp và admin không bị hỏi mã
- Mục tiêu: chỉ học viên qua bước so địa chỉ.
- Dữ liệu: ncc01 và admin kiểm thử.
- Các bước: đăng nhập từ 127.0.0.1 rồi từ 192.168.1.30.
- Kết quả mong đợi: cả bốn lần 200 có phiên, không có thư nào.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4 bước 5; mục 3.8

## P03-20 Đăng xuất
- Mục tiêu: hủy phiên.
- Dữ liệu: học viên đang có phiên, có 1 khóa trong giỏ.
- Các bước: gọi POST /api/tai-khoan/dang-xuat; rồi gọi GET /api/tai-khoan/toi không kèm cookie cũ.
- Kết quả mong đợi: 200, cookie ava_phien bị xóa; /api/tai-khoan/toi trả { "dang_nhap": false }; dòng gio_hang vẫn còn.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.3, 3.5

## P03-21 Phiên hết hạn sau 7 ngày
- Mục tiêu: mã phiên có hạn 7 ngày.
- Dữ liệu: phiên vừa tạo.
- Các bước: giải mã cookie ava_phien.
- Kết quả mong đợi: thời điểm hết hạn cách lúc tạo đúng 7 ngày; cookie có hạn 7 ngày.
- Cách kiểm: Tự động
- Nguồn: Phần 3 mục 3.4; Phần chung C4

## P03-22 Trang đăng nhập báo lỗi
- Mục tiêu: lỗi ô hiện dưới ô, lỗi máy chủ hiện trên nút.
- Dữ liệu: như P03-03 đến P03-09.
- Các bước: mở /dang-nhap, thử lần lượt.
- Kết quả mong đợi: để trống và mật khẩu sai định dạng báo dưới ô, không gửi lên máy chủ; sai tên hoặc mật khẩu, bị chặn, bị khóa hiện một dòng đỏ phía trên nút như các màn trong thiet_ke/dang_nhap/; bị khóa không chuyển sang trang 403; có liên kết "Quên mật khẩu?" dưới ô mật khẩu và "Đăng ký"; không có chân trang.
- Cách kiểm: Bấm tay
- Nguồn: Phần 3 mục 3.3, 3.7

## P03-23 Đăng nhập từ nút Mua
- Mục tiêu: ?tu=mua hiện thêm dòng nhắc.
- Dữ liệu: mở /dang-nhap?tu=mua.
- Các bước: nhìn trang; đăng nhập sai và đúng.
- Kết quả mong đợi: có dòng "Vui lòng đăng nhập để mua khóa học" như thiet_ke/dang_nhap/tu_nut_mua.html; các lỗi hiện như các màn tu_nut_mua_*.html. Việc đi tiếp sau khi đăng nhập kiểm ở Phần 12.
- Cách kiểm: Bấm tay
- Nguồn: Phần 3 mục 3.3

## P03-24 Đi đâu sau khi đăng nhập
- Mục tiêu: quay_lai hợp lệ thì về đó, không thì về trang theo vai trò.
- Dữ liệu: học viên, người cung cấp, admin.
- Các bước: đăng nhập không có quay_lai; đăng nhập với ?quay_lai=/gio-hang; đăng nhập với ?quay_lai=https://trang-la.vn.
- Kết quả mong đợi: không có quay_lai thì học viên về trang chủ, người cung cấp về /ho-so#quan-ly-khoa-hoc, admin về /quan-tri/khoa-hoc; có /gio-hang thì về /gio-hang; địa chỉ trang khác không được nhận, về trang theo vai trò.
- Cách kiểm: Bấm tay
- Nguồn: Phần 3 mục 3.3; Phần chung C5

## P03-25 Trang Xác nhận đăng nhập
- Mục tiêu: trang hiện đúng và chạy đúng.
- Dữ liệu: thử bằng điện thoại cùng wifi theo Phần chung C4 (đổi CLIENT_ORIGIN thành địa chỉ wifi của máy tính, chạy lại backend và frontend).
- Các bước: đăng nhập học viên từ điện thoại; nhìn trang; gõ 5 chữ số; đợi đếm ngược; nhập mã sai; nhập đúng mã trong Gmail thật.
- Kết quả mong đợi: dòng "Bạn đang đăng nhập từ một địa chỉ mạng mới. Chúng tôi đã gửi mã gồm 6 chữ số tới Gmail a***@gmail.com. Vui lòng nhập mã để tiếp tục." với Gmail che đúng; nút "Xác nhận" mờ khi chưa đủ 6 chữ số; "Gửi lại mã sau N giây" đếm ngược 60 giây; mã sai báo chữ đỏ dưới ô; gửi lại được thì dòng xanh "Đã gửi mã mới tới Gmail a***@gmail.com."; mã đúng thì vào được; máy tính bấm trang bất kỳ thì bị đẩy về đăng nhập với câu "Tài khoản của bạn vừa đăng nhập ở một địa chỉ mạng khác."
- Cách kiểm: Bấm tay
- Nguồn: Phần 3 mục 3.3, 3.7, 3.8

## P03-26 Mở thẳng trang xác nhận khi không có lượt chờ
- Mục tiêu: không có lượt chờ thì về đăng nhập.
- Dữ liệu: khách chưa đăng nhập.
- Các bước: mở /xac-nhan-dang-nhap.
- Kết quả mong đợi: chuyển về /dang-nhap.
- Cách kiểm: Bấm tay
- Nguồn: Phần 3 mục 3.3

## P03-27 Người đã đăng nhập mở /dang-nhap
- Mục tiêu: về trang chủ.
- Dữ liệu: học viên đã đăng nhập.
- Các bước: mở /dang-nhap.
- Kết quả mong đợi: về trang chủ.
- Cách kiểm: Bấm tay
- Nguồn: Phần 3 mục 3.1

## P03-28 Đăng xuất trên giao diện
- Mục tiêu: hai chỗ đăng xuất đều chạy.
- Dữ liệu: học viên đã đăng nhập.
- Các bước: bấm "Đăng xuất" ở menu ảnh đại diện; đăng nhập lại rồi bấm "Đăng xuất" ở menu trái trang hồ sơ.
- Kết quả mong đợi: mỗi lần về trang chủ, đầu trang kiểu khách.
- Cách kiểm: Bấm tay
- Nguồn: Phần 3 mục 3.3
