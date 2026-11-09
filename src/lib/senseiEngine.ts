/**
 * Sensei AI Intelligence Engine (Autonomous Dojo Core)
 * Provides instant, deep martial arts instruction, kata biomechanics, kumite drills,
 * belt grading criteria, and class information. Acts as an autonomous fallback so the
 * AI Chatbot never displays disruptions even on static hosts or when upstream APIs are unavailable.
 */

export interface SenseiMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export interface StudentContext {
  name?: string;
  belt?: string;
  rank?: string;
}

export function generateSenseiResponse(
  messages: SenseiMessage[],
  studentContext?: StudentContext | null
): { content: string; modelUsed: string } {
  const latestMessage = messages
    .filter((m) => m.role === 'user')
    .pop()?.content || '';

  const query = latestMessage.toLowerCase().trim();
  const studentName = studentContext?.name || 'Warrior';
  const belt = studentContext?.belt || 'White Belt';

  let responseText = '';

  // 1. GREETINGS & INTRODUCTIONS
  if (/^(hi|hello|hey|osu|oss|greetings|morning|afternoon|evening)/.test(query) || query === 'sensei') {
    responseText = `**Osu, ${studentName}!** 🥋\n\n` +
      `Welcome to the **Lion Mode Karate tatami**. I am your Dojo Sensei AI assistant.\n\n` +
      `As a **${belt}**, your focus is on discipline, foundation, and deliberate execution. Here is how I can guide your training today:\n\n` +
      `- **Kata Breakdown & Bunkai:** Step-by-step stance geometry and practical application.\n` +
      `- **Kumite Timing & Drills:** Reflex development, distance management (*Ma-ai*), and counter-attacks.\n` +
      `- **Belt Syllabus & Grading:** Specific requirements to earn your next belt stripe.\n` +
      `- **Dojo Timetable & Classes:** Check class schedules and upcoming open mats.\n\n` +
      `*What aspect of your martial journey shall we sharpen today?*`;
  }

  // 2. CLASS SCHEDULE & TIMETABLE
  else if (/schedule|class|timetable|hours|times|when is|today|session/.test(query)) {
    responseText = `**Osu!** Here is the official **Lion Mode Karate Dojo Schedule**:\n\n` +
      `| Program | Days | Time Slot | Focus |\n` +
      `| :--- | :--- | :--- | :--- |\n` +
      `| **Kids & Fundamentals** | Mon / Wed / Fri | 4:00 PM – 5:00 PM | Basics, Balance, Discipline |\n` +
      `| **Advanced Kata & Kumite** | Tue / Thu | 5:30 PM – 7:00 PM | Competition Kata, Sparring Tactics |\n` +
      `| **Adult All-Levels** | Mon / Wed / Sat | 6:30 PM – 8:00 PM | Striking Power, Self-Defense |\n` +
      `| **Open Mat & Testing** | Saturday | 10:00 AM – 12:30 PM | Sparring Rounds, Belt Exams |\n\n` +
      `> **Sensei Etiquette Note:** Always arrive 10–15 minutes early to bow onto the tatami (*Rei*), stretch your hamstrings, and center your breathing (*Mokuso*).`;
  }

  // 3. KATA & SPECIFIC FORMS
  else if (/kata|heian|bunkai|taikyoku|bassai|kanku|tekki|form/.test(query)) {
    let kataName = 'Heian Shodan';
    if (/nidan/.test(query)) kataName = 'Heian Nidan';
    else if (/sandan/.test(query)) kataName = 'Heian Sandan';
    else if (/yondan/.test(query)) kataName = 'Heian Yondan';
    else if (/godan/.test(query)) kataName = 'Heian Godan';
    else if (/tekki/.test(query)) kataName = 'Tekki Shodan';
    else if (/bassai/.test(query)) kataName = 'Bassai Dai';
    else if (/kanku/.test(query)) kataName = 'Kanku Dai';

    responseText = `**Osu! Detailed Breakdown: ${kataName}** 🥋\n\n` +
      `Kata is the encyclopedia of martial arts. Every movement is a deliberate defense and counter-strike.\n\n` +
      `### 1. Stance Geometry & Preparation\n` +
      `- **Rooted Stance:** Lock your rear leg with heel pressed firmly to the tatami. Front knee bent directly over your ankle.\n` +
      `- **Hip Action (*Koshi*):** Drive your blocks with half-facing hips (*Hanmi*) and finish your punches with square hips (*Shomen*).\n\n` +
      `### 2. Execution & Repetitions\n` +
      `- **Rhythm:** Do not rush through transitions. Fast movements require sharp snap (*Kime*); slow movements require deep breathing (*Ibuki*).\n` +
      `- **Drill:** Perform the first 6 counts of ${kataName} at 50% speed for 10 sets, then 5 sets at 100% full speed with sharp *Kiai*.\n\n` +
      `### 3. Key Sensei Cue\n` +
      `> *"Power does not come from your shoulders—it travels from the tatami through your hips into your fists."*\n\n` +
      `### 4. Common Flaw to Avoid\n` +
      `- Bobbing your head up and down when stepping forward. Keep your center of gravity level throughout the entire sequence.`;
  }

  // 4. KUMITE / SPARRING / COMBINATIONS
  else if (/sparring|kumite|fight|counter|punch|jab|reverse|speed|timing|reflex/.test(query)) {
    responseText = `**Osu! Kumite Combat Protocol: Distance & Timing (*Ma-ai*)** 🥊\n\n` +
      `In sparring, the fighter who controls the space controls the match.\n\n` +
      `### The "Slip & Counter" Drill (*Sen-no-sen*)\n\n` +
      `1. **Stance & Footwork:**\n` +
      `   - Bounce lightly on the balls of your feet in fighting stance (*Kamae*).\n` +
      `   - Keep your guard tight with rear hand protecting your jawline and lead hand active.\n\n` +
      `2. **The 3-Beat Combination:**\n` +
      `   - **Beat 1 (Draw):** Half-step back to slip the opponent's lead attack by 2 inches.\n` +
      `   - **Beat 2 (Explosion):** Fire a lunging reverse punch (*Gyaku-tsuki*) directly into the solar plexus with sharp *Kiai*.\n` +
      `   - **Beat 3 (Exit):** Pivot 45° off-angle to avoid counter-hooks while keeping eyes fixed on the opponent (*Zanshin*).\n\n` +
      `3. **Training Prescription:**\n` +
      `   - 4 rounds of 3 minutes shadow sparring focusing purely on foot speed and breath control.\n` +
      `   - Rest 45 seconds between rounds with deep diaphragmatic recovery.`;
  }

  // 5. KICKS & FLEXIBILITY
  else if (/kick|geri|mawashi|yoko|mae geri|flexibility|stretch|high kick/.test(query)) {
    responseText = `**Osu! Kicking Mechanics & Hip Chambering** 🦵\n\n` +
      `A powerful kick is 90% chamber and 10% extension. If the knee does not chamber high and tight, the kick lacks speed and snap.\n\n` +
      `### Key Drills for High, Snapping Kicks:\n\n` +
      `1. **Front Snap Kick (*Mae-Geri Keage*):**\n` +
      `   - Lift the knee chest-high with toes pulled back tightly (*Koshi* strike).\n` +
      `   - Snap out and instantly snap back before setting the foot down. Never let the leg drop lazily.\n\n` +
      `2. **Roundhouse Kick (*Mawashi-Geri*):**\n` +
      `   - Pivot your supporting foot 180° away from the target to open the hip joint.\n` +
      `   - Turn your striking hip fully over so your knee and laces point horizontally, not upward.\n\n` +
      `3. **Wall Balance Conditioning:**\n` +
      `   - Place one hand on the wall, chamber your roundhouse kick, and hold for 15 seconds. Pulse 10 short extensions without lowering the knee. Repeat 3 sets per leg.`;
  }

  // 6. BELT GRADING & PROMOTION SYLLABUS
  else if (/belt|grading|exam|rank|stripe|promotion|test|criteria/.test(query)) {
    responseText = `**Osu! Belt Promotion Standards & Requirements** 🥋\n\n` +
      `At Lion Mode Karate, belt promotions are earned through discipline, consistent attendance, and technical precision—never given away.\n\n` +
      `### Core Grading Pillars:\n\n` +
      `- **1. Kihon (Basics - 30%):** Clean execution of stances, blocks, punches, and kicks with zero balance wobbles.\n` +
      `- **2. Kata (Form - 35%):** Knowing your prescribed belt kata with dynamic rhythm, sharp *Kime*, and solid stances.\n` +
      `- **3. Kumite (Sparring - 20%):** Controlled sparring demonstrating ring awareness, sportsmanship, and quick counter-timing.\n` +
      `- **4. Attendance & Spirit (15%):** Minimum required classes logged on your Dojo Passport and active dojo respect.\n\n` +
      `*Sensei Advice:* If you are preparing for your upcoming belt examination, ensure your dojo passport attendance streak is current and review your kata daily!`;
  }

  // 7. GEAR, PRO SHOP & UNIFORM
  else if (/gear|uniform|gi|shop|gloves|shin|mouthguard|buy|cost/.test(query)) {
    responseText = `**Osu! Dojo Gear & Equipment Guidelines** 🥋\n\n` +
      `Proper safety equipment protects you and your training partners:\n\n` +
      `- **Standard Training Uniform (*Karate Gi*):** Durable white cotton canvas with official Lion Mode embroidery.\n` +
      `- **Sparring Protection:** Mandatory WKF-approved fist guards (red or blue), mouthguard, and shin/instep guards.\n` +
      `- **Pro Shop:** All authentic Lion Mode gear, training weapons, and academy uniforms can be ordered directly through our **[Pro Shop](#/shop)**.\n\n` +
      `*Check with Sensei Babu during class if you need sizing assistance for uniforms or sparring pads!*`;
  }

  // 8. GENERAL MARTIAL ARTS GUIDANCE & PHILOSOPHY
  else {
    responseText = `**Osu, ${studentName}!** 🥋\n\n` +
      `Thank you for your question. As your Sensei, I remind you that true mastery in karate is built one deliberate repetition at a time.\n\n` +
      `> *"Karate begins and ends with respect (Rei). It is not about defeating others, but conquering your own limitations."*\n\n` +
      `Here is your recommended training focus for today:\n\n` +
      `1. **Focus on Stance Depth:** Sink 2 inches lower into your stances to engage your quads and core.\n` +
      `2. **Breath Control (*Kiai*):** Exhale sharply with abdominal contraction on the impact of every technique.\n` +
      `3. **Consistent Practice:** Spend 15 minutes reviewing your belt kata and practicing 50 reverse punches.\n\n` +
      `Feel free to ask me for specific kata steps, sparring drills, the dojo timetable, or belt grading requirements!`;
  }

  return {
    content: responseText,
    modelUsed: 'Sensei Intelligence Core'
  };
}
