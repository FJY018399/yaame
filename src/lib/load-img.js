/*
 * 使用方法:  给需要懒加载图片的dom  添加box类名  屏幕看不到的元素整体使用show隐藏执行完此方法在显示即可
 */
let lazyImages = [];
export const lazyLoadImages = () => {
    lazyImages = document.querySelectorAll('.box');

    // 初始化，将图片的 src 或背景图片置空并保存原始地址
    lazyImages.forEach(image => {
        if (image.tagName.toLowerCase() === 'img') {
            // 保存原始 src 地址到 data-src 中，并清空 src
            const originalSrc = image.getAttribute('src');
            image.setAttribute('data-src', originalSrc);
            image.setAttribute('src', '');
        } else {
            // 保存背景图片 URL 到 data-bg 中，并清空背景图片
            const style = window.getComputedStyle(image);
            const backgroundImage = style.getPropertyValue('background-image');
            const match = backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
            if (match && match[1]) {
                image.setAttribute('data-bg', match[1]);
                image.style.backgroundImage = 'none'; // 清空背景图片
                image.style.background = 'none';
            }
        }
    });

    const loadImages = () => {
        lazyImages.forEach(image => {
            if (isInViewport(image)) {
                // 判断图片是背景图还是 <img> 标签，并获取其原始 URL
                let bgImage = '';

                if (image.tagName.toLowerCase() === 'img') {
                    bgImage = image.getAttribute('data-src'); // 获取原始 src 地址
                } else {
                    bgImage = image.getAttribute('data-bg'); // 获取原始背景图 URL
                }

                if (bgImage) {
                    // 如果是 <img> 标签，恢复 src；如果是背景图，恢复背景图片
                    if (image.tagName.toLowerCase() === 'img') {
                        image.src = bgImage;
                        image.removeAttribute('data-src');
                    } else {
                        image.style.background = `url(${bgImage}) no-repeat`;
                        image.style.backgroundSize = 'contain';
                        image.removeAttribute('data-bg');
                    }
                    // 移除 class 避免重复加载
                    // image.classList.remove('box');
                }
            }
        });
    };

    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight; // 视口的高度
        const windowWidth = window.innerWidth;   // 视口的宽度

        return (
            rect.bottom >= 0 &&      // 图片底部进入视口
            rect.right >= 0 &&       // 图片右侧进入视口
            rect.top <= windowHeight &&  // 图片顶部进入视口
            rect.left <= windowWidth     // 图片左侧进入视口
        );
    };

    // 监听滚动和窗口大小改变事件
    window.document.addEventListener('scroll', loadImages);
    window.document.addEventListener('resize', loadImages);

    // 初始加载  背景图片会先加载所以不介意调用此方法   所以请自行判断用户首次进来看到的大约位置   在此位置一下做懒加载处理
    return {
        loadImages
    }
};
