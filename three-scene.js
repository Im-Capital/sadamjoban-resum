/**
 * Mr. Capital - Three.js Background Scene
 * Advanced particle system with interactive elements
 */

// ============================================
// Scene Setup
// ============================================
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, 
    antialias: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ============================================
// Particles System
// ============================================
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;

const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);
const sizes = new Float32Array(particlesCount);

const colorPalette = [
    new THREE.Color('#4169E1'), // Royal Blue
    new THREE.Color('#0080FF'), // Electric Blue
    new THREE.Color('#00FFFF'), // Neon Cyan
    new THREE.Color('#8B5CF6')  // Purple
];

for (let i = 0; i < particlesCount * 3; i += 3) {
    // Positions - spread across a wide area
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;
    
    // Colors - random from palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
    
    // Sizes
    sizes[i / 3] = Math.random() * 2;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// Particle material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

// Create particle system
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// ============================================
// Floating Geometric Shapes
// ============================================
const shapes = [];
const shapeGeometries = [
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.IcosahedronGeometry(1, 0)
];

const shapeMaterial = new THREE.MeshBasicMaterial({
    color: 0x4169E1,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});

for (let i = 0; i < 15; i++) {
    const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
    const mesh = new THREE.Mesh(geometry, shapeMaterial.clone());
    
    mesh.position.x = (Math.random() - 0.5) * 50;
    mesh.position.y = (Math.random() - 0.5) * 50;
    mesh.position.z = (Math.random() - 0.5) * 30 - 10;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    mesh.userData = {
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: Math.random() * 0.5 + 0.5,
        floatOffset: Math.random() * Math.PI * 2
    };
    
    // Random color variation
    mesh.material.color = colorPalette[Math.floor(Math.random() * colorPalette.length)].clone();
    mesh.material.opacity = Math.random() * 0.3 + 0.1;
    
    shapes.push(mesh);
    scene.add(mesh);
}

// ============================================
// Lighting
// ============================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x4169E1, 1, 100);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00FFFF, 0.5, 100);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

// ============================================
// Mouse Interaction
// ============================================
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
});

// ============================================
// Camera Position
// ============================================
camera.position.z = 30;

// ============================================
// Animation Loop
// ============================================
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Smooth mouse movement
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    
    // Rotate particles based on mouse
    particles.rotation.y += 0.001;
    particles.rotation.x = targetY * 0.5;
    particles.rotation.z = targetX * 0.5;
    
    // Animate particles wave effect
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(elapsedTime + positions[i3]) * 0.02;
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    
    // Animate floating shapes
    shapes.forEach((shape, index) => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        
        // Floating motion
        shape.position.y += Math.sin(elapsedTime * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.05;
    });
    
    // Animate lights
    pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 20;
    pointLight1.position.y = Math.cos(elapsedTime * 0.5) * 20;
    
    pointLight2.position.x = Math.cos(elapsedTime * 0.3) * 20;
    pointLight2.position.z = Math.sin(elapsedTime * 0.3) * 20;
    
    renderer.render(scene, camera);
}

animate();

// ============================================
// Handle Window Resize
// ============================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ============================================
// Performance Optimization - Reduce particles on mobile
// ============================================
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    // Reduce particle count for better performance
    particlesCount = 1000;
    particles.geometry.dispose();
    particles.material.dispose();
}

// ============================================
// Pause animation when tab is not visible
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Could pause animation here for better battery life
    }
});

console.log('%cThree.js Scene Initialized', 'color: #00FFFF; font-weight: bold;');
