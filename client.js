// Progressive enhancement only. Without JS: the header is a list of anchor links, every panel is
// visible, and the language links are plain links.
// The inline script in <head> has already added class "js" and data-tab (from the URL hash) to <html>.
;(() => {
  const root = document.documentElement
  const list = document.querySelector('.tabs__list')
  const panels = [...document.querySelectorAll('.panel')]

  if (list && panels.length) {
    const tabs = [...list.querySelectorAll('.tabs__tab')]
    const nav = document.querySelector('.nav')
    const box = document.querySelector('.panels')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')

    // ARIA tabs pattern (automatic activation, roving tabindex).
    list.setAttribute('role', 'tablist')
    for (const tab of tabs) {
      const panel = document.getElementById(tab.dataset.tab)
      tab.setAttribute('role', 'tab')
      tab.setAttribute('aria-controls', panel.id)
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('aria-labelledby', tab.id)
    }

    const select = (id, focus) => {
      for (const tab of tabs) {
        const on = tab.dataset.tab === id
        tab.setAttribute('aria-selected', String(on))
        tab.tabIndex = on ? 0 : -1
        if (on && focus) tab.focus()
      }
      root.dataset.tab = id
    }

    // After a switch, bring the top of the panels back under the sticky header if it scrolled away.
    const reveal = () => {
      const top = box.getBoundingClientRect().top + scrollY - nav.getBoundingClientRect().bottom - 12
      if (scrollY > top) scrollTo({ top, behavior: reduce.matches ? 'auto' : 'smooth' })
    }

    // The hash names a panel or any element inside one. Other hashes (old section ids) keep the tab
    // the inline head script chose from its id map; anything unknown falls back to the first tab.
    const fromHash = () => {
      let id = location.hash.slice(1)
      try {
        id = decodeURIComponent(id)
      } catch {}
      const target = id && document.getElementById(id)
      const panel = target && target.closest('.panel')
      const known = tabs.some((tab) => tab.dataset.tab === root.dataset.tab)
      select(panel ? panel.id : known ? root.dataset.tab : tabs[0].dataset.tab)
      if (panel && target !== panel) target.scrollIntoView({ block: 'start' })
    }

    list.addEventListener('click', (event) => {
      const tab = event.target.closest('.tabs__tab')
      if (!tab) return
      event.preventDefault()
      const id = tab.dataset.tab
      if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
      select(id)
      reveal()
    })

    list.addEventListener('keydown', (event) => {
      const i = tabs.indexOf(document.activeElement)
      if (i < 0) return
      if (event.key === ' ') {
        event.preventDefault()
        tabs[i].click()
        return
      }
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[event.key]
      if (next === undefined) return
      event.preventDefault()
      const tab = tabs[(next + tabs.length) % tabs.length]
      history.replaceState(null, '', `#${tab.dataset.tab}`)
      select(tab.dataset.tab, true)
      reveal()
    })

    addEventListener('popstate', fromHash)
    addEventListener('hashchange', fromHash)
    fromHash()

    // Printing shows every panel (CSS) and every item's details.
    let opened = []
    addEventListener('beforeprint', () => {
      opened = [...document.querySelectorAll('details:not([open])')]
      for (const d of opened) d.open = true
    })
    addEventListener('afterprint', () => {
      for (const d of opened) d.open = false
      opened = []
    })
  }

  // Keep the current #hash when switching languages.
  for (const a of document.querySelectorAll('.lang__opt')) {
    a.addEventListener('click', () => {
      if (location.hash) a.href = a.getAttribute('href').split('#')[0] + location.hash
    })
  }
})()
