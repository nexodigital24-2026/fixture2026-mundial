// Browser UI test - uses Playwright with proper click delays for React state
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  console.log('Navigating to site...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  // Take initial screenshot
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-01-initial.png' });
  
  // Click Simulador tab
  await page.locator('[role="tab"]').filter({ hasText: 'Simulador' }).click();
  await page.waitForTimeout(500);
  
  // Reset any existing scores
  await page.locator('button:has-text("Resetear")').first().click();
  await page.waitForTimeout(1000);
  
  // Open all groups
  const groupIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  for (const gid of groupIds) {
    try {
      await page.locator(`button:has-text("Grupo ${gid}")`).click({ timeout: 3000 });
      await page.waitForTimeout(300);
    } catch (e) {}
  }
  await page.waitForTimeout(500);
  
  // Enter group scores using JavaScript evaluate with setTimeout between clicks
  // This ensures React processes each state update individually
  const clickResult = await page.evaluate(async () => {
    const allBtns = document.querySelectorAll('button');
    const scoreBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      if (cls && cls.includes('font-black') && cls.includes('rounded-lg') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        scoreBtns.push(btn);
      }
    }
    
    // Click with delays to let React process
    for (let i = 0; i < scoreBtns.length; i += 2) {
      const homeBtn = scoreBtns[i];
      const awayBtn = scoreBtns[i + 1];
      if (!awayBtn) break;
      
      // Reset both to – (click 11 times each)
      for (let c = 0; c < 11; c++) {
        homeBtn.click();
        await new Promise(r => setTimeout(r, 20));
      }
      for (let c = 0; c < 11; c++) {
        awayBtn.click();
        await new Promise(r => setTimeout(r, 20));
      }
      
      // Set home=2 (3 clicks)
      for (let c = 0; c < 3; c++) {
        homeBtn.click();
        await new Promise(r => setTimeout(r, 20));
      }
      // Set away=1 (2 clicks)
      for (let c = 0; c < 2; c++) {
        awayBtn.click();
        await new Promise(r => setTimeout(r, 20));
      }
    }
    
    return scoreBtns.length;
  });
  console.log(`Clicked ${clickResult} group score buttons`);
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-02-groups-scored.png', fullPage: true });
  
  // Check played count
  const playedText = await page.evaluate(() => {
    const el = document.querySelector('[class*="bg-gradient-to-r"] + *');
    // Find the element showing X/72
    const allText = document.body.textContent;
    const match = allText.match(/(\d+)\/72/);
    return match ? match[0] : 'not found';
  });
  console.log(`Played: ${playedText}`);
  
  // Switch to Llaves tab
  await page.locator('[role="tab"]').filter({ hasText: 'Llaves' }).click();
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-03-bracket-initial.png' });
  
  // Check Dieciseisavos round
  const dieciContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent.substring(0, 500) : 'NOT FOUND';
  });
  console.log('Dieciseisavos content:', dieciContent.substring(0, 300));
  
  // Enter ALL Dieciseisavos scores using evaluate with delays
  const dieciClickResult = await page.evaluate(async () => {
    const allBtns = document.querySelectorAll('button');
    const bracketBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      if (cls && cls.includes('font-black') && cls.includes('rounded-md') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        bracketBtns.push(btn);
      }
    }
    
    for (let i = 0; i < bracketBtns.length; i += 2) {
      const homeBtn = bracketBtns[i];
      const awayBtn = bracketBtns[i + 1];
      if (!awayBtn) break;
      
      for (let c = 0; c < 11; c++) { homeBtn.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 11; c++) { awayBtn.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 3; c++) { homeBtn.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 2; c++) { awayBtn.click(); await new Promise(r => setTimeout(r, 20)); }
    }
    
    return bracketBtns.length;
  });
  console.log(`Clicked ${dieciClickResult} Dieciseisavos score buttons`);
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-04-dieciseisavos-scored.png' });
  
  // Switch to Octavos
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('Octavos') && btn.textContent.includes('(')) {
        btn.click();
        return;
      }
    }
  });
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-05-octavos-round.png' });
  
  // Check Octavos content
  const octavosContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent.substring(0, 800) : 'NOT FOUND';
  });
  const octavosHasTeams = !octavosContent.includes('Ganador Match');
  console.log(`Octavos has team names (no "Ganador Match" labels): ${octavosHasTeams ? '✅' : '⚠️  Some matches still show Ganador labels'}`);
  const octavosPorDefinir = (octavosContent.match(/Por definir/g) || []).length;
  console.log(`"Por definir" count in Octavos: ${octavosPorDefinir}`);
  
  // Enter Octavos scores
  await page.evaluate(async () => {
    const allBtns = document.querySelectorAll('button');
    const bracketBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      if (cls && cls.includes('font-black') && cls.includes('rounded-md') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        bracketBtns.push(btn);
      }
    }
    for (let i = 0; i < bracketBtns.length; i += 2) {
      const homeBtn = bracketBtns[i];
      const awayBtn = bracketBtns[i + 1];
      if (!awayBtn) break;
      for (let c = 0; c < 11; c++) { homeBtn.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 11; c++) { awayBtn.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 3; c++) { homeBtn.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 2; c++) { awayBtn.click(); await new Promise(r => setTimeout(r, 20)); }
    }
  });
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-06-octavos-scored.png' });
  
  // Switch to Cuartos
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('Cuartos') && btn.textContent.includes('(')) {
        btn.click();
        return;
      }
    }
  });
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-07-cuartos-round.png' });
  
  const cuartosContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent.substring(0, 800) : 'NOT FOUND';
  });
  const cuartosPorDefinir = (cuartosContent.match(/Por definir/g) || []).length;
  console.log(`"Por definir" count in Cuartos: ${cuartosPorDefinir}`);
  
  // Enter Cuartos scores
  await page.evaluate(async () => {
    const allBtns = document.querySelectorAll('button');
    const bracketBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      if (cls && cls.includes('font-black') && cls.includes('rounded-md') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        bracketBtns.push(btn);
      }
    }
    for (let i = 0; i < bracketBtns.length; i += 2) {
      const homeBtn = bracketBtns[i];
      const awayBtn = bracketBtns[i + 1];
      if (!awayBtn) break;
      for (let c = 0; c < 11; c++) { homeBtn.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 11; c++) { awayBtn.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 3; c++) { homeBtn.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 2; c++) { awayBtn.click(); await new Promise(r => setTimeout(r, 20)); }
    }
  });
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-08-cuartos-scored.png' });
  
  // Switch to Semifinales
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('Semifinales') && btn.textContent.includes('(')) {
        btn.click();
        return;
      }
    }
  });
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-09-semifinales-round.png' });
  
  const semiContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent.substring(0, 500) : 'NOT FOUND';
  });
  console.log('Semifinales content:', semiContent.substring(0, 300));
  
  // Enter Semifinales scores: M101 home wins 3-1, M102 away wins 2-0
  await page.evaluate(async () => {
    const allBtns = document.querySelectorAll('button');
    const bracketBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      if (cls && cls.includes('font-black') && cls.includes('rounded-md') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        bracketBtns.push(btn);
      }
    }
    
    // Match 101: Home 3, Away 1
    if (bracketBtns.length >= 2) {
      const h1 = bracketBtns[0], a1 = bracketBtns[1];
      for (let c = 0; c < 11; c++) { h1.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 11; c++) { a1.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 4; c++) { h1.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 2; c++) { a1.click(); await new Promise(r => setTimeout(r, 20)); }
    }
    
    // Match 102: Home 0, Away 2
    if (bracketBtns.length >= 4) {
      const h2 = bracketBtns[2], a2 = bracketBtns[3];
      for (let c = 0; c < 11; c++) { h2.click(); await new Promise(r => setTimeout(r, 20)); }
      for (let c = 0; c < 11; c++) { a2.click(); await new Promise(r => setTimeout(r, 20)); }
      h2.click(); await new Promise(r => setTimeout(r, 20));
      for (let c = 0; c < 3; c++) { a2.click(); await new Promise(r => setTimeout(r, 20)); }
    }
  });
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-10-semifinales-scored.png' });
  
  // Switch to 3er Puesto
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('3er Puesto') && btn.textContent.includes('(')) {
        btn.click();
        return;
      }
    }
  });
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-11-3er-puesto.png' });
  
  const tercerContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent : 'NOT FOUND';
  });
  console.log('=== 3er Puesto content ===');
  console.log(tercerContent.substring(0, 300));
  
  const tercerHasTeams = !tercerContent.includes('Por definir') || (tercerContent.match(/Por definir/g) || []).length < 2;
  console.log(`3er Puesto has resolved teams: ${tercerHasTeams ? '✅' : '⚠️'}`);
  
  // Switch to Final
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('Final') && btn.textContent.includes('(') && !btn.textContent.includes('3er')) {
        btn.click();
        return;
      }
    }
  });
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/ui-12-final.png' });
  
  const finalContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent : 'NOT FOUND';
  });
  console.log('=== Final content ===');
  console.log(finalContent.substring(0, 300));
  
  const finalHasTeams = !finalContent.includes('Por definir') || (finalContent.match(/Por definir/g) || []).length < 2;
  console.log(`Final has resolved teams: ${finalHasTeams ? '✅' : '⚠️'}`);
  
  // Detailed match extraction for each round
  console.log('\n=== DETAILED MATCH DATA ===');
  
  const rounds = ['Dieciseisavos', 'Octavos', 'Cuartos', 'Semifinales', '3er Puesto', 'Final'];
  for (const roundName of rounds) {
    // Switch to round
    await page.evaluate((rn) => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        if (btn.textContent.includes(rn) && btn.textContent.includes('(')) {
          btn.click();
          break;
        }
      }
    }, roundName);
    await page.waitForTimeout(300);
    
    // Extract match data
    const matchData = await page.evaluate(() => {
      const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
      if (!bracketArea) return [];
      
      // Find match cards by looking for the card containers
      const cards = bracketArea.querySelectorAll('[class*="border"][class*="rounded-lg"]');
      const matches = [];
      
      for (const card of cards) {
        // Find team name elements - they're in bold text spans
        const boldElements = card.querySelectorAll('[class*="font-bold"]');
        const teams = [];
        const scores = [];
        
        for (const el of boldElements) {
          const text = el.textContent.trim();
          if (text && text !== 'vs' && !text.match(/^\d+\/\d+$/) && text.length > 2) {
            teams.push(text);
          }
        }
        
        // Get score buttons
        const scoreBtns = card.querySelectorAll('button[class*="font-black"]');
        for (const btn of scoreBtns) {
          const text = btn.textContent.trim();
          if (text.match(/^[0-9]$/)) scores.push(text);
        }
        
        if (teams.length >= 2) {
          matches.push({
            home: teams[0],
            away: teams[1],
            scores: scores.join('-')
          });
        }
      }
      
      return matches;
    });
    
    console.log(`\n${roundName}:`);
    if (matchData.length > 0) {
      matchData.forEach((m, i) => {
        console.log(`  Match ${i + 1}: ${m.home} vs ${m.away} [${m.scores}]`);
      });
    } else {
      console.log('  (no match data extracted)');
    }
  }
  
  console.log('\n=== UI TEST COMPLETE ===');
  console.log('Screenshots saved to /home/z/my-project/knockout-test/');
  
  await browser.close();
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
