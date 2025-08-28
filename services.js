// Pagination state
let currentCategory = 0;
let currentPage = 0;
const itemsPerPage = 3;
let servicesData = null;

// Load and display services from services.json
async function loadServices() {
    try {
        // Fallback: inline data if fetch fails
        const data = {
            "services": [
                {
                    "name": "Massages",
                    "sub-services": [
                        {
                            "name": "Therapeutic Massage",
                            "description": "Relieves pain, reduces stress, and aids healing using kneading, pressing, and stretching techniques tailored to individual needs."
                        },
                        {
                            "name": "Deep Tissue Massage",
                            "description": "Uses firm pressure and slow strokes to target deep muscles, easing chronic pain, tightness, and mobility issues."
                        },
                        {
                            "name": "Cupping Massage",
                            "description": "Silicone cups create suction to improve blood flow, reduce tension, and promote relaxation."
                        },
                        {
                            "name": "Sports Massage",
                            "description": "Targets muscles used in activity to enhance performance, reduce soreness, and prevent injuries."
                        },
                        {
                            "name": "Orthopedic Massage",
                            "description": "Supports recovery from injuries or surgeries by reducing swelling, easing pain, and restoring mobility."
                        },
                        {
                            "name": "Lymphatic Drainage Massage",
                            "description": "Gentle technique that improves lymph flow, reduces swelling, boosts immunity, and supports healing."
                        }
                    ]
                },
                {
                    "name": "Facials",
                    "sub-services": [
                        {
                            "name": "Halo Facial",
                            "description": "Customized treatment with cleansing, exfoliation, extractions, massage, masks, and advanced techniques for youthful, healthy skin."
                        },
                        {
                            "name": "Mini Dermaplanning",
                            "description": "30-minute exfoliation that removes facial hair, enhances product absorption, and creates a smooth base for makeup."
                        },
                        {
                            "name": "PCA Skin Chemical Peel",
                            "description": "45-minute peel that targets aging, acne, discoloration, and sensitivity, leaving skin rejuvenated and radiant."
                        }
                    ]
                },
                {
                    "name": "Waxing",
                    "sub-services": [
                        { 
                            "name": "Full Face", 
                            "description": "Removes unwanted hair from the entire face, leaving skin smooth and makeup-ready." 
                        },
                        { 
                            "name": "Underarms", 
                            "description": "Quick and effective hair removal that leaves underarms clean, smooth, and longer-lasting than shaving." 
                        },
                        { 
                            "name": "Full Legs", 
                            "description": "Removes hair from both legs, providing silky-smooth skin and slower regrowth compared to shaving." 
                        }
                    ]
                }      
            ]
        };

        // Try to fetch from file first, fall back to inline data
        let fetchedData;
        try {
            const response = await fetch('./services.json');
            fetchedData = await response.json();
        } catch (fetchError) {
            console.log('Using fallback data due to fetch error:', fetchError);
            fetchedData = data;
        }
        
        // Store services data globally
        servicesData = fetchedData;
        
        const servicesContainer = document.getElementById('services-container');
        const categoryButtons = document.getElementById('category-buttons');
        
        // Create category toggle buttons
        fetchedData.services.forEach((serviceCategory, index) => {
            const button = document.createElement('button');
            button.className = `category-button ${index === 0 ? 'active' : ''}`;
            button.textContent = serviceCategory.name;
            button.setAttribute('data-category', index);
            button.addEventListener('click', () => showCategory(index));
            categoryButtons.appendChild(button);
        });
        
        // Create service content container with pagination
        const serviceContent = document.createElement('div');
        serviceContent.className = 'service-content';
        serviceContent.id = 'service-content';
        
        // Create pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';
        paginationControls.innerHTML = `
            <button id="prev-btn" class="pagination-btn" onclick="changePage(-1)">‹</button>
            <span id="page-info" class="page-info"></span>
            <button id="next-btn" class="pagination-btn" onclick="changePage(1)">›</button>
        `;
        
        // Create content area for services
        const contentArea = document.createElement('div');
        contentArea.className = 'content-area';
        contentArea.id = 'content-area';
        
        serviceContent.appendChild(contentArea);
        serviceContent.appendChild(paginationControls);
        servicesContainer.appendChild(serviceContent);
        
        // Initialize first category
        showCategory(0);
    } catch (error) {
        console.error('Error loading services:', error);
        document.getElementById('services-container').innerHTML = '<p>Unable to load services at this time.</p>';
    }
}

// Function to show selected category
function showCategory(categoryIndex) {
    currentCategory = categoryIndex;
    currentPage = 0; // Reset to first page when switching categories
    
    // Update button states
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach((btn, index) => {
        btn.classList.toggle('active', index === categoryIndex);
    });
    
    // Render current page
    renderCurrentPage();
}

// Function to render current page of services
function renderCurrentPage() {
    const contentArea = document.getElementById('content-area');
    const services = servicesData.services[currentCategory]['sub-services'];
    const totalPages = Math.ceil(services.length / itemsPerPage);
    
    // Clear content area
    contentArea.innerHTML = '';
    
    // Calculate start and end indices for current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, services.length);
    
    // Create grid container for current page services
    const pageGrid = document.createElement('div');
    pageGrid.className = 'page-grid';
    
    // Add services for current page
    for (let i = startIndex; i < endIndex; i++) {
        const service = services[i];
        const subServiceCard = document.createElement('div');
        subServiceCard.className = 'sub-service-card';
        
        const subServiceName = document.createElement('h4');
        subServiceName.className = 'sub-service-name';
        subServiceName.textContent = service.name;
        
        const subServiceDesc = document.createElement('p');
        subServiceDesc.className = 'sub-service-description';
        subServiceDesc.textContent = service.description;
        
        subServiceCard.appendChild(subServiceName);
        subServiceCard.appendChild(subServiceDesc);
        pageGrid.appendChild(subServiceCard);
    }
    
    // Add empty cards to maintain consistent height
    const remainingSlots = itemsPerPage - (endIndex - startIndex);
    for (let i = 0; i < remainingSlots; i++) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'sub-service-card empty-card';
        emptyCard.style.visibility = 'hidden';
        pageGrid.appendChild(emptyCard);
    }
    
    contentArea.appendChild(pageGrid);
    
    // Update pagination controls
    updatePaginationControls(totalPages);
}

// Function to change page
function changePage(direction) {
    const services = servicesData.services[currentCategory]['sub-services'];
    const totalPages = Math.ceil(services.length / itemsPerPage);
    
    const newPage = currentPage + direction;
    
    if (newPage >= 0 && newPage < totalPages) {
        currentPage = newPage;
        renderCurrentPage();
    }
}

// Function to update pagination controls
function updatePaginationControls(totalPages) {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');
    
    // Update button states
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
    
    // Update page info
    if (totalPages > 1) {
        pageInfo.textContent = `${currentPage + 1} of ${totalPages}`;
        document.querySelector('.pagination-controls').style.display = 'flex';
    } else {
        pageInfo.textContent = '1 of 1';
        document.querySelector('.pagination-controls').style.display = 'flex';
    }
}

// Load services when the page loads
document.addEventListener('DOMContentLoaded', loadServices);
