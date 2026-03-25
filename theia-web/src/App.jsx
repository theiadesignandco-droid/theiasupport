import { useState, useRef, useEffect } from "react";

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
Si no tenés la info → {"escalate":true,"question":"<resumen>","reason":"<qué falta>"}
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
        const j=JSON.parse(raw.trim());
        if(j.escalate){ escalated=true; setAlerts(p=>[{id:Date.now(),question:j.question,reason:j.reason,time:nowT()},...p]); sendWhatsApp(j.question,j.reason,desde); content=`No tengo esa información, pero ya le envié un WhatsApp al equipo con tu consulta:\n\n"${j.question}"\n\nTe responden a la brevedad.`; }
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
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [desp, setDesp] = useState(10);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Los modelos disponibles — sin Perfiles WPC
  const modelosDisp = Object.keys(MODELOS);

  const calcular = () => {
    setError("");
    const w = parseFloat(ancho), h = parseFloat(alto);
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
          {/* Dimensiones */}
          <div>
            <label style={{ fontSize:11, color:T.gray500, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:8 }}>Dimensiones de la pared</label>
            <div style={{ marginBottom:10 }}>
              <label style={{ fontSize:12, color:T.gray600, display:"block", marginBottom:4 }}>Ancho (metros)</label>
              <input value={ancho} onChange={e=>setAncho(e.target.value)} placeholder="ej: 2.00" type="number" step="0.01" style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.gray200}`, background:T.gray50, color:T.black, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'JetBrains Mono',monospace" }}/>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, color:T.gray600, display:"block", marginBottom:4 }}>Alto (metros)</label>
              <input value={alto} onChange={e=>setAlto(e.target.value)} placeholder="ej: 3.00" type="number" step="0.01" style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.gray200}`, background:T.gray50, color:T.black, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'JetBrains Mono',monospace" }}/>
            </div>
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
          {/* Header */}
          <div style={{ padding:"14px 20px", background:T.black, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:15, fontWeight:700, color:T.white }}>{result.modelKey}</span>
            <span style={{ fontSize:12, color:T.gray400, fontFamily:"'JetBrains Mono',monospace" }}>{result.w}m × {result.h}m · +{result.desperdicio}%</span>
          </div>
          {/* Alerta unión */}
          {result.unionAlerta
            ? <div style={{ padding:"10px 20px", background:T.amberLight, borderBottom:`1px solid #FDE68A`, fontSize:12.5, color:T.amber }}>⚠️ El alto ({result.h}m) supera el largo de la tabla ({result.m.largo}m). Se necesitan {result.filasCompletas} tabla{result.filasCompletas>1?"s":""} completa{result.filasCompletas>1?"s":""} + {result.tablasExtra} tabla{result.tablasExtra>1?"s":""} extra para recortes de {result.sobrante}m. Habrá unión horizontal.</div>
            : <div style={{ padding:"10px 20px", background:T.greenLight, borderBottom:`1px solid #BBF7D0`, fontSize:12.5, color:T.green }}>✓ La tabla ({result.m.largo}m) cubre el alto ({result.h}m). Se coloca entera y se recorta a medida — sin uniones.</div>
          }
          {/* Desarrollo */}
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
          {/* Cards resultado */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:1, background:T.gray200 }}>
            {[
              { l:"Tablas necesarias",  v:`${result.tablasConDesp}`, n:`${result.columnas} col. × ${result.unionAlerta?result.filasCompletas:"1"} fila${result.tablasExtra>0?` +${result.tablasExtra} extras`:""}` },
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
          {/* Sistema */}
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
    const usr = USERS[u.trim().toLowerCase()];
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

// ─── SIDEBAR ──────────────────────────────
function Sidebar({ role, tab, setTab, onLogout, alertCount }) {
  const adminItems = [{id:"chat",icon:<IChat/>,l:"Chat + Corrección"},{id:"calc",icon:<ICalc/>,l:"Calculadora"},{id:"catalog",icon:<ICatalog/>,l:"Catálogo"},{id:"precios",icon:<IPrice/>,l:"Precios"},{id:"kb",icon:<IKB/>,l:"Conocimiento"},{id:"train",icon:<IBrain/>,l:"Entrenar IA"},{id:"alerts",icon:<IWarn/>,l:"Alertas",badge:alertCount}];
  const vendedorItems = [{id:"chat",icon:<IChat/>,l:"Consultas IA"},{id:"calc",icon:<ICalc/>,l:"Calculadora"},{id:"catalog",icon:<ICatalog/>,l:"Catálogo"},{id:"precios",icon:<IPrice/>,l:"Lista de Precios"}];
  const items = role==="admin" ? adminItems : vendedorItems;
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
        {items.map(item=>(
          <button key={item.id} onClick={()=>setTab(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:7,border:"none",background:tab===item.id?"rgba(255,255,255,0.1)":"none",color:tab===item.id?T.white:T.gray600,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:tab===item.id?600:400,marginBottom:2,textAlign:"left",transition:"all .15s"}} onMouseEnter={e=>{if(tab!==item.id){e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color=T.gray300;}}} onMouseLeave={e=>{if(tab!==item.id){e.currentTarget.style.background="none";e.currentTarget.style.color=T.gray600;}}}>
            <span style={{color:tab===item.id?T.white:T.gray700,flexShrink:0}}>{item.icon}</span>
            {item.l}
            {item.badge>0&&<span style={{marginLeft:"auto",background:T.red,color:T.white,borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{item.badge}</span>}
          </button>
        ))}
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
  const tabLabels = {chat:role==="admin"?"Chat + Corrección":"Consultas IA",calc:"Calculadora de Materiales",catalog:"Catálogo de Productos",precios:"Lista de Precios",kb:"Base de Conocimiento",train:"Entrenar IA",alerts:"Alertas de Escalamiento"};
  const desde = role==="admin"?"Administrador":"Vendedor";
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"Outfit,sans-serif",background:T.gray50}}>
      <Sidebar role={role} tab={tab} setTab={setTab} onLogout={onLogout} alertCount={alerts.length}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:50,background:T.white,borderBottom:`1px solid ${T.gray200}`,display:"flex",alignItems:"center",padding:"0 24px",flexShrink:0}}>
          <div style={{fontSize:14,fontWeight:600,color:T.black}}>{tabLabels[tab]||""}</div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,fontSize:11,color:T.green}}><span style={{width:5,height:5,borderRadius:"50%",background:T.green,display:"inline-block"}}></span>Agente activo</div>
        </div>
        <div style={{flex:1,overflow:"hidden"}}>
          {tab==="chat"    && <ChatCore kb={kb} setKb={setKb} setAlerts={setAlerts} isAdmin={role==="admin"} desde={desde}/>}
          {tab==="calc"    && <div style={{height:"100%",overflowY:"auto"}}><Calculadora/></div>}
          {tab==="catalog" && <CatalogoView/>}
          {tab==="precios" && <PreciosView/>}
          {tab==="kb"      && <KBView kb={kb} setKb={setKb}/>}
          {tab==="train"   && <div style={{display:"flex",height:"100%"}}><TrainView kb={kb} setKb={setKb}/></div>}
          {tab==="alerts"  && <AlertsView alerts={alerts} setAlerts={setAlerts} setKb={setKb}/>}
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
      {session?.r==="admin"   &&<Panel role="admin"    onLogout={()=>setSession(null)} kb={kb} setKb={setKb}/>}
      {session?.r==="vendedor"&&<Panel role="vendedor" onLogout={()=>setSession(null)} kb={kb} setKb={setKb}/>}
      {session?.r==="client"  &&<ClientView kb={kb} onLogout={()=>setSession(null)}/>}
    </div>
  );
}
