// Test script to enter all group scores and knockout scores
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connect('http://localhost:9222');
  const contexts = browser.contexts();
  const context = contexts[0] || await browser.newContext();
  const pages = context.pages();
  const page = pages[0] || await context.newPage();
  
  // Ensure we're on the right page
  if (!page.url().includes('localhost:3000')) {
    await page.goto('http://localhost:3000');
  }
  
  await page.waitForTimeout(1000);

  // Strategy: For each group, we want the first team to win all 3 matches, 
  // second team to win 2, third team to win 1, fourth team to lose all.
  // 
  // Group matches are 6 per group in this order:
  // Match 1: Team1 vs Team2 (Team1 wins, e.g., 3-1)
  // Match 2: Team3 vs Team4 (Team3 wins, e.g., 2-0)
  // Match 3: Team2 vs Team3 (depends...) 
  // Wait, the match structure varies per group. Let me look at it differently.
  //
  // Actually, let me just make every home team win with score 2-1.
  // This creates clear winners for every match. The standings will be 
  // determined by who plays home vs away in each match.
  
  // Actually, even simpler: Let me just assign specific scores that create
  // clear group positions. For each group:
  // - Team 1 (first in list): wins all 3 matches -> 9 pts
  // - Team 2 (second in list): wins 2, loses 1 -> 6 pts
  // - Team 3 (third in list): wins 1, loses 2 -> 3 pts
  // - Team 4 (fourth in list): loses all 3 -> 0 pts
  
  // Group A matches: MEX vs RSA, KOR vs CZE, CZE vs RSA, MEX vs KOR, CZE vs MEX, RSA vs KOR
  // I need: MEX wins all, RSA wins 2, KOR wins 1, CZE loses all
  // Match 1: MEX 3-0 RSA -> MEX wins ✓, RSA loses
  // Match 2: KOR 2-0 CZE -> KOR wins ✓, CZE loses ✓
  // Match 3: CZE vs RSA -> RSA wins, CZE loses ✓. RSA 2-0 CZE
  // Match 4: MEX vs KOR -> MEX wins ✓, KOR loses. MEX 3-0 KOR
  // Match 5: CZE vs MEX -> MEX wins ✓, CZE loses ✓. CZE 0-3 MEX
  // Match 6: RSA vs KOR -> RSA wins ✓, KOR loses. RSA 2-0 KOR
  // Final: MEX 9pts, RSA 6pts, KOR 3pts, CZE 0pts ✓

  // I'll use this pattern for ALL groups:
  // Match 1 (home vs away): home wins 3-0
  // Match 2 (home vs away): home wins 2-0  (but we want team3 to win 1)
  // Actually, the specific match pairings vary per group. Let me just use
  // a simpler strategy: make the home team win every match 2-1.
  // This way we get clear results without draws.
  
  // The ScoreInput works by cycling: click once = 0, twice = 1, 3 times = 2, etc.
  // Starting from -1 (shown as "–"):
  // To get score 0: click 1 time
  // To get score 1: click 2 times
  // To get score 2: click 3 times
  // To get score 3: click 4 times
  
  // Strategy: For all matches, make home score = 2, away score = 1
  // Home: 3 clicks (– → 0 → 1 → 2)
  // Away: 2 clicks (– → 0 → 1)
  
  const groupIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  // First, make sure all groups are expanded
  for (const gid of groupIds) {
    const groupHeader = page.locator(`button:has-text("Grupo ${gid}")`);
    const isExpanded = await groupHeader.getAttribute('aria-expanded');
    // Check if the group content is visible by looking for score buttons
    const groupCard = groupHeader.locator('..');
    // Click to expand if not already
    try {
      // Check if the group shows matches (has score input buttons)
      const matchArea = page.locator(`[class*="p-2.5"]`).filter({ has: page.locator('button:has-text("–")') }).first();
      // Just click the group header to toggle
      await groupHeader.click();
      await page.waitForTimeout(200);
    } catch (e) {
      // Ignore
    }
  }
  
  // Let me use a more direct approach - find all score input buttons and click them
  // The score buttons cycle: click increments from -1 → 0 → 1 → 2 → ... → 9 → -1
  
  // Actually, let me find the buttons more precisely. 
  // Each match row has: [flag home] [name home] [score_home_btn] - [score_away_btn] [name away] [flag away]
  
  // The simplest approach: find all the score buttons and click them in pairs
  // For each pair (home, away), click home 3 times (→ score 2) and away 2 times (→ score 1)
  
  console.log('Starting to enter group scores...');
  
  // First, open all groups
  for (const gid of groupIds) {
    const header = page.locator(`button:has-text("Grupo ${gid}")`);
    if (await header.isVisible()) {
      // Check if content is already visible
      const content = header.locator('xpath=following-sibling::*').first();
      // Just click to open
      await header.click();
      await page.waitForTimeout(300);
    }
  }
  
  // Wait for all animations
  await page.waitForTimeout(1000);
  
  // Now enter scores. I'll use a different approach.
  // Let me find all the "–" buttons (score inputs) and click them.
  // The buttons are in order: for each match, home score then away score.
  // But they're grouped by group.
  
  // Actually, let me just use JavaScript to directly set the React state.
  // The ScoreInput component has an onClick that calls onChange.
  // Let me try finding and clicking buttons programmatically.
  
  // Find all score input buttons (they show "–" initially or a number)
  const scoreButtons = await page.locator('button').filter({ hasText: /^–$|^[0-9]$/ }).all();
  console.log(`Found ${scoreButtons.length} score buttons`);
  
  // These should be 144 buttons (72 matches × 2 scores)
  // For each pair of buttons, click home 3 times (→ 2) and away 2 times (→ 1)
  // Actually, wait - some buttons might already have scores from previous tests
  // Let me just reset first
  
  // Click reset button
  const resetBtn = page.locator('button:has-text("Resetear")').first();
  if (await resetBtn.isVisible()) {
    await resetBtn.click();
    await page.waitForTimeout(500);
  }
  
  // Re-open all groups after reset
  for (const gid of groupIds) {
    const header = page.locator(`button:has-text("Grupo ${gid}")`);
    if (await header.isVisible()) {
      await header.click();
      await page.waitForTimeout(200);
    }
  }
  await page.waitForTimeout(500);
  
  // Now find all score buttons again
  const allButtons = await page.locator('button').filter({ hasText: /^–$|^[0-9]$/ }).all();
  console.log(`After reset, found ${allButtons.length} score buttons`);
  
  // Each match has 2 score buttons (home, away), so 72 matches × 2 = 144 buttons
  // For each match, I want home=2, away=1 (home wins)
  // Starting from "–" (value -1):
  //   To set home=2: click 3 times (– → 0 → 1 → 2)
  //   To set away=1: click 2 times (– → 0 → 1)
  
  // But I need to be more nuanced. For the group standings to produce 
  // clear 1st, 2nd, 3rd places, I need specific scores.
  // Let me use: home wins all matches with score 2-1.
  // This means the team that plays more home games will rank higher.
  
  // Actually, let me think about what results this produces...
  // In each group, each team plays 3 matches, but not all at home.
  // The home/away pattern varies. Let me just use a simple approach:
  // Make every match have a home win 2-1. This avoids draws and
  // produces clear rankings based on who happens to play more home games.
  
  // Wait, actually the problem is that some teams play 2 home games and others 1.
  // With all home wins, teams with 2 home games get 6 points, teams with 1 get 3 points.
  // There could be ties at 6 points or 3 points.
  
  // Let me instead use a more varied scoring to ensure clear differentiation.
  // For each match, I'll use a different score pattern:
  // Match 1: 3-0 (home wins big)
  // Match 2: 2-0 (home wins)
  // Match 3: 2-1 (home wins close)
  // Match 4: 3-1 (home wins)
  // Match 5: 1-0 (home wins)
  // Match 6: 2-0 (home wins)
  
  // Actually, this still has the same issue. Let me just pick scores
  // that make the FIRST team in each group win all, SECOND win 2, etc.
  
  // For simplicity, let me just make all home teams win 2-1.
  // The group standings will sort themselves out by goal difference
  // from the specific match scores.
  
  for (let i = 0; i < allButtons.length; i += 2) {
    const homeBtn = allButtons[i];
    const awayBtn = allButtons[i + 1];
    
    if (!homeBtn || !awayBtn) break;
    
    // Click home button 3 times to set to 2
    for (let c = 0; c < 3; c++) {
      await homeBtn.click();
      await page.waitForTimeout(50);
    }
    
    // Click away button 2 times to set to 1
    for (let c = 0; c < 2; c++) {
      await awayBtn.click();
      await page.waitForTimeout(50);
    }
    
    if ((i / 2 + 1) % 12 === 0) {
      console.log(`Entered scores for ${i/2 + 1} matches...`);
    }
  }
  
  console.log('All group scores entered!');
  
  // Take a screenshot
  await page.screenshot({ path: '/home/z/my-project/test-all-groups-scored.png' });
  
  // Now switch to the Llaves (Bracket) tab
  const llavesTab = page.locator('tab:has-text("Llaves")').first();
  // Actually, let me use a role-based selector
  const tabs = page.locator('[role="tab"]');
  const llavesTabEl = tabs.filter({ hasText: 'Llaves' }).first();
  await llavesTabEl.click();
  await page.waitForTimeout(1000);
  
  // Take a screenshot of the bracket
  await page.screenshot({ path: '/home/z/my-project/test-bracket-initial.png' });
  
  // Get the current state of bracket matches
  const bracketContent = await page.textContent('[role="tabpanel"]');
  console.log('Bracket content:', bracketContent?.substring(0, 200));
  
  // Now I need to enter scores for the Dieciseisavos round
  // Find the round selector buttons and make sure Dieciseisavos is selected
  const roundButtons = page.locator('button').filter({ hasText: /Dieciseisavos|Octavos|Cuartos|Semifinales|3er Puesto|Final/ });
  const roundCount = await roundButtons.count();
  console.log(`Found ${roundCount} round buttons`);
  
  // Click Dieciseisavos
  await roundButtons.filter({ hasText: 'Dieciseisavos' }).first().click();
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/test-dieciseisavos-round.png' });
  
  // Find bracket score buttons (they use a different style - dark background)
  // The BracketScoreInput uses: value === null ? '–' : value
  // And cycling: value === null ? 0 : value < 9 ? value + 1 : -1
  // So: null → 0 → 1 → 2 → ... → 9 → -1 (which means null again)
  // Wait, it sets to -1, not null. Let me re-read the code.
  // onChange(value === null ? 0 : value < 9 ? value + 1 : -1)
  // onKnockoutScoreChange stores: { home: val, away: val }
  // Where val can be -1 (meaning no score)
  // So clicking: null → 0 → 1 → 2 → ... → 9 → -1
  
  // In the bracket, the score buttons also show "–" initially
  // Let me find them and click them
  
  // Actually, the bracket score buttons have a different class (amber bg when set, dark bg when not)
  // Let me find them by looking for buttons within the bracket section
  
  // The bracket section is inside a div with bg-[#0a1628]
  // The score buttons are within BracketMatchCard components
  
  // Let me find all bracket score buttons
  const bracketScoreBtns = await page.locator('.bg-\\[\\#0a1628\\] button').filter({ hasText: /^–$|^[0-9]$/ }).all();
  console.log(`Found ${bracketScoreBtns.length} bracket score buttons`);
  
  // For Dieciseisavos, there are 16 matches = 32 score buttons
  // I'll enter scores for ALL 16 matches to make home team win 2-1
  // This ensures all Octavos matches get populated
  
  for (let i = 0; i < Math.min(32, bracketScoreBtns.length); i += 2) {
    const homeBtn = bracketScoreBtns[i];
    const awayBtn = bracketScoreBtns[i + 1];
    
    // Home wins 2-1
    // Click home 3 times (– → 0 → 1 → 2)
    for (let c = 0; c < 3; c++) {
      await homeBtn.click();
      await page.waitForTimeout(50);
    }
    
    // Click away 2 times (– → 0 → 1)
    for (let c = 0; c < 2; c++) {
      await awayBtn.click();
      await page.waitForTimeout(50);
    }
  }
  
  console.log('All Dieciseisavos scores entered!');
  await page.screenshot({ path: '/home/z/my-project/test-dieciseisavos-scored.png' });
  
  // Now switch to Octavos and check if teams are populated
  await roundButtons.filter({ hasText: 'Octavos' }).first().click();
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/test-octavos-round.png' });
  
  // Check the Octavos matches
  const octavosText = await page.textContent('[role="tabpanel"]');
  console.log('Octavos content preview:', octavosText?.substring(0, 500));
  
  // Enter scores for Octavos (8 matches = 16 score buttons)
  const octavosScoreBtns = await page.locator('.bg-\\[\\#0a1628\\] button').filter({ hasText: /^–$|^[0-9]$/ }).all();
  console.log(`Found ${octavosScoreBtns.length} Octavos score buttons`);
  
  for (let i = 0; i < Math.min(16, octavosScoreBtns.length); i += 2) {
    const homeBtn = octavosScoreBtns[i];
    const awayBtn = octavosScoreBtns[i + 1];
    
    // Home wins 2-1
    for (let c = 0; c < 3; c++) {
      await homeBtn.click();
      await page.waitForTimeout(50);
    }
    for (let c = 0; c < 2; c++) {
      await awayBtn.click();
      await page.waitForTimeout(50);
    }
  }
  
  console.log('All Octavos scores entered!');
  await page.screenshot({ path: '/home/z/my-project/test-octavos-scored.png' });
  
  // Switch to Cuartos
  await roundButtons.filter({ hasText: 'Cuartos' }).first().click();
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/test-cuartos-round.png' });
  
  // Enter scores for Cuartos (4 matches = 8 score buttons)
  const cuartosScoreBtns = await page.locator('.bg-\\[\\#0a1628\\] button').filter({ hasText: /^–$|^[0-9]$/ }).all();
  console.log(`Found ${cuartosScoreBtns.length} Cuartos score buttons`);
  
  for (let i = 0; i < Math.min(8, cuartosScoreBtns.length); i += 2) {
    const homeBtn = cuartosScoreBtns[i];
    const awayBtn = cuartosScoreBtns[i + 1];
    
    // Home wins 2-1
    for (let c = 0; c < 3; c++) {
      await homeBtn.click();
      await page.waitForTimeout(50);
    }
    for (let c = 0; c < 2; c++) {
      await awayBtn.click();
      await page.waitForTimeout(50);
    }
  }
  
  console.log('All Cuartos scores entered!');
  await page.screenshot({ path: '/home/z/my-project/test-cuartos-scored.png' });
  
  // Switch to Semifinales
  await roundButtons.filter({ hasText: 'Semifinales' }).first().click();
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/test-semifinales-round.png' });
  
  // Enter scores for Semifinales (2 matches = 4 score buttons)
  // Make MATCH 101: home wins 3-1, MATCH 102: away wins 2-0
  // This way we can verify that the Final gets the winners and 3er Puesto gets the losers
  const semiScoreBtns = await page.locator('.bg-\\[\\#0a1628\\] button').filter({ hasText: /^–$|^[0-9]$/ }).all();
  console.log(`Found ${semiScoreBtns.length} Semifinales score buttons`);
  
  // Match 101 (Semifinal 1): Home wins 3-1
  if (semiScoreBtns.length >= 2) {
    for (let c = 0; c < 4; c++) { // 4 clicks → score 3
      await semiScoreBtns[0].click();
      await page.waitForTimeout(50);
    }
    for (let c = 0; c < 2; c++) { // 2 clicks → score 1
      await semiScoreBtns[1].click();
      await page.waitForTimeout(50);
    }
  }
  
  // Match 102 (Semifinal 2): Away wins 2-0
  if (semiScoreBtns.length >= 4) {
    // Home scores 0 (1 click → 0)
    await semiScoreBtns[2].click();
    await page.waitForTimeout(50);
    // Away scores 2 (3 clicks → 2)
    for (let c = 0; c < 3; c++) {
      await semiScoreBtns[3].click();
      await page.waitForTimeout(50);
    }
  }
  
  console.log('Semifinales scores entered!');
  await page.screenshot({ path: '/home/z/my-project/test-semifinales-scored.png' });
  
  // Switch to 3er Puesto
  await roundButtons.filter({ hasText: '3er Puesto' }).first().click();
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/test-3er-puesto-round.png' });
  
  // Check 3er Puesto - should show LOSERS of the semifinals
  const tercerPuestoText = await page.textContent('[role="tabpanel"]');
  console.log('3er Puesto content:', tercerPuestoText?.substring(0, 300));
  
  // Enter score for 3er Puesto
  const tercerScoreBtns = await page.locator('.bg-\\[\\#0a1628\\] button').filter({ hasText: /^–$|^[0-9]$/ }).all();
  console.log(`Found ${tercerScoreBtns.length} 3er Puesto score buttons`);
  
  if (tercerScoreBtns.length >= 2) {
    // Home wins 1-0
    await tercerScoreBtns[0].click(); // 1 click → 0
    for (let c = 0; c < 2; c++) { // Wait, 1 click → 0, 2 clicks → 1
      await tercerScoreBtns[0].click();
      await page.waitForTimeout(50);
    }
    // Away scores 0
    await tercerScoreBtns[1].click(); // 1 click → 0
    await page.waitForTimeout(50);
  }
  
  await page.screenshot({ path: '/home/z/my-project/test-3er-puesto-scored.png' });
  
  // Switch to Final
  await roundButtons.filter({ hasText: 'Final' }).first().click();
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/home/z/my-project/test-final-round.png' });
  
  // Check Final - should show WINNERS of the semifinals
  const finalText = await page.textContent('[role="tabpanel"]');
  console.log('Final content:', finalText?.substring(0, 300));
  
  // Enter score for Final
  const finalScoreBtns = await page.locator('.bg-\\[\\#0a1628\\] button').filter({ hasText: /^–$|^[0-9]$/ }).all();
  console.log(`Found ${finalScoreBtns.length} Final score buttons`);
  
  if (finalScoreBtns.length >= 2) {
    // Home wins 2-1
    for (let c = 0; c < 3; c++) {
      await finalScoreBtns[0].click();
      await page.waitForTimeout(50);
    }
    for (let c = 0; c < 2; c++) {
      await finalScoreBtns[1].click();
      await page.waitForTimeout(50);
    }
  }
  
  await page.screenshot({ path: '/home/z/my-project/test-final-scored.png' });
  
  console.log('\n=== TEST COMPLETE ===');
  console.log('Check the screenshots for visual verification.');
  
  // Don't close the browser - just disconnect
  await browser.close();
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
