// Progressive enhancement only. Without JS the nav stays solid, the copy button is absent,
// and the language links are plain links.
;(() => {
  const nav = document.querySelector('.nav')
  const sentinel = document.querySelector('.hero__sentinel')
  if (nav && sentinel && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      nav.dataset.state = entry.boundingClientRect.top > 0 ? 'over' : 'solid'
    })
    io.observe(sentinel)
  }

  document.querySelectorAll('.nav__mobile').forEach((menu) => {
    menu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => { menu.open = false }),
    )
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        menu.open = false
        menu.querySelector('summary').focus()
      }
    })
    document.addEventListener('pointerdown', (event) => {
      if (!menu.contains(event.target)) menu.open = false
    })
  })

  document.querySelectorAll('[data-copy-email]').forEach((holder) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'btn btn--light btn--copy'
    b.innerHTML =
      '<svg class="icon" aria-hidden="true" focusable="false"><use href="/sprite.svg#i-copy"/></svg><span class="btn__label"></span>'
    const label = b.querySelector('.btn__label')
    label.textContent = holder.dataset.copy
    const live = holder.querySelector('[role="status"]')
    let timer
    b.addEventListener('click', async () => {
      const text = holder.dataset.copyEmail
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        const t = document.createElement('textarea')
        t.value = text
        document.body.append(t)
        t.select()
        document.execCommand('copy')
        t.remove()
      }
      label.textContent = holder.dataset.copied
      b.querySelector('use').setAttribute('href', '/sprite.svg#i-check')
      if (live) live.textContent = holder.dataset.copied
      clearTimeout(timer)
      timer = setTimeout(() => {
        label.textContent = holder.dataset.copy
        b.querySelector('use').setAttribute('href', '/sprite.svg#i-copy')
      }, 2000)
    })
    holder.insertBefore(b, live)
  })

  // Keep the current #hash when switching languages.
  document.querySelectorAll('.lang__opt').forEach((a) =>
    a.addEventListener('click', () => {
      if (location.hash) a.href = a.getAttribute('href').split('#')[0] + location.hash
    }),
  )
})()
