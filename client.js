// Progressive enhancement for 나상현's site. Everything here is optional:
// without JS the nav shows under the bar, the copy button is absent, and the
// language links are plain links. Served with defer; must stay small (< 4 KB).
;(() => {
  const header = document.querySelector('.header')
  const btn = header && header.querySelector('.menu-btn')
  if (header && btn) {
    const openLabel = btn.getAttribute('aria-label')
    const closeLabel = btn.getAttribute('data-close-label') || openLabel
    const set = (open) => {
      header.dataset.nav = open ? 'open' : 'closed'
      btn.setAttribute('aria-expanded', String(open))
      btn.setAttribute('aria-label', open ? closeLabel : openLabel)
    }
    set(false)
    btn.addEventListener('click', () => set(header.dataset.nav !== 'open'))
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.dataset.nav === 'open') {
        set(false)
        btn.focus()
      }
    })
    const nav = document.getElementById(btn.getAttribute('aria-controls'))
    if (nav)
      nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) set(false)
      })
  }

  // Copy-email button (added only when scripting is available).
  const actions = document.querySelector('.contact__actions[data-email]')
  if (actions) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'btn btn--secondary btn--lg'
    b.innerHTML =
      '<span class="btn__idle"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-copy"/></svg></span>' +
      '<span class="btn__done"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-check"/></svg></span>'
    b.querySelector('.btn__idle').append(actions.dataset.copy)
    b.querySelector('.btn__done').append(actions.dataset.copied)
    const status = actions.querySelector('[role="status"]')
    let timer
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(actions.dataset.email)
      } catch {
        const t = document.createElement('textarea')
        t.value = actions.dataset.email
        document.body.append(t)
        t.select()
        document.execCommand('copy')
        t.remove()
      }
      b.dataset.state = 'copied'
      if (status) status.textContent = actions.dataset.copied
      clearTimeout(timer)
      timer = setTimeout(() => {
        delete b.dataset.state
      }, 2000)
    })
    actions.insertBefore(b, status)
  }

  // Keep the current #hash when switching languages.
  document.querySelectorAll('.lang__opt').forEach((a) =>
    a.addEventListener('click', () => {
      if (location.hash) a.href = a.getAttribute('href').split('#')[0] + location.hash
    }),
  )
})()
