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


document.addEventListener('DOMContentLoaded', function() {
    const postDates = document.querySelectorAll('.post-date');
    postDates.forEach(function(postDateElement) {
      const postDate = new Date(postDateElement.getAttribute('data-date'));
      postDateElement.textContent = formatDate(postDate);
    });
  });

const formatDate = function formatDate(postDate) {
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const postDateOnly = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
    const diffDays = Math.floor((nowDate - postDateOnly) / (24 * 60 * 60 * 1000));
  
    if (diffDays === -2) {
      return '后天';
    } else if (diffDays === -1) {
      return '明天';
    } else if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays === 2) {
      return '前天';
    } else if (now.getFullYear() === postDate.getFullYear()) {
      return `${postDate.getMonth() + 1} 月 ${postDate.getDate()} 日`;
    } else {
      return `${postDate.getFullYear()} 年 ${postDate.getMonth() + 1} 月 ${postDate.getDate()} 日`;
    }
}
