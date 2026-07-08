const initScrollReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  )

  document.querySelectorAll('.stats-grid, .cards-grid, .team-cards, .games-grid').forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.setProperty('--stagger', i)
    })
  })

  document.querySelectorAll('.stat-card, .feature-card, .team-card, .section-title, .cta-content, .game-card').forEach((el) => {
    observer.observe(el)
  })
}

const initNavbarScroll = () => {
  const navbar = document.querySelector('.navbar')
  if (!navbar) return

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href')
      if (href === '#') return
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })
}

const initMobileMenu = () => {
  const btn = document.querySelector('.mobile-menu-btn')
  const nav = document.querySelector('.nav-links')
  if (!btn || !nav) return

  btn.addEventListener('click', () => {
    btn.classList.toggle('active')
    if (nav.style.display === 'flex') {
      nav.style.display = 'none'
    } else {
      nav.style.display = 'flex'
      nav.style.position = 'absolute'
      nav.style.top = '64px'
      nav.style.left = '0'
      nav.style.right = '0'
      nav.style.flexDirection = 'column'
      nav.style.background = 'rgba(0, 0, 0, 0.95)'
      nav.style.padding = '24px'
      nav.style.backdropFilter = 'blur(20px)'
      nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.04)'
    }
  })
}

const initCounter = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          const target = parseInt(el.dataset.target)
          const duration = 1400
          const startTime = performance.now()

          const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            el.textContent = Math.floor(eased * target).toLocaleString()
            if (progress < 1) requestAnimationFrame(update)
          }

          requestAnimationFrame(update)
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.5 }
  )

  document.querySelectorAll('.stat-number').forEach((el) => observer.observe(el))
}

const initCardGlow = () => {
  document.querySelectorAll('.card').forEach((card) => {
    const glow = document.createElement('div')
    glow.className = 'card-glow-overlay'
    card.style.position = 'relative'
    card.insertBefore(glow, card.firstChild)

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--gx', ((e.clientX - rect.left) / rect.width) * 100 + '%')
      card.style.setProperty('--gy', ((e.clientY - rect.top) / rect.height) * 100 + '%')
      glow.style.opacity = '1'
    })

    card.addEventListener('mouseleave', () => {
      glow.style.opacity = '0'
    })
  })
}

const initNavbarEntrance = () => {
  const navbar = document.querySelector('.navbar')
  if (!navbar) return
  navbar.style.opacity = '0'
  setTimeout(() => {
    navbar.style.transition = 'opacity 0.5s ease'
    navbar.style.opacity = '1'
  }, 80)
}

const initButtonRipple = () => {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (btn.hasAttribute('data-coming-soon')) return
      const ripple = document.createElement('span')
      const rect = btn.getBoundingClientRect()
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:200px; height:200px;
        left:${e.clientX - rect.left}px; top:${e.clientY - rect.top}px;
        background:rgba(255,255,255,0.18);
        transform:translate(-50%,-50%) scale(0);
        animation:ripple 0.55s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
      `
      btn.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    })
  })
}

const initParallax = () => {
  const hero = document.querySelector('.hero')
  if (!hero) return
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      hero.style.backgroundPositionY = `calc(center + ${window.scrollY * 0.18}px)`
    }
  }, { passive: true })
}

const initComingSoon = () => {
  const toast = document.getElementById('toast')
  if (!toast) return
  let hideTimeout = null
  document.querySelectorAll('[data-coming-soon]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      toast.classList.add('show')
      clearTimeout(hideTimeout)
      hideTimeout = setTimeout(() => toast.classList.remove('show'), 2500)
    })
  })
}

const addGlobalStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ripple {
      to { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
    }
    .card-glow-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      opacity: 0;
      transition: opacity 0.35s ease;
      background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(11,79,255,0.1) 0%, transparent 55%);
      pointer-events: none;
      z-index: 0;
    }
  `
  document.head.appendChild(style)
}

document.addEventListener('DOMContentLoaded', () => {
  addGlobalStyles()
  initScrollReveal()
  initNavbarScroll()
  initSmoothScroll()
  initMobileMenu()
  initCounter()
  initComingSoon()
  initCardGlow()
  initNavbarEntrance()
  initButtonRipple()
  initParallax()
})
