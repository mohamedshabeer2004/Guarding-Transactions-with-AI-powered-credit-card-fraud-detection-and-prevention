// Mobile Navigation
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('active');
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
        }
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Fraud Detection Form
const transactionForm = document.getElementById('transactionForm');
const resultCard = document.getElementById('resultCard');
const riskLevel = document.getElementById('riskLevel');
const riskMeter = document.getElementById('riskMeter');
const safetyResult = document.getElementById('safetyResult');
const confidenceResult = document.getElementById('confidenceResult');
const factorList = document.getElementById('factorList');
const recommendation = document.getElementById('recommendation');

// Sample data for different risk scenarios
const riskScenarios = {
    low: {
        level: "Low Risk",
        safety: "Safe Transaction",
        confidence: "98% Confidence",
        meter: 15,
        color: "risk-low",
        factors: [
            "Normal transaction amount",
            "Local merchant location",
            "Typical spending category",
            "Regular time of day"
        ],
        recommendation: "This transaction appears normal based on cardholder's spending patterns."
    },
    medium: {
        level: "Medium Risk",
        safety: "Suspicious Activity",
        confidence: "85% Confidence",
        meter: 50,
        color: "risk-medium",
        factors: [
            "Higher than average amount",
            "International merchant",
            "Unusual category for cardholder",
            "Multiple recent transactions"
        ],
        recommendation: "Review transaction details and consider contacting cardholder for verification."
    },
    high: {
        level: "High Risk",
        safety: "Likely Fraudulent",
        confidence: "92% Confidence",
        meter: 85,
        color: "risk-high",
        factors: [
            "Very high transaction amount",
            "High risk country",
            "Luxury goods purchase",
            "Nighttime transaction",
            "Unusually high frequency"
        ],
        recommendation: "Strong indicators of fraud. Recommend blocking transaction and freezing account."
    }
};

transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const amount = parseFloat(document.getElementById('amount').value);
    const location = document.getElementById('location').value;
    const category = document.getElementById('category').value;
    const time = document.getElementById('time').value;
    const frequency = document.getElementById('frequency').value;
    
    // Determine risk level based on inputs (simplified for demo)
    let riskScenario;
    
    if ((location === 'international' || location === 'high_risk') && 
        (category === 'luxury' || category === 'gaming') && 
        (frequency === 'high' || frequency === 'very_high')) {
        riskScenario = riskScenarios.high;
    } else if ((location === 'domestic' || location === 'international') && 
               (amount > 500 || time === 'night' || frequency === 'high')) {
        riskScenario = riskScenarios.medium;
    } else {
        riskScenario = riskScenarios.low;
    }
    
    // Add some randomness to make it feel more realistic
    const randomVariation = Math.random() * 0.1 - 0.05; // +/- 5%
    riskScenario.meter = Math.min(100, Math.max(0, riskScenario.meter + randomVariation * 100));
    riskScenario.confidence = `${Math.min(99, Math.max(80, parseInt(riskScenario.confidence) + randomVariation * 10))}% Confidence`;
    
    // Update UI with results
    riskLevel.textContent = riskScenario.level;
    riskLevel.className = riskScenario.color;
    riskMeter.style.width = `${riskScenario.meter}%`;
    riskMeter.className = 'meter-fill ' + riskScenario.color;
    safetyResult.textContent = riskScenario.safety;
    confidenceResult.textContent = riskScenario.confidence;
    
    // Update factors list
    factorList.innerHTML = '';
    riskScenario.factors.forEach(factor => {
        const li = document.createElement('li');
        li.textContent = factor;
        factorList.appendChild(li);
    });
    
    // Update recommendation
    recommendation.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <p>${riskScenario.recommendation}</p>
    `;
    
    // Show result card with animation
    resultCard.style.opacity = '0';
    resultCard.style.transform = 'translateY(20px)';
    resultCard.style.display = 'block';
    
    setTimeout(() => {
        resultCard.style.opacity = '1';
        resultCard.style.transform = 'translateY(0)';
    }, 100);
});

// Animate elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .case-card, .demo-container, .about-content');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animated elements
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.feature-card, .case-card, .demo-container, .about-content');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger once on load
    animateOnScroll();
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);