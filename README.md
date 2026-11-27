# Tiên Lộ – Pixel Cultivation RPG

Game nhập vai tu tiên phong cách pixel/2.5D, chạy bằng HTML5 Canvas và JavaScript thuần. Dự án được thiết kế để xuất bản miễn phí bằng **GitHub Pages**, chơi trên trình duyệt Android, iOS và máy tính.

## Chạy thử trên máy

1. Tải toàn bộ thư mục dự án.
2. Mở `index.html` bằng trình duyệt hiện đại. Một số trình duyệt di động hạn chế lưu dữ liệu khi mở file trực tiếp; nên dùng GitHub Pages hoặc máy chủ tĩnh để chơi ổn định.

## Đưa game lên GitHub Pages

1. Tạo repository mới trên GitHub, ví dụ `tien-lo-pixel-rpg`.
2. Tải lên **toàn bộ** các tệp trong thư mục này (`index.html`, `style.css`, `game.js`, `favicon.svg`, `README.md`). Không chỉ tải riêng file HTML.
3. Mở **Settings → Pages**.
4. Trong **Build and deployment**, chọn **Deploy from a branch**.
5. Chọn branch `main`, folder `/ (root)`, rồi nhấn **Save**.
6. Chờ GitHub Pages triển khai và mở địa chỉ dạng `https://TEN-GITHUB.github.io/tien-lo-pixel-rpg/`.

## Điều khiển

- Điện thoại: sử dụng cụm phím mũi tên ở góc dưới bên trái; chạm **ĐÁNH**, **Tuyệt kỹ**, **Auto farm** và các nút chức năng.
- Máy tính: `W A S D` hoặc phím mũi tên để di chuyển, `Space` để đánh, `Q` dùng tuyệt kỹ, `E` tương tác NPC, `Esc` đóng cửa sổ.
- Chạm lên yêu thú để chọn mục tiêu; tiến lại gần để chiến đấu. Vật phẩm rơi được tự nhặt khi nhân vật đến gần.
- Tiến trình tự lưu vào `localStorage` của trình duyệt trên thiết bị hiện tại.

## Tính năng hiện có trong bản prototype

- Tạo nhân vật nam/nữ và 7 hệ tu: Kiếm tu, Phàm nhân, Quỷ tu, Độc tu, Đan tu, Cung tu, Hợp hoan tu.
- Bản đồ ba chương: Thôn Thanh Trúc, Băng Phong Cốc, Hỏa Vân Sơn.
- 18 mẫu yêu thú pixel khác nhau theo ba khu vực; quái có tạo hình, chỉ số, phần thưởng và nguyên liệu riêng.
- Chiến đấu thời gian thực, kỹ năng hệ tu, hút máu/độc/khống chế, quái phản công.
- Tu luyện, 23 đại cảnh giới được khai báo và 9 tiểu cảnh giới mỗi đại cảnh giới; đột phá có tiêu hao linh thạch và xác suất thành công.
- Nhiệm vụ tân thủ, NPC, túi đồ, nhặt đồ tự động, thương hội, tông môn, thành tựu và auto farm.
- Cài đặt hiệu ứng, lưu và tải tiến trình trên thiết bị.

## Lưu ý phạm vi

Đây là **bản game mẫu chạy phía trình duyệt**, chưa phải game online nhiều người chơi. GitHub Pages chỉ lưu trữ website tĩnh; tài khoản, máy chủ, PvP, chat trực tuyến, đồng bộ cloud save, bản build APK/IPA và mô hình 3D thật cần được phát triển ở giai đoạn tiếp theo. Phần hình ảnh hiện tại là pixel sprite vẽ bằng Canvas, tạo cảm giác 2.5D; chưa dùng mô hình 3D dựng hình thực.

## Cài như ứng dụng trên điện thoại

Sau khi game chạy bằng HTTPS trên GitHub Pages:

- **Android / Chrome:** mở trang game → menu dấu ba chấm → **Install app** hoặc **Add to Home screen**.
- **iPhone / Safari:** mở trang game → nút **Share** → **Add to Home Screen**.

Game có manifest và service worker để lưu các tệp giao diện vào bộ nhớ đệm, giúp tải lại nhanh hơn và hỗ trợ mở trang đã từng tải. Dữ liệu nhân vật vẫn được lưu riêng trong trình duyệt của thiết bị.

## Tỉ lệ rơi pháp bảo trong prototype

Tỷ lệ cơ sở được kiểm tra khi hạ quái, sau đó điều chỉnh nhẹ theo cấp độ và phần trăm sinh lực còn lại:

| Phẩm cấp | Chương 1 | Chương 2 | Chương 3 |
|---|---:|---:|---:|
| Linh Khí | 2,5% | 3,2% | 3,0% |
| Pháp Bảo | — | 0,8% | 1,4% |
| Cổ Bảo | — | 0,05% | 0,22% |
| Thông Thiên Linh Bảo | — | — | 0,04% |
| Tiên Khí | — | — | 0,01% |
| Hỗn Độn Chí Bảo | — | — | 0,001% |

Đây là tỷ lệ thiết kế cho bản thử nghiệm; có thể cân bằng lại khi phát triển thêm hệ thống trang bị, chỉ số may mắn và boss.
