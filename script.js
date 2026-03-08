/**
 * Women's Day Gift — Browser-compatible script
 * Refactored from Parcel bundle into vanilla JS.
 * Uses GSAP loaded via CDN in index.html.
 *
 * Features:
 *   - Parallax grid movement (mouse-tracking) — preserved from original template
 *   - Custom cursor
 *   - Envelope open → music → scene transition → typing animation
 */
(function () {
    'use strict';

    // ───────── Utility functions (extracted from bundle) ─────────

    /** Map value x from range [a, b] to [c, d] */
    function map(x, a, b, c, d) {
        return ((x - a) * (d - c)) / (b - a) + c;
    }

    /** Linear interpolation */
    function lerp(a, b, n) {
        return (1 - n) * a + n * b;
    }

    /** Get viewport size */
    function calcWinsize() {
        return { width: window.innerWidth, height: window.innerHeight };
    }

    /** Random integer in [min, max] */
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /** Get mouse/pointer position from event */
    function getMousePos(e) {
        return { x: e.pageX || 0, y: e.pageY || 0 };
    }

    // ───────── Viewport & mouse tracking ─────────

    var winsize = calcWinsize();
    window.addEventListener('resize', function () {
        winsize = calcWinsize();
    });

    var mousepos = { x: winsize.width / 2, y: winsize.height / 2 };
    window.addEventListener('mousemove', function (ev) {
        mousepos = getMousePos(ev);
    });

    // ───────── GridItem: parallax per-item movement ─────────

    function GridItem(el) {
        this.el = el;
        this._startMove();
    }

    GridItem.prototype._startMove = function () {
        var self = this;
        var translationVals = { tx: 0, ty: 0 };
        var xstart = getRandomNumber(15, 60);
        var ystart = getRandomNumber(15, 60);

        function render() {
            translationVals.tx = lerp(
                translationVals.tx,
                map(mousepos.x, 0, winsize.width, -xstart, xstart),
                0.07
            );
            translationVals.ty = lerp(
                translationVals.ty,
                map(mousepos.y, 0, winsize.height, -ystart, ystart),
                0.07
            );
            gsap.set(self.el, { x: translationVals.tx, y: translationVals.ty });
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    };

    // ───────── Grid: manage all items ─────────

    function Grid(el) {
        this.el = el;
        this.gridItems = [];
        var items = Array.from(el.querySelectorAll('.grid__item'));
        for (var i = 0; i < items.length; i++) {
            this.gridItems.push(new GridItem(items[i]));
        }
        this._showItems(items);
    }

    Grid.prototype._showItems = function (items) {
        gsap.timeline()
            .set(items, { scale: 0.7, opacity: 0 })
            .to(items, {
                duration: 2,
                ease: 'Expo.easeOut',
                scale: 1,
                stagger: { amount: 0.6, grid: 'auto', from: 'center' }
            }, 0)
            .to(items, {
                duration: 3,
                ease: 'Power1.easeOut',
                opacity: 0.8,
                stagger: { amount: 0.6, grid: 'auto', from: 'center' }
            }, 0);
    };

    // ───────── Custom Cursor ─────────

    function Cursor(el) {
        this.el = el;
        this.el.style.opacity = 0;
        this.bounds = this.el.getBoundingClientRect();
        this.renderedStyles = {
            tx: { previous: 0, current: 0, amt: 0.2 },
            ty: { previous: 0, current: 0, amt: 0.2 }
        };

        var self = this;
        var initMove = function () {
            self.renderedStyles.tx.previous = self.renderedStyles.tx.current =
                mousepos.x - self.bounds.width / 2;
            self.renderedStyles.ty.previous = self.renderedStyles.ty.current =
                mousepos.y - self.bounds.height / 2;
            gsap.to(self.el, { duration: 0.9, ease: 'Power3.easeOut', opacity: 1 });
            requestAnimationFrame(function () { self._render(); });
            window.removeEventListener('mousemove', initMove);
        };
        window.addEventListener('mousemove', initMove);
    }

    Cursor.prototype._render = function () {
        var self = this;
        this.renderedStyles.tx.current = mousepos.x - this.bounds.width / 2;
        this.renderedStyles.ty.current = mousepos.y - this.bounds.height / 2;

        for (var key in this.renderedStyles) {
            this.renderedStyles[key].previous = lerp(
                this.renderedStyles[key].previous,
                this.renderedStyles[key].current,
                this.renderedStyles[key].amt
            );
        }

        this.el.style.transform =
            'translateX(' + this.renderedStyles.tx.previous + 'px) ' +
            'translateY(' + this.renderedStyles.ty.previous + 'px)';

        requestAnimationFrame(function () { self._render(); });
    };

    // ───────── Nyan Cat Background Animation (Part 1 only) ─────────

    // var NYAN_GIF_URL = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHZueWpobjJqNWFiaHphbm92Z2JmN3RwaHpmZ29mNXZ0NXZyeHpxayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/sIIhZmxQX2f4w1vSh3/giphy.gif';
    var NYAN_GIF_URL = '/img/nyan-cat.gif'; // Local fallback for offline use
    var nyanActive = false;
    var nyanAnimations = [];

    /** Create a single Nyan Cat that flies left→right across #part1 */
    function spawnNyanCat() {
        if (!nyanActive) return;

        var part1 = document.getElementById('part1');
        if (!part1) return;

        var cat = document.createElement('div');
        cat.className = 'nyan-cat';
        var img = document.createElement('img');
        img.src = NYAN_GIF_URL;
        img.alt = 'Nyan Cat';
        cat.appendChild(img);

        // Random vertical position within viewport
        var startY = Math.random() * (window.innerHeight - 100);
        cat.style.left = '-150px';
        cat.style.top = startY + 'px';

        part1.appendChild(cat);

        // Random speed (5–10 seconds to cross)
        var duration = 5000 + Math.random() * 5000;
        var targetX = window.innerWidth + 150;

        var anim = cat.animate(
            [{ left: '-150px' }, { left: targetX + 'px' }],
            { duration: duration, easing: 'linear' }
        );

        nyanAnimations.push({ el: cat, anim: anim });

        anim.onfinish = function () {
            cat.remove();
            // Remove from tracking array
            nyanAnimations = nyanAnimations.filter(function (n) { return n.el !== cat; });
            // Spawn another if still active
            if (nyanActive) spawnNyanCat();
        };
    }

    /** Start the Nyan Cat background — called on page load */
    function initNyanBackground() {
        nyanActive = true;
        for (var i = 0; i < 10; i++) {
            (function (delay) {
                setTimeout(spawnNyanCat, delay);
            })(i * 1500);
        }
    }

    /** Stop all Nyan Cats and remove them — called on transition to Part 2 */
    function stopNyanBackground() {
        nyanActive = false;
        nyanAnimations.forEach(function (n) {
            n.anim.cancel();
            n.el.remove();
        });
        nyanAnimations = [];
    }

    // ───────── Wish message & typing effect ─────────

    var message =
        '🎉Gửi XuanAn thân mến... :>>✨ ' + 'Nhân ngày 8/3, chúc bà luôn giữ được nụ cười tỏa nắng, ' +
        'tâm hồn tự do và trái tim đầy ấm áp. Thế giới này trở nên đẹp đẽ hơn rất nhiều ' +
        'vì có sự hiện diện của bà. Hãy luôn tự tin và tỏa sáng theo cách của riêng mình nhé! ✨💖';

    function startTyping() {
        var i = 0;
        var typingSpan = document.getElementById('typing-text');
        function type() {
            if (i < message.length) {
                typingSpan.textContent += message.charAt(i);
                i++;
                setTimeout(type, 60);
            }
        }
        type();
    }

    // ───────── Envelope click → transition → grid ─────────

    function initExperience() {
        var env = document.getElementById('env');
        var part1 = document.getElementById('part1');
        var part2 = document.getElementById('part2');
        var bgMusic = document.getElementById('bgMusic');

        // Open envelope
        env.classList.add('open');

        // Play music immediately on user interaction
        bgMusic.play().catch(function (err) {
            console.log('Auto-play blocked:', err);
        });

        // After envelope animation, transition scenes
        setTimeout(function () {
            // Stop Nyan Cats before hiding Part 1
            stopNyanBackground();

            part1.style.opacity = '0';
            part1.style.transform = 'scale(1.1)';

            setTimeout(function () {
                part1.style.display = 'none';
                part2.style.display = 'block';

                // Fade in Part 2
                gsap.to(part2, { opacity: 1, duration: 1.5 });

                // Initialize the parallax grid (from original template logic)
                var gridEl = document.querySelector('.grid');
                if (gridEl) {
                    new Grid(gridEl);
                }

                // Start the typing animation
                startTyping();
            }, 1000);
        }, 1200);
    }

    // ───────── Init on DOM ready ─────────

    document.addEventListener('DOMContentLoaded', function () {
        // Custom cursor
        var cursorEl = document.getElementById('cursor');
        if (cursorEl) {
            new Cursor(cursorEl);
        }

        // Wire envelope click
        var envelopeWrapper = document.querySelector('.envelope-wrapper');
        if (envelopeWrapper) {
            envelopeWrapper.addEventListener('click', initExperience);
        }

        // Start Nyan Cat background animation for Part 1
        initNyanBackground();
    });
})();
