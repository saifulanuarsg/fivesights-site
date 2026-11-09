/* Bitsmedia pulse, the close of the session. Same five confidence rows as before, word for word, then session feedback. */
window.PULSE.screens = [
  { kind: "gate", form: "swan", kicker: "Before you go", title: "Two minutes: the same questions as before, then your feedback.",
    privacy: "<p><strong>Still anonymous.</strong> Only fivesights reads these. Leadership sees the combined results, never your own answers.</p>",
    cta: "Start", foot: "The passcode is on the screen." },
  { form: "dog", kicker: "1 of 3", title: "After this morning.", items: [
    { id: "lead", type: "chips", label: "Are you on the senior leadership team?", options: ["Yes", "No"] },
    { id: "conf", type: "scale", label: "Now, how sure are you that you can...", low: "1 not yet", high: "5 absolutely", rows: [
      { id: "heading", label: "Explain where Bitsmedia is heading in the next year" },
      { id: "speak", label: "Say what you really think at work" },
      { id: "good", label: "See the good in a view you disagree with" },
      { id: "user", label: "Describe a typical day of one of our users" },
      { id: "test", label: "Turn an idea into something testable within a day" }
    ] }
  ] },
  { form: "stone", kicker: "2 of 3", title: "How you feel now.", items: [
    { id: "word", type: "word", label: "One word for how you feel about the next 12 months", placeholder: "Any language" },
    { id: "heard", type: "scale", label: "What I said today was heard", low: "1 not at all", high: "5 completely", rows: [{ id: "x", label: "" }] }
  ] },
  { form: "canary", kicker: "3 of 3 · Your feedback", title: "How did this morning go?", cta: "Send", items: [
    { id: "useful", type: "scale", label: "How useful was this morning for you?", low: "1 not useful", high: "5 very useful", rows: [{ id: "x", label: "" }] },
    { id: "fb_best", type: "text", label: "What worked best?", optional: true, max: 300 },
    { id: "fb_change", type: "text", label: "What one thing would you change?", optional: true, max: 300 }
  ] },
  { kind: "done", form: "swan", kicker: "Sent", title: "Thank you. Enjoy lunch.", outro: "<p>Your answers and feedback have been received. Everyone will see the combined results in the report.</p>" }
];
