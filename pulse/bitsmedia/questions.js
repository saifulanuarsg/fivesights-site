/* Bitsmedia pulse, before the retreat (Tue 10 Nov 2026). */
window.PULSE.screens = [
  { kind: "gate", form: "swan", kicker: "Bitsmedia retreat, 10 November", title: "Please complete this survey before the session starts.",
    intro: "<p>The objective is to understand how the team sees the company today, so that Tuesday's session starts from your views. It takes about three minutes.</p>",
    privacy:
      "<p><strong>This is private.</strong> fivesights runs this survey, not Bitsmedia, and only fivesights reads what you write.</p>" +
      "<ul><li>Leadership and HR get <strong>one combined report</strong> of everyone's views. They never see your answers on their own.</li>" +
      "<li>Department results only appear where five or more people answered.</li>" +
      "<li>Your name is optional. If you add it, it is never shared or reported.</li></ul>" +
      "<p>Any language is fine.</p>",
    cta: "Let's go",
    foot: "The passcode is in the message from HR." },

  { form: "cat", kicker: "1 of 5 · The basics", title: "First, where you sit.", items: [
    { id: "dept", type: "text", label: "Your department", max: 60, placeholder: "e.g. Engineering",
      hint: "Small teams are combined with a neighbour in the report, so nobody stands out." },
    { id: "country", type: "chips", label: "Where do you work?", optional: true,
      hint: "Only ever reported as Singapore and outside Singapore, and never next to your department.",
      options: ["Singapore", "Kuala Lumpur", "Jakarta", "Somewhere else"] }
  ] },

  { form: "canary", kicker: "2 of 5 · In your words", title: "Finish the sentence.", items: [
    { id: "best", type: "text", label: "When we're at our best, we...", hint: "How we work, not just what we make." },
    { id: "overdone", type: "text", label: "A good thing we now overdo is...",
      hint: "Something good taken too far, like tidiness turning into fussiness. New here? First impressions count." },
    { id: "more", type: "text", label: "We need more...", optional: true }
  ] },

  { form: "rhino", kicker: "3 of 5 · Tug of war", title: "Pick your spot.",
    intro: "<p>Both ends are good things. Tap where we are <strong>now</strong> (filled), then where we should be <strong>next</strong> (ring). Same spot is fine.</p>", items: [
    { id: "t1", type: "tug", label: "", left: "Launching new things", right: "Finishing what we start" },
    { id: "t2", type: "tug", label: "", left: "Each team decides", right: "One plan for everyone" },
    { id: "t3", type: "tug", label: "", left: "Serving loyal users", right: "Winning new users" },
    { id: "t4", type: "tug", label: "", left: "Saying it straight", right: "Keeping the peace" }
  ], missingText: "Each line needs two taps: one for now, one for next." },

  { form: "dog", kicker: "4 of 5 · You, right now", title: "How sure are you?", items: [
    { id: "conf", type: "scale", label: "How sure are you that you can...", low: "1 not yet", high: "5 absolutely", rows: [
      { id: "heading", label: "Explain where Bitsmedia is heading in the next year" },
      { id: "speak", label: "Say what you really think at work" },
      { id: "good", label: "See the good in a view you disagree with" },
      { id: "user", label: "Describe a typical day of one of our users" },
      { id: "test", label: "Turn an idea into something testable within a day" }
    ] }
  ] },

  { form: "stone", kicker: "5 of 5 · Last bits", title: "Nearly there.", cta: "Send", items: [
    { id: "word", type: "word", label: "One word for how you feel about the next 12 months", placeholder: "Any language" },
    { id: "plain", type: "long", label: "Anything leadership should hear, said plainly?", optional: true,
      hint: "This goes into the report as a combined theme. We only quote a line if it could have come from anyone." },
    { id: "name", type: "text", label: "Your name", optional: true,
      hint: "It never appears in any report." }
  ] },

  { kind: "done", form: "swan", kicker: "Sent", title: "Done. Terima kasih.",
    outro: "<p>Your answers have been received.</p>" }
];
