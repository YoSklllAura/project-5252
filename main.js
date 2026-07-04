import './style.css'

const initParticles = () => {
  const container = document.getElementById('particles')
  if (!container) return

  const canvas = document.createElement('canvas')
  container.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let particles = []
  let animationId = null

  const resize = () => {
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
  }

  const createParticles = () => {
    const rect = container.getBoundingClientRect()
    const count = Math.min(80, Math.floor((rect.width * rect.height) / 12000))
    particles = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }
  }

  const draw = () => {
    const rect = container.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0) p.x = rect.width
      if (p.x > rect.width) p.x = 0
      if (p.y < 0) p.y = rect.height
      if (p.y > rect.height) p.y = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(11, 79, 255, ${p.opacity})`
      ctx.fill()
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(11, 79, 255, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animationId = requestAnimationFrame(draw)
  }

  resize()
  createParticles()
  draw()

  window.addEventListener('resize', () => {
    resize()
    createParticles()
  })

  return () => {
    if (animationId) cancelAnimationFrame(animationId)
  }
}

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
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  )

  document
    .querySelectorAll('.stat-card, .feature-card, .team-card, .section-title, .cta-content, .game-card')
    .forEach((el) => observer.observe(el))
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
    const isOpen = btn.classList.toggle('active')
    if (!isOpen) {
      nav.style.display = 'none'
      return
    }
    nav.style.display = 'flex'
    nav.style.position = 'absolute'
    nav.style.top = '64px'
    nav.style.left = '0'
    nav.style.right = '0'
    nav.style.flexDirection = 'column'
    nav.style.background = 'rgba(0, 0, 0, 0.97)'
    nav.style.padding = '24px'
    nav.style.gap = '20px'
    nav.style.backdropFilter = 'blur(20px)'
    nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.06)'
  })
}

const initCounter = () => {
  const statNumbers = document.querySelectorAll('.stat-number')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const target = parseInt(el.dataset.target, 10) || 0
        const duration = 1400
        const startTime = performance.now()

        const update = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          el.textContent = Math.floor(eased * target).toLocaleString()
          if (progress < 1) requestAnimationFrame(update)
        }

        requestAnimationFrame(update)
        observer.unobserve(el)
      })
    },
    { threshold: 0.5 }
  )

  statNumbers.forEach((el) => observer.observe(el))
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

const initCardTilt = () => {
  const cards = document.querySelectorAll('.card')

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`
      card.style.transition = 'transform 0.1s ease'

      card.style.setProperty('--x', `${(x / rect.width) * 100}%`)
      card.style.setProperty('--y', `${(y / rect.height) * 100}%`)
    })

    card.addEventListener('mouseleave', () => {
      card.style.transform = ''
      card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    })
  })
}

const initMagneticButtons = () => {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
    })

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = ''
    })
  })
}

const initButtonRipple = () => {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ripple {
      0% { width: 0; height: 0; opacity: 0.35; }
      100% { width: 260px; height: 260px; opacity: 0; }
    }
  `
  document.head.appendChild(style)

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (btn.hasAttribute('data-coming-soon')) return

      const ripple = document.createElement('span')
      Object.assign(ripple.style, {
        position: 'absolute',
        width: '0',
        height: '0',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.25)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        animation: 'ripple 0.5s ease-out',
      })

      const rect = btn.getBoundingClientRect()
      ripple.style.left = `${e.clientX - rect.left}px`
      ripple.style.top = `${e.clientY - rect.top}px`

      btn.appendChild(ripple)
      setTimeout(() => ripple.remove(), 500)
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initParticles()
  initScrollReveal()
  initNavbarScroll()
  initSmoothScroll()
  initMobileMenu()
  initCounter()
  initComingSoon()
  initCardTilt()
  initMagneticButtons()
  initButtonRipple()
})