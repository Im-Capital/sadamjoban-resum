/**
 * Three.js Scene Setup
 * Creates an immersive 3D particle background with floating geometric shapes
 */

// Scene variables
let scene, camera, renderer;
let particles, geometry, material;
let floatingShapes = [];
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

// Initialize the Three.js scene
function initThreeScene() {
    const canvas = document.getElementById('webgl-canvas');
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles
    createParticles();
    
    // Create floating shapes
    createFloatingShapes();
    
    // Add lights
    addLights();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    
    // Start animation loop
    animate();
}

// Create particle system
function createParticles() {
    const particleCount = 2000;
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorPalette = [
        new THREE.Color(0x4169E1), // Royal Blue
        new THREE.Color(0x0080FF), // Electric Blue
        new THREE.Color(0x00FFFF), // Neon Cyan
        new THREE.Color(0x8B5CF6)  // Purple
    ];
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Positions - spread across a wide area
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = (Math.random() - 0.5) * 200;
        positions[i + 2] = (Math.random() - 0.5) * 200;
        
        // Colors - randomly select from palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Create floating geometric shapes
function createFloatingShapes() {
    const shapeCount = 15;
    const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.BoxGeometry(1, 1, 1)
    ];
    
    const materials = [
        new THREE.MeshPhongMaterial({
            color: 0x4169E1,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        }),
        new THREE.MeshPhongMaterial({
            color: 0x0080FF,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        }),
        new THREE.MeshPhongMaterial({
            color: 0x00FFFF,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        })
    ];
    
    for (let i = 0; i < shapeCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 100;
        mesh.position.y = (Math.random() - 0.5) * 100;
        mesh.position.z = (Math.random() - 0.5) * 50 + 20;
        
        // Random scale
        const scale = Math.random() * 2 + 0.5;
        mesh.scale.set(scale, scale, scale);
        
        // Random rotation speed
        mesh.rotationSpeed = {
            x: Math.random() * 0.02,
            y: Math.random() * 0.02,
            z: Math.random() * 0.02
        };
        
        // Random float speed
        mesh.floatSpeed = Math.random() * 0.05 + 0.02;
        mesh.floatOffset = Math.random() * Math.PI * 2;
        
        scene.add(mesh);
        floatingShapes.push(mesh);
    }
}

// Add lighting to the scene
function addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Point lights for glow effects
    const pointLight1 = new THREE.PointLight(0x4169E1, 1, 100);
    pointLight1.position.set(30, 30, 30);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00FFFF, 1, 100);
    pointLight2.position.set(-30, -30, 30);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x8B5CF6, 1, 100);
    pointLight3.position.set(0, 30, -30);
    scene.add(pointLight3);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse movement for parallax effect
function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth mouse following
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    
    // Rotate particles slowly
    if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
        
        // Add subtle wave motion to particles
        const positions = particles.geometry.attributes.position.array;
        const time = Date.now() * 0.0005;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + positions[i] * 0.05) * 0.02;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate floating shapes
    floatingShapes.forEach((shape, index) => {
        // Rotation
        shape.rotation.x += shape.rotationSpeed.x;
        shape.rotation.y += shape.rotationSpeed.y;
        shape.rotation.z += shape.rotationSpeed.z;
        
        // Floating motion
        shape.position.y += Math.sin(time + shape.floatOffset) * shape.floatSpeed;
        
        // Parallax effect based on mouse position
        shape.position.x += (targetX - shape.position.x * 0.01) * 0.001;
        shape.position.y += (targetY - shape.position.y * 0.01) * 0.001;
    });
    
    // Camera movement based on mouse
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (-targetY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Export initialization function
window.initThreeScene = initThreeScene;
