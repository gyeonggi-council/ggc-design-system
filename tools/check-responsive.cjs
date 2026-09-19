// Run: node tools/check-responsive.cjs [--baseline]
const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const baseline = process.argv.includes('--baseline');
const out = path.join(root, 'docs/design-evidence', baseline ? 'before' : 'after');
const pages = ['index', 'tokens', 'components', 'components-forms', 'components-nav', 'components-overlay', 'dashboard', 'explore', 'wizard', 'login', 'public/index', 'public/list', 'public/detail', 'public/form', ...(!baseline ? ['examples-standalone'] : [])];
const sizes = [320, 390, 768, 1024, 1440, 1920];
const url = name => pathToFileURL(path.join(root, 'design/examples', name + '.html')).href;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.GGC_CHROME || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : chromium.executablePath()) });
  const results = [], errors = [];
  const interactions = [];
  try {
    for (const name of pages) {
      const page = await browser.newPage();
      page.on('pageerror', e => errors.push(name + ': ' + e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(name + ': ' + m.text()); });
      for (const width of sizes) {
        await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
        await page.goto(url(name));
        await page.evaluate(() => document.fonts.ready);
        const metrics = await page.evaluate(() => {
          const d = document.documentElement;
          const first = [...document.querySelectorAll('main .ggc-list-row, main table tbody tr, main .ggc-work-record, main .ggc-field input, main .ggc-field textarea')].find(e => e.getClientRects().length);
          const record = [...document.querySelectorAll('main .ggc-list-row, main table tbody tr, main .ggc-work-record')].find(e => e.getClientRects().length);
          const culprits = d.scrollWidth > d.clientWidth ? [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > d.clientWidth + 1 && r.width && !e.closest('.ggc-lnb, .ggc-main-menu, .ggc-table-wrap, .ex-code'); }).slice(0, 8).map(e => ({ tag: e.tagName, class: e.className, text: e.textContent.slice(0, 60), right: e.getBoundingClientRect().right })) : [];
          return { overflow: d.scrollWidth - d.clientWidth, height: d.scrollHeight, firstContentY: first ? Math.round(first.getBoundingClientRect().top) : null, firstRecordY: record ? Math.round(record.getBoundingClientRect().top) : null, ...(culprits.length ? { culprits } : {}) };
        });
        results.push({ page: name, width, ...metrics });
        if (['dashboard', 'explore', 'wizard'].includes(name) && [390, 1440].includes(width)) {
          await page.screenshot({ path: path.join(out, name + '-' + width + '.png') });
        }
      }
      await page.close();
    }
    fs.writeFileSync(path.join(out, 'responsive.json'), JSON.stringify({ results, errors }, null, 2) + '\n');
    console.log(JSON.stringify({ checks: results.length, overflow: results.filter(r => r.overflow > 0), errors, work: results.filter(r => ['dashboard', 'explore', 'wizard'].includes(r.page) && [390, 1440].includes(r.width)) }, null, 2));
    if (!baseline) {
      assert.equal(results.filter(r => r.overflow > 0).length, 0, 'Page overflow');
      assert.equal(errors.length, 0, 'Browser errors');
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      page.setDefaultTimeout(6000);
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
      for (const name of pages.filter(n => !n.startsWith('public/') && n !== 'login')) {
        await page.goto(url(name));
        const toggle = page.locator('.ggc-shell > .ggc-gnb [data-ggc-drawer-toggle]');
        assert.equal(await page.locator('.ggc-lnb').evaluate(e => e.inert), true, name + ' closed menu is inert');
        await toggle.click();
        assert.equal(await page.locator('.ggc-lnb').getAttribute('aria-modal'), 'true');
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.evaluate(() => document.activeElement.closest('.ggc-lnb') !== null), true);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.ggc-drawer-close').evaluate(e => e === document.activeElement), true);
        await page.keyboard.press('Escape');
        assert.equal(await toggle.evaluate(e => e === document.activeElement), true);
        await toggle.click();
        await page.setViewportSize({ width: 1440, height: 900 });
        // The matchMedia change handler can run after viewport sizing resolves.
        await page.waitForFunction(() => !document.documentElement.hasAttribute('data-ggc-drawer-active'));
        assert.equal(await page.evaluate(() => document.documentElement.hasAttribute('data-ggc-drawer-active')), false);
        await toggle.click(); assert.equal(await page.locator('.ggc-lnb').evaluate(e => e.classList.contains('ggc-lnb--icon')), true);
        await toggle.click();
        await page.setViewportSize({ width: 390, height: 844 });
      }
      interactions.push('10 shell pages: menu open/close, focus trap/restore, resize unlock, desktop collapse');
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
        await page.goto(url('explore'));
        if (width === 1440) {
          const visibleRows = await page.locator('.ggc-work-results tbody tr').evaluateAll(rows => rows.filter(r => r.getBoundingClientRect().bottom <= innerHeight).length);
          assert.ok(visibleRows >= 15, 'Desktop must show 15 complete rows; got ' + visibleRows);
        }
        await page.locator('#work-q').fill('청년');
        assert.match(await page.locator('[data-work-count]').innerText(), /2건/);
        const downloadEvent = page.waitForEvent('download'); await page.locator('[data-work-export]').click();
        const csv = fs.readFileSync(await (await downloadEvent).path(), 'utf8');
        assert.equal(csv.trim().split('\r\n').length, 3, 'Filtered export includes header and two matching records');
        assert.match(csv, /2026-0147/);
        await page.locator('#work-q').fill('존재하지않는의안'); assert.equal(await page.locator('.ggc-work-results .ggc-empty').isVisible(), true);
        await page.getByRole('button', { name: '검색 조건 초기화', exact: true }).click();
        await page.locator('.ggc-work-filter > details > summary').click();
        await page.locator('#work-c').selectOption({ label: '기획재정위원회' });
        assert.match(await page.locator('[data-work-count]').innerText(), /5건/);
        await page.locator('#work-s').selectOption({ label: '접수' }); assert.match(await page.locator('[data-work-count]').innerText(), /1건/);
        await noOverflow();
        await page.locator('button[type=reset]').click(); await page.locator('.ggc-work-filter > details > summary').click();
        await page.locator('#work-sort').selectOption('oldest');
        const first = width === 390 ? page.locator('.ggc-work-record h2 a').first() : page.locator('.ggc-work-results tbody a').first();
        await first.click(); assert.match(await page.locator('#work-dialog').innerText(), /2026-0127/);
        assert.equal(await page.locator('#work-dialog dt').count(), 8); await page.getByRole('button', { name: '닫기', exact: true }).click();
        if (width === 1440) await page.locator('[data-work-view]').click();
        await page.locator('.ggc-work-record details summary').first().click();
        assert.equal(await page.locator('.ggc-work-record').first().locator('dt').count(), 8); await noOverflow();
        const seen = [];
        do {
          seen.push(...await page.locator('.ggc-work-record code').allTextContents());
          if (await page.locator('.ggc-pagination').getByRole('button', { name: '다음', exact: true }).isDisabled()) break;
          await page.locator('.ggc-pagination').getByRole('button', { name: '다음', exact: true }).click();
        } while (seen.length < 100);
        assert.equal(new Set(seen).size, 21, 'All records reachable in both layouts');
        await page.locator('[data-work-view]').click(); await noOverflow();
        await page.goto(url('wizard'));
        await page.locator('#w5').fill('검토 후 수정한 예시 조문');
        if (width === 390) {
          await page.locator('[data-work-pane=secondary]').click();
          assert.equal(await page.getByText('유사 조례', { exact: true }).last().isVisible(), true);
          await page.screenshot({ path: path.join(out, 'wizard-reference-390.png') });
          await page.locator('[data-work-pane=primary]').click();
        }
        assert.equal(await page.locator('#w5').inputValue(), '검토 후 수정한 예시 조문');
        await page.getByRole('button', { name: '조문 직접 추가', exact: true }).click();
        await page.locator('#work-extra-1').fill('추가 조문 예시');
        await page.locator('[data-work-save]').click(); await page.reload();
        assert.equal(await page.locator('#w5').inputValue(), '검토 후 수정한 예시 조문');
        assert.equal(await page.locator('#work-extra-1').inputValue(), '추가 조문 예시');
        await page.locator('main > .ggc-wizard').getByRole('button', { name: '1단계 개요 설정', exact: true }).click();
        await page.locator('#w1').fill('');
        await page.locator('main > .ggc-wizard').getByRole('button', { name: '4단계 검토 · 제출', exact: true }).click();
        await page.locator('[data-work-next]').click(); assert.equal(await page.locator('#w1').evaluate(e => e === document.activeElement), true);
        await page.locator('#w1').fill('반응형 검증 예시 조례');
        await page.locator('main > .ggc-wizard').getByRole('button', { name: '4단계 검토 · 제출', exact: true }).click();
        const draftEvent = page.waitForEvent('download'); await page.locator('[data-work-next]').click();
        const draft = fs.readFileSync(await (await draftEvent).path(), 'utf8'); assert.match(draft, /반응형 검증 예시 조례/); assert.equal(draft.split('추가 조문 예시').length, 2);
        await noOverflow();
        await page.evaluate(() => localStorage.clear());
        interactions.push(width + ': search, filters, reset, empty, sort, 21 records, 8 fields, detail, CSV, view switch, wizard steps, reference, persistence, additional clauses, validation, export');
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(url('dashboard')); await page.locator('[data-work-pane=secondary]').click(); await noOverflow();
      assert.equal(await page.getByText('이번 주 일정', { exact: true }).isVisible(), true);
      await page.screenshot({ path: path.join(out, 'dashboard-schedule-390.png') });
      await page.goto(url('examples-standalone') + '#explore');
      await page.locator('#work-q').fill('청년'); assert.match(await page.locator('[data-work-count]').innerText(), /2건/);
      await page.locator('main.ggc-work-explore .ggc-work-record h2 a').first().click();
      await page.getByRole('link', { name: '초안 작성 화면', exact: true }).click();
      await page.locator('main.ggc-work-wizard').waitFor({ state: 'visible' });
      assert.equal(await page.locator('main.ggc-work-wizard').isVisible(), true); await noOverflow();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator('.ggc-shell > .ggc-gnb [data-ggc-drawer-toggle]').click();
      await page.locator('.ggc-lnb-item[data-page=explore]').click();
      assert.equal(await page.locator('.ggc-shell > .ggc-gnb [data-ggc-drawer-toggle]').getAttribute('aria-expanded'), 'false');
      interactions.push('Dashboard secondary content and standalone cross-page navigation');
      const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
      const phonePage = await phone.newPage();
      for (const name of ['dashboard', 'explore', 'wizard', 'examples-standalone']) {
        await phonePage.goto(url(name) + (name === 'examples-standalone' ? '#explore' : ''));
        assert.equal(await phonePage.evaluate(() => innerWidth), 390, name + ' must use the device viewport');
        assert.equal(await phonePage.evaluate(() => document.compatMode), 'CSS1Compat', name + ' must use standards mode');
        assert.equal(await phonePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
      }
      await phonePage.locator('#work-q').fill('청년');
      await phonePage.locator('.ggc-work-record h2 a').first().tap();
      assert.equal(await phonePage.locator('#work-dialog').isVisible(), true);
      await phone.close();
      interactions.push('Touch device emulation: device viewport, standards mode, no overflow, standalone detail tap');
      assert.equal(errors.length, 0);
      fs.writeFileSync(path.join(out, 'interactions.json'), JSON.stringify({ interactions, errors }, null, 2) + '\n');
      console.log('Interaction checks passed: ' + interactions.length + ' suites');
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
