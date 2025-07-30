
        document.addEventListener("DOMContentLoaded", function () {
            fetch('https://ipinfo.io/json?token=0b68842a329c44')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('ip-address').textContent = data.ip;
                    document.getElementById('visitor-region').textContent = `${data.city}, ${data.region}, ${data.country}`;
                    document.getElementById('timezone').textContent = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

                    const updateTime = () => {
                        const now = new Date();
                        const options = { timeZone: data.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' };
                        document.getElementById('current-time').textContent = now.toLocaleTimeString('bn-BD', options);
                    };
                    updateTime();
                    setInterval(updateTime, 1000);
                });

            // Battery
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    const updateBattery = () => {
                        document.getElementById('battery-level').textContent = Math.round(battery.level * 100) + '%';
                        document.getElementById('charging-status').textContent = battery.charging ? 'চার্জ হচ্ছে' : 'চার্জ হচ্ছে না';
                    };
                    updateBattery();
                    battery.addEventListener('levelchange', updateBattery);
                    battery.addEventListener('chargingchange', updateBattery);
                });
            }

            const ua = navigator.userAgent;
            const isMobile = /Mobi|Android/i.test(ua);
            const isTablet = /Tablet|iPad/i.test(ua);
            document.getElementById('device-type').textContent = isTablet ? 'ট্যাবলেট' : isMobile ? 'মোবাইল' : 'ডেস্কটপ';

            const os = /Windows/i.test(ua) ? 'Windows' : /Mac/i.test(ua) ? 'Mac' : /Linux/i.test(ua) ? 'Linux' : /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iOS/i.test(ua) ? 'iOS' : 'অজানা';
            document.getElementById('os').textContent = os;

            const browser = /Firefox/i.test(ua) ? 'Firefox' : /Edg/i.test(ua) ? 'Edge' : /Chrome/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : /Opera|OPR/i.test(ua) ? 'Opera' : 'অজানা';
            document.getElementById('browser').textContent = browser;

            const versionMatch = ua.match(/(Firefox|Chrome|Edg|Safari|Opera|OPR)\/(\d+\.\d+)/);
            document.getElementById('browser-version').textContent = versionMatch ? versionMatch[2] : 'অজানা';

            document.getElementById('platform').textContent = navigator.platform;
            document.getElementById('touch-support').textContent = 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'হ্যাঁ' : 'না';
            document.getElementById('online-status').textContent = navigator.onLine ? 'অনলাইনে' : 'অফলাইনে';
            document.getElementById('cookies-enabled').textContent = navigator.cookieEnabled ? 'হ্যাঁ' : 'না';
            document.getElementById('do-not-track').textContent = navigator.doNotTrack || 'অজানা';

            // GeoLocation
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    pos => {
                        const { latitude, longitude } = pos.coords;
                        document.getElementById('geolocation').textContent = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
                    },
                    err => {
                        document.getElementById('geolocation').textContent = 'অনুমতি নেই';
                    }
                );
            } else {
                document.getElementById('geolocation').textContent = 'সাপোর্ট নেই';
            }

            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            document.getElementById('connection-type').textContent = conn ? conn.effectiveType : 'অজানা';
            document.getElementById('screen-resolution').textContent = `${window.screen.width}x${window.screen.height}`;
            document.getElementById('cpu-cores').textContent = navigator.hardwareConcurrency || 'অজানা';
            document.getElementById('device-memory').textContent = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'অজানা';
            document.getElementById('language').textContent = navigator.language || 'অজানা';
        });

        // Global Variables
        let currentTheme = 'light';
        let visitorCount = parseInt(localStorage.getItem('visitorCount') || '1250');
        let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        let konamiIndex = 0;

        // DOM Elements
        const loader = document.getElementById('loader');
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const themeToggle = document.getElementById('themeToggle');
        const backToTop = document.getElementById('backToTop');
        const scrollProgress = document.getElementById('scrollProgress');
        const contactForm = document.getElementById('contactForm');
        const playBtn = document.getElementById('playBtn');
        const audioProgressBar = document.getElementById('audioProgress');
        const audioProgressFill = document.getElementById('audioProgressFill');
        const visitorCountElement = document.getElementById('visitorCount');
        const todayVisitorElement = document.getElementById('todayVisitor');

        // ব্রাউজারে আগে যতবার ভিজিট করেছেন সেটা LocalStorage থেকে নিন
        let count = localStorage.getItem('visitorCount');
        if (!count) {
            count = 0;
        } else {
            count = parseInt(count);
        }

        // কাউন্ট 1 বাড়ান
        count++;

        // LocalStorage-এ সেভ করুন
        localStorage.setItem('visitorCount', count);

        // UI-তে দেখান
        document.getElementById('visitorCount').textContent = count;
        document.getElementById('todayVisitor').textContent = count;

        // Initialize Website
        document.addEventListener('DOMContentLoaded', function () {
            // Hide loader after 3 seconds
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    showNotification('স্বাগতম!', 'মোরেলগঞ্জের ওয়েবসাইটে আপনাকে স্বাগতম জানাই', 'success');
                }, 500);
            }, 3000);

            // Initialize components
            initializeTheme();
            initializeNavigation();
            initializeScrollEffects();
            initializeAudioPlayer();
            initializeVisitorCounter();
            initializeAnimations();
            initializeContactForm();
            initializeEasterEgg();

            // Update visitor count
            updateVisitorCount();
        });

        // Theme Management
        function initializeTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);

            themeToggle.addEventListener('click', () => {
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                showNotification('থিম পরিবর্তন', `${newTheme === 'dark' ? 'ডার্ক' : 'লাইট'} মোডে পরিবর্তিত হয়েছে`, 'success');
            });
        }

        function setTheme(theme) {
            currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);

            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        // Navigation
        function initializeNavigation() {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-item a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Navbar scroll effect
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.style.background = 'var(--card-bg)';
                    navbar.style.backdropFilter = 'blur(20px)';
                } else {
                    navbar.style.background = 'var(--glass-bg)';
                    navbar.style.backdropFilter = 'blur(20px)';
                }
            });
        }

        // Scroll Effects
        function initializeScrollEffects() {
            // Scroll progress
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                scrollProgress.style.width = scrollPercent + '%';

                // Back to top button
                if (scrollTop > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });

            // Back to top functionality
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        }

        // Scroll to section function
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Audio Player

        let isPlaying = false;

        playBtn.addEventListener('click', toggleAudio);
        audioProgressBar.addEventListener('click', seekAudio);

        function toggleAudio() {
            if (!isPlaying) {
                playAudio();
            } else {
                pauseAudio();
            }
        }

        function playAudio() {
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            audioPlayer.play();
            animateAudioProgress();
            showNotification('অডিও', 'অডিও প্লে শুরু হয়েছে', 'success');
        }

        function pauseAudio() {
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            audioPlayer.pause();
            clearInterval(audioPlayer.progressInterval);
        }

        function animateAudioProgress() {
            clearInterval(audioPlayer.progressInterval);
            audioPlayer.progressInterval = setInterval(() => {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                audioProgressFill.style.width = progress + '%';
                if (audioPlayer.ended) {
                    pauseAudio();
                    audioProgressFill.style.width = '0%';
                }
            }, 100);
        }

        function seekAudio(e) {
            const rect = audioProgressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = clickX / rect.width;
            audioPlayer.currentTime = progress * audioPlayer.duration;
            audioProgressFill.style.width = (progress * 100) + '%';
        }

        // ✅ Notification
        function showNotification(title, message, type = 'info') {
            let box = document.getElementById('notificationBox');
            if (!box) {
                box = document.createElement('div');
                box.id = 'notificationBox';
                box.style.position = 'fixed';
                box.style.top = '20px';
                box.style.right = '20px';
                box.style.zIndex = '9999';
                document.body.appendChild(box);
            }

            const notification = document.createElement('div');
            notification.innerHTML = `<strong>${title}</strong><br>${message}`;
            notification.style.background = type === 'success' ? '#4caf50' : '#2196f3';
            notification.style.color = '#fff';
            notification.style.padding = '12px 16px';
            notification.style.marginTop = '10px';
            notification.style.borderRadius = '8px';
            notification.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';

            box.appendChild(notification);
            setTimeout(() => (notification.style.opacity = '1'), 100);
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }





        // Visitor Counter
        function initializeVisitorCounter() {
            const today = new Date().toDateString();
            const lastVisit = localStorage.getItem('lastVisit');

            if (lastVisit !== today) {
                visitorCount++;
                localStorage.setItem('visitorCount', visitorCount.toString());
                localStorage.setItem('lastVisit', today);
            }
        }

        function updateVisitorCount() {
            // Animate counter
            let current = 0;
            const target = visitorCount;
            const increment = target / 100;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                visitorCountElement.textContent = Math.floor(current);
                todayVisitorElement.textContent = Math.floor(current) + 1;
            }, 20);
        }

        // Animations
        function initializeAnimations() {
            // Intersection Observer for animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 1s ease forwards';
                        entry.target.style.opacity = '1';
                    }
                });
            }, observerOptions);

            // Observe all cards and sections
            document.querySelectorAll('.card, .timeline-item, .testimonial-card').forEach(el => {
                el.style.opacity = '0';
                observer.observe(el);
            });

            // Add hover effects to cards
            document.querySelectorAll('.card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                });
            });
        }

        // Contact Form
        const botToken = "8417711337:AAGDvBw-ZiVo16GpAH-Fn6XF4pq0KhYVTOw";
        const chatId = "7390565890";

        // ✅ Stylish Toast Notification Function
        function showNotification(title, message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<strong>${title}</strong><br>${message}`;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-20px)';
            }, 3500);
            setTimeout(() => toast.remove(), 4000);
        }

        // ✅ Contact Form Handler
        function initializeContactForm() {
            const contactForm = document.getElementById('contactForm');
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const formData = new FormData(contactForm);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');

                if (!name || !email || !message) {
                    showNotification('ত্রুটি', 'সব ফিল্ড পূরণ করুন', 'error');
                    return;
                }

                const submitBtn = contactForm.querySelector('.submit-btn');
                submitBtn.textContent = 'পাঠানো হচ্ছে...';
                submitBtn.disabled = true;

                // Get extra info: IP, Time, Device
                fetch("https://api.ipify.org?format=json")
                    .then(response => response.json())
                    .then(data => {
                        const ip = data.ip;
                        const now = new Date();
                        const date = now.toLocaleDateString();
                        const time = now.toLocaleTimeString();
                        const userAgent = navigator.userAgent;

                        const fullMessage = `
🔔 নতুন বার্তা প্রাপ্ত
👤 নাম: ${name}
📧 ইমেইল: ${email}
📝 বার্তা: ${message}


🌐 IP: ${ip}

📅 তারিখ: ${date}

⏰ সময়: ${time}

📱 ডিভাইস: ${userAgent}
                `;

                        // Send to Telegram Bot
                        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: fullMessage
                            })
                        })
                            .then(() => {
                                showNotification('সফল!', 'আপনার বার্তা পাঠানো হয়েছে ❤️‍🔥', 'success');
                                contactForm.reset();
                                submitBtn.textContent = 'পাঠান';
                                submitBtn.disabled = false;
                            })
                            .catch(() => {
                                showNotification('ত্রুটি', 'বার্তা পাঠানো যায়নি 😭', 'error');
                                submitBtn.textContent = 'পাঠান';
                                submitBtn.disabled = false;
                            });
                    })
                    .catch(() => {
                        showNotification('ত্রুটি', 'IP ঠিকানা আনতে সমস্যা হয়েছে', 'error');
                        submitBtn.textContent = 'পাঠান';
                        submitBtn.disabled = false;
                    });
            });
        }

        // ✅ Initialize
        document.addEventListener('DOMContentLoaded', initializeContactForm);




        // Modal Functions
        function openModal(imageSrc) {
            const modal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            modalImage.src = imageSrc;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modal = document.getElementById('imageModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Close modal when clicking outside
        window.addEventListener('click', function (event) {
            const modal = document.getElementById('imageModal');
            if (event.target === modal) {
                closeModal();
            }
        });

        // Notification System
        function showNotification(title, message, type = 'info') {
            const container = document.getElementById('notificationContainer');

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;

            const iconMap = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };

            notification.innerHTML = `
                <div class="notification-header">
                    <i class="notification-icon ${iconMap[type]}"></i>
                    <div class="notification-title">${title}</div>
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close">&times;</button>
            `;

            container.appendChild(notification);

            // Show notification
            setTimeout(() => notification.classList.add('show'), 100);

            // Auto hide after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => container.removeChild(notification), 300);
            }, 5000);

            // Close button functionality
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => container.removeChild(notification), 300);
            });
        }

        // Easter Egg - Konami Code
        function initializeEasterEgg() {
            document.addEventListener('keydown', function (e) {
                if (e.keyCode === konamiCode[konamiIndex]) {
                    konamiIndex++;
                    if (konamiIndex === konamiCode.length) {
                        activateEasterEgg();
                        konamiIndex = 0;
                    }
                } else {
                    konamiIndex = 0;
                }
            });
        }

        function activateEasterEgg() {
            // Add rainbow effect to entire page
            document.body.classList.add('konami-activated');

            // Show special notification
            const easterEggDiv = document.createElement('div');
            easterEggDiv.className = 'easter-egg-notification';
            easterEggDiv.innerHTML = '🎉 কোনামি কোড আবিষ্কার! 🎮<br>আপনি একটি গোপন বৈশিষ্ট্য আনলক করেছেন!';
            document.body.appendChild(easterEggDiv);

            // Remove after 3 seconds
            setTimeout(() => {
                document.body.removeChild(easterEggDiv);
                document.body.classList.remove('konami-activated');
            }, 3000);

            // Show notification
            showNotification('🎮 Easter Egg!', 'আপনি গোপন কোনামি কোড আবিষ্কার করেছেন!', 'success');
        }

        // Additional Interactive Features

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const rate = scrolled * -0.5;

            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });

        // Dynamic background for sections
        const sections = document.querySelectorAll('.section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const colors = [
                        'linear-gradient(135deg, #AAC9CE, #B6B4C2)',
                        'linear-gradient(135deg, #B6B4C2, #C9BBC8)',
                        'linear-gradient(135deg, #C9BBC8, #E5C1CD)',
                        'linear-gradient(135deg, #E5C1CD, #F3DBCF)',
                        'linear-gradient(135deg, #F3DBCF, #AAC9CE)'
                    ];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    document.body.style.background = randomColor;
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));

        // Auto-rotate testimonials (if more testimonials are added)
        let testimonialIndex = 0;
        const testimonials = document.querySelectorAll('.testimonial-card');

        if (testimonials.length > 1) {
            setInterval(() => {
                testimonials[testimonialIndex].style.display = 'none';
                testimonialIndex = (testimonialIndex + 1) % testimonials.length;
                testimonials[testimonialIndex].style.display = 'block';
            }, 5000);
        }

        // Add ripple effect to buttons
        document.querySelectorAll('button, .cta-button').forEach(button => {
            button.addEventListener('click', function (e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Weather widget simulation
        function displayWeather() {
            const weather = {
                temp: Math.floor(Math.random() * 6) + 28,
                condition: ['রৌদ্রোজ্জ্বল', 'মেঘলা', 'বৃষ্টি', 'ঝড়ো বাতাস'][Math.floor(Math.random() * 4)]
            };

            showNotification('🌤️ আজকের আবহাওয়া',
                `তাপমাত্রা: ${weather.temp}°C\nঅবস্থা: ${weather.condition}`, 'info');
        }

        // Call weather on page load
        setTimeout(displayWeather, 5000);

        // Floating Action Button events
        const fab = document.getElementById('fab');

        fab.addEventListener('mouseenter', () => {
            fab.style.transform = 'scale(1.1)';
            fab.style.boxShadow = '0 8px 30px rgba(240, 147, 251, 0.6)';
        });

        fab.addEventListener('mouseleave', () => {
            fab.style.transform = 'scale(1)';
            fab.style.boxShadow = '0 4px 20px rgba(240, 147, 251, 0.4)';
        });

        fab.addEventListener('click', displayWeather);