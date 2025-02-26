window.addEventListener('wheel', function(event) {
    if (event.deltaY !== 0) {
        window.scrollBy({
            left: event.deltaY,
            behavior: 'auto'
        });
        //event.preventDefault();
    }
});


function getScrollbarHeight() {
    // 创建一个临时元素来计算滚动条高度
    const div = document.createElement('div');
    div.style.visibility = 'hidden';
    div.style.overflow = 'scroll'; // 创建滚动条
    div.style.width = '50px';
    div.style.height = '50px';

    document.body.appendChild(div);
    const scrollbarHeight = div.offsetHeight - div.clientHeight; // 计算滚动条高度
    document.body.removeChild(div);

    return scrollbarHeight;
}

// 获取横向滚动条高度并设置 CSS 变量
const scrollbarHeight = getScrollbarHeight();
document.documentElement.style.setProperty('--scrollbar-height', `${scrollbarHeight}px`);