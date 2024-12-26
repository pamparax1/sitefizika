// Initialize Three.js Earth
function initEarth() {
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 15;

    // Create renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    
    // Setup container
    const earthContainer = document.getElementById('earth-3d');
    const updateSize = () => {
        const rect = earthContainer.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    };
    
    updateSize();
    earthContainer.appendChild(renderer.domElement);

    // Create starfield
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
        transparent: true
    });

    const starVertices = [];
    const starVelocities = [];
    const numStars = 3000;
    const spread = 1000;

    for (let i = 0; i < numStars; i++) {
        const x = (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread;
        const z = (Math.random() - 0.5) * spread;
        starVertices.push(x, y, z);
        
        // Add velocity for each star
        starVelocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create Earth
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const texture = new THREE.TextureLoader().load(
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        function(texture) {
            material.needsUpdate = true;
        }
    );
    
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 15,
        specular: new THREE.Color(0x333333)
    });
    
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (event) => {
        const rect = earthContainer.getBoundingClientRect();
        if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
            mouseX = (event.clientX - rect.width / 2) * 0.001;
            mouseY = (event.clientY - rect.height / 2) * 0.001;
        }
    });

    // Handle window resize
    window.addEventListener('resize', updateSize);

    // Animation
    function animate() {
        // Only animate if element is in viewport
        const rect = earthContainer.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            // Update star positions
            const positions = starGeometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += starVelocities[i/3].x;
                positions[i + 1] += starVelocities[i/3].y;
                positions[i + 2] += starVelocities[i/3].z;

                const distance = Math.sqrt(
                    positions[i] ** 2 + 
                    positions[i + 1] ** 2 + 
                    positions[i + 2] ** 2
                );

                if (distance > spread/2) {
                    positions[i] = (Math.random() - 0.5) * 200;
                    positions[i + 1] = (Math.random() - 0.5) * 200;
                    positions[i + 2] = (Math.random() - 0.5) * 200;
                }
            }
            starGeometry.attributes.position.needsUpdate = true;

            // Smooth camera movement
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;
            camera.position.x += (targetX - camera.position.x) * 0.1;
            camera.position.y += (-targetY - camera.position.y) * 0.1;
            camera.lookAt(scene.position);

            // Rotate earth
            earth.rotation.y += 0.002;

            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
    }

    animate();
}

// Active Missions Data
const missions = [
    {
        title: "Вояджър 1",
        description: "Изстрелян през 1977 г., Вояджър 1 е най-отдалеченият човешки обект от Земята, изследващ междузвездното пространство отвъд границите на нашата слънчева система.",
        category: "deep-space",
        status: "Активен",
        launchDate: "5 септември 1977",
        image: "./images/voyager1.jpg",
        details: {
            distance: "14.8 милиарда мили от Земята",
            speed: "38,000 мили в час",
            achievements: "Първият космически апарат в междузвездното пространство"
        }
    },
    {
        title: "Вояджър 2",
        description: "Следвайки различна траектория от своя близнак, Вояджър 2 е единственият космически апарат, посетил Уран и Нептун.",
        category: "deep-space",
        status: "Активен",
        launchDate: "20 август 1977",
        image: "./images/voyager2.jpg",
        details: {
            distance: "12.3 милиарда мили от Земята",
            speed: "34,390 мили в час",
            achievements: "Единственият апарат посетил Уран и Нептун"
        }
    },
    {
        title: "Междузвездна Мисия Вояджър",
        description: "Разширена мисия, фокусирана върху изучаването на външната хелиосфера и междузвездната среда, носеща Златния Запис като послание към потенциални извънземни цивилизации.",
        category: "research",
        status: "В процес",
        launchDate: "1989-Настояще",
        image: "./images/voyager-mission.jpg",
        details: {
            purpose: "Изучаване на междузвездното пространство",
            instruments: "Детектори за космически лъчи, плазма и магнитно поле",
            legacy: "Златен Запис - послание от Земята към космоса"
        }
    }
];

// Future Projects Data
const futureProjects = [
    {
        title: "Междузвездна Сонда",
        timeline: "2030-те",
        description: "Предложена мисия да последва стъпките на Вояджър, проектирана да изследва междузвездната среда с модерна технология",
        status: "В планиране"
    },
    {
        title: "Наследство на Данните от Вояджър",
        timeline: "2025-2030",
        description: "Проект за запазване и анализ на десетилетия данни от мисията Вояджър за бъдещите поколения",
        status: "В разработка"
    },
    {
        title: "Подобрение на Мрежата за Дълбок Космос",
        timeline: "2024-2025",
        description: "Подобряване на комуникационните възможности за поддържане на връзка с сондите Вояджър",
        status: "Активен"
    }
];

// Initialize mission cards
function initMissionCards() {
    const missionContainer = document.querySelector('.mission-grid');
    missions.forEach(mission => {
        const card = document.createElement('div');
        card.className = `mission-card ${mission.category}`;
        card.innerHTML = `
            <img src="${mission.image}" alt="${mission.title}" onerror="this.src='./images/voyager1.jpg'">
            <h3>${mission.title}</h3>
            <p>${mission.description}</p>
            <div class="mission-info">
                <span class="status ${mission.status.toLowerCase()}">${mission.status}</span>
                <span class="launch-date">Изстрелване: ${mission.launchDate}</span>
            </div>
        `;
        missionContainer.appendChild(card);
    });
}

// Initialize future projects
function initFutureProjects() {
    const projectContainer = document.querySelector('.project-timeline');
    futureProjects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'timeline-item';
        projectElement.innerHTML = `
            <div class="timeline-content">
                <h3>${project.title}</h3>
                <p class="timeline-date">${project.timeline}</p>
                <p>${project.description}</p>
                <span class="status">${project.status}</span>
            </div>
        `;
        projectContainer.appendChild(projectElement);
    });
}

// Filter missions
function initMissionFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            const cards = document.querySelectorAll('.mission-card');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            cards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initEarth();
    initMissionCards();
    initFutureProjects();
    initMissionFilters();
});