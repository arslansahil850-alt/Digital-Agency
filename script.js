const navbar = document.querySelector(".site-header");
const navbarToggle = document.querySelector(".navbar-toggle");
const mobileNavigation = document.querySelector(".mobile-navigation");
const mobileLinks = document.querySelectorAll(
    ".mobile-navigation-link, .mobile-navigation-cta"
);

function openMobileMenu() {
    navbarToggle.setAttribute("aria-expanded", "true");
    navbarToggle.setAttribute("aria-label", "Close navigation menu");
}

function closeMobileMenu() {
    navbarToggle.setAttribute("aria-expanded", "false");
    navbarToggle.setAttribute("aria-label", "Open navigation menu");
}

navbarToggle.addEventListener("click", function () {
    const isOpen =
        navbarToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        closeMobileMenu();
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 1000) {
        closeMobileMenu();
    }
});


/* Navbar scroll behavior */

window.addEventListener("scroll", function () {
    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


/* Smooth scrolling */

const allNavigationLinks = document.querySelectorAll(
    'a[href^="#"]'
);

allNavigationLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        const navbarHeight = navbar.offsetHeight;
        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    });
});


/* Active navigation */

const sections = document.querySelectorAll("main section[id]");
const desktopLinks = document.querySelectorAll(".navbar-link");

function updateActiveNavigation() {
    let currentSection = "";

    sections.forEach(function (section) {
        const sectionTop =
            section.offsetTop - navbar.offsetHeight - 100;

        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    desktopLinks.forEach(function (link) {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveNavigation);

updateActiveNavigation();

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) {
        return;
    }

    question.setAttribute("aria-expanded", "false");

    question.addEventListener("click", function () {
        const isOpen = item.classList.contains("active");

        faqItems.forEach(function (otherItem) {
            otherItem.classList.remove("active");

            const otherQuestion =
                otherItem.querySelector(".faq-question");

            if (otherQuestion) {
                otherQuestion.setAttribute("aria-expanded", "false");
            }
        });

        if (!isOpen) {
            item.classList.add("active");
            question.setAttribute("aria-expanded", "true");
        }
    });
});

/* Scroll reveal */

const revealElements = document.querySelectorAll(
    ".service-card, .work-card, .benefit-item, .process-card, .testimonial-card, .pricing-card, .about-content, .about-visual, .faq-item, .contact-content, .contact-form"
);

const revealObserver = new IntersectionObserver(
    function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(function (element) {
    element.classList.add("reveal");
    revealObserver.observe(element);
});


/* Counters */

const counters = document.querySelectorAll(".about-stat strong");
let countersStarted = false;

function startCounters() {
    if (countersStarted) {
        return;
    }

    countersStarted = true;

    counters.forEach(function (counter) {
        const target = parseInt(
            counter.textContent.replace(/\D/g, ""),
            10
        );

        if (isNaN(target)) {
            return;
        }

        const suffix = counter.textContent.replace(/[0-9]/g, "");
        let current = 0;

        const increment = Math.max(
            1,
            Math.ceil(target / 50)
        );

        function updateCounter() {
            current += increment;

            if (current >= target) {
                counter.textContent = target + suffix;
                return;
            }

            counter.textContent = current + suffix;
            requestAnimationFrame(updateCounter);
        }

        updateCounter();
    });
}

const counterSection = document.querySelector(".about-section");

if (counterSection) {
    const counterObserver = new IntersectionObserver(
        function (entries, observer) {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.disconnect();
            }
        },
        {
            threshold: 0.3
        }
    );

    counterObserver.observe(counterSection);
}


/* Contact form */

const contactForm = document.querySelector(".contact-form");
const formMessage = document.querySelector(".form-message");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        if (formMessage) {
            formMessage.textContent =
                "Thanks! Your project request has been received.";
            formMessage.style.display = "block";
        }

        contactForm.reset();
    });
}


/* Scroll reveal styles */

const revealStyle = document.createElement("style");

revealStyle.textContent = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition:
            opacity 0.7s ease,
            transform 0.7s ease;
    }

    .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }

    .site-header.scrolled .navbar {
        background: rgba(5, 7, 13, 0.92);
        box-shadow: 0 10px 35px rgba(0, 0, 0, 0.2);
    }
`;

document.head.appendChild(revealStyle);


const workFilters = document.querySelectorAll(".work-filter");
const workCards = document.querySelectorAll(".work-card");

workFilters.forEach(function (filter) {
    filter.addEventListener("click", function () {
        const selectedCategory = filter.dataset.filter;

        workFilters.forEach(function (button) {
            button.classList.toggle("active", button === filter);
        });

        workCards.forEach(function (card) {
            const category = card.dataset.category;

            card.hidden =
                selectedCategory !== "all" &&
                category !== selectedCategory;
        });
    });
});