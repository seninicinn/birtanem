/*************************************************
 * 0. GİRİŞ KİLİDİ (ŞİFRE EKRANI)
 *************************************************/
function checkPassword() {
    const input = document.getElementById('password-input').value.trim().toLowerCase();
    const errorMsg = document.getElementById('error-msg');
    const screen = document.getElementById('password-screen');
    const container = document.querySelector('.password-container');

    if (input === 'fatma') {
        errorMsg.style.color = "#d8b4fe";
        errorMsg.innerText = "Hoş geldin...";
        screen.style.opacity = '0';

        setTimeout(() => {
            screen.style.visibility = 'hidden';
            document.body.classList.remove('locked');
        }, 1500);
    } else {
        errorMsg.innerText = "Bu evren seni tanımıyor...";
        container.animate([
            { transform: "translateX(0)" },
            { transform: "translateX(-10px)" },
            { transform: "translateX(10px)" },
            { transform: "translateX(-10px)" },
            { transform: "translateX(10px)" },
            { transform: "translateX(0)" }
        ], { duration: 400 });
        document.getElementById('password-input').value = "";
    }
}

document.getElementById('password-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

/*************************************************
 * 1. THREE.JS: TÜM GEÇİŞLER (Gökyüzünde Biter)
 *************************************************/
const canvas = document.getElementById('firefly-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#030305');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function createTexture(theme) {
    let canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    let ctx = canvas.getContext('2d');
    let gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);

    if (theme === 'orange') {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 214, 100, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 150, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (theme === 'lilac') {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(216, 180, 254, 0.8)');
        gradient.addColorStop(0.4, 'rgba(182, 133, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.4, 'rgba(200, 200, 220, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

const particleCount = window.innerWidth < 768 ? 300 : 500;
const geometry = new THREE.BufferGeometry();

const currentPositions = new Float32Array(particleCount * 3);
const basePositions = new Float32Array(particleCount * 3);
const heartPositions = new Float32Array(particleCount * 3);
const infinityPositions = new Float32Array(particleCount * 3);
const galaxyPositions = new Float32Array(particleCount * 3);
const faPositions = new Float32Array(particleCount * 3);
const magnifyingPositions = new Float32Array(particleCount * 3);
const skyPositions = new Float32Array(particleCount * 3);
const phases = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    // Uzay
    basePositions[i * 3] = (Math.random() - 0.5) * 250;
    basePositions[i * 3 + 1] = (Math.random() - 0.5) * 250;
    basePositions[i * 3 + 2] = (Math.random() - 0.5) * 150;

    // Kalp
    const t = Math.random() * Math.PI * 2;
    const heartScale = 2.5;
    heartPositions[i * 3] = heartScale * (16 * Math.pow(Math.sin(t), 3));
    heartPositions[i * 3 + 1] = heartScale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    heartPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    // Sonsuzluk
    const infScale = 40;
    const denominator = 1 + Math.sin(t) * Math.sin(t);
    infinityPositions[i * 3] = (infScale * Math.cos(t)) / denominator;
    infinityPositions[i * 3 + 1] = (infScale * Math.sin(t) * Math.cos(t)) / denominator;
    infinityPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    // Galaksi
    const angle = Math.random() * Math.PI * 2;
    const radius = 80 + Math.random() * 100;
    galaxyPositions[i * 3] = Math.cos(angle) * radius;
    galaxyPositions[i * 3 + 1] = (Math.random() - 0.5) * 150;
    galaxyPositions[i * 3 + 2] = Math.sin(angle) * radius - 40;

    // F&A
    let faX, faY;
    let p = Math.random();
    if (i < particleCount / 2) {
        if (p < 0.4) { faX = -25; faY = (Math.random() - 0.5) * 40; }
        else if (p < 0.7) { faX = -25 + Math.random() * 15; faY = 20; }
        else { faX = -25 + Math.random() * 10; faY = 0; }
    } else {
        let aT = Math.random();
        if (p < 0.4) { faX = 25 - (10 * aT); faY = 20 - (40 * aT); }
        else if (p < 0.8) { faX = 25 + (10 * aT); faY = 20 - (40 * aT); }
        else { faX = 20 + Math.random() * 10; faY = 0; }
    }
    faPositions[i * 3] = faX + (Math.random() - 0.5) * 4;
    faPositions[i * 3 + 1] = faY + (Math.random() - 0.5) * 4 + 20;
    faPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    // Büyüteç
    if (p < 0.75) {
        let magR = 25 + (Math.random() - 0.5) * 4;
        magnifyingPositions[i * 3] = -5 + Math.cos(t) * magR;
        magnifyingPositions[i * 3 + 1] = 15 + Math.sin(t) * magR;
        magnifyingPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    } else {
        let magT = Math.random();
        magnifyingPositions[i * 3] = 12 + magT * 20 + (Math.random() - 0.5) * 3;
        magnifyingPositions[i * 3 + 1] = -2 - magT * 20 + (Math.random() - 0.5) * 3;
        magnifyingPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }

    // Gökyüzü (Final Ekranında da Bu Kalacak)
    skyPositions[i * 3] = (Math.random() - 0.5) * 300;
    skyPositions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    skyPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;

    phases[i] = Math.random() * Math.PI * 2;
}

geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

const orangeMaterial = new THREE.PointsMaterial({ size: 4, map: createTexture('orange'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 });
const lilacMaterial = new THREE.PointsMaterial({ size: 4, map: createTexture('lilac'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 });
const silverMaterial = new THREE.PointsMaterial({ size: 4, map: createTexture('silver'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 });

const orangeFireflies = new THREE.Points(geometry, orangeMaterial);
const lilacFireflies = new THREE.Points(geometry, lilacMaterial);
const silverFireflies = new THREE.Points(geometry, silverMaterial);

scene.add(orangeFireflies);
scene.add(lilacFireflies);
scene.add(silverFireflies);

const transitionData = { progress1: 0, progress2: 0, progress3: 0, progress4: 0, progress5: 0, progress6: 0 };

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        basePositions[i * 3] += Math.sin(time * 0.5 + phases[i]) * 0.02;
        basePositions[i * 3 + 1] += Math.cos(time * 0.3 + phases[i]) * 0.02 + 0.05;
        if (basePositions[i * 3 + 1] > 125) basePositions[i * 3 + 1] = -125;

        let startX = basePositions[i * 3];
        let startY = basePositions[i * 3 + 1];
        let startZ = basePositions[i * 3 + 2];

        let pulseHeart = 1 + Math.sin(time * 3) * 0.03;
        let midX = heartPositions[i * 3] * pulseHeart;
        let midY = heartPositions[i * 3 + 1] * pulseHeart;
        let midZ = heartPositions[i * 3 + 2];

        let endX = infinityPositions[i * 3];
        let endY = infinityPositions[i * 3 + 1];
        let endZ = infinityPositions[i * 3 + 2];

        let galX = galaxyPositions[i * 3] + Math.sin(time * 0.5 + phases[i]) * 5;
        let galY = galaxyPositions[i * 3 + 1] + Math.cos(time * 0.3 + phases[i]) * 5;
        let galZ = galaxyPositions[i * 3 + 2];

        let pulseFA = 1 + Math.sin(time * 2 + phases[i]) * 0.02;
        let fXaX = faPositions[i * 3] * pulseFA;
        let fYaY = faPositions[i * 3 + 1] * pulseFA;
        let fZaZ = faPositions[i * 3 + 2];

        let magX = magnifyingPositions[i * 3] + Math.sin(time * 0.5 + phases[i]) * 2;
        let magY = magnifyingPositions[i * 3 + 1] + Math.cos(time * 0.3 + phases[i]) * 2;
        let magZ = magnifyingPositions[i * 3 + 2];

        let skyX = skyPositions[i * 3] + Math.sin(time * 0.5 + phases[i]) * 2;
        let skyY = skyPositions[i * 3 + 1] + (time * 5 + phases[i]) % 300 - 150;
        let skyZ = skyPositions[i * 3 + 2];

        let tX1 = THREE.MathUtils.lerp(startX, midX, transitionData.progress1);
        let tY1 = THREE.MathUtils.lerp(startY, midY, transitionData.progress1);
        let tZ1 = THREE.MathUtils.lerp(startZ, midZ, transitionData.progress1);

        let tX2 = THREE.MathUtils.lerp(tX1, endX, transitionData.progress2);
        let tY2 = THREE.MathUtils.lerp(tY1, endY, transitionData.progress2);
        let tZ2 = THREE.MathUtils.lerp(tZ1, endZ, transitionData.progress2);

        let tX3 = THREE.MathUtils.lerp(tX2, galX, transitionData.progress3);
        let tY3 = THREE.MathUtils.lerp(tY2, galY, transitionData.progress3);
        let tZ3 = THREE.MathUtils.lerp(tZ2, galZ, transitionData.progress3);

        let tX4 = THREE.MathUtils.lerp(tX3, fXaX, transitionData.progress4);
        let tY4 = THREE.MathUtils.lerp(tY3, fYaY, transitionData.progress4);
        let tZ4 = THREE.MathUtils.lerp(tZ3, fZaZ, transitionData.progress4);

        let tX5 = THREE.MathUtils.lerp(tX4, magX, transitionData.progress5);
        let tY5 = THREE.MathUtils.lerp(tY4, magY, transitionData.progress5);
        let tZ5 = THREE.MathUtils.lerp(tZ4, magZ, transitionData.progress5);

        // Final Geçişi: Gökyüzü olarak kalır
        positions[i * 3] = THREE.MathUtils.lerp(tX5, skyX, transitionData.progress6);
        positions[i * 3 + 1] = THREE.MathUtils.lerp(tY5, skyY, transitionData.progress6);
        positions[i * 3 + 2] = THREE.MathUtils.lerp(tZ5, skyZ, transitionData.progress6);
    }

    orangeMaterial.opacity = (1 - transitionData.progress1) * 0.9;
    lilacMaterial.opacity = (transitionData.progress1 * (1 - transitionData.progress2)) * 0.9;
    silverMaterial.opacity = (transitionData.progress2 * (1 - transitionData.progress6 * 0.5)) * 0.9;
    orangeMaterial.opacity += transitionData.progress6 * 0.5;

    // Kameranın gökyüzündeki o yavaş, asil dönüşü devam eder
    scene.rotation.y = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(time * 0.02, time * 0.05, transitionData.progress3),
        time * 0.015,
        transitionData.progress6
    );
    scene.rotation.z = THREE.MathUtils.lerp(0, Math.sin(time * 0.5) * 0.1, transitionData.progress2);

    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}
animate();


/*************************************************
 * 2. GSAP SCROLLTELLING SİSTEMİ (GENEL)
 *************************************************/
gsap.registerPlugin(ScrollTrigger);

const heroTl = gsap.timeline({ scrollTrigger: { trigger: ".hero-scroll-container", start: "top top", end: "+=400%", pin: true, scrub: 1.5 } });
heroTl.to(".text-1", { opacity: 1, y: 0, duration: 2 }).to(".text-1", { opacity: 0, y: -50, duration: 2, delay: 1 })
    .fromTo(".text-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 2 }).to(".text-2", { opacity: 0, y: -50, duration: 2, delay: 1 })
    .fromTo(".text-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 2 }).to(".text-3", { opacity: 0, y: -50, duration: 2, delay: 1 });

gsap.to(transitionData, { progress1: 1, scrollTrigger: { trigger: ".section-two", start: "top bottom", end: "top 30%", scrub: 1 } });
gsap.to(transitionData, { progress2: 1, scrollTrigger: { trigger: ".section-three", start: "top bottom", end: "top center", scrub: 1 } });
gsap.to(transitionData, { progress3: 1, scrollTrigger: { trigger: ".section-four", start: "top bottom", end: "top center", scrub: 1 } });
gsap.to(transitionData, { progress4: 1, scrollTrigger: { trigger: ".section-five", start: "top bottom", end: "top center", scrub: 1 } });
gsap.to(transitionData, { progress5: 1, scrollTrigger: { trigger: ".section-six", start: "top bottom", end: "top center", scrub: 1 } });
gsap.to(transitionData, { progress6: 1, scrollTrigger: { trigger: ".section-seven", start: "top bottom", end: "top center", scrub: 1 } });


/*************************************************
 * 3. ZARF VE ÇİZGİ ANİMASYONLARI (SECTION 3)
 *************************************************/
gsap.to(".timeline-progress", { height: "100%", ease: "none", scrollTrigger: { trigger: ".section-three", start: "top center", end: "bottom center", scrub: true } });

gsap.utils.toArray(".timeline-item").forEach((item) => {
    let envelope = item.querySelector(".envelope-item");
    let flap = item.querySelector(".flap");
    let letter = item.querySelector(".letter");
    let knot = item.querySelector(".timeline-knot");
    let knotCore = item.querySelector(".knot-core");

    let tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top center", toggleActions: "play none none reverse" } });
    tl.to(knot, { borderColor: "#ffffff", boxShadow: "0 0 15px rgba(255, 255, 255, 0.8)", duration: 0.3 })
        .to(knotCore, { backgroundColor: "#ffffff", boxShadow: "0 0 10px #ffffff", duration: 0.3 }, "-=0.3")
        .to(flap, { rotateX: 180, duration: 0.6, ease: "power2.inOut" })
        .set(flap, { zIndex: 1 })
        .to(letter, { y: -100, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.2");
});


/*************************************************
 * 4. "NEDEN SEN?" KARTLARI (SECTION 4)
 *************************************************/
gsap.fromTo(".section-title", { opacity: 0, y: 100, filter: "blur(15px)", scale: 0.8 }, { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, scrollTrigger: { trigger: ".section-four", start: "top 75%", end: "top 35%", scrub: 1 } });
gsap.utils.toArray(".flip-card").forEach((card) => {
    gsap.fromTo(card, { opacity: 0, y: 150, rotationX: -40, scale: 0.8 }, { opacity: 1, y: 0, rotationX: 0, scale: 1, scrollTrigger: { trigger: card, start: "top 95%", end: "top 60%", scrub: 1.5 } });
});

/*************************************************
 * 5. CİNAYET DOSYASI ANİMASYONU (SECTION 6)
 *************************************************/
const folderTl = gsap.timeline({ scrollTrigger: { trigger: ".section-six", start: "top top", end: "+=200%", pin: true, scrub: 1.5 } });
folderTl.fromTo(".folder-paper", { y: 100 }, { y: -250, duration: 1 });


/*************************************************
 * 6. ZAMAN SAYACI MANTIĞI
 *************************************************/
const startDate = new Date('2026-07-03T04:27:00').getTime(); function updateCounter() {
    const difference = new Date().getTime() - startDate;
    document.getElementById('days').innerText = Math.floor(difference / (1000 * 60 * 60 * 24));
    document.getElementById('hours').innerText = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('minutes').innerText = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('seconds').innerText = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');
}
setInterval(updateCounter, 1000);
updateCounter();

/*************************************************
 * 7. DİLEK FENERİ (SPAM KORUMALI)
 *************************************************/
function spawnLantern() {
    const container = document.getElementById('lantern-container');
    const lantern = document.createElement('div');
    lantern.classList.add('lantern');

    const startPosX = Math.random() * window.innerWidth;
    const duration = 5 + Math.random() * 4;
    const swayDuration = 2 + Math.random() * 2;
    const scale = 0.5 + Math.random() * 0.7;

    lantern.style.left = startPosX + 'px';
    lantern.style.animation = `floatUp ${duration}s linear forwards, sway ${swayDuration}s ease-in-out infinite alternate`;
    lantern.style.transform = `scale(${scale})`;

    container.appendChild(lantern);
    setTimeout(() => { lantern.remove(); }, duration * 1000);
}

/*************************************************
 * 8. FİNAL: PÜRÜZSÜZ KAÇAN BUTON & KONFETİ 
 *************************************************/
function runAway() {
    const btnNo = document.getElementById('btn-no');

    const maxMoveX = window.innerWidth * 0.3;
    const maxMoveY = window.innerHeight * 0.3;

    const randomX = (Math.random() - 0.5) * 2 * maxMoveX;
    const randomY = (Math.random() - 0.5) * 2 * maxMoveY;

    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

function sayYes() {
    document.querySelector('.proposal-text').innerHTML = "Artık Bu Evren İkimizin... <br> Seni Çok Seviyorum! ∞";
    document.querySelector('.buttons-wrapper').style.display = "none";

    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) { return clearInterval(interval); }
        var particleCount = 50 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}