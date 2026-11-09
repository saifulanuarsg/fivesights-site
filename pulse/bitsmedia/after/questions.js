/* Bitsmedia pulse, the close of the session. Same five confidence rows as before, word for word. */
window.PULSE.screens = [
  { kind: "gate", form: "swan", kicker: "Before you go", title: "Ninety seconds. Same questions, three hours later.",
    privacy: "<p><strong>Still private.</strong> Only fivesights reads these. Leadership gets the combined picture, never your answers.</p>",
    cta: "Go", foot: "The passcode is on the screen." },
  { form: "dog", kicker: "1 of 2", title: "After this morning.", items: [
    { id: "lead", type: "chips", label: "Are you on the senior leadership team?", options: ["Yes", "No"] },
    { id: "conf", type: "scale", label: "After this morning, how sure are you that you can...", low: "1 not yet", high: "5 absolutely", rows: [
      { id: "heading", label: "Explain where Bitsmedia is heading in the next year" },
      { id: "speak", label: "Say what you really think at work" },
      { id: "good", label: "See the good in a view you disagree with" },
      { id: "user", label: "Describe a typical day of one of our users" },
      { id: "test", label: "Turn an idea into something testable within a day" }
    ] }
  ] },
  { form: "stone", kicker: "2 of 2", title: "Last two.", cta: "Send", items: [
    { id: "word", type: "word", label: "One word for how you feel about the next 12 months", placeholder: "Any language" },
    { id: "heard", type: "scale", label: "What I said today was heard", low: "1 not at all", high: "5 completely", rows: [{ id: "x", label: "" }] }
  ] },
  { kind: "done", form: "swan", kicker: "Sent", title: "Thank you. Enjoy lunch.", outro: "<p>The combined picture goes to the whole team in the report.</p>" }
];
