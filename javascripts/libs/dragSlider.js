function DragSlide(container, options) {
    //严格模式
    "use strict";

    var noop = function() {}; // 无操作的一个方法..
    var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // 卸载方法

    // 检测浏览器是否兼容
    var browser = {
        addEventListener: !!window.addEventListener,
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        transitions: (function(temp) {
            var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
            for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
            return false;
        })(document.createElement('swipe'))
    };

    // 若根元素则退出
    if (!container) return;
    var element = container.children[0];
    var slides, slidePos, width, length;
    options = options || {};
    var index = parseInt(options.startSlide, 10) || 0;
    var speed = options.speed || 300;
    options.continuous = options.continuous !== undefined ? options.continuous : true;

    function setup() {

        // 缓存slide
        slides = element.children;
        length = slides.length;

        // 如果只有一张图则不继续
        if (slides.length < 2) options.continuous = false;

        //如果两张图的情况
        if (browser.transitions && options.continuous && slides.length < 3) {
            element.appendChild(slides[0].cloneNode(true));
            element.appendChild(element.children[1].cloneNode(true));
            slides = element.children;
        }

        // 储存当前的位置
        slidePos = new Array(slides.length);

        // 计算宽度
        width = container.getBoundingClientRect().width || container.offsetWidth;
        
        element.style.width = (slides.length * width) + 'px';

        // 排列元素
        var pos = slides.length;
        while(pos--) {

            var slide = slides[pos];

            slide.style.width = width + 'px';
            slide.setAttribute('data-index', pos);

            if (browser.transitions) {
                slide.style.left = (pos * -width) + 'px';
                _move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
            }

        }

        // 元素重置
        if (options.continuous && browser.transitions) {
            _move(circle(index-1), -width, 0);
            _move(circle(index+1), width, 0);
        }

        if (!browser.transitions) element.style.left = (index * -width) + 'px';

        container.style.visibility = 'visible';

    }

    // 后退
    function prev() {

        if (options.continuous) slide(index-1);
        else if (index) slide(index-1);

    }
    // 前进
    function next() {

        if (options.continuous) slide(index+1);
        else if (index < slides.length - 1) slide(index+1);

    }
    // 循环
    function circle(index) {

        return (slides.length + (index % slides.length)) % slides.length;

    }

    function slide(to, slideSpeed) {

        // 如果已是index则不处理
        if (index == to) return;

        if (browser.transitions) {

            var direction = Math.abs(index-to) / (index-to); // 1: 向后滚动, -1: 向前滚动

            // 获取实际位置
            if (options.continuous) {
                var natural_direction = direction;
                direction = -slidePos[circle(to)] / width;

                // 如果向后滚 to < index, use to = slides.length + to
                // 如果向前滚 to > index, use to = -slides.length + to
                if (direction !== natural_direction) to =  -direction * slides.length + to;

            }

            var diff = Math.abs(index-to) - 1;

            // 移除index和to之间的
            while (diff--) _move( circle((to > index ? to : index) - diff - 1), width * direction, 0);

            to = circle(to);

            _move(index, width * direction, slideSpeed || speed);
            _move(to, 0, slideSpeed || speed);

            if (options.continuous) _move(circle(to - direction), -(width * direction), 0); // 获取下一个位置

        } else {

            to = circle(to);
            animate(index * -width, to * -width, slideSpeed || speed);
            //如果浏览器不支持transitions
        }

        index = to;
        offloadFn(options.callback && options.callback(index, slides[index]));
    }

    function _move(index, dist, speed) {

        translate(index, dist, speed);
        slidePos[index] = dist;

    }

    function translate(index, dist, speed) {

        var slide = slides[index];
        var style = slide && slide.style;

        if (!style) return;

        style.webkitTransitionDuration =
            style.MozTransitionDuration =
                style.msTransitionDuration =
                    style.OTransitionDuration =
                        style.transitionDuration = speed + 'ms';

        style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
                style.OTransform = 'translateX(' + dist + 'px)';

    }

    function animate(from, to, speed) {

        // 如果不是animation, 则复位
        if (!speed) {

            element.style.left = to + 'px';
            return;

        }

        var start = +new Date;

        var timer = setInterval(function() {

            var timeElap = +new Date - start;

            if (timeElap > speed) {

                element.style.left = to + 'px';

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                clearInterval(timer);
                return;

            }

            element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

        }, 4);

    }

    // 设置自动翻页
    var delay = options.auto || 0;
    var interval;

    function begin() {

        interval = setTimeout(next, delay);

    }

    function stop() {

        delay = 0;
        clearTimeout(interval);

    }


    // 设置初始值
    var start = {};
    var delta = {};
    var isScrolling;

    // 设置事件捕获
    var events = {

        handleEvent: function(event) {

            switch (event.type) {
                case 'touchstart': this.start(event); break;
                case 'touch_move': this._move(event); break;
                case 'touchend': offloadFn(this.end(event)); break;
                case 'webkitTransitionEnd':
                case 'msTransitionEnd':
                case 'oTransitionEnd':
                case 'otransitionend':
                case 'transitionend': offloadFn(this.transitionEnd(event)); break;
                case 'resize': offloadFn(setup.call()); break;
            }

            if (options.stopPropagation) event.stopPropagation();

        },
        start: function(event) {

            var touches = event.touches[0];

            // 开始位置值
            start = {

                x: touches.pageX,
                y: touches.pageY,

                // 保存拖拽时间
                time: +new Date

            };

            isScrolling = undefined;

            delta = {};

            // 拖拽事件
            element.addEventListener('touchmove', this, false);
            element.addEventListener('touchend', this, false);

        },
        _move: function(event) {

            // 拖住不松..
            if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

            if (options.disableScroll) event.preventDefault();

            var touches = event.touches[0];

            // 计算x和y
            delta = {
                x: touches.pageX - start.x,
                y: touches.pageY - start.y
            }

            if ( typeof isScrolling == 'undefined') {
                isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
            }

            // 如果不竖向拉动
            if (!isScrolling) {

                // 阻止自然滚动
                event.preventDefault();

                // 停止滚动
                stop();

                if (options.continuous) { // we don't add resistance at the end

                    translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

                } else {

                    delta.x =
                        delta.x /
                            ( (!index && delta.x > 0               // if first slide and sliding left
                                || index == slides.length - 1        // or if last slide and sliding right
                                && delta.x < 0                       // and if sliding at all
                                ) ?
                                ( Math.abs(delta.x) / width + 1 )      // determine resistance level
                                : 1 );                                 // no resistance if false

                    // translate 1:1
                    translate(index-1, delta.x + slidePos[index-1], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(index+1, delta.x + slidePos[index+1], 0);
                }

            }

        },
        end: function(event) {

            // measure duration
            var duration = +new Date - start.time;

            // determine if slide attempt triggers next/prev slide
            var isValidSlide =
                Number(duration) < 250               // if slide duration is less than 250ms
                    && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
                    || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

            // determine if slide attempt is past start and end
            var isPastBounds =
                !index && delta.x > 0                            // if first slide and slide amt is greater than 0
                    || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

            if (options.continuous) isPastBounds = false;

            // determine direction of swipe (true:right, false:left)
            var direction = delta.x < 0;

            // if not scrolling vertically
            if (!isScrolling) {

                if (isValidSlide && !isPastBounds) {

                    if (direction) {

                        if (options.continuous) { // we need to get the next in this direction in place

                            _move(circle(index-1), -width, 0);
                            _move(circle(index+2), width, 0);

                        } else {
                            _move(index-1, -width, 0);
                        }

                        _move(index, slidePos[index]-width, speed);
                        _move(circle(index+1), slidePos[circle(index+1)]-width, speed);
                        index = circle(index+1);

                    } else {
                        if (options.continuous) { // we need to get the next in this direction in place

                            _move(circle(index+1), width, 0);
                            _move(circle(index-2), -width, 0);

                        } else {
                            _move(index+1, width, 0);
                        }

                        _move(index, slidePos[index]+width, speed);
                        _move(circle(index-1), slidePos[circle(index-1)]+width, speed);
                        index = circle(index-1);

                    }

                    options.callback && options.callback(index, slides[index]);

                } else {

                    if (options.continuous) {

                        _move(circle(index-1), -width, speed);
                        _move(index, 0, speed);
                        _move(circle(index+1), width, speed);

                    } else {

                        _move(index-1, -width, speed);
                        _move(index, 0, speed);
                        _move(index+1, width, speed);
                    }

                }

            }

            // kill touchmove and touchend event listeners until touchstart called again
            element.removeEventListener('touchmove', events, false)
            element.removeEventListener('touchend', events, false)

        },
        transitionEnd: function(event) {

            if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

            }

        }

    }

    // 进行设置
    setup();

    // 如允许则开始自动滚动
    if (delay) begin();


    // 添加监听事件
    if (browser.addEventListener) {

        // 设置 touchstart 事件
        if (browser.touch) element.addEventListener('touchstart', events, false);

        if (browser.transitions) {
            element.addEventListener('webkitTransitionEnd', events, false);
            element.addEventListener('msTransitionEnd', events, false);
            element.addEventListener('oTransitionEnd', events, false);
            element.addEventListener('otransitionend', events, false);
            element.addEventListener('transitionend', events, false);
        }

        // 在window上设置resize事件
        window.addEventListener('resize', events, false);

    } else {

        window.onresize = function () { setup() }; // 兼容IE

    }

    // API
    return {
        setup: function() {

            setup();

        },
        slide: function(to, speed) {

            // 停止滚动
            stop();

            slide(to, speed);

        },
        prev: function() {

            // 停止滚动
            stop();

            prev();

        },
        next: function() {

            // 停止滚动
            stop();

            next();

        },
        getPos: function() {

            // 返回当前的位置
            return index;

        },
        getNumSlides: function() {

            // 返回滚动图总数
            return length;
        },
        kill: function() {

            // 停止滚动
            stop();

            // 重置元素
            element.style.width = 'auto';
            element.style.left = 0;

            // 重置slider
            var pos = slides.length;
            while(pos--) {

                var slide = slides[pos];
                slide.style.width = '100%';
                slide.style.left = 0;

                if (browser.transitions) translate(pos, 0, 0);

            }

            // 移除事件监听
            if (browser.addEventListener) {

                // 移除当前的事件监听
                element.removeEventListener('touchstart', events, false);
                element.removeEventListener('webkitTransitionEnd', events, false);
                element.removeEventListener('msTransitionEnd', events, false);
                element.removeEventListener('oTransitionEnd', events, false);
                element.removeEventListener('otransitionend', events, false);
                element.removeEventListener('transitionend', events, false);
                window.removeEventListener('resize', events, false);

            }
            else {

                window.onresize = null;

            }

        }
    }

}

if ( window.jQuery ) {
    (function($) {
        $.fn.DragSlide = function(params) {
            return this.each(function() {
                $(this).data('DragSlide', new DragSlide($(this)[0], params));
            });
        }
    })( window.jQuery )
}