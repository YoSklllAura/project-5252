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
  let mouse = { x: null, y: null }

  const resize = () => {
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
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

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
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

  const onMouseMove = (e) => {
    const rect = container.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  }

  const onMouseLeave = () => {
    mouse.x = null
    mouse.y = null
  }

  resize()
  createParticles()
  draw()

  window.addEventListener('resize', () => {
    resize()
    createParticles()
  })
  container.addEventListener('mousemove', onMouseMove)
  container.addEventListener('mouseleave', onMouseLeave)

  return () => {
    if (animationId) cancelAnimationFrame(animationId)
    container.removeEventListener('mousemove', onMouseMove)
    container.removeEventListener('mouseleave', onMouseLeave)
  }
}

const initScrollReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  document.querySelectorAll('.stat-card, .feature-card, .team-card, .section-title, .cta-content, .game-card').forEach((el) => {
    observer.observe(el)
  })
}

const initNavbarScroll = () => {
  const navbar = document.querySelector('.navbar')
  if (!navbar) return

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
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
  const statNumbers = document.querySelectorAll('.stat-number')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          const target = parseInt(el.dataset.target)
          let current = 0
          const duration = 1500
          const startTime = performance.now()

          const update = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            current = Math.floor(eased * target)
            el.textContent = current.toLocaleString()
            if (progress < 1) {
              requestAnimationFrame(update)
            }
          }

          requestAnimationFrame(update)
          observer.unobserve(el)
        }
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

  const showToast = () => {
    toast.classList.add('show')
    clearTimeout(hideTimeout)
    hideTimeout = setTimeout(() => {
      toast.classList.remove('show')
    }, 2500)
  }

  document.querySelectorAll('[data-coming-soon]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      showToast()
    })
  })
}

const initCardTilt = () => {
  const cards = document.querySelectorAll('.card')

  const onMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`
    card.style.transition = 'transform 0.1s ease'
  }

  const onMouseLeave = (e) => {
    const card = e.currentTarget
    card.style.transform = ''
    card.style.transition = 'all 0.35s ease'
  }

  cards.forEach((card) => {
    card.addEventListener('mousemove', onMouseMove)
    card.addEventListener('mouseleave', onMouseLeave)
  })
}

const initParallax = () => {
  const particles = document.getElementById('particles')
  if (!particles) return

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY
    particles.style.transform = `translateY(${scrollY * 0.3}px)`
  }, { passive: true })
}

const initStagger = () => {
  const cards = document.querySelectorAll('.stat-card')
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`
  })

  const featureCards = document.querySelectorAll('.feature-card')
  featureCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.12}s`
  })

  const teamCards = document.querySelectorAll('.team-card')
  teamCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.12}s`
  })
}

const initMagneticButtons = () => {
  const buttons = document.querySelectorAll('.btn')

  const onMouseMove = (e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`
  }

  const onMouseLeave = (e) => {
    const btn = e.currentTarget
    btn.style.transform = ''
  }

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', onMouseMove)
    btn.addEventListener('mouseleave', onMouseLeave)
  })
}

const initLogoShine = () => {
  const logos = document.querySelectorAll('.logo')
  logos.forEach((logo) => {
    logo.addEventListener('mouseenter', () => {
      const accent = logo.querySelector('.logo-accent')
      if (accent) {
        accent.style.textShadow = '0 0 40px rgba(11, 79, 255, 0.8), 0 0 80px rgba(11, 79, 255, 0.4)'
      }
    })
    logo.addEventListener('mouseleave', () => {
      const accent = logo.querySelector('.logo-accent')
      if (accent) {
        accent.style.textShadow = '0 0 20px rgba(11, 79, 255, 0.4)'
      }
    })
  })
}

const initTextReveal = () => {
  const heroContent = document.querySelector('.hero-content')
  if (!heroContent) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 }
  )

  observer.observe(heroContent)
}

const initButtonClick = () => {
  const buttons = document.querySelectorAll('.btn')
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (btn.hasAttribute('data-coming-soon')) return

      const ripple = document.createElement('span')
      ripple.style.position = 'absolute'
      ripple.style.width = '0'
      ripple.style.height = '0'
      ripple.style.borderRadius = '50%'
      ripple.style.background = 'rgba(255, 255, 255, 0.3)'
      ripple.style.transform = 'translate(-50%, -50%)'
      ripple.style.pointerEvents = 'none'
      ripple.style.animation = 'ripple 0.5s ease-out'

      const rect = btn.getBoundingClientRect()
      ripple.style.left = (e.clientX - rect.left) + 'px'
      ripple.style.top = (e.clientY - rect.top) + 'px'

      btn.appendChild(ripple)
      setTimeout(() => ripple.remove(), 500)
    })
  })
}

const addRippleStyle = () => {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ripple {
      0% { width: 0; height: 0; opacity: 0.5; }
      100% { width: 300px; height: 300px; opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

const initCardGlow = () => {
  const cards = document.querySelectorAll('.card')
  cards.forEach((card) => {
    const glow = document.createElement('div')
    glow.style.position = 'absolute'
    glow.style.inset = '0'
    glow.style.borderRadius = '16px'
    glow.style.opacity = '0'
    glow.style.transition = 'opacity 0.3s ease'
    glow.style.background = 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(11, 79, 255, 0.12) 0%, transparent 60%)'
    glow.style.pointerEvents = 'none'
    glow.style.zIndex = '0'
    card.style.position = 'relative'
    card.insertBefore(glow, card.firstChild)

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      card.style.setProperty('--x', x + '%')
      card.style.setProperty('--y', y + '%')
      glow.style.opacity = '1'
    })

    card.addEventListener('mouseleave', () => {
      glow.style.opacity = '0'
    })
  })
}

const initNavbarEntrance = () => {
  const navbar = document.querySelector('.navbar')
  if (navbar) {
    navbar.style.opacity = '0'
    navbar.style.transform = 'translateY(-20px)'
    navbar.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    setTimeout(() => {
      navbar.style.opacity = '1'
      navbar.style.transform = 'translateY(0)'
    }, 100)
  }
}

const initFloatingElements = () => {
  const icons = document.querySelectorAll('.card-icon, .team-avatar')
  icons.forEach((icon, index) => {
    icon.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`
    icon.style.animationDelay = `${index * 0.3}s`
  })
}

document.addEventListener('DOMContentLoaded', () => {
  addRippleStyle()
  initParticles()
  initScrollReveal()
  initNavbarScroll()
  initSmoothScroll()
  initMobileMenu()
  initCounter()
  initComingSoon()
  initCardTilt()
  initParallax()
  initStagger()
  initMagneticButtons()
  initLogoShine()
  initTextReveal()
  initButtonClick()
  initCardGlow()
  initNavbarEntrance()
  initFloatingElements()
})
