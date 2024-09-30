var units = {
    vw: function(a) {
        return window.innerWidth * a / 100;
    },
    vh: function(a) {
        return window.innerHeight * a / 100;
    },
    vmax: function(a) {
        return Math.max(window.innerHeight, window.innerWidth) * a / 100;
    },
    vmin: function(a) {
        return Math.min(window.innerHeight, window.innerWidth) * a / 100;
    }
};

var inited = false;
var clickCount = 0;
var clickTimer;

document.addEventListener('click', function(e) {
    var x = e.clientX;
    var y = e.clientY;

    // Kiểm tra khu vực click (tương tự như trước)
    if (x > units.vw(90) && y > units.vh(90)) {
        clickCount++;

        // Nếu lần thứ 1 hoặc 2, chờ thêm
        if (clickCount === 1) {
            clickTimer = setTimeout(function() {
                clickCount = 0; // Reset sau một thời gian không đạt 3 lần nhấp
            }, 500); // Thời gian chờ giữa các lần click
        }

        // Khi đủ 3 lần click
        if (clickCount === 3) {
            clearTimeout(clickTimer); // Hủy bộ đếm giờ
            clickCount = 0; // Reset số lần click
            showInfos(); // Gọi hàm showInfos sau khi triple click
        }
    }
});

function showInfos() {
    if (inited) {
        eruda.destroy();
        inited = false;
        localStorage.removeItem('eruda-dev-tools');
    } else {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        document.body.appendChild(script);
        script.onload = function() {
            eruda.init({
                tool: ['console', 'network']
            });
            inited = true;
            localStorage.setItem('eruda-dev-tools', 'true');
        };
    }
}

// Tự động bật công cụ nếu đã được bật trước đó
if (localStorage.getItem('eruda-dev-tools')) {
    showInfos();
}
