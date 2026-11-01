// Build a Sanity NDJSON seed for the Samy story documents (FR + NL).
// Run: node scripts/build-story-seed.mjs
// Output: sanity/seed/story.ndjson

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outPath = resolve(__dirname, "..", "sanity", "seed", "story.ndjson");

const fr = {
  title: "L'histoire de Samy",
  paragraphs: [
    "Il y a quelques mois, j'ai perdu mon chien. En cherchant un nouveau compagnon, j'ai découvert Lilou, une Staffordshire présentée sur le site de Veeweyde Turnhout — adoptable, décrite comme pouvant vivre en famille avec des enfants, malgré de sérieux problèmes de santé. J'ai posé ma candidature, prêt à prendre en charge ses besoins médicaux.",
    "Pas de réponse. J'ai téléphoné pour prendre rendez-vous. Refusé. J'ai insisté : toujours refusé. Quand j'ai demandé pourquoi, on m'a décrit Lilou autrement — agressive, impossible à approcher, une rencontre qui serait tendue. Une description à l'opposé de celle publiée sur leur site. L'explication qu'on m'a donnée était qu'il fallait bien présenter un profil attractif sur le site.",
    "Quelques semaines plus tard, j'ai découvert Samy, un jeune malinois, sur le site de Veeweyde à Anderlecht. J'ai pris rendez-vous. La première rencontre s'est très bien passée. J'ai rempli le formulaire d'adoption — où il est explicitement précisé que je vis en appartement, à côté de la forêt de Soignes. Une visite de contrôle à domicile a ensuite été organisée : tout était en ordre. Une deuxième rencontre avec Samy a confirmé mon engagement.",
    "Au moment de finaliser l'adoption, on m'a annoncé que je ne pouvais pas adopter Samy — parce que je n'ai pas de jardin. Alors que ce point avait été discuté dès le début, qu'il figurait sur le formulaire, et que la visite à domicile avait été validée.",
    "Quelques jours plus tôt, Samy avait été adopté par une autre famille. Il avait été ramené au refuge dans les 24 heures parce qu'il avait mordu leur fille adolescente.",
    "Je ne voulais pas abandonner. J'ai contacté une comportementaliste canine, qui a bien voulu intervenir pour tenter de dialoguer avec le refuge. Elle m'a rappelé une dizaine de jours plus tard : selon Veeweyde, le refus d'adoption n'avait finalement rien à voir avec l'absence de jardin ; il tenait au fait que, lors de la dernière rencontre, j'aurais semblé pressé et peu à l'écoute. Veeweyde se disait prêt à me recevoir à nouveau.",
    "J'ai immédiatement recontacté Veeweyde pour relancer la procédure. On m'a dit qu'on me rappellerait. Deux jours plus tard, sans retour, j'ai rappelé moi-même. Cette fois, on m'a de nouveau annoncé que je ne pouvais pas adopter Samy — toujours à cause de l'absence de jardin.",
    "Lorsque j'ai fait remarquer que la comportementaliste avait reçu, de leur part, une version exactement opposée — où le jardin n'était pas en cause — il y a eu un long silence.",
    "Puis plus rien.",
    "Lilou et Samy sont toujours au refuge aujourd'hui.",
  ],
};

const nl = {
  title: "Het verhaal van Samy",
  paragraphs: [
    "Enkele maanden geleden verloor ik mijn hond. Op zoek naar een nieuwe compagnon ontdekte ik Lilou, een Staffordshire gepresenteerd op de website van Veeweyde Turnhout — adopteerbaar, beschreven als geschikt om in gezin met kinderen te leven, ondanks ernstige gezondheidsproblemen. Ik diende mijn kandidatuur in, bereid om voor haar medische noden te zorgen.",
    "Geen reactie. Ik belde om een afspraak te maken. Geweigerd. Ik hield aan: nog steeds geweigerd. Toen ik om uitleg vroeg, kreeg ik een andere beschrijving van Lilou — agressief, niet te benaderen, een ontmoeting die gespannen zou verlopen. Een beschrijving tegenovergesteld aan wat op hun site stond. De uitleg die ik kreeg was dat men nu eenmaal een aantrekkelijk profiel op de site moest tonen.",
    "Enkele weken later ontdekte ik Samy, een jonge mechelaar, op de website van Veeweyde in Anderlecht. Ik maakte een afspraak. De eerste ontmoeting verliep uitstekend. Ik vulde het adoptieaanvraagformulier in — waarop uitdrukkelijk vermeld staat dat ik in een appartement woon, naast het Zoniënwoud. Een huisbezoek werd georganiseerd: alles was in orde. Een tweede ontmoeting met Samy bevestigde mijn engagement.",
    "Op het moment van afronden kreeg ik te horen dat ik Samy niet kon adopteren — omdat ik geen tuin heb. Terwijl dit vanaf het begin was besproken, op het formulier stond, en het huisbezoek was goedgekeurd.",
    "Enkele dagen eerder was Samy door een ander gezin geadopteerd. Hij was binnen 24 uur teruggebracht naar het asiel omdat hij hun tienerdochter had gebeten.",
    "Ik wilde het er niet bij laten. Ik nam contact op met een hondencomportementaliste, die bereid was te bemiddelen met het asiel. Een tiental dagen later belde zij me terug: volgens Veeweyde had de weigering uiteindelijk niets te maken met het ontbreken van een tuin; het ging erom dat ik tijdens de laatste ontmoeting gehaast en weinig luisterbereid zou zijn overgekomen. Veeweyde zei bereid te zijn mij opnieuw te ontvangen.",
    "Ik nam onmiddellijk opnieuw contact op met Veeweyde om de procedure te hervatten. Men zei me dat ze zouden terugbellen. Twee dagen later, zonder nieuws, belde ik zelf. Deze keer kreeg ik opnieuw te horen dat ik Samy niet kon adopteren — nog steeds vanwege het ontbreken van een tuin.",
    "Toen ik erop wees dat de comportementaliste van hen het tegenovergestelde had gehoord — dat de tuin niet de reden was — viel er een lange stilte.",
    "Daarna niets meer.",
    "Lilou en Samy zitten vandaag nog steeds in het asiel.",
  ],
};

function buildBody(paragraphs) {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `b${i + 1}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i + 1}`, text, marks: [] }],
  }));
}

function doc(locale, title, paragraphs) {
  return {
    _id: `story-${locale}`,
    _type: "story",
    locale,
    title,
    body: buildBody(paragraphs),
    lastUpdated: "2026-11-01T00:00:00Z",
  };
}

const ndjson =
  [
    doc("fr", fr.title, fr.paragraphs),
    doc("nl", nl.title, nl.paragraphs),
  ]
    .map((d) => JSON.stringify(d))
    .join("\n") + "\n";

writeFileSync(outPath, ndjson);
console.log(`Wrote ${outPath}`);
