Visual Update: Enhancing Part 1 Aesthetics

1. Current Progress

The 3-file structure (index.html, style.css, script.js) is established.

Transition logic and basic grid functionality are ready.

2. New Requirements for Part 1

I want to make Part 1 more visually appealing and dynamic:

Background Tone: Change the background of Part 1 to a Pastel Pink theme (referencing #fce4ec or similar soft pink gradients).

Nyan Cat Animation: Implement multiple "Nyan Cat" characters (GIFs) that fly across the background from left to right at various speeds and heights.

Z-Index Management:

Background: Lowest level.

Nyan Cats: Floating behind the envelope.

Envelope & Welcome Text: Highest level (must be clickable).

3. Tasks for Copilot

Please update the 3 files as follows:

A. style.css:

Update #part1 styles to use the new pastel pink color scheme.

Add styles for a .nyan-cat class (absolute positioning, fixed width).

Ensure the .envelope-wrapper and .welcome-text have a higher z-index than the background animations.

B. script.js:

Add a function initNyanBackground() that runs when the page loads.

This function should dynamically create <img> elements (Nyan Cat GIFs) and use GSAP or Web Animations API to make them "fly" across the screen continuously.

Ensure these cats only appear during Part 1 and stop/disappear when the user transitions to Part 2.

C. index.html:

Ensure the background container is set up correctly to host these animations.

D. Code for inferencing the current part and conditionally showing/hiding the Nyan Cats based on the active part.

"""
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Part 1 - 8/3</title>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&display=swap" rel="stylesheet">
    <style>
        :root {
            --pastel-pink: #fce4ec; /* Tone hồng pastel giống ảnh bạn gửi */
            --primary-pink: #ff758c;
        }

        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: var(--pastel-pink);
            font-family: 'Dancing Script', cursive;
        }

        /* Hiệu ứng nền mờ nhẹ cho cảm giác nghệ thuật */
        .background-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(252,228,236,0.2) 100%);
            z-index: 1;
        }

        /* Container chính cho Part 1 */
        #part1 {
            position: relative;
            z-index: 10;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .welcome-text {
            font-size: 2.5rem;
            color: #d81b60;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            text-align: center;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        /* Envelope Styles */
        .envelope-wrapper {
            cursor: pointer;
            perspective: 1000px;
        }

        .envelope {
            width: 250px;
            height: 160px;
            background: white;
            position: relative;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .envelope::before {
            content: "";
            position: absolute;
            top: 0; left: 0;
            width: 0; height: 0;
            border-left: 125px solid transparent;
            border-right: 125px solid transparent;
            border-top: 100px solid #ffab91;
            z-index: 3;
        }

        .letter {
            position: absolute;
            bottom: 10px; left: 50%;
            transform: translateX(-50%);
            width: 230px; height: 120px;
            background: #fff;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Pacifico', cursive;
            color: #ff4081;
        }

        /* Nyan Cat Styles */
        .nyan-cat {
            position: fixed;
            width: 100px; /* Kích thước mèo Nyan */
            height: auto;
            pointer-events: none;
            z-index: 2;
            transition: transform 0.1s linear;
        }

        .nyan-img {
            width: 100%;
            height: auto;
        }
    </style>
</head>
<body>

    <div class="background-overlay"></div>

    <div id="part1">
        <h1 class="welcome-text">Xin chào bạn xinh đẹp,<br>bấm vào đây để mở nhé! ❤️</h1>
        <div class="envelope-wrapper">
            <div class="envelope">
                <div class="letter">8 tháng 3 vui vẻ!</div>
            </div>
        </div>
    </div>

    <!-- Script tạo hiệu ứng mèo Nyan chạy -->
    <script>
        const nyanImgUrl = "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHZueWpobjJqNWFiaHphbm92Z2JmN3RwaHpmZ29mNXZ0NXZyeHpxayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/sIIhZmxQX2f4w1vSh3/giphy.gif"; // Link GIF mèo nyan

        function createNyanCat() {
            const nyan = document.createElement('div');
            nyan.className = 'nyan-cat';
            nyan.innerHTML = `<img src="${nyanImgUrl}" class="nyan-img">`;
            
            // Vị trí bắt đầu ngẫu nhiên (bên trái màn hình)
            const startY = Math.random() * window.innerHeight;
            nyan.style.left = '-150px';
            nyan.style.top = startY + 'px';
            
            document.body.appendChild(nyan);

            // Tốc độ ngẫu nhiên
            const duration = 5000 + Math.random() * 5000;
            const targetX = window.innerWidth + 150;

            const animation = nyan.animate([
                { left: '-150px' },
                { left: targetX + 'px' }
            ], {
                duration: duration,
                easing: 'linear'
            });

            animation.onfinish = () => {
                nyan.remove();
                createNyanCat(); // Tạo con mới khi con cũ chạy xong
            };
        }

        // Tạo 5 con mèo chạy lúc đầu
        for(let i=0; i<5; i++) {
            setTimeout(createNyanCat, i * 1500);
        }
    </script>
</body>
</html>
"""