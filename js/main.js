document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.slide, 10);
      showSlide(idx);
      startSlideTimer();
    });
  });

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopSlideTimer);
    heroSection.addEventListener('mouseleave', startSlideTimer);
  }

  startSlideTimer();

  // ----------------- 2. ACCORDION (FAQ) -----------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');


      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    firstItem.classList.add('active');
    const firstAnswer = firstItem.querySelector('.faq-answer');
    if (firstAnswer) firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }

  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInSlide 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  let cart = [];
  const cartBtn = document.querySelector('.cart-btn');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-drawer-overlay');
  const closeDrawerBtn = document.querySelector('.close-drawer-btn');
  const cartCountEl = document.querySelector('.cart-badge');
  const cartTotalEl = document.querySelector('.cart-total-text');
  const cartItemsContainer = document.querySelector('.cart-drawer-items');
  const cartSubtotalEl = document.querySelector('.cart-subtotal-val');

  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  const addCartButtons = document.querySelectorAll('.btn-add-cart');
  addCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const title = button.dataset.title;
      const price = parseInt(button.dataset.price, 10);
      const img = button.dataset.img;

      const existing = cart.find(item => item.title === title);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ title, price, img, qty: 1 });
      }

      updateCartUI();
      showToast(`Added "${title}" to your cart!`);
      openCart();
    });
  });

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (cartCountEl) cartCountEl.textContent = totalCount;
    if (cartTotalEl) cartTotalEl.textContent = `₨${totalPrice.toLocaleString()}.00`;
    if (cartSubtotalEl) cartSubtotalEl.textContent = `₨${totalPrice.toLocaleString()}.00`;

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <i class="fas fa-shopping-bag"></i>
          <p>Your cart is currently empty.</p>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-price">${item.qty} × ₨${item.price.toLocaleString()}</div>
          </div>
          <button class="cart-item-remove" data-index="${idx}" title="Remove item">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `).join('');

     
      cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(rmBtn => {
        rmBtn.addEventListener('click', () => {
          const idx = parseInt(rmBtn.dataset.index, 10);
          cart.splice(idx, 1);
          updateCartUI();
        });
      });
    }
  }


  const checkoutBtn = document.querySelector('.cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty! Please add a product first.');
        return;
      }
      const itemsList = cart.map(i => `${i.qty}x ${i.title}`).join(', ');
      const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const text = encodeURIComponent(`Hi Utools, I would like to purchase: ${itemsList} (Total: Rs ${total.toLocaleString()}). Please guide me with payment details.`);
      window.open(`https://wa.me/923174919997?text=${text}`, '_blank');
    });
  }

  // ----------------- 5. TOAST NOTIFICATION -----------------
  let toastTimer = null;
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  const searchInputs = document.querySelectorAll('.header-search-input');
  const searchDropdown = document.querySelector('.header-search-dropdown');

  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        if (searchDropdown) searchDropdown.classList.remove('active');
        return;
      }

      const matches = Array.from(productCards).filter(c => {
        const title = c.querySelector('.product-title').textContent.toLowerCase();
        return title.includes(query);
      });

      if (searchDropdown) {
        if (matches.length > 0) {
          searchDropdown.innerHTML = matches.map(c => {
            const title = c.querySelector('.product-title').textContent.trim();
            const price = c.querySelector('.price-current').textContent.trim();
            const img = c.querySelector('.product-image-wrap img').src;
            return `
              <div class="search-result-item" data-title="${title}">
                <img src="${img}" alt="${title}" class="search-result-img">
                <div class="search-result-info">
                  <h6>${title}</h6>
                  <span>${price}</span>
                </div>
              </div>
            `;
          }).join('');
          searchDropdown.classList.add('active');

          searchDropdown.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
              const targetTitle = item.dataset.title;
              document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
              productCards.forEach(c => {
                if (c.querySelector('.product-title').textContent.trim() === targetTitle) {
                  c.style.display = 'flex';
                  c.style.boxShadow = '0 0 0 3px #0070f0';
                  setTimeout(() => { c.style.boxShadow = ''; }, 3000);
                }
              });
              searchDropdown.classList.remove('active');
              input.value = '';
            });
          });
        } else {
          searchDropdown.innerHTML = `<div style="padding:12px; font-size:12.5px; color:#6b7280; text-align:center;">No products found</div>`;
          searchDropdown.classList.add('active');
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = input.value.trim().toLowerCase();
        if (!query) return;
        document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
        productCards.forEach(c => {
          if (c.querySelector('.product-title').textContent.toLowerCase().includes(query)) {
            c.style.display = 'flex';
          } else {
            c.style.display = 'none';
          }
        });
        if (searchDropdown) searchDropdown.classList.remove('active');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search-wrap') && searchDropdown) {
      searchDropdown.classList.remove('active');
    }
  });

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input.value) {
        showToast(`Thank you! ${input.value} has been subscribed to Utools updates.`);
        input.value = '';
      }
    });
  }

  const mobileToggle = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const closeMobileBtn = document.querySelector('.close-mobile-nav-btn');

  function openMobileNav() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
  if (closeMobileBtn) closeMobileBtn.addEventListener('click', closeMobileNav);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (header) {
      if (window.scrollY > 40) {
        header.style.boxShadow = '0 6px 20px rgba(8, 24, 48, 0.08)';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(8, 24, 48, 0.04)';
      }
    }
  });
});
