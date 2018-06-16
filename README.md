# BKFA.JS
## Các bước cài đặt
1. npm install express-generator -g
2. express --view=pug BkfaJS
3. npm install
4. npm start để chạy thử
5.Cấu hình thư mục dự án:
	+ Controllers
	+ Models
	+ Config
	+ Templates (muốn tự cấu hình view thì tạo, không thì thôi)
	+ server.js (không sử dụng /bin/www)
6. Cấu hình template cơ bản
	- Cài đặt một số các modules:
		+ nodemon: tự động khởi động lại server mỗi lần lưu thay đổi
		+ pug: template engine cho phần giao diện
		+ mongoose: dùng thao tác với cơ sở dữ liệu mongodb
	- chú ý 2 tùy chọn đó là --save và -g:
		+ --save: là các modules được cài đặt và lưu vào dự án đồng thời lưu vào file package.json
		+ --g: lưu module vào môi trường của máy để dùng chung cho các dự án khác.
	-> npm install nodemon --g
	-> npm install express-pug --save
	(express-pug là cầu nối giữa pug và express, cho phép express sử dụng được các thư viện của pug. Khi cài express-pug thì thư viện pug được cài theo.﻿)
	-> npm install mongoose --save
	- Copy /bin/www vaof server.js và đổi ../app thành ./app và node ./bin/www trong package.json thành node ./server.js
7. Cài đặt một số modules thông dụng
	+ npm install body-parser --save
8. Cấu hình kết nối router, controller, models
