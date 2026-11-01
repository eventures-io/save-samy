// Build a Sanity NDJSON seed for the Veeweyde petition (FR + NL).
// Run: node scripts/build-petition-seed.mjs
// Output: sanity/seed/petition.ndjson

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outPath = resolve(__dirname, "..", "sanity", "seed", "petition.ndjson");

const fr = {
  title: "Pétition pour la transparence et l'équité des adoptions chez Veeweyde",
  addressees: [
    "La Direction Générale de Veeweyde",
    "Ministère du Bien-être animal — Région de Bruxelles-Capitale",
  ],
  blocks: [
    { type: "p", text: "Nous, citoyens et futurs adoptants, demandons une réforme urgente des procédures d'adoption au sein des refuges Veeweyde. Les animaux méritent de trouver une famille aimante, et les adoptants méritent un traitement transparent, cohérent et honnête." },
    { type: "h2", text: "Un schéma récurrent" },
    { type: "p", text: "Les témoignages publiés par des tiers sur la fiche Google Maps des refuges Veeweyde documentent un schéma persistant : candidatures sérieuses rejetées sans explication claire, procédures d'adoption menées pendant plusieurs semaines puis stoppées sans justification cohérente, descriptions d'animaux ajustées au fil des échanges pour motiver des refus, et absence de critères constants communiqués aux adoptants." },
    { type: "p", text: "Ce site rassemble ces témoignages ainsi que deux cas documentés en détail. Ils ne sont pas isolés — ils illustrent un fonctionnement qui désavantage à la fois les adoptants et les animaux encore en attente." },
    { type: "h2", text: "Nos revendications" },
    { type: "p", text: "Nous demandons :" },
    { type: "li", text: "La transparence totale sur les critères de refus d'adoption. Les motifs doivent être clairs, objectifs et constants." },
    { type: "li", text: "L'honnêteté des profils : la fin des pratiques consistant à modifier la description d'un animal (sur le site ou par téléphone) pour justifier un refus administratif." },
    { type: "li", text: "Le respect de l'engagement des adoptants : l'arrêt des adoptions parallèles menées en secret alors qu'une procédure exigeante (visites multiples, contrôle à domicile) est déjà en cours." },
    { type: "li", text: "Un meilleur encadrement des animaux : une véritable enquête lorsqu'un chien est ramené pour morsure, afin de ne pas lui apposer injustement une étiquette de « chien dangereux » qui le condamne à l'enfermement." },
    { type: "em", text: "En signant cette pétition, je soutiens la demande d'une révision immédiate de la politique d'adoption chez Veeweyde, pour le bien-être réel des animaux et le respect des adoptants." },
  ],
};

const nl = {
  title: "Petitie voor transparantie en billijkheid bij adopties bij Veeweyde",
  addressees: [
    "De Algemene Directie van Veeweyde",
    "Minister voor Dierenwelzijn — Brussels Hoofdstedelijk Gewest",
  ],
  blocks: [
    { type: "p", text: "Wij, burgers en toekomstige adoptanten, vragen een dringende hervorming van de adoptieprocedures binnen de Veeweyde-asielen. Dieren verdienen een liefhebbend gezin te vinden, en adoptanten verdienen een transparante, coherente en eerlijke behandeling." },
    { type: "h2", text: "Een terugkerend patroon" },
    { type: "p", text: "De getuigenissen die door derden op de Google Maps-pagina's van de Veeweyde-asielen zijn gepubliceerd, documenteren een aanhoudend patroon : serieuze kandidaturen afgewezen zonder duidelijke uitleg, adoptieprocedures die weken worden gevoerd en vervolgens zonder samenhangende rechtvaardiging worden stopgezet, beschrijvingen van dieren die tijdens de uitwisselingen worden aangepast om weigeringen te motiveren, en een gebrek aan consistente criteria die aan adoptanten worden gecommuniceerd." },
    { type: "p", text: "Deze site bundelt deze getuigenissen samen met twee gedetailleerd gedocumenteerde gevallen. Deze zijn niet geïsoleerd — ze illustreren een werking die zowel adoptanten als nog wachtende dieren benadeelt." },
    { type: "h2", text: "Onze eisen" },
    { type: "p", text: "Wij vragen :" },
    { type: "li", text: "Volledige transparantie over de criteria voor weigering van adoptie. De motieven moeten duidelijk, objectief en consistent zijn." },
    { type: "li", text: "Eerlijkheid in de profielen : een einde aan de praktijken waarbij de beschrijving van een dier (op de site of per telefoon) wordt aangepast om een administratieve weigering te rechtvaardigen." },
    { type: "li", text: "Respect voor het engagement van adoptanten : het stopzetten van parallelle adopties die in het geheim worden uitgevoerd terwijl een veeleisende procedure (meerdere bezoeken, huisbezoek) al aan de gang is." },
    { type: "li", text: "Betere omkadering van dieren : een echt onderzoek wanneer een hond wordt teruggebracht wegens bijten, om hem niet onterecht het etiket « gevaarlijke hond » op te plakken dat hem veroordeelt tot opsluiting." },
    { type: "em", text: "Door deze petitie te ondertekenen, steun ik de vraag naar een onmiddellijke herziening van het adoptiebeleid bij Veeweyde, voor het werkelijke welzijn van de dieren en het respect voor adoptanten." },
  ],
};

function block(type, text, i) {
  const base = {
    _key: `b${i + 1}`,
    _type: "block",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `s${i + 1}`,
        text,
        marks: type === "em" ? ["em"] : [],
      },
    ],
  };
  if (type === "h2") return { ...base, style: "h2" };
  if (type === "li") return { ...base, style: "normal", listItem: "bullet", level: 1 };
  return { ...base, style: "normal" };
}

function doc(locale, data) {
  return {
    _id: `petition-${locale}`,
    _type: "petition",
    locale,
    title: data.title,
    addressees: data.addressees,
    body: data.blocks.map((b, i) => block(b.type, b.text, i)),
    lastUpdated: "2026-11-01T00:00:00Z",
  };
}

const ndjson =
  [doc("fr", fr), doc("nl", nl)].map((d) => JSON.stringify(d)).join("\n") + "\n";

writeFileSync(outPath, ndjson);
console.log(`Wrote ${outPath}`);
