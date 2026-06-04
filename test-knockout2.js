const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  console.log('Navigating to site...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/01-homepage.png' });
  
  // Click Simulador tab
  await page.locator('[role="tab"]').filter({ hasText: 'Simulador' }).click();
  await page.waitForTimeout(500);
  
  // Reset any existing scores
  const resetBtn = page.locator('button:has-text("Resetear")').first();
  await resetBtn.click();
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
  
  // Now use element handles which are stable references
  // Find score input buttons by their CSS class pattern
  // ScoreInput buttons have: "w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-black text-sm"
  // Use a broad selector for small square buttons with font-black
  
  const scoreBtnHandles = await page.$$('button[class*="font-black"][class*="rounded-lg"]');
  console.log(`Found ${scoreBtnHandles.length} group score buttons by CSS`);
  
  // If that doesn't work, try another approach
  // Actually let me use a JavaScript approach to find and click the buttons
  // I'll use page.evaluate to directly manipulate the React state
  
  // Better approach: find all the score buttons using their class pattern
  // Group score buttons: "w-8 h-8" + "font-black" + "rounded-lg"
  // Bracket score buttons: "w-7 h-7" + "font-black" + "rounded-md"
  
  // Let me try to find them using evaluate and then click them
  const result = await page.evaluate(() => {
    // Find all score input buttons (they are small square buttons with single char display)
    const allBtns = document.querySelectorAll('button');
    const scoreBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      // Group ScoreInput: has "font-black" and "rounded-lg" and text is – or single digit
      if (cls && cls.includes('font-black') && cls.includes('rounded-lg') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        scoreBtns.push({
          text: btn.textContent.trim(),
          classes: cls.substring(0, 80)
        });
      }
    }
    return scoreBtns.length;
  });
  console.log(`Found ${result} group score buttons via evaluate`);
  
  // Use evaluate to click all buttons programmatically
  // For each match (pair of buttons), set home=2, away=1
  const clickResult = await page.evaluate(() => {
    const allBtns = document.querySelectorAll('button');
    const scoreBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      if (cls && cls.includes('font-black') && cls.includes('rounded-lg') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        scoreBtns.push(btn);
      }
    }
    
    // Click in pairs: home btn 3 times (→2), away btn 2 times (→1)
    for (let i = 0; i < scoreBtns.length; i += 2) {
      const homeBtn = scoreBtns[i];
      const awayBtn = scoreBtns[i + 1];
      if (!awayBtn) break;
      
      // Reset to – first by clicking until we get to –
      // Actually, just click the right number of times from current state
      // The cycling is: value < maxGoals ? value + 1 : -1
      // So from any state, clicking 11 times (maxGoals=9) will cycle back to –
      // Then click 3 times for 2, or 2 times for 1
      
      // Reset home (click 11 times to cycle back)
      for (let c = 0; c < 11; c++) homeBtn.click();
      // Now home is – (value=-1), click 3 times → 0, 1, 2
      for (let c = 0; c < 3; c++) homeBtn.click();
      
      // Reset away
      for (let c = 0; c < 11; c++) awayBtn.click();
      // Now away is –, click 2 times → 0, 1
      for (let c = 0; c < 2; c++) awayBtn.click();
    }
    
    return scoreBtns.length;
  });
  console.log(`Clicked ${clickResult} group score buttons`);
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/02-groups-scored.png', fullPage: true });
  
  // Check played count
  const playedEl = await page.$('text=/\\d+\\/72/');
  if (playedEl) {
    const playedText = await playedEl.textContent();
    console.log(`Played: ${playedText}`);
  }
  
  // ==========================================
  // SWITCH TO LLAVES (BRACKET) TAB
  // ==========================================
  await page.locator('[role="tab"]').filter({ hasText: 'Llaves' }).click();
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/03-bracket-initial.png' });
  
  // Check that Dieciseisavos has team names (not "Por definir")
  const dieciContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent.substring(0, 1000) : 'NOT FOUND';
  });
  console.log('Dieciseisavos initial content:', dieciContent.substring(0, 500));
  
  // Check how many "Por definir" there are
  const porDefinirCount = await page.evaluate(() => {
    return document.querySelectorAll('*').length; // just count all elements for now
  });
  
  const porDefinirInDieci = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    if (!bracketArea) return -1;
    const text = bracketArea.textContent;
    const matches = text.match(/Por definir/g);
    return matches ? matches.length : 0;
  });
  console.log(`"Por definir" count in Dieciseisavos: ${porDefinirInDieci}`);
  
  // Enter scores for ALL Dieciseisavos matches (16 matches = 32 score buttons)
  // Bracket score buttons have: "font-black" + "rounded-md" and "w-7 h-7"
  const dieciClickResult = await page.evaluate(() => {
    const allBtns = document.querySelectorAll('button');
    const bracketBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      // BracketScoreInput: has "font-black" and "rounded-md"
      if (cls && cls.includes('font-black') && cls.includes('rounded-md') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        bracketBtns.push(btn);
      }
    }
    
    // Home wins 2-1 for all matches
    for (let i = 0; i < bracketBtns.length; i += 2) {
      const homeBtn = bracketBtns[i];
      const awayBtn = bracketBtns[i + 1];
      if (!awayBtn) break;
      
      // Reset (click 11 times to cycle)
      for (let c = 0; c < 11; c++) homeBtn.click();
      for (let c = 0; c < 11; c++) awayBtn.click();
      
      // Set home=2 (3 clicks)
      for (let c = 0; c < 3; c++) homeBtn.click();
      // Set away=1 (2 clicks)
      for (let c = 0; c < 2; c++) awayBtn.click();
    }
    
    return bracketBtns.length;
  });
  console.log(`Clicked ${dieciClickResult} Dieciseisavos score buttons`);
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/04-dieciseisavos-scored.png' });
  
  // ==========================================
  // SWITCH TO OCTAVOS
  // ==========================================
  // Find the round selector buttons inside the bracket
  // They are inside the bg-[#0a1628] container
  const octavosSwitchResult = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('Octavos') && btn.textContent.includes('(')) {
        btn.click();
        return btn.textContent.trim();
      }
    }
    return 'NOT FOUND';
  });
  console.log(`Clicked Octavos round button: ${octavosSwitchResult}`);
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/05-octavos-round.png' });
  
  // Verify Octavos teams
  const octavosContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent.substring(0, 1500) : 'NOT FOUND';
  });
  console.log('Octavos content preview:', octavosContent.substring(0, 800));
  
  const octavosPorDefinir = (octavosContent.match(/Por definir/g) || []).length;
  console.log(`"Por definir" in Octavos: ${octavosPorDefinir}`);
  
  // Enter scores for Octavos
  const octavosClickResult = await page.evaluate(() => {
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
      
      for (let c = 0; c < 11; c++) homeBtn.click();
      for (let c = 0; c < 11; c++) awayBtn.click();
      for (let c = 0; c < 3; c++) homeBtn.click();
      for (let c = 0; c < 2; c++) awayBtn.click();
    }
    
    return bracketBtns.length;
  });
  console.log(`Clicked ${octavosClickResult} Octavos score buttons`);
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/06-octavos-scored.png' });
  
  // ==========================================
  // SWITCH TO CUARTOS
  // ==========================================
  const cuartosSwitchResult = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('Cuartos') && btn.textContent.includes('(')) {
        btn.click();
        return btn.textContent.trim();
      }
    }
    return 'NOT FOUND';
  });
  console.log(`Clicked Cuartos round button: ${cuartosSwitchResult}`);
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/07-cuartos-round.png' });
  
  const cuartosContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent.substring(0, 1000) : 'NOT FOUND';
  });
  console.log('Cuartos content preview:', cuartosContent.substring(0, 600));
  
  const cuartosPorDefinir = (cuartosContent.match(/Por definir/g) || []).length;
  console.log(`"Por definir" in Cuartos: ${cuartosPorDefinir}`);
  
  // Enter scores for Cuartos
  const cuartosClickResult = await page.evaluate(() => {
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
      
      for (let c = 0; c < 11; c++) homeBtn.click();
      for (let c = 0; c < 11; c++) awayBtn.click();
      for (let c = 0; c < 3; c++) homeBtn.click();
      for (let c = 0; c < 2; c++) awayBtn.click();
    }
    
    return bracketBtns.length;
  });
  console.log(`Clicked ${cuartosClickResult} Cuartos score buttons`);
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/08-cuartos-scored.png' });
  
  // ==========================================
  // SWITCH TO SEMIFINALES
  // ==========================================
  const semiSwitchResult = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('Semifinales') && btn.textContent.includes('(')) {
        btn.click();
        return btn.textContent.trim();
      }
    }
    return 'NOT FOUND';
  });
  console.log(`Clicked Semifinales round button: ${semiSwitchResult}`);
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/09-semifinales-round.png' });
  
  const semiContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent.substring(0, 1000) : 'NOT FOUND';
  });
  console.log('Semifinales content:', semiContent.substring(0, 600));
  
  const semiPorDefinir = (semiContent.match(/Por definir/g) || []).length;
  console.log(`"Por definir" in Semifinales: ${semiPorDefinir}`);
  
  // Enter scores for Semifinales
  // Match 101: HOME wins 3-1 (HOME goes to Final as winner, AWAY goes to 3er Puesto as loser)
  // Match 102: AWAY wins 2-0 (AWAY goes to Final as winner, HOME goes to 3er Puesto as loser)
  const semiClickResult = await page.evaluate(() => {
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
      const h1 = bracketBtns[0];
      const a1 = bracketBtns[1];
      // Reset
      for (let c = 0; c < 11; c++) h1.click();
      for (let c = 0; c < 11; c++) a1.click();
      // Home=3 (4 clicks)
      for (let c = 0; c < 4; c++) h1.click();
      // Away=1 (2 clicks)
      for (let c = 0; c < 2; c++) a1.click();
    }
    
    // Match 102: Home 0, Away 2
    if (bracketBtns.length >= 4) {
      const h2 = bracketBtns[2];
      const a2 = bracketBtns[3];
      // Reset
      for (let c = 0; c < 11; c++) h2.click();
      for (let c = 0; c < 11; c++) a2.click();
      // Home=0 (1 click)
      h2.click();
      // Away=2 (3 clicks)
      for (let c = 0; c < 3; c++) a2.click();
    }
    
    return bracketBtns.length;
  });
  console.log(`Clicked ${semiClickResult} Semifinales score buttons`);
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/10-semifinales-scored.png' });
  
  // ==========================================
  // SWITCH TO 3er PUESTO - CRITICAL CHECK
  // ==========================================
  const tercerSwitchResult = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('3er Puesto') && btn.textContent.includes('(')) {
        btn.click();
        return btn.textContent.trim();
      }
    }
    return 'NOT FOUND';
  });
  console.log(`Clicked 3er Puesto round button: ${tercerSwitchResult}`);
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/11-3er-puesto-round.png' });
  
  // CRITICAL: Check 3er Puesto shows LOSERS
  const tercerContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent : 'NOT FOUND';
  });
  console.log('=== CRITICAL: 3er Puesto content ===');
  console.log(tercerContent.substring(0, 800));
  
  const tercerPorDefinir = (tercerContent.match(/Por definir/g) || []).length;
  console.log(`"Por definir" in 3er Puesto: ${tercerPorDefinir}`);
  const tercerPerdedor = (tercerContent.match(/Perdedor/g) || []).length;
  console.log(`"Perdedor" in 3er Puesto: ${tercerPorDefinir > 0 ? 'STILL SHOWS LABEL - teams NOT resolved!' : tercerPerdedor > 0 ? 'Shows label but teams should be resolved' : 'No Perdedor label visible (good - teams resolved!)'}`);
  
  // Enter score for 3er Puesto
  await page.evaluate(() => {
    const allBtns = document.querySelectorAll('button');
    const bracketBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      if (cls && cls.includes('font-black') && cls.includes('rounded-md') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        bracketBtns.push(btn);
      }
    }
    
    if (bracketBtns.length >= 2) {
      const h = bracketBtns[0];
      const a = bracketBtns[1];
      for (let c = 0; c < 11; c++) h.click();
      for (let c = 0; c < 11; c++) a.click();
      // Home=1 (2 clicks)
      for (let c = 0; c < 2; c++) h.click();
      // Away=0 (1 click)
      a.click();
    }
  });
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/12-3er-puesto-scored.png' });
  
  // ==========================================
  // SWITCH TO FINAL - CRITICAL CHECK
  // ==========================================
  const finalSwitchResult = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('Final') && btn.textContent.includes('(') && !btn.textContent.includes('3er')) {
        btn.click();
        return btn.textContent.trim();
      }
    }
    return 'NOT FOUND';
  });
  console.log(`Clicked Final round button: ${finalSwitchResult}`);
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/knockout-test/13-final-round.png' });
  
  // CRITICAL: Check Final shows WINNERS
  const finalContent = await page.evaluate(() => {
    const bracketArea = document.querySelector('[class*="bg-\\[\\#0a1628\\]"]');
    return bracketArea ? bracketArea.textContent : 'NOT FOUND';
  });
  console.log('=== CRITICAL: Final content ===');
  console.log(finalContent.substring(0, 800));
  
  const finalPorDefinir = (finalContent.match(/Por definir/g) || []).length;
  console.log(`"Por definir" in Final: ${finalPorDefinir}`);
  
  // Enter Final score
  await page.evaluate(() => {
    const allBtns = document.querySelectorAll('button');
    const bracketBtns = [];
    for (const btn of allBtns) {
      const cls = btn.className;
      if (cls && cls.includes('font-black') && cls.includes('rounded-md') && 
          (btn.textContent.trim() === '–' || btn.textContent.trim().match(/^[0-9]$/))) {
        bracketBtns.push(btn);
      }
    }
    
    if (bracketBtns.length >= 2) {
      const h = bracketBtns[0];
      const a = bracketBtns[1];
      for (let c = 0; c < 11; c++) h.click();
      for (let c = 0; c < 11; c++) a.click();
      for (let c = 0; c < 3; c++) h.click(); // Home=2
      for (let c = 0; c < 2; c++) a.click(); // Away=1
    }
  });
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/z/my-project/knockout-test/14-final-scored.png' });
  
  // ==========================================
  // DETAILED VERIFICATION
  // ==========================================
  // Now let's do a detailed check by extracting all match data
  console.log('\n========================================');
  console.log('=== DETAILED BRACKET VERIFICATION ===');
  console.log('========================================');
  
  // Go back to each round and extract team names
  const rounds = ['Dieciseisavos', 'Octavos', 'Cuartos', 'Semifinales', '3er Puesto', 'Final'];
  
  for (const roundName of rounds) {
    // Click the round button
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
      if (!bracketArea) return 'NO BRACKET AREA';
      
      // Find all match cards
      const matches = [];
      const cards = bracketArea.querySelectorAll('[class*="border"][class*="rounded-lg"]');
      
      for (const card of cards) {
        const rows = card.querySelectorAll('[class*="flex"][class*="items-center"][class*="gap-1"]');
        if (rows.length >= 2) {
          const homeRow = rows[0];
          const awayRow = rows[1];
          const homeName = homeRow.textContent.trim();
          const awayName = awayRow.textContent.trim();
          matches.push({ home: homeName, away: awayName });
        }
      }
      
      return matches;
    });
    
    console.log(`\n${roundName}:`);
    if (Array.isArray(matchData)) {
      matchData.forEach((m, i) => {
        console.log(`  Match ${i + 1}: ${m.home} vs ${m.away}`);
      });
    } else {
      console.log(`  ${matchData}`);
    }
  }
  
  // ==========================================
  // CODE-LEVEL VERIFICATION
  // ==========================================
  console.log('\n========================================');
  console.log('=== CODE-LEVEL VERIFICATION ===');
  console.log('========================================');
  
  // Let's also verify the logic by examining the resolveBracket function directly
  const codeVerification = await page.evaluate(() => {
    // Get the React fiber to access component state
    const root = document.getElementById('__next');
    if (!root) return 'No React root found';
    
    // Try to access React internal state
    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!fiberKey) return 'No React fiber found';
    
    return 'React fiber found - state verification would require deeper inspection';
  });
  console.log(codeVerification);
  
  console.log('\n========================================');
  console.log('=== TEST COMPLETE ===');
  console.log('========================================');
  console.log('Screenshots saved to /home/z/my-project/knockout-test/');
  
  await browser.close();
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
