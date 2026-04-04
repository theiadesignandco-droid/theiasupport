import React, { useState, useRef, useEffect } from "react";

const GF = "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');";
const T = {
  white:"#FFFFFF", gray50:"#FAFAFA", gray100:"#F4F4F4", gray200:"#E8E8E8",
  gray300:"#D1D1D1", gray400:"#A8A8A8", gray500:"#737373", gray600:"#525252",
  gray700:"#404040", gray800:"#262626", gray900:"#171717", black:"#0A0A0A",
  red:"#DC2626", redLight:"#FEF2F2", green:"#16A34A", greenLight:"#F0FDF4",
  amber:"#D97706", amberLight:"#FFFBEB",
};

const USERS = {
  sociostheia: { pass:"theiadesing25",  role:"admin",    label:"Administrador" },
  theiaventas: { pass:"libertador6501", role:"vendedor", label:"Vendedor"      },
};
const EXTRA_USERS_KEY = "theia_users_v2";
const getExtraUsers = () => { try{ return JSON.parse(localStorage.getItem(EXTRA_USERS_KEY)||"{}"); }catch{ return {}; } };
const getEffectiveUsers = () => ({ ...USERS, ...getExtraUsers() });
const saveExtraUsers = (obj) => localStorage.setItem(EXTRA_USERS_KEY, JSON.stringify(obj));
const OWNER_WA = "541134423383";
const SHEET_ID = "1N4p7U1umPDv3umT38f6zTyKQSjO7vmIIwPdmVe6xt1Y";

// ─── PDF LINKS ────────────────────────────
const PDF_LINKS = [
  { label:"Catálogo Theia 2026",  url:"https://drive.google.com/file/d/1xaDJ2OL1bxE18gcc5zArvHpy5BmmMxHS/view?usp=sharing", icon:"🏛️" },
  { label:"Catálogo WPC Elite",   url:"https://drive.google.com/file/d/1lrvGVdOmmRn6xRLigcE1F8cXacBG9HZw/view?usp=sharing", icon:"🪵" },
  { label:"Catálogo WPC Premium", url:"https://drive.google.com/file/d/12S9406INtIvdHryzkQN8zDfZBArvHXDv/view?usp=sharing", icon:"🏠" },
];

// ─── MODELOS (todos los anchos y specs corregidos) ─
const MODELOS = {
  // EXTERIOR ELITE — omega + clips AW-08/09, 8 clips por pieza
  "UH67 Elite":              { largo:2.85, anchoUtil:0.1322, clip:"AW-08", clipsXpieza:8, linea:"elite",   adhesivo:null },
  "UH62 Elite":              { largo:2.85, anchoUtil:0.1995, clip:"AW-09", clipsXpieza:8, linea:"elite",   adhesivo:null },
  "UH58 Elite":              { largo:2.85, anchoUtil:0.1865, clip:"AW-08", clipsXpieza:8, linea:"elite",   adhesivo:null },
  "UH61 Elite":              { largo:2.85, anchoUtil:0.1865, clip:"AW-08", clipsXpieza:8, linea:"elite",   adhesivo:null },
  "UH93 Elite":              { largo:2.85, anchoUtil:0.1830, clip:"AW-08", clipsXpieza:8, linea:"elite",   adhesivo:null },
  // EXTERIOR PREMIUM — omega + atornillado, 8 clips por pieza
  "WPC Premium (D-0302)":    { largo:2.90, anchoUtil:0.2000, clip:null,    clipsXpieza:0, linea:"premium", adhesivo:null },
  // INTERIOR LISTONES — pegado, 1 cartucho cada 3 tablas
  "Wall Panel Pino (D-0301)": { largo:2.75, anchoUtil:0.1450, clip:null,   clipsXpieza:0, linea:"interior",adhesivo:{ tipo:"listons", cada:3, label:"1 cartucho cada 3 tablas" } },
  "Wall Panel PVC (D-0304-3)":{ largo:2.90, anchoUtil:0.1500, clip:null,   clipsXpieza:0, linea:"interior",adhesivo:{ tipo:"listons", cada:3, label:"1 cartucho cada 3 tablas" } },
  // INTERIOR PLACAS — pegado, 1.5 cartuchos por placa
  "Panel PVC Placa (D-0304-1)":{ largo:2.44, anchoUtil:1.220, clip:null,   clipsXpieza:0, linea:"interior",adhesivo:{ tipo:"placas", por:1.5, label:"1.5 cartuchos por placa" } },
  "Wood Panel FB (MD-202)":   { largo:2.60, anchoUtil:1.200, clip:null,    clipsXpieza:0, linea:"interior",adhesivo:{ tipo:"placas", por:1.5, label:"1.5 cartuchos por placa" } },
};

// ─── CATÁLOGO ─────────────────────────────
const CATALOGO = [
  { cat:"WPC Elite", desc:"Garantía 15 años · Largo 2.85m · Sistema omega + clips COBRA", items:[
    { cod:"UH67", nom:"WPC Elite UH67", dim:"285 × 14.22 cm", col:"8 colores", gar:"15 años", nota:"Ancho útil 13.22cm · Perfil delgado, modulación fina", precio:"Consultar" },
    { cod:"UH62", nom:"WPC Elite UH62", dim:"285 × 20.95 cm", col:"5 colores", gar:"15 años", nota:"Ancho útil 19.95cm · Paños amplios, menos juntas",     precio:"Consultar" },
    { cod:"UH58", nom:"WPC Elite UH58", dim:"285 × 19.65 cm", col:"5 colores", gar:"15 años", nota:"Ancho útil 18.65cm · Mayor espesor, máx rigidez",      precio:"Consultar" },
    { cod:"UH61", nom:"WPC Elite UH61", dim:"285 × 19.65 cm", col:"8 colores (incl. blanco)", gar:"15 años", nota:"Ancho útil 18.65cm · Tabla más pesada", precio:"Consultar" },
    { cod:"UH93", nom:"WPC Elite UH93", dim:"285 × 19.50 cm", col:"Teca / Lapacho",           gar:"15 años", nota:"Ancho útil 18.30cm · Solo tonos cálidos",precio:"Consultar" },
  ]},
  { cat:"WPC Premium", desc:"Garantía 10 años · Largo 2.90m · Sistema omega + atornillado en encastre oculto", items:[
    { cod:"D-0302-1", nom:"WPC Teak",          dim:"290 × 22 cm", col:"Teak",          gar:"10 años", nota:"Ancho útil 20cm", precio:"USD 48 +IVA" },
    { cod:"D-0302-2", nom:"WPC Teak & Black",  dim:"290 × 22 cm", col:"Bicolor negro", gar:"10 años", nota:"Fachadas contemporáneas", precio:"USD 48 +IVA" },
  ]},
  { cat:"Wall Panel Interior", desc:"Instalación pegada · KPU 40 / Fischer Total / Unipega Hightech Total", items:[
    { cod:"D-0301",   nom:"Wall Panel Pino Premium", dim:"275 × 14.5 cm",  col:"Fresno Claro / Fresno / Haya / Roble", gar:"—", nota:"Ancho útil 14.5cm · 1 cartucho c/3 tablas", precio:"USD 21 +IVA" },
    { cod:"D-0304-3", nom:"Wall Panel PVC Natural",  dim:"290 × 16 cm",    col:"Natural",                              gar:"—", nota:"Ancho útil 15cm · 1 cartucho c/3 tablas · Impermeable", precio:"USD 10 +IVA" },
    { cod:"D-0304-1", nom:"Panel PVC Simil Madera",  dim:"244 × 122 cm",   col:"Único",                                gar:"—", nota:"1.5 cartuchos por placa · Impresión 3D", precio:"USD 48 +IVA" },
    { cod:"MD-202",   nom:"Wood Panel FB",            dim:"260 × 120 cm",   col:"Roble / Haya / Grafito",               gar:"—", nota:"1.5 cartuchos por placa · Madera natural", precio:"USD 40 +IVA" },
  ]},
  { cat:"Perfiles WPC", desc:"Largo 2.90m · Color Teak · Refuerzo interior + subestructura metálica a medida", items:[
    { cod:"D-0303-5", nom:"Perfil 12 × 12 cm", dim:"290 cm", col:"Teak", gar:"—", nota:"Columnas, pérgolas, vigas principales", precio:"USD 93 +IVA" },
    { cod:"D-0303-3", nom:"Perfil 9 × 4 cm",   dim:"290 cm", col:"Teak", gar:"—", nota:"Vigas decorativas, estructura pérgola",  precio:"USD 42 +IVA" },
    { cod:"D-0303-7", nom:"Perfil 6 × 4 cm",   dim:"290 cm", col:"Teak", gar:"—", nota:"Marcos, bordes, terminaciones deck",     precio:"USD 27 +IVA" },
    { cod:"D-0303-4", nom:"Perfil 5 × 2 cm",   dim:"290 cm", col:"Teak", gar:"—", nota:"Tapajuntas, brises, celosías, remates",  precio:"USD 17 +IVA" },
  ]},
];

const PRECIOS = [
  { cat:"WPC Elite — Exterior", items:[
    ["UH67","A consultar","omega + clip AW-08 · 8 clips/pieza","15 años"],
    ["UH62","A consultar","omega + clip AW-09 · 8 clips/pieza","15 años"],
    ["UH58","A consultar","omega + clip AW-08 · 8 clips/pieza","15 años"],
    ["UH61","A consultar","omega + clip AW-08 · 8 clips/pieza","15 años"],
    ["UH93","A consultar","omega + clip AW-08 · 8 clips/pieza","15 años"],
  ]},
  { cat:"WPC Premium — Exterior", items:[
    ["WPC Teak (D-0302-1)","USD 48 +IVA","omega + atornillado en encastre","10 años"],
    ["WPC Teak & Black (D-0302-2)","USD 48 +IVA","omega + atornillado en encastre","10 años"],
  ]},
  { cat:"Wall Panel Interior — Listones", items:[
    ["Wall Panel Pino (D-0301)","USD 21 +IVA","pegado · 1 cartucho c/3 tablas","—"],
    ["Wall Panel PVC Natural (D-0304-3)","USD 10 +IVA","pegado · 1 cartucho c/3 tablas","—"],
  ]},
  { cat:"Wall Panel Interior — Placas", items:[
    ["Panel PVC Placa (D-0304-1)","USD 48 +IVA","pegado · 1.5 cartuchos/placa","—"],
    ["Wood Panel FB (MD-202)","USD 40 +IVA","pegado · 1.5 cartuchos/placa","—"],
  ]},
  { cat:"Perfiles WPC", items:[
    ["Perfil 12×12cm (D-0303-5)","USD 93 +IVA","subestructura metálica a medida","—"],
    ["Perfil 9×4cm (D-0303-3)","USD 42 +IVA","subestructura metálica a medida","—"],
    ["Perfil 6×4cm (D-0303-7)","USD 27 +IVA","subestructura metálica a medida","—"],
    ["Perfil 5×2cm (D-0303-4)","USD 17 +IVA","subestructura metálica a medida","—"],
  ]},
  { cat:"Muebles de Diseño — ARS", items:[
    ["Eames Lounge Chair + Ottoman","$2.150.000 +IVA","Cuero genuino + madera moldeada","—"],
    ["Swivel Leisure Chair","$863.700","","—"],
    ["Hansen Lounge Chair","$762.800","","—"],
    ["Coffee Table","$695.300","Vidrio + madera","—"],
    ["Accent Chair","$704.000","82×68×80cm","—"],
    ["Curved Chair","$660.000","","—"],
    ["Flower Table","$543.500","Vidrio + madera","—"],
    ["Pierre Chair","$574.000","","—"],
    ["Biarritz Chair","$520.432","Madera lacada negra","—"],
    ["Silla Cover","$372.700","","—"],
    ["Wood Taburete","$364.800","","—"],
    ["Eames Plywood","$310.000","","—"],
    ["Butterfly Stool","$165.000","","—"],
  ]},
];

// ─── KB ───────────────────────────────────
const REAL_KB = `=== THEIA DESIGN & CO — BASE DE CONOCIMIENTO ===
Showroom: Av. Libertador 6501, CABA · Lun-Vie 10-19hs · Sáb 09-13hs
Tel/WA: +54 11 2532-7855 · theiadesignandco@gmail.com · www.theiadesignandco.com.ar

[CATÁLOGO WPC ELITE — Garantía 15 años · Largo 2.85m]
UH67: largo 2.85m, ancho total 14.22cm, ancho útil 13.22cm · 8 colores
UH62: largo 2.85m, ancho total 20.95cm, ancho útil 19.95cm · 5 colores
UH58: largo 2.85m, ancho total 19.65cm, ancho útil 18.65cm · 5 colores
UH61: largo 2.85m, ancho total 19.65cm, ancho útil 18.65cm · 8 colores (incluye Blanco)
UH93: largo 2.85m, ancho total 19.50cm, ancho útil 18.30cm · Solo Teca y Lapacho

[CATÁLOGO WPC PREMIUM — Garantía 10 años]
D-0302-1 WPC Teak 290×22cm USD 48+IVA
D-0302-2 WPC Teak & Black 290×22cm USD 48+IVA

[CATÁLOGO INTERIOR]
D-0301 Wall Panel Pino 275cm × 14.5cm ancho útil — USD 21+IVA · Colores: Fresno Claro/Fresno/Haya/Roble
D-0304-3 Wall Panel PVC 290cm × 15cm ancho útil — USD 10+IVA · Impermeable
D-0304-1 Panel PVC Placa 244×122cm — USD 48+IVA
MD-202 Wood Panel FB 260×120cm — USD 40+IVA · Roble/Haya/Grafito

[PERFILES WPC — 290cm · Teak]
12×12cm USD 93 · 9×4cm USD 42 · 6×4cm USD 27 · 5×2cm USD 17 (todos +IVA)

[MUEBLES ARS]
Eames Lounge+Ottoman $2.150.000 · Swivel $863.700 · Hansen $762.800 · Coffee Table $695.300
Accent Chair $704.000 · Curved Chair $660.000 · Flower Table $543.500 · Pierre $574.000
Biarritz $520.432 · Silla Cover $372.700 · Taburete $364.800 · Eames Plywood $310.000 · Butterfly $165.000
[DECORACIÓN ARS] Alfombra $134.500 · Vasijas $93.900 · Servilletero $69.500 · Mantas — A consultar

=== GUÍA TÉCNICA INSTALACIÓN ===

[SISTEMAS POR PRODUCTO]
WPC ELITE (UH67/62/58/61/93): omega galvanizado cada 40cm + CLIPS COBRA (AW-08 o AW-09) 8 CLIPS POR PIEZA + chapitas en encastres. Garantía 15 años. Instalación exclusiva equipo Theia.
WPC PREMIUM (D-0302): omega galvanizado cada 40cm + atornillado en encastre oculto + chapitas. Garantía 10 años. Instalación exclusiva equipo Theia.
PERFILES WPC (12×12/9×4/6×4/5×2): van con refuerzo interior + subestructura metálica diseñada a medida según proyecto (NO omega estándar). Cálculo según plano, ancho del perfil y espaciado a elección del cliente.
INTERIOR (pino/PVC/placas): pegado con KPU 40 / Fischer Total / Unipega Hightech Total. Sin omega.
DECK: perfil PGU o PGC cada 40cm (PGU/PGC vienen en piezas de 6m).

[ADHESIVO POR PRODUCTO INTERIOR]
Wall Panel Pino (D-0301) y Wall Panel PVC (D-0304-3): 1 CARTUCHO CADA 3 TABLAS
Panel PVC Placa (D-0304-1) y Wood Panel FB (MD-202): 1.5 CARTUCHOS POR PLACA
Productos adhesivos recomendados: KPU 40, Fischer Total, Unipega Hightech Total

[LONGITUDES DE MATERIALES]
Omega: piezas de 2.50m
Terminaciones (lateral/esquinero): vienen de 6m, se cortan de a 3m
PGU/PGC: piezas de 6m

[CUÁNDO VAN TERMINACIONES]
Terminación lateral/zócalo: cuando el WPC exterior toca el piso o cuando los laterales quedan a la vista (perfil de aluminio negro).
Esquinero: cuando dos planos de tablas se encuentran en esquina exterior.
Terminación en T: junta de dilatación o unión de dos paños.
Las terminaciones para interior son a criterio y elección del cliente — no se calculan automáticamente.

[LÓGICA DE CÁLCULO]
Siempre por dimensiones exactas (ancho × alto). Se calcula columnas y se optimiza el uso de recortes.
Columnas = ceil(ancho_pared / ancho_útil_tabla)
Si alto ≤ largo tabla → 1 fila (tabla recortada, SIN uniones). 
Si alto > largo tabla → tablas completas por columna + tablas extra optimizando los recortes sobrantes.
NUNCA hacer uniones en el mismo paño vertical si se puede evitar con recortes de tablas enteras.
Clips: 8 CLIPS POR PIEZA (no por m²).
Perfiles omega van cada 40cm. Omega viene en piezas de 2.50m.`;

const AGENT_SYS = (kb) => `Sos el asistente técnico de THEIA Design & Co. Especialista en revestimientos WPC e instalación.

BASE DE CONOCIMIENTO:
${kb}

REGLAS DE CÁLCULO:
1. Siempre por ANCHO × ALTO exactos
2. Columnas = ceil(ancho / ancho_útil_tabla)
3. Si alto ≤ largo tabla → 1 fila (sin uniones), tabla recortada
4. Si alto > largo tabla → calcular piezas completas + optimizar recortes sobrantes (cuántos recortes del sobrante caben en 1 tabla extra)
5. Clips: 8 POR PIEZA (no por m²)
6. Adhesivo listones (pino/PVC): 1 cartucho cada 3 tablas
7. Adhesivo placas: 1.5 cartuchos por placa
8. Terminaciones interiores: a criterio del cliente, NO calcular
9. Terminaciones exteriores: mencionarlas solo cuando el WPC toca el piso o los laterales quedan a la vista
10. Perfiles WPC: cálculo según plano/proyecto, no calculable en forma estándar

RESPUESTA: español argentino, profesional. Mostrá el desarrollo del cálculo.
Si no tenés la info → responde ÚNICAMENTE con este JSON exacto, sin markdown, sin texto extra, sin comillas de código:
{"escalate":true,"question":"<resumen max 15 palabras>","reason":"<qué falta>"}
Nunca inventes precios ni specs.`;

const TRAIN_SYS = `Sos un consultor ayudando a cargar la base de conocimiento de THEIA Design & Co (revestimientos WPC, Buenos Aires). Hacé UNA sola pregunta concreta. Temas: precios, stock, importación, formas de pago, descuentos, zonas entrega, diferenciadores. Al final: [KB_UPDATE: <info>]`;

// ─── UTILS ────────────────────────────────
const nowT = () => new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});
const AK = import.meta.env.VITE_ANTHROPIC_KEY||"";
const AH = {"Content-Type":"application/json","x-api-key":AK,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"};
const claudeCall = async (system, messages, max=1000) => {
  const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:AH,body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:max,system,messages})});
  return (await r.json()).content?.[0]?.text||"";
};
const claudePDF = async (b64, name) => {
  const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:AH,body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:`Extraé toda la información del catálogo de Theia: productos, precios, colores, specs, garantías. Formato estructurado. Archivo: ${name}`}]}]})});
  return (await r.json()).content?.[0]?.text||"";
};
const sendWhatsApp = (question, reason, desde) => {
  const txt = encodeURIComponent(`🏛️ *THEIA — Consulta sin respuesta*\n━━━━━━━━━━━━━━━━\n📌 *Consulta:*\n${question}\n\n❓ *Motivo:*\n${reason}\n\n👤 Desde: ${desde}\n⏰ ${new Date().toLocaleString("es-AR",{timeZone:"America/Argentina/Buenos_Aires"})}\n━━━━━━━━━━━━━━━━\nRespondé para actualizar la base 👆`);
  window.open(`https://wa.me/${OWNER_WA}?text=${txt}`,"_blank");
};

// ─── CÁLCULO INTELIGENTE ──────────────────
function calcMateriales(w, h, modelKey, desperdicio) {
  const m = MODELOS[modelKey];
  if (!m || !w || !h) return null;
  const factor = 1 + desperdicio/100;
  const columnas = Math.ceil(w / m.anchoUtil);

  // Manejo inteligente de altura
  let tablasBase, filasCompletas, sobrante, tablasExtra, unionAlerta;
  filasCompletas = Math.floor(h / m.largo);
  sobrante = +(h - filasCompletas * m.largo).toFixed(4);
  unionAlerta = sobrante > 0.001 && filasCompletas > 0;

  if (sobrante < 0.001) {
    // Altura exactamente múltiplo del largo de tabla
    tablasBase = columnas * (filasCompletas || 1);
    tablasExtra = 0;
  } else if (filasCompletas === 0) {
    // Alto < largo tabla → 1 tabla por columna, se recorta
    tablasBase = columnas;
    tablasExtra = 0;
    sobrante = 0;
  } else {
    // Alto > largo tabla → piezas completas + piezas de recorte
    const tablasCompletas = columnas * filasCompletas;
    // Cuántas piezas del sobrante caben en una tabla entera
    const piezasPorTabla = Math.floor(m.largo / sobrante);
    tablasExtra = piezasPorTabla > 0 ? Math.ceil(columnas / piezasPorTabla) : columnas;
    tablasBase = tablasCompletas + tablasExtra;
  }

  const tablasConDesp = Math.ceil(tablasBase * factor);
  const clips = m.clipsXpieza > 0 ? tablasConDesp * m.clipsXpieza : 0;

  // Omegas (solo exterior, no interior)
  let omegaFilas=0, omegaMetros=0, omegaPiezas=0;
  if (m.linea !== "interior") {
    omegaFilas = Math.ceil(w / 0.40) + 1;
    omegaMetros = +(omegaFilas * h * factor).toFixed(2);
    omegaPiezas = Math.ceil(omegaMetros / 2.50);
  }

  // Adhesivo
  let adhesivoQty = null, adhesivoLabel = null;
  if (m.adhesivo) {
    if (m.adhesivo.tipo === "listons") {
      adhesivoQty = Math.ceil(tablasConDesp / m.adhesivo.cada);
      adhesivoLabel = `${adhesivoQty} cartucho${adhesivoQty>1?"s":""} (1 cada ${m.adhesivo.cada} tablas)`;
    } else if (m.adhesivo.tipo === "placas") {
      adhesivoQty = Math.ceil(tablasConDesp * m.adhesivo.por);
      adhesivoLabel = `${adhesivoQty} cartucho${adhesivoQty>1?"s":""} (${m.adhesivo.por} por placa)`;
    }
  }

  return { w, h, columnas, filasCompletas, sobrante:sobrante.toFixed(2), tablasExtra, tablasBase, tablasConDesp, clips, omegaFilas, omegaMetros, omegaPiezas, adhesivoQty, adhesivoLabel, unionAlerta, m, modelKey, desperdicio };
}

// ─── ICONS ────────────────────────────────
const Ic = ({d,s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const ISend    = ({s=16}) => <Ic d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" s={s}/>;
const IOut     = ()       => <Ic d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" s={14}/>;
const IEye     = ()       => <Ic d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z"/>;
const IEyeOff  = ()       => <Ic d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>;
const IEdit    = ()       => <Ic d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" s={13}/>;
const IChat    = ()       => <Ic d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>;
const ICatalog = ()       => <Ic d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 4.5v15"/>;
const IPrice   = ()       => <Ic d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>;
const ICalc    = ()       => <Ic d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM9 9h.01M12 9h.01M15 9h.01M9 12h.01M12 12h.01M15 12h.01M9 15h.01M12 15h.01M15 15h.01"/>;
const IBrain   = ()       => <Ic d="M12 2a5 5 0 00-5 5v1H6a3 3 0 00-3 3v2a3 3 0 003 3h1v1a5 5 0 0010 0v-1h1a3 3 0 003-3v-2a3 3 0 00-3-3h-1V7a5 5 0 00-5-5z"/>;
const IWarn    = ()       => <Ic d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>;
const IKB      = ()       => <Ic d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/>;
const IZap     = ()       => <Ic d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const IPDF     = ()       => <Ic d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M9 13h6M9 17h4"/>;
const IWA = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="#16A34A"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const ICRM     = ()       => <Ic d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>;
const IMetrics = ()       => <Ic d="M18 20V10M12 20V4M6 20v-6"/>;
const IEnvios  = ()       => <Ic d="M1 3h15v13H1zM16 8l4 2v6h-4M5 16a2 2 0 100 4 2 2 0 000-4zM12 16a2 2 0 100 4 2 2 0 000-4z"/>;
const IUsers   = ()       => <Ic d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>;

// ─── USUARIOS VIEW ────────────────────────
function UsersView() {
  const [extra, setExtra]     = useState(getExtraUsers);
  const [form, setForm]       = useState({user:"",pass:"",role:"operador",label:""});
  const [err, setErr]         = useState("");
  const [ok, setOk]           = useState("");
  const [showPass, setShowPass] = useState({});

  const allUsers = getEffectiveUsers();
  const isBuiltin = (u) => !!USERS[u];

  const save = (obj) => { saveExtraUsers(obj); setExtra({...obj}); };

  const addUser = () => {
    setErr(""); setOk("");
    const u = form.user.trim().toLowerCase();
    if (!u || !form.pass || !form.label.trim()) { setErr("Completá usuario, contraseña y nombre."); return; }
    if (!/^[a-z0-9_]{3,30}$/.test(u)) { setErr("El usuario solo puede tener letras, números y _ (3-30 caracteres)."); return; }
    if (allUsers[u]) { setErr("Ese usuario ya existe."); return; }
    const updated = { ...getExtraUsers(), [u]: { pass: form.pass, role: form.role, label: form.label.trim() } };
    save(updated);
    setForm({user:"",pass:"",role:"vendedor",label:""});
    setOk(`Usuario "${u}" creado ✓`);
    setTimeout(()=>setOk(""),3000);
  };

  const deleteUser = (u) => {
    if (!window.confirm(`¿Eliminar al usuario "${u}"?`)) return;
    const updated = { ...getExtraUsers() };
    delete updated[u];
    save(updated);
  };

  const resetPass = (u) => {
    const np = window.prompt(`Nueva contraseña para "${u}":`);
    if (!np || np.length < 4) { alert("La contraseña debe tener al menos 4 caracteres."); return; }
    const updated = { ...getExtraUsers(), [u]: { ...extra[u], pass: np } };
    save(updated);
    setOk(`Contraseña de "${u}" actualizada ✓`);
    setTimeout(()=>setOk(""),3000);
  };

  const ROLE_LABELS = { admin:"Administrador", operador:"Operador", vendedor:"Vendedor" };
  const roleBadge = (role) => {
    if(role==="admin")    return {bg:"#FEF9C3",col:"#854D0E"};
    if(role==="operador") return {bg:"#EDE9FE",col:"#5B21B6"};
    return {bg:"#F0FDF4",col:T.green};
  };

  return (
    <div style={{padding:24,overflowY:"auto",height:"100%",maxWidth:760,margin:"0 auto"}}>
      <div style={{marginBottom:22}}>
        <h2 style={{fontSize:20,fontWeight:700,color:T.black}}>Gestión de Usuarios</h2>
        <p style={{color:T.gray500,fontSize:13,marginTop:4}}>Administrá los accesos a la plataforma. Los usuarios base del sistema no pueden modificarse desde aquí.</p>
      </div>

      {/* Add user */}
      <div style={{background:T.white,border:`1px solid ${T.gray200}`,borderRadius:12,padding:20,marginBottom:20}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:T.black}}>Agregar nuevo usuario</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div>
            <label style={{fontSize:11,color:T.gray500,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Nombre para mostrar</label>
            <input value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} placeholder="Ej: María García" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1px solid ${T.gray200}`,background:T.gray50,color:T.black,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          </div>
          <div>
            <label style={{fontSize:11,color:T.gray500,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Nombre de usuario</label>
            <input value={form.user} onChange={e=>setForm(p=>({...p,user:e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,"")}))} placeholder="Ej: mgarcía → mgarcia" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1px solid ${T.gray200}`,background:T.gray50,color:T.black,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          </div>
          <div>
            <label style={{fontSize:11,color:T.gray500,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Contraseña</label>
            <input type="text" value={form.pass} onChange={e=>setForm(p=>({...p,pass:e.target.value}))} placeholder="Mínimo 4 caracteres" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1px solid ${T.gray200}`,background:T.gray50,color:T.black,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          </div>
          <div>
            <label style={{fontSize:11,color:T.gray500,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Rol</label>
            <div style={{position:"relative"}}>
              <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1px solid ${T.gray200}`,background:T.gray50,color:T.black,fontSize:13,outline:"none",fontFamily:"inherit",appearance:"none"}}>
                <option value="operador">Operador — acceso amplio (recomendado)</option>
                <option value="vendedor">Vendedor — solo chat, calculadora y catálogo</option>
                <option value="admin">Administrador — acceso total</option>
              </select>
              <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:T.gray400,pointerEvents:"none",fontSize:11}}>▾</span>
            </div>
          </div>
        </div>
        {err && <div style={{background:T.redLight,border:`1px solid #FECACA`,borderRadius:7,padding:"9px 14px",fontSize:12.5,color:T.red,marginBottom:10}}>{err}</div>}
        {ok  && <div style={{background:T.greenLight,border:`1px solid #BBF7D0`,borderRadius:7,padding:"9px 14px",fontSize:12.5,color:T.green,marginBottom:10}}>{ok}</div>}
        <button onClick={addUser} style={{padding:"9px 22px",borderRadius:8,background:T.black,border:"none",color:T.white,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Crear usuario</button>
      </div>

      {/* Users table */}
      <div style={{background:T.white,border:`1px solid ${T.gray200}`,borderRadius:12,padding:20}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:T.black}}>Usuarios activos</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr>
                {["Usuario","Nombre","Rol","Contraseña","Acciones"].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"7px 10px",color:T.gray500,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:`1px solid ${T.gray200}`,fontWeight:600}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(allUsers).map(([u,d])=>{
                const builtin = isBuiltin(u);
                return(
                  <tr key={u} onMouseEnter={e=>e.currentTarget.style.background=T.gray50} onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <td style={{padding:"10px 10px",borderBottom:`1px solid ${T.gray100}`,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.black,fontWeight:600}}>
                      {u}
                      {builtin && <span style={{marginLeft:7,background:T.gray100,color:T.gray500,borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:600,verticalAlign:"middle"}}>sistema</span>}
                    </td>
                    <td style={{padding:"10px 10px",borderBottom:`1px solid ${T.gray100}`,color:T.black}}>{d.label}</td>
                    <td style={{padding:"10px 10px",borderBottom:`1px solid ${T.gray100}`}}>
                      <span style={{padding:"3px 9px",borderRadius:5,fontSize:11,fontWeight:600,background:roleBadge(d.role).bg,color:roleBadge(d.role).col}}>{ROLE_LABELS[d.role]||d.role}</span>
                    </td>
                    <td style={{padding:"10px 10px",borderBottom:`1px solid ${T.gray100}`,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.gray400}}>
                      {builtin ? "••••••••••" : (showPass[u] ? d.pass : "••••••••")}
                      {!builtin && <button onClick={()=>setShowPass(p=>({...p,[u]:!p[u]}))} style={{background:"none",border:"none",color:T.gray400,cursor:"pointer",marginLeft:6,padding:0,fontSize:12}}>{showPass[u]?"🙈":"👁"}</button>}
                    </td>
                    <td style={{padding:"10px 10px",borderBottom:`1px solid ${T.gray100}`}}>
                      {!builtin && (
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={()=>resetPass(u)} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${T.gray200}`,background:"none",color:T.gray600,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>Cambiar pass</button>
                          <button onClick={()=>deleteUser(u)} style={{padding:"4px 10px",borderRadius:5,border:`1px solid #FECACA`,background:"none",color:T.red,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>Eliminar</button>
                        </div>
                      )}
                      {builtin && <span style={{fontSize:11,color:T.gray300}}>No editable</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:14,padding:"10px 14px",background:T.gray50,borderRadius:8,fontSize:12,color:T.gray500,lineHeight:1.6}}>
          💡 <strong>Vendedor:</strong> Chat IA, Calculadora y Catálogo. &nbsp;·&nbsp; <strong>Operador:</strong> todo excepto Alertas, Entrenar IA, Conocimiento, config. de logística y Usuarios. &nbsp;·&nbsp; <strong>Administrador:</strong> acceso total.
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────
const COT_CSS = `
.cot-wrap{font-family:'DM Sans',sans-serif;background:#f5f4f0;min-height:100%;display:flex;flex-direction:column;}
.cot-wrap *{box-sizing:border-box;}
.cot-subnav{display:flex;gap:2px;flex-wrap:wrap;padding:14px 20px 0;background:#fff;border-bottom:1px solid rgba(0,0,0,0.09);}
.cot-subnav>div[style]{display:contents;}
.cot-subnav-section{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#a8a8a3;padding:0 10px 12px;display:flex;align-items:flex-end;}
.cot-tab{padding:8px 14px 10px;border:none;border-bottom:2px solid transparent;background:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;color:#737373;cursor:pointer;margin-bottom:-1px;transition:all .15s;white-space:nowrap;}
.cot-tab:hover{color:#1a1a18;}
.cot-tab.cot-active{color:#c8873a;border-bottom-color:#c8873a;font-weight:600;}
.cot-body{padding:24px 28px;flex:1;overflow-y:auto;}
.cot-body .card{background:#fff;border:1px solid rgba(0,0,0,0.09);border-radius:10px;padding:20px 24px;margin-bottom:16px;}
.cot-body .card-title{font-size:14px;font-weight:600;margin-bottom:14px;color:#1a1a18;}
.cot-body label.lbl{display:block;font-size:11px;color:#6b6b66;margin-bottom:5px;letter-spacing:.03em;text-transform:uppercase;font-weight:500;}
.cot-body input[type=text],.cot-body input[type=number],.cot-body input[type=month],.cot-body select,.cot-body textarea{width:100%;background:#f0efe9;border:1px solid rgba(0,0,0,0.09);border-radius:6px;padding:9px 12px;font-size:13px;font-family:'DM Sans',sans-serif;color:#1a1a18;outline:none;transition:border-color .15s;}
.cot-body input:focus,.cot-body select:focus{border-color:#c8873a;background:#fff;}
.cot-body .fg{margin-bottom:14px;}
.cot-body .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
.cot-body .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;}
.cot-body .g4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px;}
.cot-body .btn{background:#1a1a18;color:#fff;border:none;border-radius:6px;padding:9px 18px;font-size:13px;font-family:'DM Sans',sans-serif;font-weight:500;cursor:pointer;transition:opacity .15s;}
.cot-body .btn:hover{opacity:.82;}
.cot-body .btn:disabled{opacity:.38;cursor:not-allowed;}
.cot-body .btn-sm{padding:7px 14px;font-size:12px;}
.cot-body .btn-accent{background:#c8873a;}
.cot-body .btn-outline{background:none;color:#1a1a18;border:1px solid rgba(0,0,0,0.15);border-radius:6px;padding:7px 14px;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background .15s;}
.cot-body .btn-outline:hover{background:#f0efe9;}
.cot-body .btn-ghost{background:none;border:none;cursor:pointer;color:#a8a8a3;font-size:13px;padding:2px 6px;}
.cot-body .btn-ghost:hover{color:#1a1a18;}
.cot-body .row-btns{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
.cot-body .veh-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;}
.cot-body .veh-card{background:#fff;border:1.5px solid rgba(0,0,0,0.09);border-radius:10px;padding:16px;cursor:pointer;text-align:center;transition:all .2s;}
.cot-body .veh-card:hover{border-color:rgba(0,0,0,0.15);transform:translateY(-1px);}
.cot-body .veh-card.sel{border-color:#c8873a;background:#fdf3e8;}
.cot-body .veh-av{width:44px;height:44px;border-radius:50%;background:#f0efe9;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;margin:0 auto 10px;color:#6b6b66;transition:all .2s;}
.cot-body .veh-card.sel .veh-av{background:#c8873a;color:#fff;}
.cot-body .veh-nm{font-size:15px;font-weight:700;margin-bottom:2px;}
.cot-body .veh-sb{font-size:11px;color:#6b6b66;margin-bottom:8px;}
.cot-body .veh-rt{font-size:14px;font-weight:500;color:#c8873a;margin-bottom:2px;}
.cot-body .veh-nt{font-size:11px;color:#a8a8a3;}
.cot-body .metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:16px;}
.cot-body .metric{background:#f0efe9;border-radius:6px;padding:12px 14px;}
.cot-body .metric-label{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:#6b6b66;margin-bottom:4px;font-weight:500;}
.cot-body .metric-val{font-size:17px;font-weight:500;}
.cot-body .metric-3{grid-template-columns:repeat(3,minmax(0,1fr));}
.cot-body .bk{background:#f0efe9;border-radius:10px;padding:16px 20px;margin-top:14px;}
.cot-body .bk-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(0,0,0,0.09);font-size:13px;}
.cot-body .bk-row:last-of-type{border-bottom:none;}
.cot-body .bk-total{display:flex;justify-content:space-between;padding-top:12px;margin-top:4px;border-top:2px solid rgba(0,0,0,0.15);}
.cot-body .bk-total-label{font-weight:600;font-size:14px;}
.cot-body .bk-price{font-size:32px;font-weight:700;color:#1a1a18;margin-top:6px;}
.cot-body .bk-rate{font-size:12px;color:#6b6b66;margin-top:3px;}
.cot-body .ai-box{background:#fff;border:1px solid rgba(0,0,0,0.09);border-radius:10px;padding:18px 22px;margin-bottom:16px;}
.cot-body .ai-input-row{display:flex;gap:10px;align-items:flex-end;}
.cot-body .ai-result{background:#f0efe9;border-radius:6px;padding:12px 16px;margin-top:12px;display:none;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.cot-body .ai-result.show{display:flex;}
.cot-body .ai-time-num{font-size:24px;font-weight:700;}
.cot-body .ai-time-sub{font-size:12px;color:#6b6b66;margin-top:2px;}
.cot-body .spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(0,0,0,0.15);border-top-color:#c8873a;border-radius:50%;animation:cot-spin .7s linear infinite;}
@keyframes cot-spin{to{transform:rotate(360deg);}}
.cot-body .badge{font-size:11px;border-radius:4px;padding:3px 9px;display:inline-block;font-weight:500;}
.cot-body .b-ok{background:#eaf4ee;color:#2d7a4f;}
.cot-body .b-warn{background:#fdf3df;color:#926c1a;}
.cot-body .b-err{background:#fdeaea;color:#b83a3a;}
.cot-body .b-info{background:#e8f0fc;color:#2a5fa8;}
.cot-body .tbl-wrap{overflow-x:auto;}
.cot-body table{width:100%;border-collapse:collapse;}
.cot-body th{font-size:11px;font-weight:500;color:#6b6b66;text-align:left;padding:6px 8px 9px;border-bottom:1px solid rgba(0,0,0,0.09);white-space:nowrap;text-transform:uppercase;letter-spacing:.04em;}
.cot-body td{padding:9px 8px;border-bottom:1px solid rgba(0,0,0,0.09);font-size:13px;vertical-align:middle;}
.cot-body tr:last-child td{border-bottom:none;}
.cot-body .ti{background:none;border:none;outline:none;font-size:13px;font-family:'DM Sans',sans-serif;color:#1a1a18;width:100%;padding:2px 0;}
.cot-body .ti:focus{border-bottom:1px solid #c8873a;}
.cot-body .empty-msg{text-align:center;padding:2.5rem 0;color:#a8a8a3;font-size:13px;}
.cot-body .hint{font-size:12px;color:#6b6b66;line-height:1.65;margin-bottom:14px;}
.cot-body .warn-inline{background:#fdf3df;color:#926c1a;border-radius:6px;padding:10px 14px;font-size:13px;margin-top:10px;line-height:1.5;}
.cot-body .dim-row{display:flex;align-items:center;gap:8px;}
.cot-body .dim-sep{color:#a8a8a3;font-size:17px;font-weight:300;margin-top:20px;}
.cot-body .no-data{background:#f0efe9;border-radius:6px;padding:14px 16px;font-size:13px;color:#6b6b66;margin-top:12px;}
.cot-body .sep-line{border:none;border-top:1px solid rgba(0,0,0,0.09);margin:14px 0;}
.cot-body .ok-msg{font-size:12px;color:#2d7a4f;display:none;}
.cot-body .damian-min{font-size:30px;font-weight:700;}
`;

function CotizadorView({ role="admin" }) {
  const [cotTab, setCotTab] = useState('amba-calc');

  const allTabs = [
    {id:'amba-calc',   label:'Calcular flete',    group:'Envíos AMBA'},
    {id:'amba-zonas',  label:'Zonas guardadas',    group:'Envíos AMBA'},
    {id:'amba-config', label:'Choferes y tarifas', group:'Envíos AMBA', adminOnly:true},
    {id:'exp-estimar',   label:'Estimar envío',     group:'Expressos'},
    {id:'exp-historial', label:'Cargar cotización', group:'Expressos'},
    {id:'exp-resumen',   label:'Resumen',           group:'Expressos'},
    {id:'exp-config',    label:'Configuración',     group:'Expressos', adminOnly:true},
  ];
  const tabs = allTabs.filter(t => !t.adminOnly || role === 'admin');

  useEffect(() => {
    // Inject font and CSS
    if (!document.getElementById('cot-style')) {
      const s = document.createElement('style');
      s.id = 'cot-style';
      s.textContent = COT_CSS;
      document.head.appendChild(s);
    }
    if (!document.querySelector('link[href*="DM+Sans"]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap';
      document.head.appendChild(l);
    }

    // ── Storage ──
    window.cotLd = (k,d)=>{try{const v=localStorage.getItem('theia_'+k);return v?JSON.parse(v):d;}catch(e){return d;}};
    window.cotSv = (k,v)=>{try{localStorage.setItem('theia_'+k,JSON.stringify(v));}catch(e){}};
    window.cotFmt = (n)=>Math.round(n).toLocaleString('es-AR');
    window.cotFmtD = (n,d)=>parseFloat(n).toFixed(d!=null?d:1);

    // ── AMBA constants ──
    // Load AMBA config (names, rates, min)
    const DEFAULT_AMBA = {
      angel:  {name:'Angel',  rate:35000, sb:'Carga chica',   nt:'Largo < 290 cm',   largo_max:290},
      oscar:  {name:'Oscar',  rate:45000, sb:'Carga mediana', nt:'Cargas medianas',   largo_max:0},
      damian: {name:'Damián', min:200000, sb:'Carga grande',  nt:'Mínimo $200.000'},
    };
    window.ambaCfg = window.cotLd('amba_cfg', DEFAULT_AMBA);
    window.COT_AR=window.ambaCfg.angel.rate; window.COT_OR=window.ambaCfg.oscar.rate;
    window.COT_LM=30; window.COT_UM=30;
    window.ambDests=window.cotLd('amb_dests',[]);
    window.ambVeh=null; window.aiEstimado=null;

    window.selVeh = (v) => {
      window.ambVeh=v;
      ['angel','oscar','damian'].forEach(x=>{const el=document.getElementById('vc-'+x);if(el)el.classList.toggle('sel',x===v);});
      const aoF=document.getElementById('ao-form'), daB=document.getElementById('damian-box');
      if(v==='damian'){if(aoF)aoF.style.display='none';if(daB)daB.style.display='block';}
      else{
        if(aoF)aoF.style.display='block';if(daB)daB.style.display='none';
        const lbx=document.getElementById('ao-largo-box');if(lbx)lbx.style.display=v==='angel'?'block':'none';
        window.aoCalc();
      }
    };

    window.estimarTiempo = async () => {
      const origen=(document.getElementById('ao-origen-txt')||{}).value?.trim()||'Av. Rodríguez Peña 3919, Quilmes, Buenos Aires';
      const destino=(document.getElementById('ao-destino-txt')||{}).value?.trim()||'';
      if(!destino){alert('Escribí un destino primero.');return;}
      const btn=document.getElementById('btn-estimar');
      const resBox=document.getElementById('ai-time-result');
      const resContent=document.getElementById('ai-time-content');
      if(btn){btn.disabled=true;btn.textContent='Estimando...';}
      if(resBox)resBox.className='ai-result show';
      if(resContent)resContent.innerHTML='<div style="display:flex;align-items:center;gap:10px;"><div class="spinner"></div><span style="font-size:13px;color:#6b6b66;">Consultando a Claude...</span></div>';
      try{
        const AK=import.meta.env.VITE_ANTHROPIC_KEY||'';
        const resp=await fetch('https://api.anthropic.com/v1/messages',{
          method:'POST',
          headers:{'Content-Type':'application/json','x-api-key':AK,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
          body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,messages:[{role:'user',content:`Sos experto en logística del Gran Buenos Aires. Estimá el tiempo de viaje en camioneta/camión de reparto desde "${origen}" hasta "${destino}" (zona AMBA), considerando tráfico normal de día laboral.\n\nRespondé SOLO con JSON válido, sin texto adicional ni markdown:\n{"minutos":ENTERO,"rango":"MIN-MAX min","ruta":"descripción breve de la ruta principal","confianza":"alta|media|baja"}`}]})
        });
        const data=await resp.json();
        const txt=data.content.map(c=>c.text||'').join('').trim().replace(/```json|```/g,'').trim();
        const p=JSON.parse(txt);
        window.aiEstimado=p;
        const cb=p.confianza==='alta'?'b-ok':p.confianza==='media'?'b-warn':'b-err';
        const cl={'alta':'Confianza alta','media':'Confianza media','baja':'Confianza baja'}[p.confianza]||'';
        if(resContent)resContent.innerHTML=`<div><div style="display:flex;align-items:baseline;gap:10px;margin-bottom:4px;"><span class="ai-time-num">${p.minutos} min</span><span style="font-size:13px;color:#6b6b66;">(${p.rango})</span><span class="badge ${cb}">${cl}</span></div><div class="ai-time-sub">${p.ruta}</div></div>`;
      }catch(e){
        if(resContent)resContent.innerHTML='<span style="font-size:13px;color:#b83a3a;">No se pudo estimar. Ingresá el tiempo manualmente.</span>';
        window.aiEstimado=null;
      }
      if(btn){btn.disabled=false;btn.textContent='Estimar tiempo ↗';}
    };

    window.usarTiempo = () => {
      if(!window.aiEstimado) return;
      const t=document.getElementById('ao-tiempo');const h=document.getElementById('ao-tiempo-hint');
      if(t)t.value=window.aiEstimado.minutos;if(h)h.textContent='estimado por IA · podés ajustarlo';
      window.aoCalc();
    };

    window.aoDestSel = () => {
      const el=document.getElementById('ao-dest-sel');if(!el)return;
      const id=el.value;if(!id)return;
      const d=window.ambDests.find(x=>x.id===+id);
      if(d){
        const t=document.getElementById('ao-tiempo'),dn=document.getElementById('ao-destino-txt'),h=document.getElementById('ao-tiempo-hint');
        if(t)t.value=d.minutos;if(dn)dn.value=d.name;if(h)h.textContent='';
        window.aoCalc();
      }
    };

    window.aoCalc = () => {
      if(!window.ambVeh||window.ambVeh==='damian') return;
      const t=parseFloat((document.getElementById('ao-tiempo')||{}).value)||0;
      const lg=window.ambVeh==='angel'?parseFloat((document.getElementById('ao-largo')||{}).value)||0:0;
      const rEl=document.getElementById('ao-result');const wEl=document.getElementById('ao-largo-warn');
      if(window.ambVeh==='angel'&&lg>290&&lg>0){if(wEl)wEl.style.display='block';if(rEl)rEl.style.display='none';return;}
      if(wEl)wEl.style.display='none';if(!t){if(rEl)rEl.style.display='none';return;}
      const rate=window.ambVeh==='angel'?window.COT_AR:window.COT_OR;
      const tot=window.COT_LM+t+window.COT_UM;
      const horas=Math.ceil(tot/60);const cost=horas*rate;
      const hh=Math.floor(tot/60),mm=tot%60;
      const tsExacto=hh>0?(mm>0?`${hh}h ${mm}min`:`${hh}h`):`${mm}min`;
      const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
      set('bk-ida',t+' min');set('bk-total',`${tot} min (${tsExacto})`);
      set('bk-rate-lbl',`${window.ambVeh==='angel'?window.ambaCfg.angel.name:window.ambaCfg.oscar.name} · $${window.cotFmt(rate)}/hr`);
      set('bk-precio','$'+window.cotFmt(cost));
      set('bk-horas',`${horas} hora${horas>1?'s':''} facturada${horas>1?'s':''} (redondeo para arriba)`);
      if(rEl)rEl.style.display='block';
    };

    window.addAmbDest = () => {
      const n=(document.getElementById('ad-name')||{}).value?.trim();
      const m=parseFloat((document.getElementById('ad-min')||{}).value)||0;
      const nt=(document.getElementById('ad-notas')||{}).value?.trim();
      if(!n||!m){alert('Ingresá nombre y tiempo de viaje.');return;}
      window.ambDests.push({id:Date.now(),name:n,minutos:m,notas:nt});
      window.cotSv('amb_dests',window.ambDests);
      window.renderAmbDestsTable();window.renderAmbDestSel();
      ['ad-name','ad-min','ad-notas'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    };

    window.delAmbDest = (id) => {
      window.ambDests=window.ambDests.filter(d=>d.id!==id);
      window.cotSv('amb_dests',window.ambDests);
      window.renderAmbDestsTable();window.renderAmbDestSel();
    };

    window.renderAmbDestSel = () => {
      const s=document.getElementById('ao-dest-sel');if(!s)return;
      const v=s.value;
      s.innerHTML='<option value="">— Seleccioná una zona guardada —</option>';
      window.ambDests.forEach(d=>s.innerHTML+=`<option value="${d.id}">${d.name} (${d.minutos} min)</option>`);
      if(v) s.value=v;
    };

    window.renderAmbDestsTable = () => {
      const tbl=document.getElementById('ad-table'),emp=document.getElementById('ad-empty');
      if(!window.ambDests.length){if(tbl)tbl.style.display='none';if(emp)emp.style.display='block';return;}
      if(emp)emp.style.display='none';if(tbl)tbl.style.display='table';
      const b=document.getElementById('ad-tbody');if(!b)return;
      b.innerHTML=window.ambDests.map(d=>{
        const tot=window.COT_LM+d.minutos+window.COT_UM,h=Math.ceil(tot/60);
        return`<tr><td style="font-weight:500;">${d.name}</td><td style="text-align:right;">${d.minutos} min</td><td style="text-align:right;">$${window.cotFmt(h*window.COT_AR)}</td><td style="text-align:right;">$${window.cotFmt(h*window.COT_OR)}</td><td style="color:#6b6b66;">${d.notas||'—'}</td><td><button class="btn-ghost" onclick="delAmbDest(${d.id})">✕</button></td></tr>`;
      }).join('');
    };

    window.saveAmbaCfg = () => {
      const g = (id) => (document.getElementById(id)||{}).value||'';
      window.ambaCfg.angel.name  = g('cfg-angel-name') || 'Angel';
      window.ambaCfg.angel.rate  = parseFloat(g('cfg-angel-rate'))  || 35000;
      window.ambaCfg.angel.sb    = g('cfg-angel-sb')   || 'Carga chica';
      window.ambaCfg.angel.nt    = g('cfg-angel-nt')   || 'Largo < 290 cm';
      window.ambaCfg.angel.largo_max = parseFloat(g('cfg-angel-max')) || 290;
      window.ambaCfg.oscar.name  = g('cfg-oscar-name') || 'Oscar';
      window.ambaCfg.oscar.rate  = parseFloat(g('cfg-oscar-rate'))  || 45000;
      window.ambaCfg.oscar.sb    = g('cfg-oscar-sb')   || 'Carga mediana';
      window.ambaCfg.oscar.nt    = g('cfg-oscar-nt')   || 'Cargas medianas';
      window.ambaCfg.damian.name = g('cfg-damian-name')|| 'Damián';
      window.ambaCfg.damian.min  = parseFloat(g('cfg-damian-min')) || 200000;
      window.ambaCfg.damian.sb   = g('cfg-damian-sb')  || 'Carga grande';
      window.ambaCfg.damian.nt   = g('cfg-damian-nt')  || `Mínimo $${window.cotFmt(window.ambaCfg.damian.min)}`;
      window.COT_AR = window.ambaCfg.angel.rate;
      window.COT_OR = window.ambaCfg.oscar.rate;
      window.cotSv('amba_cfg', window.ambaCfg);
      // Update veh cards
      window.updateVehCards();
      const ok=document.getElementById('amba-cfg-ok');
      if(ok){ok.style.display='inline';setTimeout(()=>ok.style.display='none',2200);}
    };

    window.loadAmbaCfgForm = () => {
      const s = (id,v) => { const el=document.getElementById(id); if(el) el.value=v; };
      const c = window.ambaCfg;
      s('cfg-angel-name', c.angel.name);  s('cfg-angel-rate', c.angel.rate);
      s('cfg-angel-sb',   c.angel.sb);    s('cfg-angel-nt',   c.angel.nt);
      s('cfg-angel-max',  c.angel.largo_max||290);
      s('cfg-oscar-name', c.oscar.name);  s('cfg-oscar-rate', c.oscar.rate);
      s('cfg-oscar-sb',   c.oscar.sb);    s('cfg-oscar-nt',   c.oscar.nt);
      s('cfg-damian-name',c.damian.name); s('cfg-damian-min', c.damian.min);
      s('cfg-damian-sb',  c.damian.sb);   s('cfg-damian-nt',  c.damian.nt);
    };

    window.updateVehCards = () => {
      const c = window.ambaCfg;
      const upd = (id, cfg, extra) => {
        const card=document.getElementById('vc-'+id); if(!card)return;
        const nm=card.querySelector('.veh-nm'); if(nm)nm.textContent=cfg.name;
        const sb=card.querySelector('.veh-sb'); if(sb)sb.textContent=cfg.sb;
        const nt=card.querySelector('.veh-nt'); if(nt)nt.textContent=extra.nt;
        const rt=card.querySelector('.veh-rt'); if(rt)rt.textContent=extra.rt;
        const av=card.querySelector('.veh-av'); if(av)av.textContent=cfg.name[0];
      };
      upd('angel',  c.angel,  {nt:c.angel.nt,   rt:`$${window.cotFmt(c.angel.rate)}/hr`});
      upd('oscar',  c.oscar,  {nt:c.oscar.nt,   rt:`$${window.cotFmt(c.oscar.rate)}/hr`});
      upd('damian', c.damian, {nt:c.damian.nt||`Mínimo $${window.cotFmt(c.damian.min)}`, rt:'A cotizar'});
    };

    // ── Expressos ──
    const FE_DD=[{name:'Córdoba',obs:''},{name:'Neuquén',obs:''},{name:'Bariloche',obs:''},{name:'Mar del Plata',obs:''},{name:'Entre Ríos',obs:''},{name:'Tucumán',obs:''}];
    window.feDests=window.cotLd('fe_dests',FE_DD.map(d=>({...d})));
    window.feHist=window.cotLd('fe_hist',[]);
    window.feCfg=window.cotLd('fe_cfg',{div:6000});

    window.feV=(l,a,h,b,dv)=>(l*a*h*b)/dv;
    window.feCW=(r,v)=>Math.max(r||0,v||0);

    window.feInitSels = () => {
      const s=document.getElementById('e-dest');if(!s)return;
      const v=s.value;
      s.innerHTML='<option value="">— Seleccioná destino —</option>';
      window.feDests.forEach((d,i)=>s.innerHTML+=`<option value="${i}">${d.name}</option>`);
      if(v!=='')s.value=v;
      const dv=document.getElementById('r-divshow');if(dv)dv.textContent=window.feCfg.div;
      window.feCalc();
    };

    window.feCalc = () => {
      const di=(document.getElementById('e-dest')||{}).value;
      const b=parseFloat((document.getElementById('e-bultos')||{}).value)||1;
      const p=parseFloat((document.getElementById('e-peso')||{}).value)||0;
      const l=parseFloat((document.getElementById('e-l')||{}).value)||0;
      const a=parseFloat((document.getElementById('e-a')||{}).value)||0;
      const h2=parseFloat((document.getElementById('e-h')||{}).value)||0;
      const div=window.feCfg.div;
      const vol=(l&&a&&h2)?window.feV(l,a,h2,b,div):0;
      const fact=window.feCW(p,vol);
      const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
      set('r-real',p?window.cotFmtD(p)+' kg':'—');set('r-vol',vol?window.cotFmtD(vol)+' kg':'—');set('r-fact',fact?window.cotFmtD(fact)+' kg':'—');
      const rEl=document.getElementById('est-result'),nEl=document.getElementById('est-nodata');
      if(!di||fact===0){if(rEl)rEl.style.display='none';if(nEl)nEl.style.display='none';return;}
      const dq=window.feHist.filter(q=>+q.di===+di);
      if(!dq.length){if(rEl)rEl.style.display='none';if(nEl)nEl.style.display='block';return;}
      if(nEl)nEl.style.display='none';
      const stats=dq.map(q=>{const v2=window.feV(q.l,q.a,q.h,q.b,div),cw=window.feCW(q.p,v2);return cw>0?{rate:q.precio/cw,empresa:q.empresa}:null;}).filter(Boolean);
      if(!stats.length){if(rEl)rEl.style.display='none';if(nEl)nEl.style.display='block';return;}
      const rates=stats.map(s=>s.rate);
      const avg=rates.reduce((s,r)=>s+r,0)/rates.length,mn=Math.min(...rates),mx=Math.max(...rates);
      set('r-precio','$'+window.cotFmt(avg*fact));set('r-rango','Rango: $'+window.cotFmt(mn*fact)+' – $'+window.cotFmt(mx*fact));
      set('r-nq','Basado en '+stats.length+' cotización'+(stats.length>1?'es':''));
      set('r-tasa','Tarifa prom.: $'+window.cotFmtD(avg,0)+'/kg facturable');
      let cl,ct;if(stats.length>=5){cl='b-ok';ct='Confianza alta';}else if(stats.length>=2){cl='b-warn';ct='Confianza media';}else{cl='b-err';ct='Dato único';}
      const rb=document.getElementById('r-badge');if(rb)rb.innerHTML=`<span class="badge ${cl}">${ct}</span>`;
      const byEmp={};stats.forEach(s=>{const k=s.empresa||'Sin nombre';if(!byEmp[k])byEmp[k]=[];byEmp[k].push(s.rate);});
      const empR=Object.entries(byEmp).map(([e,rs])=>{const a2=rs.reduce((s,r)=>s+r,0)/rs.length;return`<span style="font-size:12px;color:#6b6b66;">${e}: <strong style="color:#1a1a18;">$${window.cotFmt(a2*fact)}</strong> (${rs.length} cotiz.)</span>`;}).join('&nbsp;·&nbsp;');
      const rd=document.getElementById('r-detalle');if(rd)rd.innerHTML=empR?`<div style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6b6b66;margin-bottom:8px;font-weight:500;">Por transportista</div>${empR}`:'';
      if(rEl)rEl.style.display='block';
    };

    window.feRenderHSel = () => {
      const s=document.getElementById('h-dest');if(!s)return;
      s.innerHTML='<option value="">— Destino —</option>';
      window.feDests.forEach((d,i)=>s.innerHTML+=`<option value="${i}">${d.name}</option>`);
    };

    window.addFEHist = () => {
      const di=(document.getElementById('h-dest')||{}).value;
      const precio=parseFloat((document.getElementById('h-precio')||{}).value)||0;
      if(di===''||!precio){alert('Completá al menos destino y precio pagado.');return;}
      window.feHist.push({
        id:Date.now(),di:+di,
        b:parseFloat((document.getElementById('h-b')||{}).value)||1,
        p:parseFloat((document.getElementById('h-p')||{}).value)||0,
        precio,
        l:parseFloat((document.getElementById('h-l')||{}).value)||0,
        a:parseFloat((document.getElementById('h-a')||{}).value)||0,
        h:parseFloat((document.getElementById('h-h')||{}).value)||0,
        fecha:(document.getElementById('h-fecha')||{}).value||'',
        empresa:((document.getElementById('h-emp')||{}).value||'').trim(),
        notas:((document.getElementById('h-notas')||{}).value||'').trim(),
      });
      window.cotSv('fe_hist',window.feHist);window.feRenderHTable();
      ['h-b','h-p','h-precio','h-l','h-a','h-h','h-notas','h-emp'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=id==='h-b'?1:'';});
      const ok=document.getElementById('h-ok');if(ok){ok.style.display='inline';setTimeout(()=>ok.style.display='none',2500);}
    };

    window.delFEHist = (id) => {window.feHist=window.feHist.filter(q=>q.id!==id);window.cotSv('fe_hist',window.feHist);window.feRenderHTable();};

    window.feRenderHTable = () => {
      const tbl=document.getElementById('hl-table'),emp=document.getElementById('hl-empty');
      if(!window.feHist.length){if(tbl)tbl.style.display='none';if(emp)emp.style.display='block';return;}
      if(emp)emp.style.display='none';if(tbl)tbl.style.display='table';
      const b=document.getElementById('hl-body');if(!b)return;
      b.innerHTML=[...window.feHist].reverse().map(q=>{
        const dn=window.feDests[q.di]?window.feDests[q.di].name:'—';
        const vol=window.feV(q.l,q.a,q.h,q.b,window.feCfg.div);
        const cw=window.feCW(q.p,vol);
        const dims=(q.l&&q.a&&q.h)?`${q.l}×${q.a}×${q.h}`:'—';
        return`<tr><td style="font-weight:500;">${dn}</td><td>${q.fecha?q.fecha.substring(0,7):'—'}</td><td>${q.empresa||'—'}</td><td style="text-align:center;">${q.b}</td><td>${dims}</td><td style="text-align:right;">${q.p?q.p+' kg':'—'}</td><td style="text-align:right;color:#6b6b66;">${vol?window.cotFmtD(vol)+' kg':'—'}</td><td style="text-align:right;font-weight:500;">${cw?window.cotFmtD(cw)+' kg':'—'}</td><td style="text-align:right;">$${window.cotFmt(q.precio)}</td><td style="text-align:right;color:#6b6b66;">${cw>0?'$'+window.cotFmtD(q.precio/cw,0):'—'}</td><td><button class="btn-ghost" onclick="delFEHist(${q.id})">✕</button></td></tr>`;
      }).join('');
    };

    window.feRenderResumen = () => {
      const emp=document.getElementById('res-empty'),cards=document.getElementById('res-cards');
      if(!window.feHist.length){if(emp)emp.style.display='block';if(cards)cards.innerHTML='';return;}
      if(emp)emp.style.display='none';
      const byD={};window.feHist.forEach(q=>{if(!byD[q.di])byD[q.di]=[];byD[q.di].push(q);});
      if(cards)cards.innerHTML=Object.entries(byD).map(([di,qs])=>{
        const dn=window.feDests[+di]?window.feDests[+di].name:'—';
        const stats=qs.map(q=>{const v=window.feV(q.l,q.a,q.h,q.b,window.feCfg.div),cw=window.feCW(q.p,v);return cw>0?{rate:q.precio/cw,empresa:q.empresa}:null;}).filter(Boolean);
        if(!stats.length)return'';
        const rs=stats.map(s=>s.rate),avg=rs.reduce((s,r)=>s+r,0)/rs.length,mn=Math.min(...rs),mx=Math.max(...rs);
        const byEmp={};stats.forEach(s=>{const k=s.empresa||'Sin nombre';if(!byEmp[k])byEmp[k]=[];byEmp[k].push(s.rate);});
        const empR=Object.entries(byEmp).map(([e,rr])=>{const a2=rr.reduce((s,r)=>s+r,0)/rr.length;return`<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(0,0,0,0.09);font-size:13px;"><span>${e}</span><span>$${window.cotFmtD(a2,0)}/kg · ${rr.length} cotiz.</span></div>`;}).join('');
        let cl='b-err';if(qs.length>=5)cl='b-ok';else if(qs.length>=2)cl='b-warn';
        return`<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><div style="font-size:16px;font-weight:700;">${dn}</div><span class="badge ${cl}">${qs.length} cotización${qs.length>1?'es':''}</span></div><div class="metrics metric-3" style="margin-bottom:14px;"><div class="metric"><div class="metric-label">Promedio</div><div class="metric-val">$${window.cotFmtD(avg,0)}/kg</div></div><div class="metric"><div class="metric-label">Mínimo</div><div class="metric-val">$${window.cotFmtD(mn,0)}/kg</div></div><div class="metric"><div class="metric-label">Máximo</div><div class="metric-val">$${window.cotFmtD(mx,0)}/kg</div></div></div><div style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6b6b66;margin-bottom:6px;font-weight:500;">Por transportista</div>${empR}</div>`;
      }).join('');
    };

    window.saveCfg = () => {
      window.feCfg.div=parseFloat((document.getElementById('cfg-div')||{}).value)||6000;
      window.cotSv('fe_cfg',window.feCfg);
      const dv=document.getElementById('r-divshow');if(dv)dv.textContent=window.feCfg.div;
      const ok=document.getElementById('cfg-ok');if(ok){ok.style.display='inline';setTimeout(()=>ok.style.display='none',2000);}
      window.feCalc();
    };

    window.addFEDest = () => {
      const n=((document.getElementById('nd-name')||{}).value||'').trim();if(!n)return;
      window.feDests.push({name:n,obs:''});
      window.cotSv('fe_dests',window.feDests);window.feRenderDestTable();
      const el=document.getElementById('nd-name');if(el)el.value='';
    };
    window.delFEDest = (i) => {
      window.feHist=window.feHist.filter(q=>+q.di!==i);
      window.feHist.forEach(q=>{if(+q.di>i)q.di=q.di-1;});
      window.feDests.splice(i,1);
      window.cotSv('fe_dests',window.feDests);window.cotSv('fe_hist',window.feHist);window.feRenderDestTable();
    };
    window.feRenderDestTable = () => {
      const b=document.getElementById('dest-tbody');if(!b)return;
      b.innerHTML=window.feDests.map((d,i)=>`<tr><td style="font-weight:500;">${d.name}</td><td><input class="ti feO" type="text" value="${d.obs||''}" placeholder="Observaciones..."/></td><td><button class="btn-ghost" onclick="delFEDest(${i})">✕</button></td></tr>`).join('');
    };
    window.saveFEDests = () => {
      document.querySelectorAll('.feO').forEach((inp,i)=>{window.feDests[i].obs=inp.value.trim();});
      window.cotSv('fe_dests',window.feDests);
      const ok=document.getElementById('d-ok');if(ok){ok.style.display='inline';setTimeout(()=>ok.style.display='none',2000);}
    };

    // Init on mount
    setTimeout(()=>{
      window.renderAmbDestSel();
      window.feInitSels();
      window.updateVehCards?.();
      const hf=document.getElementById('h-fecha');
      if(hf){const now=new Date();hf.value=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;}
      const cd=document.getElementById('cfg-div');if(cd)cd.value=window.feCfg.div;
    }, 50);

    return () => {};
  }, []);

  // On tab change, re-init relevant data
  useEffect(()=>{
    setTimeout(()=>{
      if(cotTab==='amba-zonas') window.renderAmbDestsTable?.();
      if(cotTab==='amba-config') window.loadAmbaCfgForm?.();
      if(cotTab==='exp-historial'){window.feRenderHSel?.();window.feRenderHTable?.();}
      if(cotTab==='exp-resumen') window.feRenderResumen?.();
      if(cotTab==='exp-config'){const cd=document.getElementById('cfg-div');if(cd)cd.value=window.feCfg?.div||6000;window.feRenderDestTable?.();}
      if(cotTab==='exp-estimar') window.feInitSels?.();
    },30);
  },[cotTab]);

  const groups = [...new Set(tabs.map(t=>t.group))];

  return (
    <div className="cot-wrap" style={{height:'100%',overflow:'hidden',display:'flex',flexDirection:'column'}}>
      {/* Sub-nav */}
      <div className="cot-subnav">
        {groups.map(g=>(
          <div key={g} style={{display:'contents'}}>
            <div className="cot-subnav-section">{g}</div>
            {tabs.filter(t=>t.group===g).map(t=>(
              <button key={t.id} className={`cot-tab${cotTab===t.id?' cot-active':''}`} onClick={()=>setCotTab(t.id)}>{t.label}</button>
            ))}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="cot-body" style={{overflowY:'auto',flex:1}}>

        {/* AMBA CALC */}
        {cotTab==='amba-calc' && (
          <div>
            <div className="veh-grid">
              {[{id:'angel',nm:'Angel',sb:'Carga chica',rt:'$35.000/hr',nt:'Largo < 290 cm'},{id:'oscar',nm:'Oscar',sb:'Carga mediana',rt:'$45.000/hr',nt:'Cargas medianas'},{id:'damian',nm:'Damián',sb:'Carga grande',rt:'A cotizar',nt:'Mínimo $200.000'}].map(v=>(
                <div key={v.id} className="veh-card" id={`vc-${v.id}`} onClick={()=>window.selVeh(v.id)}>
                  <div className="veh-av">{v.nm[0]}</div>
                  <div className="veh-nm">{v.nm}</div>
                  <div className="veh-sb">{v.sb}</div>
                  <div className="veh-rt">{v.rt}</div>
                  <div className="veh-nt">{v.nt}</div>
                </div>
              ))}
            </div>
            <div id="ao-form" style={{display:'none'}}>
              <div className="ai-box">
                <div className="card-title">Origen y destino</div>
                <div className="fg">
                  <label className="lbl">Origen (punto de partida)</label>
                  <input
                    type="text"
                    id="ao-origen-txt"
                    placeholder="Ej: Av. Rodríguez Peña 3919, Quilmes"
                    defaultValue="Av. Rodríguez Peña 3919, Quilmes"
                    style={{width:'100%'}}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">Zona guardada (acceso rápido)</label>
                  <select id="ao-dest-sel" onChange={()=>window.aoDestSel()} style={{width:'100%'}}>
                    <option value="">— Seleccioná una zona guardada —</option>
                  </select>
                </div>
                <label className="lbl">O escribí la dirección / zona de destino</label>
                <div className="ai-input-row">
                  <input type="text" id="ao-destino-txt" placeholder="Ej: Palermo CABA · San Isidro · Av. Santa Fe 2000" style={{flex:1}} onKeyDown={e=>{if(e.key==='Enter')window.estimarTiempo();}}/>
                  <button className="btn btn-accent btn-sm" id="btn-estimar" onClick={()=>window.estimarTiempo()}>Estimar tiempo ↗</button>
                </div>
                <div className="ai-result" id="ai-time-result">
                  <div id="ai-time-content"></div>
                  <button className="btn-outline" onClick={()=>window.usarTiempo()}>Usar este tiempo</button>
                </div>
              </div>
              <div className="card">
                <div id="ao-largo-box" style={{display:'none'}} className="fg">
                  <label className="lbl">Largo del envío (cm)</label>
                  <input type="number" id="ao-largo" min="0" placeholder="Ej: 180" onInput={()=>window.aoCalc()} style={{width:180}}/>
                  <div id="ao-largo-warn" className="warn-inline" style={{display:'none'}}>Este envío supera 290 cm — Angel no puede llevarlo. Usá Oscar o Damián.</div>
                </div>
                <div className="fg">
                  <label className="lbl">Tiempo de viaje ida (minutos)</label>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <input type="number" id="ao-tiempo" min="0" placeholder="Ej: 45" onInput={()=>window.aoCalc()} style={{width:150}}/>
                    <span style={{fontSize:12,color:'#6b6b66'}} id="ao-tiempo-hint"></span>
                  </div>
                </div>
                <div id="ao-result" style={{display:'none'}}>
                  <hr className="sep-line"/>
                  <div className="bk">
                    <div className="bk-row"><span>Carga</span><span>30 min</span></div>
                    <div className="bk-row"><span>Viaje ida</span><span id="bk-ida">—</span></div>
                    <div className="bk-row"><span>Descarga</span><span>30 min</span></div>
                    <div className="bk-total">
                      <span className="bk-total-label">Total</span>
                      <span id="bk-total" style={{fontWeight:600,fontSize:14}}></span>
                    </div>
                  </div>
                  <div style={{marginTop:14}}>
                    <div className="bk-rate" id="bk-rate-lbl"></div>
                    <div className="bk-price" id="bk-precio"></div>
                    <div style={{fontSize:12,color:'#6b6b66',marginTop:4}} id="bk-horas"></div>
                  </div>
                </div>
              </div>
            </div>
            <div id="damian-box" style={{display:'none'}} className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <div className="card-title" style={{margin:0}}>Damián — Carga grande</div>
                <span className="badge b-warn">A cotizar</span>
              </div>
              <div style={{display:'inline-block',background:'#f0efe9',borderRadius:6,padding:'14px 20px',marginBottom:14}}>
                <div className="metric-label">Precio mínimo</div>
                <div className="damian-min">$200.000</div>
              </div>
              <p style={{fontSize:13,color:'#6b6b66',lineHeight:1.65}}>El precio final depende de la distancia y características de la carga. Confirmá la cotización antes de comprometerte con el cliente.</p>
            </div>
          </div>
        )}

        {/* AMBA ZONAS */}
        {cotTab==='amba-zonas' && (
          <div>
            <div className="card">
              <div className="card-title">Agregar zona frecuente</div>
              <p className="hint">Las zonas guardadas aparecen como acceso rápido en el calculador para agilizar las cotizaciones.</p>
              <div className="g3">
                <div><label className="lbl">Zona / Destino</label><input type="text" id="ad-name" placeholder="Ej: Palermo"/></div>
                <div><label className="lbl">Tiempo ida (min)</label><input type="number" id="ad-min" min="1" placeholder="Ej: 40"/></div>
                <div><label className="lbl">Notas</label><input type="text" id="ad-notas" placeholder="Zona norte, peaje..."/></div>
              </div>
              <button className="btn btn-sm" onClick={()=>window.addAmbDest()}>+ Guardar zona</button>
            </div>
            <div className="card">
              <div className="card-title">Zonas guardadas</div>
              <div id="ad-empty" className="empty-msg">Todavía no guardaste zonas. Agregá las frecuentes para agilizar la cotización.</div>
              <div className="tbl-wrap">
                <table id="ad-table" style={{display:'none',minWidth:580}}>
                  <thead><tr><th>Zona</th><th style={{textAlign:'right'}}>T. ida</th><th style={{textAlign:'right'}}>Angel (1 hr)</th><th style={{textAlign:'right'}}>Oscar (1 hr)</th><th>Notas</th><th style={{width:36}}></th></tr></thead>
                  <tbody id="ad-tbody"></tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AMBA CONFIG */}
        {cotTab==='amba-config' && (
          <div>
            <p className="hint" style={{marginBottom:20}}>Configurá los nombres, tarifas y descripciones de cada chofer. Los cambios se aplican inmediatamente en el calculador de flete.</p>

            {/* Angel */}
            <div className="card">
              <div className="card-title" style={{display:'flex',alignItems:'center',gap:10}}>
                <div className="veh-av" style={{margin:0,width:34,height:34,fontSize:14}}>A</div>
                Chofer 1 — Carga chica
              </div>
              <div className="g2">
                <div><label className="lbl">Nombre</label><input type="text" id="cfg-angel-name" placeholder="Angel"/></div>
                <div><label className="lbl">Tarifa ($/hora)</label><input type="number" id="cfg-angel-rate" placeholder="35000" min="0"/></div>
                <div><label className="lbl">Descripción corta</label><input type="text" id="cfg-angel-sb" placeholder="Carga chica"/></div>
                <div><label className="lbl">Límite de largo (cm)</label><input type="number" id="cfg-angel-max" placeholder="290" min="0"/></div>
                <div className="g2" style={{gridColumn:'1/-1',margin:0}}>
                  <div><label className="lbl">Nota / restricción visible</label><input type="text" id="cfg-angel-nt" placeholder="Largo < 290 cm"/></div>
                </div>
              </div>
            </div>

            {/* Oscar */}
            <div className="card">
              <div className="card-title" style={{display:'flex',alignItems:'center',gap:10}}>
                <div className="veh-av" style={{margin:0,width:34,height:34,fontSize:14}}>O</div>
                Chofer 2 — Carga mediana
              </div>
              <div className="g2">
                <div><label className="lbl">Nombre</label><input type="text" id="cfg-oscar-name" placeholder="Oscar"/></div>
                <div><label className="lbl">Tarifa ($/hora)</label><input type="number" id="cfg-oscar-rate" placeholder="45000" min="0"/></div>
                <div><label className="lbl">Descripción corta</label><input type="text" id="cfg-oscar-sb" placeholder="Carga mediana"/></div>
                <div><label className="lbl">Nota visible</label><input type="text" id="cfg-oscar-nt" placeholder="Cargas medianas"/></div>
              </div>
            </div>

            {/* Damián */}
            <div className="card">
              <div className="card-title" style={{display:'flex',alignItems:'center',gap:10}}>
                <div className="veh-av" style={{margin:0,width:34,height:34,fontSize:14}}>D</div>
                Chofer 3 — Carga grande
              </div>
              <div className="g2">
                <div><label className="lbl">Nombre</label><input type="text" id="cfg-damian-name" placeholder="Damián"/></div>
                <div><label className="lbl">Precio mínimo ($)</label><input type="number" id="cfg-damian-min" placeholder="200000" min="0"/></div>
                <div><label className="lbl">Descripción corta</label><input type="text" id="cfg-damian-sb" placeholder="Carga grande"/></div>
                <div><label className="lbl">Nota visible</label><input type="text" id="cfg-damian-nt" placeholder="Mínimo $200.000"/></div>
              </div>
            </div>

            <div className="row-btns">
              <button className="btn btn-accent" onClick={()=>window.saveAmbaCfg()}>Guardar cambios</button>
              <span className="ok-msg" id="amba-cfg-ok">✓ Guardado y aplicado</span>
            </div>
          </div>
        )}

        {/* EXP ESTIMAR */}
        {cotTab==='exp-estimar' && (
          <div>
            <div className="card">
              <div className="card-title">Datos del envío</div>
              <div className="fg">
                <label className="lbl">Destino</label>
                <select id="e-dest" onChange={()=>window.feCalc()} style={{width:'100%',maxWidth:360}}></select>
              </div>
              <div className="g2" style={{maxWidth:360}}>
                <div><label className="lbl">Cantidad de bultos</label><input type="number" id="e-bultos" min="1" defaultValue="1" onInput={()=>window.feCalc()}/></div>
                <div><label className="lbl">Peso total real (kg)</label><input type="number" id="e-peso" min="0" step="0.1" placeholder="0" onInput={()=>window.feCalc()}/></div>
              </div>
              <div className="fg">
                <label className="lbl">Medidas por bulto (cm)</label>
                <div className="dim-row" style={{maxWidth:360}}>
                  <div style={{flex:1}}><label className="lbl">Largo</label><input type="number" id="e-l" placeholder="—" onInput={()=>window.feCalc()}/></div>
                  <span className="dim-sep">×</span>
                  <div style={{flex:1}}><label className="lbl">Ancho</label><input type="number" id="e-a" placeholder="—" onInput={()=>window.feCalc()}/></div>
                  <span className="dim-sep">×</span>
                  <div style={{flex:1}}><label className="lbl">Alto</label><input type="number" id="e-h" placeholder="—" onInput={()=>window.feCalc()}/></div>
                </div>
              </div>
            </div>
            <div className="metrics">
              <div className="metric"><div className="metric-label">Peso real</div><div className="metric-val" id="r-real">—</div></div>
              <div className="metric"><div className="metric-label">Peso volumétrico</div><div className="metric-val" id="r-vol">—</div></div>
              <div className="metric"><div className="metric-label">Peso facturable</div><div className="metric-val" id="r-fact">—</div></div>
              <div className="metric"><div className="metric-label">Divisor vol.</div><div className="metric-val" id="r-divshow">6000</div></div>
            </div>
            <div id="est-nodata" style={{display:'none'}} className="no-data">Sin cotizaciones históricas para este destino. Cargalas en <strong>Cargar cotización</strong>.</div>
            <div id="est-result" style={{display:'none'}} className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
                <div>
                  <div style={{fontSize:12,color:'#6b6b66',marginBottom:2}}>Precio estimado</div>
                  <div style={{fontSize:36,fontWeight:700}} id="r-precio">$0</div>
                  <div style={{fontSize:13,color:'#6b6b66'}} id="r-rango"></div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div id="r-badge"></div>
                  <div style={{fontSize:12,color:'#6b6b66',marginTop:8}} id="r-nq"></div>
                  <div style={{fontSize:12,color:'#6b6b66',marginTop:2}} id="r-tasa"></div>
                </div>
              </div>
              <hr className="sep-line"/>
              <div id="r-detalle"></div>
            </div>
          </div>
        )}

        {/* EXP HISTORIAL */}
        {cotTab==='exp-historial' && (
          <div>
            <div className="card">
              <div className="card-title">Registrar cotización real</div>
              <p className="hint">Cargá cada cotización que te da la empresa de transporte. Con más datos, la estimación es más precisa.</p>
              <div className="g2">
                <div><label className="lbl">Destino</label><select id="h-dest" style={{width:'100%'}}></select></div>
                <div><label className="lbl">Mes / Año</label><input type="month" id="h-fecha"/></div>
              </div>
              <div className="g4">
                <div><label className="lbl">Bultos</label><input type="number" id="h-b" min="1" defaultValue="1"/></div>
                <div><label className="lbl">Peso real (kg)</label><input type="number" id="h-p" min="0" step="0.1" placeholder="0"/></div>
                <div><label className="lbl">Precio pagado ($)</label><input type="number" id="h-precio" min="0" placeholder="0"/></div>
                <div><label className="lbl">Transportista</label><input type="text" id="h-emp" placeholder="Ej: OCA"/></div>
              </div>
              <div className="fg">
                <label className="lbl">Medidas por bulto (cm)</label>
                <div className="dim-row" style={{maxWidth:380}}>
                  <div style={{flex:1}}><label className="lbl">Largo</label><input type="number" id="h-l" placeholder="—"/></div>
                  <span className="dim-sep">×</span>
                  <div style={{flex:1}}><label className="lbl">Ancho</label><input type="number" id="h-a" placeholder="—"/></div>
                  <span className="dim-sep">×</span>
                  <div style={{flex:1}}><label className="lbl">Alto</label><input type="number" id="h-h" placeholder="—"/></div>
                </div>
              </div>
              <div className="fg"><label className="lbl">Notas (opcional)</label><input type="text" id="h-notas" placeholder="Observaciones adicionales"/></div>
              <div className="row-btns">
                <button className="btn btn-sm" onClick={()=>window.addFEHist()}>Guardar cotización</button>
                <span className="ok-msg" id="h-ok">✓ Guardado</span>
              </div>
            </div>
            <div className="card">
              <div className="card-title">Cotizaciones cargadas</div>
              <div id="hl-empty" className="empty-msg">Todavía no cargaste cotizaciones.</div>
              <div className="tbl-wrap">
                <table id="hl-table" style={{display:'none',minWidth:680}}>
                  <thead><tr><th>Destino</th><th>Mes</th><th>Trans.</th><th style={{textAlign:'center'}}>Bultos</th><th>Medidas</th><th style={{textAlign:'right'}}>P.real</th><th style={{textAlign:'right'}}>P.vol.</th><th style={{textAlign:'right'}}>P.fact.</th><th style={{textAlign:'right'}}>Precio</th><th style={{textAlign:'right'}}>$/kg</th><th></th></tr></thead>
                  <tbody id="hl-body"></tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* EXP RESUMEN */}
        {cotTab==='exp-resumen' && (
          <div>
            <div id="res-empty" className="card"><div className="empty-msg">Sin cotizaciones cargadas todavía.</div></div>
            <div id="res-cards"></div>
          </div>
        )}

        {/* EXP CONFIG */}
        {cotTab==='exp-config' && (
          <div>
            <div className="card">
              <div className="card-title">Divisor de peso volumétrico</div>
              <p className="hint">El divisor varía por transportista. Los más comunes son 6000 (estándar), 5000 o 4000. Consultá con tu empresa cuál usan.</p>
              <div style={{display:'flex',alignItems:'flex-end',gap:12}}>
                <div><label className="lbl">Divisor</label><input type="number" id="cfg-div" defaultValue="6000" min="1000" style={{width:110}}/></div>
                <button className="btn btn-sm" onClick={()=>window.saveCfg()}>Guardar</button>
                <span className="ok-msg" id="cfg-ok">✓ Guardado</span>
              </div>
            </div>
            <div className="card">
              <div className="card-title">Destinos expressos</div>
              <div style={{display:'flex',gap:10,marginBottom:14}}>
                <input type="text" id="nd-name" placeholder="Agregar destino (ej: Rosario)" style={{flex:1,maxWidth:300}}/>
                <button className="btn btn-sm" onClick={()=>window.addFEDest()}>+ Agregar</button>
              </div>
              <table>
                <thead><tr><th>Destino</th><th>Observaciones</th><th style={{width:36}}></th></tr></thead>
                <tbody id="dest-tbody"></tbody>
              </table>
              <div style={{marginTop:14,display:'flex',gap:10,alignItems:'center'}}>
                <button className="btn btn-sm" onClick={()=>window.saveFEDests()}>Guardar cambios</button>
                <span className="ok-msg" id="d-ok">✓ Guardado</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── BUBBLE ───────────────────────────────
function Bubble({ msg, isAdmin, onCorrect }) {
  const isU = msg.role === "user";
  const [showC, setShowC] = useState(false);
  const [corrTxt, setCorrTxt] = useState("");
  return (
    <div style={{ display:"flex", flexDirection:isU?"row-reverse":"row", gap:10, alignItems:"flex-end", marginBottom:16 }}>
      <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, background:isU?(msg.isCorr?T.gray500:T.black):T.gray200, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:isU?T.white:T.gray700, fontWeight:700 }}>
        {isU ? (msg.isCorr ? "✏" : "V") : "T"}
      </div>
      <div style={{ maxWidth:"80%" }}>
        {msg.escalated && <div style={{ fontSize:10, color:T.green, marginBottom:3, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}><IWA/> WhatsApp enviado a +54 11 34423383</div>}
        <div style={{ background:isU?(msg.isCorr?T.gray800:T.black):T.white, border:`1px solid ${isU?T.black:T.gray200}`, borderRadius:isU?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", fontSize:13.5, lineHeight:1.65, color:isU?T.white:T.black, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
          {msg.content.split("\n").map((l,i,a)=><span key={i}>{l}{i<a.length-1&&<br/>}</span>)}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:3 }}>
          <span style={{ fontSize:10, color:T.gray400 }}>{msg.time}</span>
          {isAdmin && !isU && (
            <button onClick={()=>setShowC(!showC)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:3, fontSize:10, color:showC?T.black:T.gray400, padding:0, fontFamily:"inherit" }}><IEdit/> Corregir</button>
          )}
        </div>
        {isAdmin && showC && (
          <div style={{ marginTop:8, background:T.gray50, border:`1px solid ${T.gray200}`, borderRadius:10, padding:12 }}>
            <div style={{ fontSize:11, color:T.gray600, marginBottom:6, fontWeight:600 }}>Escribí la corrección — se guarda en la base:</div>
            <textarea value={corrTxt} onChange={e=>setCorrTxt(e.target.value)} placeholder="Ej: El cálculo correcto es... / Falta mencionar que..." style={{ width:"100%", padding:"8px 10px", borderRadius:6, border:`1px solid ${T.gray200}`, background:T.white, color:T.black, fontSize:12.5, outline:"none", resize:"vertical", minHeight:60, boxSizing:"border-box", fontFamily:"inherit" }}/>
            <div style={{ display:"flex", gap:6, marginTop:6 }}>
              <button onClick={()=>{ if(corrTxt.trim()){ onCorrect(corrTxt.trim()); setCorrTxt(""); setShowC(false); }}} style={{ padding:"6px 14px", borderRadius:6, background:T.black, border:"none", color:T.white, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Guardar y enviar</button>
              <button onClick={()=>setShowC(false)} style={{ padding:"6px 14px", borderRadius:6, background:"none", border:`1px solid ${T.gray300}`, color:T.gray600, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CHAT CORE ────────────────────────────
function ChatCore({ kb, setKb, setAlerts, isAdmin, desde }) {
  const init = isAdmin
    ? "Sistema activo. Base técnica cargada. Podés probar el agente y corregir respuestas directamente con el botón 'Corregir'."
    : "Hola, soy el asistente de Theia. Puedo ayudarte con productos, precios, instalación y calcular exactamente qué necesitás para tu proyecto.";
  const [msgs, setMsgs] = useState([{role:"assistant",content:init,time:nowT()}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null); const inRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  const send = async (txt, isCorr=false) => {
    const text = txt || input;
    if (!text.trim() || loading) return;
    const uMsg = {role:"user",content:text.trim(),time:nowT(),isCorr};
    const hist = [...msgs, uMsg];
    setMsgs(hist); if (!txt) setInput(""); setLoading(true);
    try {
      const raw = await claudeCall(AGENT_SYS(kb), hist.map(m=>({role:m.role,content:m.content})));
      let content=raw, escalated=false;
      try {
        // Strip markdown code blocks if present
        const cleaned=raw.trim().replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"").trim();
        const j=JSON.parse(cleaned);
        if(j.escalate){ escalated=true; setAlerts(p=>[{id:Date.now(),question:j.question,reason:j.reason,time:nowT()},...p]); sendWhatsApp(j.question,j.reason,desde); content=`No tengo esa información en este momento, pero ya le envié un WhatsApp al equipo con tu consulta:\n\n"${j.question}"\n\nTe responden a la brevedad. ¿En qué más puedo ayudarte?`; }
      } catch(_) {}
      setMsgs(p=>[...p,{role:"assistant",content,time:nowT(),escalated}]);
    } catch { setMsgs(p=>[...p,{role:"assistant",content:"Error al procesar. Intentá de nuevo.",time:nowT()}]); }
    setLoading(false); inRef.current?.focus();
  };

  const handleCorr = (txt) => {
    setKb(p => p+`\n\n[CORRECCIÓN ADMIN ${nowT()}]\n${txt}`);
    send(`CORRECCIÓN DEL ADMINISTRADOR: ${txt}`, true);
  };

  const SUGG = isAdmin
    ? ["Calculá UH61 para 2m × 3m","¿Clips AW-08 o AW-09 para UH62?","¿Adhesivo para wall panel pino?","¿Cuándo van terminaciones?"]
    : ["¿Qué WPC tienen para exterior?","Calculá tablas para mi pared","¿Cuánto sale el WPC Elite?","¿Cómo se instala?"];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", height:"100%" }}>
      {isAdmin && <div style={{ padding:"8px 20px", background:T.gray50, borderBottom:`1px solid ${T.gray200}`, fontSize:11.5, color:T.gray500, display:"flex", alignItems:"center", gap:6 }}><IEdit/> Modo admin — "Corregir" bajo cualquier respuesta guarda en la base automáticamente</div>}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 8px" }}>
        {msgs.map((m,i)=><Bubble key={i} msg={m} isAdmin={isAdmin} onCorrect={handleCorr}/>)}
        {loading && (
          <div style={{ display:"flex", gap:10, alignItems:"flex-end", marginBottom:16 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",background:T.gray200,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.gray700,fontWeight:700 }}>T</div>
            <div style={{ background:T.white,border:`1px solid ${T.gray200}`,borderRadius:"16px 16px 16px 4px",padding:"12px 16px",display:"flex",gap:4 }}>
              {[0,1,2].map(d=><span key={d} style={{ width:5,height:5,borderRadius:"50%",background:T.gray400,display:"inline-block",animation:"bounce 1.2s infinite",animationDelay:`${d*.2}s` }}></span>)}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:"0 20px 6px", display:"flex", gap:6, flexWrap:"wrap" }}>
        {SUGG.map(s=><button key={s} onClick={()=>setInput(s)} style={{ background:T.white,border:`1px solid ${T.gray200}`,borderRadius:20,padding:"4px 12px",fontSize:11.5,color:T.gray500,cursor:"pointer",fontFamily:"inherit",transition:"all .15s" }} onMouseEnter={e=>{e.target.style.borderColor=T.black;e.target.style.color=T.black;}} onMouseLeave={e=>{e.target.style.borderColor=T.gray200;e.target.style.color=T.gray500;}}>{s}</button>)}
      </div>
      <div style={{ padding:"8px 20px 20px" }}>
        <div style={{ display:"flex", gap:10, background:T.white, borderRadius:12, border:`1.5px solid ${T.gray200}`, padding:"8px 8px 8px 16px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
          <input ref={inRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escribí tu consulta..." style={{ flex:1,background:"none",border:"none",color:T.black,fontSize:14,outline:"none",fontFamily:"inherit" }}/>
          <button onClick={()=>send()} disabled={loading||!input.trim()} style={{ background:loading||!input.trim()?T.gray100:T.black,border:"none",borderRadius:8,width:38,height:38,cursor:loading||!input.trim()?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:loading||!input.trim()?T.gray400:T.white,transition:"all .2s" }}><ISend/></button>
        </div>
      </div>
    </div>
  );
}

// ─── CALCULADORA ──────────────────────────
function Calculadora() {
  const [modelo, setModelo] = useState("UH67 Elite");
  const [modo, setModo] = useState("dim"); // "dim" = ancho×alto, "m2" = metros cuadrados
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [m2, setM2] = useState("");
  const [desp, setDesp] = useState(10);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const modelosDisp = Object.keys(MODELOS);

  const calcular = () => {
    setError("");
    const mod = MODELOS[modelo];
    let w, h;
    if (modo === "m2") {
      const area = parseFloat(m2);
      if (!area || area <= 0) { setError("Ingresá los m² a cubrir."); return; }
      // Estimamos con lado cuadrado para el cálculo de omegas, pero usamos m² directamente
      w = Math.sqrt(area); h = Math.sqrt(area);
      // Calculamos tablas directo por m²
      const tablasM2 = 1 / (mod.largo * mod.anchoUtil);
      const tablasBase = Math.ceil(area * tablasM2);
      const tablasConDesp = Math.ceil(tablasBase * (1 + desp/100));
      const clips = mod.clipsXpieza > 0 ? tablasConDesp * mod.clipsXpieza : 0;
      let omegaFilas=0, omegaMetros=0, omegaPiezas=0;
      if (mod.linea !== "interior") {
        omegaFilas = Math.ceil(w / 0.40) + 1;
        omegaMetros = +(omegaFilas * h * (1+desp/100)).toFixed(2);
        omegaPiezas = Math.ceil(omegaMetros / 2.50);
      }
      let adhesivoQty=null, adhesivoLabel=null;
      if (mod.adhesivo) {
        if (mod.adhesivo.tipo==="listons") { adhesivoQty=Math.ceil(tablasConDesp/mod.adhesivo.cada); adhesivoLabel=`${adhesivoQty} cartucho${adhesivoQty>1?"s":""} (1 cada ${mod.adhesivo.cada} tablas)`; }
        else { adhesivoQty=Math.ceil(tablasConDesp*mod.adhesivo.por); adhesivoLabel=`${adhesivoQty} cartucho${adhesivoQty>1?"s":""} (${mod.adhesivo.por} por placa)`; }
      }
      setResult({ modo:"m2", area, m2txt:area.toFixed(2), tablasBase, tablasConDesp, clips, omegaPiezas, omegaMetros, adhesivoLabel, m:mod, modelKey:modelo, desperdicio:desp });
      return;
    }
    w = parseFloat(ancho); h = parseFloat(alto);
    if (!w || !h || w<=0 || h<=0) { setError("Ingresá las dimensiones de la pared."); return; }
    const r = calcMateriales(w, h, modelo, desp);
    setResult(r);
  };

  const m = MODELOS[modelo];
  const sistemaLabel = {
    "omega+clips":      "Omega galvanizado (c/40cm) + Clips COBRA",
    "omega+atornillado":"Omega galvanizado (c/40cm) + Atornillado en encastre oculto",
    "pegado":           "Pegado con KPU 40 / Fischer Total / Unipega Hightech Total",
  };

  return (
    <div style={{ padding:24, maxWidth:800, margin:"0 auto", overflowY:"auto", height:"100%" }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:T.black }}>Calculadora de Materiales</h2>
        <p style={{ color:T.gray500, fontSize:13, marginTop:4 }}>Cálculo exacto por dimensiones. Tablas enteras o recortadas, sin uniones salvo que la altura supere el largo de la tabla.</p>
      </div>

      <div style={{ background:T.white, border:`1px solid ${T.gray200}`, borderRadius:14, padding:20, marginBottom:14 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Modelo */}
          <div>
            <label style={{ fontSize:11, color:T.gray500, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:8 }}>Producto / Modelo</label>
            <select value={modelo} onChange={e=>setModelo(e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.gray200}`, background:T.gray50, color:T.black, fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:10 }}>
              {modelosDisp.map(k=><option key={k}>{k}</option>)}
            </select>
            {m && (
              <div style={{ background:T.gray50, borderRadius:8, padding:"10px 12px", fontSize:12, color:T.gray600, lineHeight:1.8 }}>
                <div>Largo: <strong style={{color:T.black}}>{m.largo}m</strong></div>
                <div>Ancho útil: <strong style={{color:T.black}}>{(m.anchoUtil*100).toFixed(1)}cm</strong></div>
                <div>Sistema: <strong style={{color:T.black}}>{m.linea==="elite"||m.linea==="premium"?"Exterior":"Interior"}</strong></div>
                {m.clipsXpieza>0 && <div>Clips: <strong style={{color:T.black}}>8 por pieza ({m.clip})</strong></div>}
                {m.adhesivo && <div>Adhesivo: <strong style={{color:T.black}}>{m.adhesivo.label}</strong></div>}
              </div>
            )}
          </div>
          {/* Modo de cálculo */}
          <div>
            <label style={{ fontSize:11, color:T.gray500, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:8 }}>Modo de cálculo</label>
            <div style={{ display:"flex", gap:6, marginBottom:14 }}>
              {[{id:"dim",l:"Por dimensiones (ancho × alto)"},{id:"m2",l:"Por m²"}].map(opt=>(
                <button key={opt.id} onClick={()=>{setModo(opt.id);setResult(null);setError("");}} style={{ flex:1, padding:"9px 8px", borderRadius:8, border:`1.5px solid ${modo===opt.id?T.black:T.gray200}`, background:modo===opt.id?T.black:T.white, color:modo===opt.id?T.white:T.gray500, fontSize:12, cursor:"pointer", fontFamily:"inherit", transition:"all .15s", fontWeight:modo===opt.id?600:400 }}>{opt.l}</button>
              ))}
            </div>
            {modo==="dim" ? (
              <>
                <div style={{ marginBottom:10 }}>
                  <label style={{ fontSize:12, color:T.gray600, display:"block", marginBottom:4 }}>Ancho (metros)</label>
                  <input value={ancho} onChange={e=>setAncho(e.target.value)} placeholder="ej: 2.00" type="number" step="0.01" style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.gray200}`, background:T.gray50, color:T.black, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'JetBrains Mono',monospace" }}/>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:12, color:T.gray600, display:"block", marginBottom:4 }}>Alto (metros)</label>
                  <input value={alto} onChange={e=>setAlto(e.target.value)} placeholder="ej: 3.00" type="number" step="0.01" style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.gray200}`, background:T.gray50, color:T.black, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'JetBrains Mono',monospace" }}/>
                </div>
              </>
            ) : (
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, color:T.gray600, display:"block", marginBottom:4 }}>Superficie total (m²)</label>
                <input value={m2} onChange={e=>setM2(e.target.value)} placeholder="ej: 25.50" type="number" step="0.01" style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.gray200}`, background:T.gray50, color:T.black, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'JetBrains Mono',monospace" }}/>
                <div style={{ marginTop:6, fontSize:11, color:T.gray400 }}>El cálculo por m² incluye el desperdicio — ideal para presupuestos rápidos.</div>
              </div>
            )}
            <div>
              <label style={{ fontSize:12, color:T.gray600, display:"block", marginBottom:4 }}>Desperdicio: <strong style={{color:T.black}}>{desp}%</strong></label>
              <input type="range" min={10} max={20} step={5} value={desp} onChange={e=>setDesp(+e.target.value)} style={{ width:"100%", accentColor:T.black }}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.gray400, marginTop:2 }}><span>10%</span><span>15%</span><span>20%</span></div>
            </div>
          </div>
        </div>
        {error && <div style={{ marginTop:12, padding:"8px 12px", background:T.redLight, borderRadius:6, fontSize:12.5, color:T.red }}>{error}</div>}
        <button onClick={calcular} style={{ marginTop:16, width:"100%", padding:"12px", background:T.black, border:"none", borderRadius:8, color:T.white, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          Calcular
        </button>
      </div>

      {/* Nota Perfiles WPC */}
      <div style={{ background:T.amberLight, border:`1px solid #FDE68A`, borderRadius:10, padding:"12px 16px", marginBottom:14, fontSize:12.5, color:T.amber, lineHeight:1.6 }}>
        <strong>Perfiles WPC (12×12 / 9×4 / 6×4 / 5×2):</strong> El cálculo es según plano. Se determina en función del ancho del perfil y el espaciado elegido por el cliente — consultá con el equipo Theia.
      </div>

      {result && (
        <div style={{ background:T.white, border:`1px solid ${T.gray200}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ padding:"14px 20px", background:T.black, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:15, fontWeight:700, color:T.white }}>{result.modelKey}</span>
            <span style={{ fontSize:12, color:T.gray400, fontFamily:"'JetBrains Mono',monospace" }}>
              {result.modo==="m2" ? `${result.m2txt} m²` : `${result.w}m × ${result.h}m`} · +{result.desperdicio}%
            </span>
          </div>
          {result.modo==="m2"
            ? <div style={{ padding:"10px 20px", background:T.greenLight, borderBottom:`1px solid #BBF7D0`, fontSize:12.5, color:T.green }}>✓ Cálculo por m² · {result.m2txt} m² · base: {result.tablasBase} tablas → con {result.desperdicio}% desperdicio: {result.tablasConDesp} tablas</div>
            : result.unionAlerta
              ? <div style={{ padding:"10px 20px", background:T.amberLight, borderBottom:`1px solid #FDE68A`, fontSize:12.5, color:T.amber }}>⚠️ El alto ({result.h}m) supera el largo de la tabla ({result.m.largo}m). Se necesitan {result.filasCompletas} tabla{result.filasCompletas>1?"s":""} completa{result.filasCompletas>1?"s":""} + {result.tablasExtra} tabla{result.tablasExtra>1?"s":""} extra para recortes de {result.sobrante}m. Habrá unión horizontal.</div>
              : <div style={{ padding:"10px 20px", background:T.greenLight, borderBottom:`1px solid #BBF7D0`, fontSize:12.5, color:T.green }}>✓ La tabla ({result.m.largo}m) cubre el alto ({result.h}m). Se coloca entera y se recorta a medida — sin uniones.</div>
          }
          {result.modo!=="m2" && (
            <div style={{ padding:"14px 20px", background:T.gray50, borderBottom:`1px solid ${T.gray200}` }}>
              <div style={{ fontSize:10, color:T.gray500, marginBottom:8, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>Desarrollo del cálculo</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.gray600, lineHeight:2 }}>
                <div>Columnas = ceil({result.w} ÷ {result.m.anchoUtil}) = <strong style={{color:T.black}}>ceil({(result.w/result.m.anchoUtil).toFixed(2)}) = {result.columnas}</strong></div>
                {!result.unionAlerta
                  ? <div>Alto {result.h}m ≤ largo {result.m.largo}m → <strong style={{color:T.black}}>1 fila, tabla recortada</strong></div>
                  : <div>Completas: {result.columnas}×{result.filasCompletas} = {result.columnas*result.filasCompletas} + extras para {result.sobrante}m = <strong style={{color:T.black}}>+{result.tablasExtra}</strong></div>
                }
                <div>Base: <strong style={{color:T.black}}>{result.tablasBase} tablas</strong> → con {result.desperdicio}%: ceil({result.tablasBase}×{1+result.desperdicio/100}) = <strong style={{color:T.black,fontSize:14}}>{result.tablasConDesp} tablas</strong></div>
              </div>
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:1, background:T.gray200 }}>
            {[
              { l:"Tablas necesarias", v:`${result.tablasConDesp}`, n:result.modo==="m2"?`${result.m2txt} m² · +${result.desperdicio}% desp.`:`${result.columnas||"—"} col. × ${result.unionAlerta?result.filasCompletas:"1"} fila${result.tablasExtra>0?` +${result.tablasExtra} extras`:""}` },
              ...(result.clips>0 ? [{ l:`Clips ${result.m.clip}`, v:`${result.clips}`, n:`8 clips × ${result.tablasConDesp} piezas` }] : []),
              ...(result.omegaPiezas>0 ? [{ l:"Perfiles omega", v:`${result.omegaPiezas} pzas`, n:`${result.omegaMetros}m lin. · c/40cm · piezas 2.50m` }] : []),
              ...(result.adhesivoLabel ? [{ l:"Adhesivo", v:result.adhesivoLabel, n:"KPU 40 / Fischer / Unipega" }] : []),
            ].map((item,i) => (
              <div key={i} style={{ background:T.white, padding:"16px 18px" }}>
                <div style={{ fontSize:10, color:T.gray400, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{item.l}</div>
                <div style={{ fontSize:i===0?22:16, fontWeight:700, color:T.black, marginBottom:3 }}>{item.v}</div>
                <div style={{ fontSize:11, color:T.gray500, lineHeight:1.5 }}>{item.n}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:"12px 20px", background:T.gray50, fontSize:12, color:T.gray600, lineHeight:1.7 }}>
            <strong style={{color:T.black}}>Sistema: </strong>{sistemaLabel[result.m.linea==="elite"||result.m.linea==="premium"?(result.m.clipsXpieza>0?"omega+clips":"omega+atornillado"):"pegado"]}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CATÁLOGO ─────────────────────────────
function CatalogoView() {
  const [catActive, setCatActive] = useState(CATALOGO[0].cat);
  return (
    <div style={{ padding:24, overflowY:"auto", height:"100%" }}>
      <div style={{ marginBottom:16 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:T.black }}>Catálogo de Productos</h2>
        <p style={{ color:T.gray500, fontSize:13, marginTop:4 }}>Fichas de referencia rápida.</p>
      </div>
      {/* Links a PDFs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {PDF_LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:8, fontSize:12.5, color:T.gray700, textDecoration:"none", transition:"all .15s", fontFamily:"inherit", fontWeight:500 }} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.black;e.currentTarget.style.color=T.black;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.gray200;e.currentTarget.style.color=T.gray700;}}>
            <IPDF/> {link.icon} {link.label}
          </a>
        ))}
      </div>
      {/* Cat tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {CATALOGO.map(c => (
          <button key={c.cat} onClick={()=>setCatActive(c.cat)} style={{ padding:"6px 16px", borderRadius:20, border:`1.5px solid ${catActive===c.cat?T.black:T.gray200}`, background:catActive===c.cat?T.black:T.white, color:catActive===c.cat?T.white:T.gray600, fontSize:12.5, fontWeight:catActive===c.cat?600:400, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>{c.cat}</button>
        ))}
      </div>
      {CATALOGO.filter(c=>c.cat===catActive).map(cat => (
        <div key={cat.cat}>
          <div style={{ fontSize:12, color:T.gray500, marginBottom:14, padding:"8px 12px", background:T.gray50, borderRadius:8, lineHeight:1.6 }}>{cat.desc}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
            {cat.items.map((item,i) => (
              <div key={i} style={{ background:T.white, border:`1px solid ${T.gray200}`, borderRadius:12, padding:18, transition:"all .15s" }} onMouseEnter={e=>e.currentTarget.style.borderColor=T.gray500} onMouseLeave={e=>e.currentTarget.style.borderColor=T.gray200}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:T.gray500, textTransform:"uppercase", letterSpacing:"0.08em", background:T.gray100, padding:"3px 8px", borderRadius:4 }}>{item.cod}</span>
                  {item.gar!=="—" && <span style={{ fontSize:10, color:T.green, fontWeight:600, background:T.greenLight, padding:"3px 8px", borderRadius:4 }}>{item.gar}</span>}
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:T.black, marginBottom:8 }}>{item.nom}</div>
                <div style={{ fontSize:12, color:T.gray600, lineHeight:1.8 }}>
                  <div><span style={{color:T.gray400}}>Dim:</span> {item.dim}</div>
                  <div><span style={{color:T.gray400}}>Col:</span> {item.col}</div>
                  <div style={{marginTop:4,color:T.gray500,fontSize:11.5,lineHeight:1.5}}>{item.nota}</div>
                </div>
                <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${T.gray100}`, fontSize:13, fontWeight:700, color:T.black }}>{item.precio}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PRECIOS ──────────────────────────────
function PreciosView() {
  return (
    <div style={{ padding:24, overflowY:"auto", height:"100%" }}>
      <div style={{ marginBottom:16 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:T.black }}>Lista de Precios</h2>
        <p style={{ color:T.gray500, fontSize:13, marginTop:4 }}>Todos los precios +IVA · WPC/Paneles en USD · Muebles/Deco en ARS</p>
      </div>
      {/* PDF Links */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {PDF_LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:8, fontSize:12.5, color:T.gray700, textDecoration:"none", transition:"all .15s", fontFamily:"inherit", fontWeight:500 }} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.black;e.currentTarget.style.color=T.black;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.gray200;e.currentTarget.style.color=T.gray700;}}>
            <IPDF/> {link.icon} {link.label}
          </a>
        ))}
      </div>
      {PRECIOS.map(sec => (
        <div key={sec.cat} style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.black, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, paddingBottom:8, borderBottom:`2px solid ${T.black}` }}>{sec.cat}</div>
          <div style={{ background:T.white, border:`1px solid ${T.gray200}`, borderRadius:10, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead><tr style={{background:T.gray50}}>
                {["PRODUCTO","PRECIO","INSTALACIÓN","GARANTÍA"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",color:T.gray500,fontWeight:600,borderBottom:`1px solid ${T.gray200}`,fontSize:10,letterSpacing:"0.06em"}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sec.items.map((row,i)=>(
                  <tr key={i} style={{borderBottom:i<sec.items.length-1?`1px solid ${T.gray100}`:"none"}} onMouseEnter={e=>e.currentTarget.style.background=T.gray50} onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <td style={{padding:"10px 14px",color:T.black,fontWeight:500}}>{row[0]}</td>
                    <td style={{padding:"10px 14px",color:T.black,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{row[1]}</td>
                    <td style={{padding:"10px 14px",color:T.gray500,fontSize:12}}>{row[2]}</td>
                    <td style={{padding:"10px 14px",color:row[3]!=="—"?T.green:T.gray400,fontSize:12,fontWeight:row[3]!=="—"?600:400}}>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────
function Login({ onLogin }) {
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [sp,setSp]=useState(false); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const go = async () => {
    if (!u || !p) return;
    setErr(""); setLoading(true); await new Promise(r=>setTimeout(r,500));
    const usr = getEffectiveUsers()[u.trim().toLowerCase()];
    if (usr && usr.pass===p) { onLogin(u.trim().toLowerCase(), usr.role, usr.label); }
    else setErr("Usuario o contraseña incorrectos");
    setLoading(false);
  };
  return (
    <div style={{ minHeight:"100vh", background:T.black, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Outfit,sans-serif" }}>
      <div style={{ width:"100%", maxWidth:420, padding:"0 24px" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ fontSize:54, fontWeight:800, letterSpacing:"0.2em", color:T.white }}>THEIA</div>
          <div style={{ fontSize:11, color:T.gray600, letterSpacing:"0.15em", textTransform:"uppercase", marginTop:4 }}>Design & Co · Plataforma</div>
          <div style={{ width:32, height:2, background:T.white, margin:"14px auto 0" }}></div>
        </div>
        {/* Card */}
        <div style={{ background:T.gray900, border:`1px solid ${T.gray800}`, borderRadius:16, padding:"32px 28px" }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:T.gray500, letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Usuario</label>
            <input value={u} onChange={e=>{setU(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="admin / vendedor / theia" style={{ width:"100%", padding:"12px 14px", background:T.gray800, border:`1px solid ${err?"#DC2626":T.gray700}`, borderRadius:8, color:T.white, fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, color:T.gray500, letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Contraseña</label>
            <div style={{ position:"relative" }}>
              <input type={sp?"text":"password"} value={p} onChange={e=>{setP(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••" style={{ width:"100%", padding:"12px 40px 12px 14px", background:T.gray800, border:`1px solid ${err?"#DC2626":T.gray700}`, borderRadius:8, color:T.white, fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
              <button onClick={()=>setSp(!sp)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:T.gray600, cursor:"pointer", display:"flex" }}>{sp?<IEyeOff/>:<IEye/>}</button>
            </div>
          </div>
          {err && <div style={{ background:"#450A0A", border:"1px solid #7F1D1D", borderRadius:6, padding:"10px 14px", fontSize:12.5, color:"#FCA5A5", marginBottom:14, textAlign:"center" }}>{err}</div>}
          <button onClick={()=>go()} disabled={loading||!u||!p} style={{ width:"100%", padding:"13px", background:loading||!u||!p?T.gray700:T.white, border:"none", borderRadius:8, color:loading||!u||!p?T.gray500:T.black, fontSize:14, fontWeight:700, cursor:loading||!u||!p?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .2s" }}>
            {loading ? <><div style={{ width:16,height:16,border:"2px solid rgba(0,0,0,0.2)",borderTopColor:T.black,borderRadius:"50%",animation:"spin 1s linear infinite" }}></div>Ingresando...</> : "Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── KB VIEW ──────────────────────────────
function KBView({ kb, setKb }) {
  const [kbTab,setKbTab]=useState("manual"); const [kbDraft,setKbDraft]=useState(kb); const [saved,setSaved]=useState(false);
  const [sheetSt,setSheetSt]=useState(null); const [sheetRows,setSheetRows]=useState([]); const [sheetErr,setSheetErr]=useState("");
  const [pdfs,setPdfs]=useState([{name:"THEIA_catalogo_2026.pdf",status:"procesado"},{name:"CATALOGO_WPC_ELITE.pdf",status:"procesado"},{name:"CATALOGO_WPC_PREMIUM.pdf",status:"procesado"}]);
  const [pdfLoad,setPdfLoad]=useState(false); const fileRef=useRef(null);
  const syncSheet=async()=>{setSheetSt("loading");setSheetErr("");setSheetRows([]);try{const url=`https://corsproxy.io/?${encodeURIComponent(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`)}`;const res=await fetch(url);if(!res.ok)throw new Error();const csv=await res.text();const lines=csv.trim().split("\n").filter(l=>l.trim());const headers=lines[0].split(",").map(h=>h.replace(/"/g,"").trim());const rows=lines.slice(1).map(line=>{const v=line.split(",").map(x=>x.replace(/"/g,"").trim());const o={};headers.forEach((h,i)=>o[h]=v[i]||"");return o;}).filter(r=>Object.values(r).some(v=>v));setSheetRows(rows);const upd=`\n\n[SHEETS ${nowT()}]\n`+rows.map(r=>Object.entries(r).map(([k,v])=>`${k}: ${v}`).join(" | ")).join("\n");setKb(p=>p+upd);setKbDraft(p=>p+upd);setSheetSt("done");}catch{setSheetErr("Publicá el Sheet: Archivo → Compartir → Publicar en la web → CSV");setSheetSt("error");}};
  const handlePDF=async(e)=>{const files=Array.from(e.target.files);if(!files.length)return;setPdfLoad(true);for(const f of files){const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});try{const ext=await claudePDF(b64,f.name);setPdfs(p=>[...p,{name:f.name,size:(f.size/1024).toFixed(0)+" KB",status:"procesado"}]);setKb(p=>p+`\n\n[PDF: ${f.name}]\n${ext}`);setKbDraft(p=>p+`\n\n[PDF: ${f.name}]\n${ext}`);}catch{setPdfs(p=>[...p,{name:f.name,status:"error"}]);}}setPdfLoad(false);e.target.value="";};
  const saveKB=()=>{setKb(kbDraft);setSaved(true);setTimeout(()=>setSaved(false),2000);};
  return(
    <div style={{padding:24,overflowY:"auto",height:"100%",maxWidth:860,margin:"0 auto"}}>
      <div style={{marginBottom:20}}><h2 style={{fontSize:20,fontWeight:700,color:T.black}}>Base de Conocimiento</h2><p style={{color:T.gray500,fontSize:13,marginTop:4}}>3 PDFs procesados + guía técnica completa de instalación y cálculo.</p></div>
      <div style={{display:"flex",gap:4,marginBottom:20,background:T.gray100,borderRadius:8,padding:4}}>
        {[{id:"sheets",l:"📊 Google Sheets"},{id:"pdf",l:"📄 PDFs"},{id:"manual",l:"✏️ Manual"}].map(t=>(
          <button key={t.id} onClick={()=>setKbTab(t.id)} style={{flex:1,padding:"8px 12px",background:kbTab===t.id?T.white:"none",border:kbTab===t.id?`1px solid ${T.gray200}`:"1px solid transparent",borderRadius:6,fontSize:12.5,fontWeight:kbTab===t.id?600:400,color:kbTab===t.id?T.black:T.gray500,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>
        ))}
      </div>
      {kbTab==="sheets"&&(<div><div style={{background:T.white,border:`1px solid ${T.gray200}`,borderRadius:12,padding:20,marginBottom:12}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.blue,background:T.gray50,padding:"8px 12px",borderRadius:6,marginBottom:12,wordBreak:"break-all"}}>docs.google.com/spreadsheets/d/{SHEET_ID}</div><div style={{fontSize:12,color:T.gray600,background:T.amberLight,border:`1px solid #FDE68A`,borderRadius:6,padding:"10px 12px",lineHeight:1.6,marginBottom:14}}>⚠️ <strong>Archivo → Compartir → Publicar en la web → CSV → Publicar</strong></div><button onClick={syncSheet} disabled={sheetSt==="loading"} style={{padding:"10px 20px",borderRadius:8,background:sheetSt==="done"?T.green:T.black,border:"none",color:T.white,fontSize:13,fontWeight:600,cursor:sheetSt==="loading"?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>{sheetSt==="loading"?<><div style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:T.white,borderRadius:"50%",animation:"spin 1s linear infinite"}}></div>Sincronizando...</>:sheetSt==="done"?"✓ Sincronizado":"🔄 Sincronizar"}</button></div>{sheetErr&&<div style={{background:T.redLight,border:`1px solid #FECACA`,borderRadius:8,padding:"12px 16px",fontSize:13,color:T.red}}>❌ {sheetErr}</div>}{sheetRows.length>0&&<div style={{background:T.white,border:`1px solid #BBF7D0`,borderRadius:12,overflow:"hidden"}}><div style={{padding:"10px 16px",background:T.greenLight,fontSize:12,color:T.green,fontWeight:600}}>✓ {sheetRows.length} filas importadas</div><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{background:T.gray50}}>{Object.keys(sheetRows[0]).map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:T.gray600,fontWeight:600,borderBottom:`1px solid ${T.gray200}`,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead><tbody>{sheetRows.map((r,i)=><tr key={i} style={{borderBottom:`1px solid ${T.gray100}`}}>{Object.values(r).map((v,j)=><td key={j} style={{padding:"8px 12px",color:T.black}}>{v}</td>)}</tr>)}</tbody></table></div></div>}</div>)}
      {kbTab==="pdf"&&(<div><div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${T.gray200}`,borderRadius:12,padding:"28px 20px",textAlign:"center",cursor:"pointer",background:T.white,marginBottom:14,transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.black;e.currentTarget.style.background=T.gray50;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.gray200;e.currentTarget.style.background=T.white;}}><div style={{fontSize:32,marginBottom:8}}>📎</div><div style={{fontSize:14,fontWeight:600,color:T.black,marginBottom:4}}>Subir PDF o catálogo</div><div style={{fontSize:12,color:T.gray500,marginBottom:12}}>Claude extrae automáticamente toda la información</div><div style={{display:"inline-block",padding:"8px 20px",background:T.black,color:T.white,borderRadius:6,fontSize:12,fontWeight:600}}>Seleccionar PDF</div><input ref={fileRef} type="file" accept=".pdf" multiple style={{display:"none"}} onChange={handlePDF}/></div>{pdfLoad&&<div style={{background:T.amberLight,border:`1px solid #FDE68A`,borderRadius:8,padding:"12px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:10,fontSize:13,color:T.amber}}><div style={{width:16,height:16,border:`2px solid #FDE68A`,borderTopColor:T.amber,borderRadius:"50%",animation:"spin 1s linear infinite",flexShrink:0}}></div>Claude leyendo el PDF...</div>}<div style={{display:"flex",flexDirection:"column",gap:8}}>{pdfs.map((p,i)=><div key={i} style={{background:T.white,border:`1px solid ${T.gray200}`,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>📄</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.black}}>{p.name}</div>{p.size&&<div style={{fontSize:11,color:T.gray400,marginTop:1}}>{p.size}</div>}</div><span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:p.status==="procesado"?T.greenLight:T.redLight,color:p.status==="procesado"?T.green:T.red}}>{p.status==="procesado"?"✓ Procesado":"✗ Error"}</span></div>)}</div></div>)}
      {kbTab==="manual"&&(<div><div style={{background:T.white,border:`1px solid ${T.gray200}`,borderRadius:12,overflow:"hidden"}}><div style={{padding:"10px 16px",borderBottom:`1px solid ${T.gray200}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:T.gray50}}><span style={{fontSize:12,color:T.gray600}}>Base completa del agente</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.gray400}}>{kbDraft.split("\n").length} líneas</span></div><textarea value={kbDraft} onChange={e=>setKbDraft(e.target.value)} style={{width:"100%",minHeight:400,display:"block",background:T.white,border:"none",color:T.black,fontSize:12,lineHeight:1.75,padding:16,resize:"vertical",outline:"none",fontFamily:"'JetBrains Mono',monospace"}}/></div><div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}><button onClick={saveKB} style={{padding:"10px 24px",borderRadius:8,background:saved?T.green:T.black,border:"none",color:T.white,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{saved?"✓ Guardado":"Guardar y aplicar"}</button></div></div>)}
    </div>
  );
}

// ─── TRAIN VIEW ───────────────────────────
function TrainView({ kb, setKb }) {
  const [msgs,setMsgs]=useState([]); const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const [started,setStarted]=useState(false); const [updates,setUpdates]=useState([]);
  const endRef=useRef(null); const inRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);
  const start=async()=>{setStarted(true);setLoading(true);const raw=await claudeCall(TRAIN_SYS,[{role:"user",content:"Empezá con la primera pregunta para la base de conocimiento de Theia."}],600);setMsgs([{role:"assistant",content:raw.replace(/\[KB_UPDATE:.*?\]/gs,"").trim(),time:nowT()}]);setLoading(false);};
  const send=async()=>{if(!input.trim()||loading)return;const uMsg={role:"user",content:input.trim(),time:nowT()};const hist=[...msgs,uMsg];setMsgs(hist);setInput("");setLoading(true);try{const raw=await claudeCall(TRAIN_SYS,hist.map(m=>({role:m.role,content:m.content})),700);const match=raw.match(/\[KB_UPDATE:\s*([\s\S]*?)\]/);if(match){const u=match[1].trim();setUpdates(p=>[...p,{id:Date.now(),text:u,time:nowT()}]);setKb(p=>p+`\n\n[ENTRENAMIENTO ${nowT()}]\n${u}`);}setMsgs(p=>[...p,{role:"assistant",content:raw.replace(/\[KB_UPDATE:[\s\S]*?\]/g,"").trim(),time:nowT()}]);}catch{setMsgs(p=>[...p,{role:"assistant",content:"Error. Intentá de nuevo.",time:nowT()}]);}setLoading(false);inRef.current?.focus();};
  if(!started)return(<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:40}}><div style={{fontSize:56}}>🧠</div><div style={{textAlign:"center"}}><h2 style={{fontSize:22,fontWeight:700,color:T.black,marginBottom:8}}>Modo Entrenamiento</h2><p style={{color:T.gray500,fontSize:13.5,lineHeight:1.7,maxWidth:400}}>La IA te hace preguntas sobre Theia. Cada respuesta queda guardada automáticamente en la base de conocimiento.</p></div>{updates.length>0&&<div style={{background:T.greenLight,border:`1px solid #BBF7D0`,borderRadius:8,padding:"10px 16px",fontSize:12,color:T.green}}>✓ {updates.length} bloques guardados</div>}<button onClick={start} style={{padding:"13px 36px",borderRadius:10,background:T.black,border:"none",color:T.white,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}><IZap/> Empezar entrenamiento</button></div>);
  return(<div style={{flex:1,display:"flex",flexDirection:"column",maxWidth:700,margin:"0 auto",width:"100%",padding:"0 20px",height:"100%"}}>{updates.length>0&&<div style={{margin:"14px 0 0",background:T.greenLight,border:`1px solid #BBF7D0`,borderRadius:8,padding:"10px 14px",fontSize:12,color:T.green}}>✓ {updates.length} {updates.length===1?"bloque guardado":"bloques guardados"}</div>}<div style={{flex:1,overflowY:"auto",padding:"16px 0 8px"}}>{msgs.map((m,i)=><Bubble key={i} msg={m} isAdmin={false}/>)}{loading&&<div style={{display:"flex",gap:10,alignItems:"flex-end",marginBottom:16}}><div style={{width:28,height:28,borderRadius:"50%",background:T.gray200,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.gray700,fontWeight:700}}>IA</div><div style={{background:T.white,border:`1px solid ${T.gray200}`,borderRadius:"16px 16px 16px 4px",padding:"12px 16px",display:"flex",gap:4}}>{[0,1,2].map(d=><span key={d} style={{width:5,height:5,borderRadius:"50%",background:T.gray400,display:"inline-block",animation:"bounce 1.2s infinite",animationDelay:`${d*.2}s`}}></span>)}</div></div>}<div ref={endRef}/></div><div style={{padding:"8px 0 20px"}}><div style={{display:"flex",gap:10,background:T.white,borderRadius:12,border:`1.5px solid ${T.gray200}`,padding:"8px 8px 8px 16px"}}><input ref={inRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Respondé la pregunta..." style={{flex:1,background:"none",border:"none",color:T.black,fontSize:13.5,outline:"none",fontFamily:"inherit"}}/><button onClick={send} disabled={loading||!input.trim()} style={{background:loading||!input.trim()?T.gray100:T.black,border:"none",borderRadius:8,width:38,height:38,cursor:loading||!input.trim()?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:loading||!input.trim()?T.gray400:T.white}}><ISend/></button></div></div></div>);
}

// ─── ALERTS VIEW ──────────────────────────
function AlertsView({ alerts, setAlerts, setKb }) {
  return(
    <div style={{padding:24,overflowY:"auto",height:"100%",maxWidth:700,margin:"0 auto"}}>
      <div style={{marginBottom:20}}><h2 style={{fontSize:20,fontWeight:700,color:T.black}}>Alertas de Escalamiento</h2><p style={{color:T.gray500,fontSize:13,marginTop:4}}>WhatsApp enviado automáticamente a +54 11 34423383. Respondé aquí para guardar en la base.</p></div>
      <div style={{background:T.white,border:`1px solid ${T.gray200}`,borderRadius:12,padding:16,marginBottom:20}}>
        <div style={{fontSize:12,color:T.gray500,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><IWA/> Preview del mensaje WA:</div>
        <div style={{background:T.black,borderRadius:10,padding:16,fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,lineHeight:1.9}}>
          <div style={{color:"#FBBF24"}}>🏛️ THEIA — Consulta sin respuesta</div>
          <div style={{color:T.gray800}}>━━━━━━━━━━━━━━━━</div>
          <div style={{color:T.gray300}}>📌 {alerts[0]?.question||"¿Tienen descuento por volumen?"}</div>
          <div style={{color:T.gray500}}>❓ {alerts[0]?.reason||"No hay info sobre descuentos"}</div>
          <div style={{color:T.gray700}}>━━━━━━━━━━━━━━━━</div>
          <div style={{color:T.green}}>Respondé para actualizar la base 👆</div>
        </div>
      </div>
      {alerts.length===0?(<div style={{textAlign:"center",padding:"50px 20px"}}><div style={{fontSize:44,marginBottom:12}}>✅</div><div style={{fontSize:14,fontWeight:600,color:T.gray700,marginBottom:6}}>Sin alertas pendientes</div></div>):(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>{alerts.map(a=>(
          <div key={a.id} style={{background:T.white,border:`1px solid #FECACA`,borderRadius:12,padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{background:T.redLight,color:T.red,fontSize:11,padding:"3px 10px",borderRadius:6,fontWeight:600}}>🚨 Sin respuesta · WA enviado</span><span style={{fontSize:11,color:T.gray400}}>{a.time}</span></div>
            <div style={{fontSize:14,fontWeight:600,color:T.black,marginBottom:6}}>"{a.question}"</div>
            <div style={{fontSize:12,color:T.gray500,marginBottom:12}}>{a.reason}</div>
            <button onClick={()=>{const info=prompt(`Respuesta para guardar:\n"${a.question}"`);if(info){setKb(p=>p+`\n\n[ALERTA RESPONDIDA ${nowT()}]\nPregunta: ${a.question}\nRespuesta: ${info}`);setAlerts(p=>p.filter(x=>x.id!==a.id));}}} style={{padding:"7px 16px",borderRadius:6,background:T.black,border:"none",color:T.white,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Responder y guardar</button>
          </div>
        ))}</div>
      )}
    </div>
  );
}

// ─── CRM UTILS ────────────────────────────
const CRM_KEY = "theia_crm_v1";
const MET_KEY = "theia_met_v1";
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const todayStr = () => new Date().toISOString().slice(0,10);
const daysSince = (d) => d ? Math.floor((Date.now()-new Date(d))/86400000) : null;
const fmtDate = (s) => { if(!s)return"—"; const d=new Date(s+"T00:00:00"); return d.toLocaleDateString("es-AR",{day:"2-digit",month:"short"}); };
const ESTADO_LABELS = {lead_frio:"Lead frío",lead_tibio:"Lead tibio",lead_caliente:"Lead caliente",presupuesto_enviado:"Presupuesto enviado",negociacion:"Negociación",cerrado:"Cerrado",perdido:"Perdido"};
const FUENTE_LABELS = {meta:"Meta Ads",instagram:"Instagram",referido:"Referido",arquitecto:"Arquitecto",desarrolladora:"Desarrolladora",organico:"Orgánico",showroom:"Showroom",otro:"Otro"};
const ESTADO_COLORS = {lead_frio:"#5c9be0",lead_tibio:"#e09b3d",lead_caliente:"#e05c5c",presupuesto_enviado:"#9b5ce0",negociacion:"#c9a96e",cerrado:"#4caf7d",perdido:"#555"};
const reminderLv = (c) => {
  if(c.estado==="cerrado"||c.estado==="perdido") return "done";
  const d = daysSince(c.fechaContacto);
  if(d===null) return "warning";
  if(d>=7) return "urgente";
  if(d>=5) return "warning";
  return "ok";
};
const lsGet = (k,def) => { try{ const v=localStorage.getItem(k); return v!=null?JSON.parse(v):def; }catch{ return def; } };
const lsSet = (k,v) => { try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} };

// ─── CRM VIEW ─────────────────────────────
function CRMView() {
  const [clients, setClients]       = useState(() => lsGet(CRM_KEY,[]));
  const [modal, setModal]           = useState(null); // null | "new" | "edit" | "log"
  const [editId, setEditId]         = useState(null);
  const [logId, setLogId]           = useState(null);
  const [pipeFilter, setPipeFilter] = useState("");
  const [search, setSearch]         = useState("");
  const [filterFuente, setFilterFuente] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [form, setForm] = useState({nombre:"",telefono:"",estado:"lead_frio",fuente:"meta",producto:"",presupuesto:"",fechaContacto:todayStr(),ultimaAccion:"",proximaAccion:"",notas:""});
  const [logText, setLogText]       = useState("");
  const [logEstado, setLogEstado]   = useState("");
  const [logProxima, setLogProxima] = useState("");

  const save = (arr) => { setClients(arr); lsSet(CRM_KEY,arr); };

  const openNew = () => {
    setEditId(null);
    setForm({nombre:"",telefono:"",estado:"lead_frio",fuente:"meta",producto:"",presupuesto:"",fechaContacto:todayStr(),ultimaAccion:"",proximaAccion:"",notas:""});
    setModal("new");
  };
  const openEdit = (id) => {
    const c = clients.find(x=>x.id===id);
    if(!c) return;
    setEditId(id); setForm({...c}); setModal("edit");
  };
  const openLog = (id) => {
    const c = clients.find(x=>x.id===id);
    setLogId(id); setLogText(""); setLogEstado(""); setLogProxima(c?.proximaAccion||""); setModal("log");
  };
  const saveClient = () => {
    if(!form.nombre.trim()) return;
    if(editId) {
      save(clients.map(c=>c.id===editId?{...c,...form}:c));
    } else {
      save([{id:uid(),...form,createdAt:todayStr(),log:[]},...clients]);
    }
    setModal(null);
  };
  const deleteClient = (id) => { if(window.confirm("¿Eliminar este cliente?")) save(clients.filter(c=>c.id!==id)); };
  const saveLog = () => {
    if(!logText.trim()) return;
    const now = new Date();
    const entry = {texto:logText,fecha:now.toLocaleDateString("es-AR"),hora:now.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}),estadoNuevo:logEstado||null};
    save(clients.map(c=>{
      if(c.id!==logId) return c;
      return {...c,log:[...(c.log||[]),entry],ultimaAccion:logText,fechaContacto:todayStr(),...(logEstado?{estado:logEstado}:{}),proximaAccion:logProxima||c.proximaAccion};
    }));
    setModal(null);
  };

  // Filtered & sorted clients
  let filtered = clients.filter(c=>{
    if(search && !(`${c.nombre} ${c.telefono} ${c.producto}`).toLowerCase().includes(search.toLowerCase())) return false;
    if(filterFuente && c.fuente!==filterFuente) return false;
    if(pipeFilter && c.estado!==pipeFilter) return false;
    if(filterUrgency && reminderLv(c)!==filterUrgency) return false;
    return true;
  }).sort((a,b)=>{const o={urgente:0,warning:1,ok:2,done:3};return (o[reminderLv(a)]??3)-(o[reminderLv(b)]??3);});

  const urgCount  = clients.filter(c=>reminderLv(c)==="urgente").length;
  const warnCount = clients.filter(c=>reminderLv(c)==="warning").length;
  const active    = clients.filter(c=>c.estado!=="cerrado"&&c.estado!=="perdido");
  const cerrados  = clients.filter(c=>c.estado==="cerrado");

  const C = T; // color alias
  const dark = "#0e0e0e"; const dsurf="#161616"; const dsurf2="#1e1e1e"; const dborder="#2a2a2a"; const dborder2="#333";
  const dtext="#e8e8e8"; const dtext2="#999"; const dtext3="#555";

  const inp = {width:"100%",background:dsurf2,border:`1px solid ${dborder}`,borderRadius:7,padding:"8px 11px",color:dtext,fontFamily:"inherit",fontSize:13,outline:"none"};
  const selInp = {...inp,appearance:"none"};

  return (
    <div style={{background:dark,minHeight:"100%",padding:24,color:dtext,overflowY:"auto",height:"100%"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:30,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",lineHeight:1}}>CRM</div>
          <div style={{fontSize:12,color:dtext3,marginTop:4}}>Seguimiento de clientes y leads — Theia Design & Co</div>
        </div>
        <button onClick={openNew} style={{background:dtext,color:dark,border:"none",borderRadius:8,padding:"8px 18px",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ Nuevo cliente</button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:18}}>
        {[
          {label:"Total clientes",value:clients.length,sub:`${active.length} activos`,col:dtext},
          {label:"⚠ Urgentes",value:urgCount,sub:"7+ días sin contacto",col:"#e05c5c"},
          {label:"◌ Pendientes",value:warnCount,sub:"5–6 días sin contacto",col:"#e09b3d"},
          {label:"✓ Cerrados",value:cerrados.length,sub:`de ${active.length+cerrados.length}`,col:"#4caf7d"},
        ].map(s=>(
          <div key={s.label} style={{background:dsurf,border:`1px solid ${dborder}`,borderRadius:10,padding:"13px 15px"}}>
            <div style={{fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:24,fontWeight:800,color:s.col,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:11,color:dtext2,marginTop:3}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Pipeline pills */}
      <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:16,paddingBottom:2}}>
        {[{e:"",l:"Todos"},...Object.entries(ESTADO_LABELS).map(([e,l])=>({e,l}))].map(({e,l})=>{
          const n = e ? clients.filter(c=>c.estado===e).length : clients.length;
          const active2 = pipeFilter===e;
          return(
            <div key={e} onClick={()=>{setPipeFilter(e);}} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,border:`1px solid ${active2?"#c9a96e":dborder}`,background:dsurf,fontSize:12,cursor:"pointer",color:active2?"#c9a96e":dtext2,display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
              {l} <span style={{background:dsurf2,color:active2?"#c9a96e":dtext2,borderRadius:10,padding:"1px 6px",fontSize:10}}>{n}</span>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar..." style={{...inp,minWidth:180,maxWidth:240}}/>
        <div style={{position:"relative"}}>
          <select value={filterFuente} onChange={e=>setFilterFuente(e.target.value)} style={selInp}>
            <option value="">Todas las fuentes</option>
            {Object.entries(FUENTE_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",color:dtext3,pointerEvents:"none",fontSize:10}}>▾</span>
        </div>
        <div style={{position:"relative"}}>
          <select value={filterUrgency} onChange={e=>setFilterUrgency(e.target.value)} style={selInp}>
            <option value="">Todos</option>
            <option value="urgente">Urgentes (7+ días)</option>
            <option value="warning">Pendientes (5+ días)</option>
          </select>
          <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",color:dtext3,pointerEvents:"none",fontSize:10}}>▾</span>
        </div>
        {(search||filterFuente||pipeFilter||filterUrgency)&&<button onClick={()=>{setSearch("");setFilterFuente("");setPipeFilter("");setFilterUrgency("");}} style={{background:"none",border:`1px solid ${dborder2}`,borderRadius:7,color:dtext2,fontSize:12,cursor:"pointer",padding:"5px 10px",fontFamily:"inherit"}}>Limpiar</button>}
      </div>

      {/* Client cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
        {filtered.length===0 && <div style={{gridColumn:"1/-1",textAlign:"center",padding:"50px 20px",color:dtext3}}>👥 No hay clientes con estos filtros</div>}
        {filtered.map(c=>{
          const lv=reminderLv(c); const d=daysSince(c.fechaContacto);
          const ecol=ESTADO_COLORS[c.estado]||dborder2;
          const urgBorder = lv==="urgente"?"#e05c5c":lv==="warning"?"#e09b3d":dborder;
          return(
            <div key={c.id} style={{background:dsurf,border:`1px solid ${urgBorder}`,borderRadius:10,padding:14,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:ecol,borderRadius:"10px 0 0 10px"}}/>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:8}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:dtext}}>{c.nombre}</div>
                  {c.telefono&&<a href={`https://wa.me/${c.telefono.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{fontSize:11,color:dtext2,textDecoration:"none"}}>📱 {c.telefono}</a>}
                </div>
                <div style={{display:"flex",gap:3,flexShrink:0}}>
                  {[["📝",()=>openLog(c.id)],["✏️",()=>openEdit(c.id)],["✕",()=>deleteClient(c.id)]].map(([icon,fn],i)=>(
                    <button key={i} onClick={fn} style={{background:"none",border:`1px solid ${dborder}`,color:dtext2,borderRadius:5,padding:"3px 5px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}} onMouseEnter={e=>e.currentTarget.style.borderColor=dtext2} onMouseLeave={e=>e.currentTarget.style.borderColor=dborder}>{icon}</button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                <span style={{background:dsurf2,color:ecol,borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em"}}>{ESTADO_LABELS[c.estado]||c.estado}</span>
                <span style={{background:dsurf2,color:dtext2,borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:600}}>{FUENTE_LABELS[c.fuente]||c.fuente||"—"}</span>
              </div>
              {c.producto&&<div style={{fontSize:11,color:dtext2,marginBottom:3}}><strong style={{color:dtext}}>Producto:</strong> {c.producto}</div>}
              {c.presupuesto&&<div style={{fontSize:11,color:dtext2,marginBottom:3}}><strong style={{color:dtext}}>Presupuesto:</strong> ${Number(c.presupuesto).toLocaleString("es-AR")}</div>}
              {lv==="urgente"&&<div style={{background:"#e05c5c20",color:"#e05c5c",border:"1px solid #e05c5c30",borderRadius:5,padding:"3px 8px",fontSize:10,fontWeight:700,display:"inline-block",marginTop:6}}>🔴 {d} días sin contacto — URGENTE</div>}
              {lv==="warning"&&<div style={{background:"#e09b3d20",color:"#e09b3d",border:"1px solid #e09b3d30",borderRadius:5,padding:"3px 8px",fontSize:10,fontWeight:700,display:"inline-block",marginTop:6}}>🟡 {d} días sin contacto</div>}
              {lv==="ok"&&d!==null&&<div style={{background:"#4caf7d20",color:"#4caf7d",border:"1px solid #4caf7d30",borderRadius:5,padding:"3px 8px",fontSize:10,fontWeight:700,display:"inline-block",marginTop:6}}>✓ Hace {d} día{d===1?"":"s"}</div>}
              {c.ultimaAccion&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${dborder}`}}><div style={{fontSize:9,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Última acción</div><div style={{fontSize:11,color:dtext2}}>{c.ultimaAccion}</div></div>}
              {c.proximaAccion&&<div style={{marginTop:6}}><div style={{fontSize:9,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Próxima acción</div><div style={{fontSize:11,color:"#c9a96e"}}>{c.proximaAccion}</div></div>}
              {c.notas&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${dborder}`}}><div style={{fontSize:11,color:dtext2,fontStyle:"italic"}}>{c.notas}</div></div>}
              <div style={{fontSize:9,color:dtext3,marginTop:8,textAlign:"right"}}>Contacto: {fmtDate(c.fechaContacto)} · Alta: {fmtDate(c.createdAt)}</div>
            </div>
          );
        })}
      </div>

      {/* ── CLIENT MODAL ── */}
      {(modal==="new"||modal==="edit")&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setModal(null);}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:dsurf,border:`1px solid ${dborder2}`,borderRadius:14,width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",padding:26}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:18,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:dtext}}>{editId?"Editar Cliente":"Nuevo Cliente"}</div>
              <button onClick={()=>setModal(null)} style={{background:"none",border:`1px solid ${dborder}`,color:dtext2,borderRadius:6,width:30,height:30,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>✕</button>
            </div>
            {[
              [{label:"Nombre *",key:"nombre",placeholder:"Nombre completo"},{label:"Teléfono / WhatsApp",key:"telefono",placeholder:"+54 11 xxxxxxxx"}],
              [{label:"Estado",key:"estado",type:"select",opts:Object.entries(ESTADO_LABELS).map(([v,l])=>({v,l}))},{label:"Fuente",key:"fuente",type:"select",opts:Object.entries(FUENTE_LABELS).map(([v,l])=>({v,l}))}],
            ].map((row,ri)=>(
              <div key={ri} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                {row.map(f=>(
                  <div key={f.key}>
                    <label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{f.label}</label>
                    {f.type==="select"?(
                      <div style={{position:"relative"}}><select value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={selInp}>{f.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select><span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",color:dtext3,pointerEvents:"none",fontSize:10}}>▾</span></div>
                    ):(
                      <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder||""} style={inp}/>
                    )}
                  </div>
                ))}
              </div>
            ))}
            {[
              {label:"Producto de interés",key:"producto",placeholder:"WPC exterior, revestimiento interior, cerámicos..."},
            ].map(f=>(
              <div key={f.key} style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{f.label}</label>
                <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={inp}/>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div><label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Presupuesto aprox. ($)</label><input type="number" value={form.presupuesto} onChange={e=>setForm(p=>({...p,presupuesto:e.target.value}))} placeholder="0" style={inp}/></div>
              <div><label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Último contacto</label><input type="date" value={form.fechaContacto} onChange={e=>setForm(p=>({...p,fechaContacto:e.target.value}))} style={inp}/></div>
            </div>
            {[{label:"Última acción",key:"ultimaAccion",placeholder:"Ej: Envié catálogo WPC"},{label:"Próxima acción",key:"proximaAccion",placeholder:"Ej: Llamar para confirmar visita"},{label:"Notas",key:"notas",placeholder:"Contexto, detalles del proyecto...",textarea:true}].map(f=>(
              <div key={f.key} style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{f.label}</label>
                {f.textarea?<textarea value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{...inp,minHeight:60,resize:"vertical"}}/>:<input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={inp}/>}
              </div>
            ))}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16,paddingTop:14,borderTop:`1px solid ${dborder}`}}>
              <button onClick={()=>setModal(null)} style={{background:"none",border:`1px solid ${dborder2}`,color:dtext2,borderRadius:7,padding:"7px 16px",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>Cancelar</button>
              <button onClick={saveClient} style={{background:dtext,color:dark,border:"none",borderRadius:7,padding:"7px 18px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Guardar cliente</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOG ACTION MODAL ── */}
      {modal==="log"&&(()=>{const c=clients.find(x=>x.id===logId); const logs=c?.log||[];return(
        <div onClick={e=>{if(e.target===e.currentTarget)setModal(null);}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:dsurf,border:`1px solid ${dborder2}`,borderRadius:14,width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto",padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:16,fontWeight:800,textTransform:"uppercase",color:dtext}}>Registrar Acción</div>
              <button onClick={()=>setModal(null)} style={{background:"none",border:`1px solid ${dborder}`,color:dtext2,borderRadius:6,width:28,height:28,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
            </div>
            {logs.length>0&&<div style={{maxHeight:180,overflowY:"auto",marginBottom:12,display:"flex",flexDirection:"column",gap:6}}>
              {[...logs].reverse().map((l,i)=><div key={i} style={{background:dsurf2,borderRadius:7,padding:"8px 11px",borderLeft:`3px solid ${dborder2}`}}><div style={{fontSize:10,color:dtext3,marginBottom:2}}>{l.fecha} {l.hora}</div><div style={{fontSize:12,color:dtext}}>{l.texto}</div></div>)}
            </div>}
            <div style={{marginBottom:10}}><label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Nueva acción realizada</label><textarea value={logText} onChange={e=>setLogText(e.target.value)} placeholder="Describí qué hiciste..." style={{...inp,minHeight:70,resize:"vertical"}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div><label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Nuevo estado</label><div style={{position:"relative"}}><select value={logEstado} onChange={e=>setLogEstado(e.target.value)} style={selInp}><option value="">Sin cambio</option>{Object.entries(ESTADO_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select><span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",color:dtext3,pointerEvents:"none",fontSize:10}}>▾</span></div></div>
              <div><label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Próxima acción</label><input value={logProxima} onChange={e=>setLogProxima(e.target.value)} placeholder="Ej: Seguimiento en 3 días" style={inp}/></div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setModal(null)} style={{background:"none",border:`1px solid ${dborder2}`,color:dtext2,borderRadius:7,padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>Cancelar</button>
              <button onClick={saveLog} style={{background:dtext,color:dark,border:"none",borderRadius:7,padding:"6px 16px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Registrar</button>
            </div>
          </div>
        </div>
      );})()}
    </div>
  );
}

// ─── MÉTRICAS VIEW ────────────────────────
function MetricasView() {
  const [data, setData] = useState(() => lsGet(MET_KEY,[]));
  const [form, setForm] = useState({periodo:"",msgs:"",pres:"",cierre:"",monto:"",notas:""});
  const chartRef = useRef(null);

  const saveData = (arr) => { setData(arr); lsSet(MET_KEY,arr); };
  const saveMetric = () => {
    if(!form.periodo.trim()||(!form.msgs&&!form.pres&&!form.cierre)) return;
    saveData([...data,{id:uid(),periodo:form.periodo,msgs:+form.msgs||0,pres:+form.pres||0,cierre:+form.cierre||0,monto:+form.monto||0,notas:form.notas,fecha:new Date().toISOString()}]);
    setForm({periodo:"",msgs:"",pres:"",cierre:"",monto:"",notas:""});
  };
  const deleteMetric = (id) => saveData(data.filter(m=>m.id!==id));

  const last = data.length ? data[data.length-1] : null;
  const r1 = last&&last.msgs>0 ? ((last.pres/last.msgs)*100).toFixed(0) : null;
  const r2 = last&&last.pres>0 ? ((last.cierre/last.pres)*100).toFixed(0) : null;
  const r3 = last&&last.msgs>0 ? ((last.cierre/last.msgs)*100).toFixed(0) : null;
  const rCol = (v,g,m) => v>=g?"#4caf7d":v>=m?"#e09b3d":"#e05c5c";

  const diag = [];
  if(r1!==null){ if(+r1<10)diag.push({lv:"bad",icon:"📵",t:"Problema en la calificación",d:`Solo ${r1}% de mensajes llega a presupuesto. Revisá el target de Meta y el guion inicial.`}); else if(+r1<25)diag.push({lv:"warning",icon:"📊",t:"Conversión a presupuesto mejorable",d:`${r1}% de mensajes genera presupuesto.`}); else diag.push({lv:"good",icon:"✅",t:"Buena calificación de leads",d:`${r1}% de mensajes genera presupuesto.`});}
  if(r2!==null){ if(+r2<10)diag.push({lv:"bad",icon:"💸",t:"Problema en el cierre",d:`Solo ${r2}% de presupuestos se cierra. Revisá el seguimiento post-presupuesto.`}); else if(+r2<20)diag.push({lv:"warning",icon:"🔄",t:"Cierre mejorable",d:`${r2}% de presupuestos cerrados.`}); else diag.push({lv:"good",icon:"🏆",t:"Buen ratio de cierre",d:`${r2}% de presupuestos cerrados.`});}
  if(last&&last.msgs<5) diag.push({lv:"warning",icon:"📢",t:"Bajo volumen de mensajes",d:"Menos de 5 mensajes en la semana. Revisá campañas de Meta."});
  if(!diag.length) diag.push({lv:"good",icon:"👌",t:"Embudo saludable",d:"Las métricas se ven bien."});

  const dark="#0e0e0e",dsurf="#161616",dsurf2="#1e1e1e",dborder="#2a2a2a",dborder2="#333",dtext="#e8e8e8",dtext2="#999",dtext3="#555";
  const inp = {width:"100%",background:dsurf2,border:`1px solid ${dborder}`,borderRadius:7,padding:"8px 11px",color:dtext,fontFamily:"inherit",fontSize:13,outline:"none"};

  useEffect(()=>{
    const canvas=chartRef.current; if(!canvas||data.length<2)return;
    const ctx=canvas.getContext("2d");
    const W=canvas.parentElement.offsetWidth||600,H=160;
    canvas.width=W;canvas.height=H;ctx.clearRect(0,0,W,H);
    const last8=data.slice(-8);const maxV=Math.max(...last8.map(m=>Math.max(m.msgs,m.pres,m.cierre,1)));
    const pad={t:16,r:16,b:34,l:32};const cW=W-pad.l-pad.r,cH=H-pad.t-pad.b;const step=cW/(last8.length-1);
    ctx.strokeStyle="#2a2a2a";ctx.lineWidth=1;
    [0,.5,1].forEach(t=>{const y=pad.t+cH-t*cH;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();ctx.fillStyle="#555";ctx.font="10px Outfit";ctx.textAlign="right";ctx.fillText(Math.round(t*maxV),pad.l-4,y+3);});
    [[last8.map(m=>m.msgs),"#5c9be0"],[last8.map(m=>m.pres),"#9b5ce0"],[last8.map(m=>m.cierre),"#4caf7d"]].forEach(([pts,color])=>{
      ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.lineJoin="round";
      pts.forEach((v,i)=>{const x=pad.l+i*step,y=pad.t+cH-(v/maxV)*cH;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});ctx.stroke();
      pts.forEach((v,i)=>{const x=pad.l+i*step,y=pad.t+cH-(v/maxV)*cH;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();});
    });
    ctx.fillStyle="#555";ctx.font="10px Outfit";ctx.textAlign="center";
    last8.forEach((m,i)=>ctx.fillText(m.periodo.slice(0,8),pad.l+i*step,H-8));
    let lx=pad.l;[["#5c9be0","Msgs"],["#9b5ce0","Pres."],["#4caf7d","Cierres"]].forEach(([c,l])=>{ctx.fillStyle=c;ctx.fillRect(lx,4,10,3);ctx.fillStyle="#888";ctx.textAlign="left";ctx.fillText(l,lx+14,10);lx+=70;});
  },[data]);

  const pct = (v) => last ? Math.max(5,Math.round((v/Math.max(last.msgs,1))*100)) : 5;

  return(
    <div style={{background:dark,minHeight:"100%",overflowY:"auto",height:"100%",padding:24,color:dtext}}>
      <div style={{marginBottom:20}}><div style={{fontSize:30,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase"}}>MÉTRICAS</div><div style={{fontSize:12,color:dtext3,marginTop:4}}>Rendimiento comercial y diagnóstico de embudo</div></div>
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18,alignItems:"start"}}>
        {/* Form */}
        <div style={{background:dsurf,border:`1px solid ${dborder}`,borderRadius:12,padding:20,position:"sticky",top:10}}>
          <div style={{fontSize:16,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Registrar semana</div>
          {[{label:"Período / Semana",key:"periodo",placeholder:"Ej: Sem 14 — Abr 2025"},{label:"📱 Mensajes WhatsApp",key:"msgs",placeholder:"0",type:"number"},{label:"📋 Presupuestos realizados",key:"pres",placeholder:"0",type:"number"},{label:"✅ Presupuestos cerrados",key:"cierre",placeholder:"0",type:"number"},{label:"💰 Monto total cerrado ($)",key:"monto",placeholder:"0",type:"number"}].map(f=>(
            <div key={f.key} style={{marginBottom:10}}>
              <label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{f.label}</label>
              <input type={f.type||"text"} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={inp}/>
            </div>
          ))}
          <div style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:10,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Notas</label>
            <textarea value={form.notas} onChange={e=>setForm(p=>({...p,notas:e.target.value}))} placeholder="Campañas, observaciones..." style={{...inp,minHeight:50,resize:"vertical"}}/>
          </div>
          <button onClick={saveMetric} style={{width:"100%",background:dtext,color:dark,border:"none",borderRadius:7,padding:"9px",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer"}}>Guardar registro</button>
        </div>

        {/* Right: charts & table */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* Funnel */}
          <div style={{background:dsurf,border:`1px solid ${dborder}`,borderRadius:12,padding:20}}>
            <div style={{fontSize:16,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Embudo — Última semana</div>
            {!last?<div style={{color:dtext3,fontSize:13}}>Registrá una semana para ver el embudo</div>:(
              <>
                {[[last.msgs,"Mensajes WA","#5c9be0","#7bb3f0","100%","#5c9be0"],[last.pres,"Presupuestos","#9b5ce0","#b47ef0",r1?`${r1}%`:"—",r1?rCol(+r1,30,15):"#555"],[last.cierre,"Cierres","#4caf7d","#6dd49a",r2?`${r2}%`:"—",r2?rCol(+r2,20,10):"#555"]].map(([val,label,c1,c2,rate,rateCol])=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{minWidth:140,fontSize:11,color:dtext2,textAlign:"right"}}>{label}</div>
                    <div style={{flex:1,background:dsurf2,borderRadius:4,height:26,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${c1},${c2})`,width:`${pct(val)}%`,display:"flex",alignItems:"center",paddingLeft:8,fontSize:12,fontWeight:700,minWidth:30,transition:"width .6s"}}>{val}</div>
                    </div>
                    <div style={{minWidth:44,textAlign:"right",fontSize:12,fontWeight:700,color:rateCol}}>{rate}</div>
                  </div>
                ))}
                <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${dborder}`,display:"flex",gap:20}}>
                  {r3&&<div><div style={{fontSize:9,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Conversión total</div><div style={{fontSize:22,fontWeight:800,color:rCol(+r3,10,5)}}>{r3}%</div></div>}
                  {last.monto>0&&<div><div style={{fontSize:9,color:dtext3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Monto cerrado</div><div style={{fontSize:22,fontWeight:800,color:"#c9a96e"}}>${Number(last.monto).toLocaleString("es-AR")}</div></div>}
                </div>
              </>
            )}
          </div>

          {/* Diagnóstico */}
          <div style={{background:dsurf,border:`1px solid ${dborder}`,borderRadius:12,padding:20}}>
            <div style={{fontSize:16,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Diagnóstico</div>
            {diag.map((d,i)=>{
              const bc={good:"#4caf7d",warning:"#e09b3d",bad:"#e05c5c"}[d.lv];
              return(<div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 12px",borderRadius:8,border:`1px solid ${bc}30`,background:`${bc}08`,marginBottom:8}}>
                <span style={{fontSize:16,flexShrink:0}}>{d.icon}</span>
                <div><strong style={{display:"block",fontSize:12,color:dtext,marginBottom:2}}>{d.t}</strong><p style={{fontSize:11,color:dtext2,margin:0}}>{d.d}</p></div>
              </div>);
            })}
          </div>

          {/* Chart */}
          <div style={{background:dsurf,border:`1px solid ${dborder}`,borderRadius:12,padding:20}}>
            <div style={{fontSize:16,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Evolución histórica</div>
            {data.length<2?<div style={{color:dtext3,fontSize:13}}>Necesitás al menos 2 registros para ver el gráfico</div>:<canvas ref={chartRef} style={{display:"block",maxWidth:"100%"}}/>}
          </div>

          {/* Table */}
          <div style={{background:dsurf,border:`1px solid ${dborder}`,borderRadius:12,padding:20}}>
            <div style={{fontSize:16,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Histórico</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr>{["Período","Msgs","Pres.","Cierres","Msg→Pres","Pres→Cierre","Monto",""].map(h=><th key={h} style={{textAlign:"left",padding:"7px 10px",color:dtext3,fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:`1px solid ${dborder}`}}>{h}</th>)}</tr></thead>
                <tbody>
                  {data.length===0&&<tr><td colSpan={8} style={{textAlign:"center",color:dtext3,padding:16}}>Sin registros aún</td></tr>}
                  {[...data].reverse().map(m=>{
                    const mr1=m.msgs>0?((m.pres/m.msgs)*100).toFixed(0):"—";
                    const mr2=m.pres>0?((m.cierre/m.pres)*100).toFixed(0):"—";
                    return(<tr key={m.id} onMouseEnter={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background=dsurf2)} onMouseLeave={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="")}>
                      {[m.periodo,m.msgs,m.pres,m.cierre].map((v,i)=><td key={i} style={{padding:"8px 10px",borderBottom:`1px solid ${dborder}`,color:i===0?dtext:dtext2,fontWeight:i===0?600:400}}>{v}</td>)}
                      <td style={{padding:"8px 10px",borderBottom:`1px solid ${dborder}`,color:mr1!=="—"?rCol(+mr1,30,15):dtext3,fontWeight:600}}>{mr1}{mr1!=="—"?"%":""}</td>
                      <td style={{padding:"8px 10px",borderBottom:`1px solid ${dborder}`,color:mr2!=="—"?rCol(+mr2,20,10):dtext3,fontWeight:600}}>{mr2}{mr2!=="—"?"%":""}</td>
                      <td style={{padding:"8px 10px",borderBottom:`1px solid ${dborder}`,color:dtext2}}>{m.monto>0?`$${Number(m.monto).toLocaleString("es-AR")}`:"—"}</td>
                      <td style={{padding:"8px 10px",borderBottom:`1px solid ${dborder}`}}><button onClick={()=>deleteMetric(m.id)} style={{background:"none",border:"none",color:dtext3,cursor:"pointer",fontSize:13,padding:"2px 4px"}} onMouseEnter={e=>e.target.style.color="#e05c5c"} onMouseLeave={e=>e.target.style.color=dtext3}>✕</button></td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ role, tab, setTab, onLogout, alertCount, crmBadge }) {
  const adminItems = [
    {id:"chat",icon:<IChat/>,l:"Chat + Corrección"},
    {id:"calc",icon:<ICalc/>,l:"Calculadora"},
    {id:"catalog",icon:<ICatalog/>,l:"Catálogo"},
    {id:"kb",icon:<IKB/>,l:"Conocimiento"},
    {id:"train",icon:<IBrain/>,l:"Entrenar IA"},
    {id:"alerts",icon:<IWarn/>,l:"Alertas",badge:alertCount},
    {divider:true},
    {id:"crm",icon:<ICRM/>,l:"CRM",badge:crmBadge},
    {id:"metrics",icon:<IMetrics/>,l:"Métricas"},
    {id:"cotizador",icon:<IEnvios/>,l:"Cotizador Envíos"},
    {divider:true},
    {id:"usuarios",icon:<IUsers/>,l:"Usuarios"},
  ];
  const operadorItems = [
    {id:"chat",icon:<IChat/>,l:"Chat + Corrección"},
    {id:"calc",icon:<ICalc/>,l:"Calculadora"},
    {id:"catalog",icon:<ICatalog/>,l:"Catálogo"},
    {divider:true},
    {id:"crm",icon:<ICRM/>,l:"CRM",badge:crmBadge},
    {id:"metrics",icon:<IMetrics/>,l:"Métricas"},
    {id:"cotizador",icon:<IEnvios/>,l:"Cotizador Envíos"},
  ];
  const vendedorItems = [{id:"chat",icon:<IChat/>,l:"Consultas IA"},{id:"calc",icon:<ICalc/>,l:"Calculadora"},{id:"catalog",icon:<ICatalog/>,l:"Catálogo"}];
  const items = role==="admin" ? adminItems : role==="operador" ? operadorItems : vendedorItems;
  return(
    <div style={{width:210,background:T.black,display:"flex",flexDirection:"column",height:"100vh",flexShrink:0}}>
      <div style={{padding:"22px 18px 16px"}}>
        <div style={{fontSize:20,fontWeight:800,letterSpacing:"0.15em",color:T.white}}>THEIA</div>
        <div style={{fontSize:9,color:T.gray600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>Design & Co</div>
        <div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:5,background:T.gray800,borderRadius:5,padding:"3px 8px"}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:role==="admin"?"#FBBF24":T.green}}></div>
          <span style={{fontSize:10,color:T.gray400,fontWeight:500}}>{role==="admin"?"Admin":"Vendedor"}</span>
        </div>
      </div>
      <div style={{flex:1,padding:"0 10px",overflowY:"auto"}}>
        {items.map((item,i)=>
          item.divider
            ? <div key={i} style={{height:1,background:T.gray900,margin:"6px 8px"}}/>
            : (
              <button key={item.id} onClick={()=>setTab(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:7,border:"none",background:tab===item.id?"rgba(255,255,255,0.1)":"none",color:tab===item.id?T.white:T.gray600,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:tab===item.id?600:400,marginBottom:2,textAlign:"left",transition:"all .15s"}} onMouseEnter={e=>{if(tab!==item.id){e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color=T.gray300;}}} onMouseLeave={e=>{if(tab!==item.id){e.currentTarget.style.background="none";e.currentTarget.style.color=T.gray600;}}}>
                <span style={{color:tab===item.id?T.white:T.gray700,flexShrink:0}}>{item.icon}</span>
                {item.l}
                {item.badge>0&&<span style={{marginLeft:"auto",background:T.red,color:T.white,borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{item.badge}</span>}
              </button>
            )
        )}
      </div>
      <div style={{padding:"14px 10px",borderTop:`1px solid ${T.gray900}`}}>
        <button onClick={onLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:7,border:"none",background:"none",color:T.gray700,cursor:"pointer",fontFamily:"inherit",fontSize:12}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color=T.gray400;}} onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=T.gray700;}}><IOut/>Cerrar sesión</button>
      </div>
    </div>
  );
}

// ─── PANEL ────────────────────────────────
function Panel({ role, onLogout, kb, setKb }) {
  const [tab,setTab]=useState("chat");
  const [alerts,setAlerts]=useState([]);
  const crmUrgent = (() => { try{ const c=JSON.parse(localStorage.getItem(CRM_KEY)||"[]"); return c.filter(x=>reminderLv(x)==="urgente").length; }catch{ return 0; } })();
  const tabLabels = {chat:role==="admin"?"Chat + Corrección":"Consultas IA",calc:"Calculadora de Materiales",catalog:"Catálogo de Productos",kb:"Base de Conocimiento",train:"Entrenar IA",alerts:"Alertas de Escalamiento",crm:"CRM — Clientes",metrics:"Métricas",cotizador:"Cotizador de Envíos",usuarios:"Gestión de Usuarios"};
  const desde = role==="admin"?"Administrador":"Vendedor";
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"Outfit,sans-serif",background:T.gray50}}>
      <Sidebar role={role} tab={tab} setTab={setTab} onLogout={onLogout} alertCount={alerts.length} crmBadge={crmUrgent}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:50,background:T.white,borderBottom:`1px solid ${T.gray200}`,display:"flex",alignItems:"center",padding:"0 24px",flexShrink:0}}>
          <div style={{fontSize:14,fontWeight:600,color:T.black}}>{tabLabels[tab]||""}</div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,fontSize:11,color:T.green}}><span style={{width:5,height:5,borderRadius:"50%",background:T.green,display:"inline-block"}}></span>Agente activo</div>
        </div>
        <div style={{flex:1,overflow:"hidden"}}>
          {tab==="chat"    && <ChatCore kb={kb} setKb={setKb} setAlerts={setAlerts} isAdmin={role==="admin"} desde={desde}/>}
          {tab==="calc"    && <div style={{height:"100%",overflowY:"auto"}}><Calculadora/></div>}
          {tab==="catalog" && <CatalogoView/>}
          {tab==="kb"      && <KBView kb={kb} setKb={setKb}/>}
          {tab==="train"   && <div style={{display:"flex",height:"100%"}}><TrainView kb={kb} setKb={setKb}/></div>}
          {tab==="alerts"  && <AlertsView alerts={alerts} setAlerts={setAlerts} setKb={setKb}/>}
          {tab==="crm"     && <div style={{height:"100%",overflowY:"auto"}}><CRMView/></div>}
          {tab==="metrics" && <div style={{height:"100%",overflowY:"auto"}}><MetricasView/></div>}
          {tab==="cotizador" && <div style={{height:"100%",overflow:"hidden"}}><CotizadorView role={role}/></div>}
          {tab==="usuarios"  && <UsersView/>}
        </div>
      </div>
    </div>
  );
}

// ─── CLIENT VIEW ──────────────────────────
function ClientView({ kb, onLogout }) {
  const [tab,setTab]=useState("chat"); const [alerts,setAlerts]=useState([]);
  return(
    <div style={{minHeight:"100vh",background:T.white,fontFamily:"Outfit,sans-serif"}}>
      <div style={{background:T.black,padding:"0 20px",height:52,display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:18,fontWeight:800,letterSpacing:"0.15em",color:T.white}}>THEIA</div>
        <div style={{width:1,height:16,background:T.gray800}}></div>
        <div style={{fontSize:11,color:T.gray600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Design & Co</div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11,color:T.green,display:"flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:T.green,display:"inline-block"}}></span>En línea</span>
          <button onClick={onLogout} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"5px 10px",color:T.gray500,cursor:"pointer",fontSize:11,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}><IOut/>Salir</button>
        </div>
      </div>
      <div style={{background:T.white,borderBottom:`1px solid ${T.gray200}`,display:"flex",padding:"0 20px"}}>
        {[{id:"chat",l:"💬 Consultas"},{id:"calc",l:"📐 Calculadora"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",padding:"12px 16px",fontSize:13,fontWeight:tab===t.id?600:400,color:tab===t.id?T.black:T.gray400,borderBottom:`2px solid ${tab===t.id?T.black:"transparent"}`,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>
        ))}
      </div>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        {tab==="chat"&&<ChatCore kb={kb} setKb={()=>{}} setAlerts={setAlerts} isAdmin={false} desde="Cliente"/>}
        {tab==="calc"&&<Calculadora/>}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────
export default function App() {
  const [session,setSession]=useState(null);
  const [kb,setKb]=useState(REAL_KB);
  return(
    <div>
      <style>{`${GF}*{box-sizing:border-box;margin:0;padding:0;}body,button,input,textarea,select{font-family:'Outfit',sans-serif;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#D1D1D1;border-radius:4px;}@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {!session&&<Login onLogin={(u,r,l)=>setSession({u,r,l})}/>}
      {session?.r==="admin"    &&<Panel role="admin"    onLogout={()=>setSession(null)} kb={kb} setKb={setKb}/>}
      {session?.r==="operador" &&<Panel role="operador" onLogout={()=>setSession(null)} kb={kb} setKb={setKb}/>}
      {session?.r==="vendedor" &&<Panel role="vendedor" onLogout={()=>setSession(null)} kb={kb} setKb={setKb}/>}
      {session?.r==="client"  &&<ClientView kb={kb} onLogout={()=>setSession(null)}/>}
    </div>
  );
}
