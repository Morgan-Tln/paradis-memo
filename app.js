const { useState, useMemo, useEffect } = React;

// Moteur de détection d'allergènes partagé
function detectAllergens(ingredients, name) {
  const allergens = [];
  const text = (ingredients.join(" ") + " " + name).toLowerCase();
  if (text.includes("thon") || text.includes("saumon") || text.includes("merlu") || text.includes("limande") || text.includes("poisson")) allergens.push("Poissons");
  if (text.includes("crevette") || text.includes("homard") || text.includes("crustacé")) allergens.push("Crustacés");
  if (text.includes("œuf") || text.includes("oeuf") || text.includes("mayonnaise") || text.includes("caesar") || text.includes("tartare")) allergens.push("Œufs");
  if (text.includes("lait") || text.includes("crème") || text.includes("cheddar") || text.includes("chèvre") || text.includes("mozzarella") || text.includes("burrata") || text.includes("feta") || text.includes("cheese") || text.includes("camembert") || text.includes("grana") || text.includes("padano") || text.includes("yaourt") || text.includes("yolita")) allergens.push("Lait (Lactose)");
  if (text.includes("noix") || text.includes("amande") || text.includes("pistache")) allergens.push("Fruits à coque");
  if (text.includes("céleri") || text.includes("celeri")) allergens.push("Céleri");
  if (text.includes("moutarde")) allergens.push("Moutarde");
  if (text.includes("sésame") || text.includes("sesame")) allergens.push("Graines de sésame");
  if (text.includes("edamames") || text.includes("thaï") || text.includes("yum")) allergens.push("Soja");
  if (text.includes("spritz") || text.includes("vin") || text.includes("prosecco") || text.includes("aperol") || text.includes("martini") || text.includes("confit")) allergens.push("Anhydride sulfureux & Sulfites");
  if ((text.includes("focaccia") || text.includes("pita") || text.includes("blini") || text.includes("chou") || text.includes("panure") || text.includes("chapelure") || text.includes("muesli") || text.includes("toast") || text.includes("gnocchis") || text.includes("gaufre") || text.includes("pancake") || text.includes("céréales") || text.includes("burger") || text.includes("pain") || text.includes("boulgour")) && !text.includes("sans gluten")) {
    allergens.push("Céréales contenant du gluten");
  }
  return allergens;
}

// Nuancier de jetons d'ingrédients cohérents
function getIngredientStyle(name) {
  const lower = name.toLowerCase().trim();
  if (lower.includes("choix") || lower.includes("chois")) return { bg: "#fffbeb", text: "#b45309", border: "#fde047" };
  if (lower === "yolita") return { bg: "#f3e8ff", text: "#7e22ce", border: "#c084fc" };
  if (lower.includes("framboise") || lower === "hibiscus") return { bg: "#fce7f3", text: "#db2777", border: "#fbcfe8" };
  if (lower.includes("mangue") || lower.includes("alphonso") || lower.includes("purée de mangue")) return { bg: "#ffedd5", text: "#ea580c", border: "#22c55e" };
  if (lower.includes("citron vert")) return { bg: "#fef9c3", text: "#4d7c0f", border: "#a3e635" };
  if (lower.includes("citron") || lower.includes("citron jaune") || lower.includes("citron confit")) return { bg: "#fef9c3", text: "#a16207", border: "#fef08a" };
  if (lower.includes("orange") || lower.includes("clémentine") || lower.includes("abricot") || lower.includes("pêche jaune") || lower.includes("melon")) return { bg: "#fff7ed", text: "#d97706", border: "#fed7aa" };
  if (lower === "pamplemousse") return { bg: "#ffe4e6", text: "#be123c", border: "#fecdd3" };
  if (lower.includes("fraise") || lower === "cranberry" || lower === "cramberry" || lower === "fruits rouges" || lower === "grenade" || lower === "pastèque" || lower === "pulpe de passion" || lower === "fruit de la passion" || lower === "coulis de fruits" || lower === "coulis fruits") return { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" };
  if (lower.includes("banane") || lower.includes("ananas")) return { bg: "#fef9c3", text: "#713f12", border: "#fef08a" };
  if (lower === "thé vert glacé") return { bg: "#faf0e6", text: "#4a2c11", border: "#d2b48c" };
  if (lower === "litchi" || lower === "goyave") return { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3" };
  if (lower.includes("poivron")) return { bg: "#fff5f5", text: "#e53e3e", border: "#feb2b2" };
  if (lower.includes("céleri") || lower.includes("concombre") || lower.includes("edamames") || lower.includes("avocat") || lower.includes("multigraines") || lower.includes("épinard") || lower.includes("kale") || lower.includes("menthe") || lower.includes("basilic") || lower.includes("pistou") || lower.includes("roquette") || lower.includes("salade") || lower.includes("romaine") || lower.includes("mesclun") || lower.includes("courgette") || lower.includes("aubergine") || lower.includes("haricots") || lower.includes("persil") || lower.includes("ciboulette") || lower.includes("aloe") || lower.includes("herbes")) return { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" };
  if (lower.includes("tomate")) return { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3" };
  if (lower.includes("aperol") || lower.includes("prosecco") || lower.includes("martini") || lower.includes("eau pétillante") || lower.includes("st-germain") || lower.includes("tequila") || lower.includes("camino") || lower.includes("rhum") || lower.includes("bacardi") || lower.includes("gin") || lower.includes("bombay") || lower.includes("sapphire")) return { bg: "#ecfeff", text: "#0891b2", border: "#a5f3fc" };
  if (lower.includes("poulet") || lower.includes("dinde") || lower.includes("bœuf") || lower.includes("pastrami") || lower.includes("aiguillettes")) return { bg: "#f7f4eb", text: "#854d0e", border: "#e6dcce" };
  if (lower.includes("thon") || lower.includes("saumon") || lower.includes("merlu") || lower.includes("limande") || lower.includes("homard") || lower.includes("crevette") || lower.includes("poisson") || lower.includes("gravlax")) return { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" };
  if (lower.includes("chocolat") || lower.includes("nutella") || lower.includes("noisette") || lower.includes("choco") || lower.includes("caramel") || lower.includes("carambar")) return { bg: "#fcf6f0", text: "#4a2c11", border: "#ddc3b3" };
  if (lower.includes("focaccia") || lower.includes("croûtons") || lower.includes("pita") || lower.includes("blini") || lower.includes("chou") || lower.includes("panure") || lower.includes("chapelure") || lower.includes("muesli") || lower.includes("toasts") || lower.includes("gnocchis") || lower.includes("gaufres") || lower.includes("pancakes") || lower.includes("céréales") || lower.includes("sésame") || lower.includes("graines") || lower.includes("noix") || lower.includes("amande") || lower.includes("oignons frits")) return { bg: "#faf6f0", text: "#6b4423", border: "#e8dcad" };
  if (lower.includes("feta") || lower.includes("mozzarella") || lower.includes("burrata") || lower.includes("cheddar") || lower.includes("chèvre") || lower.includes("cheese") || lower.includes("grana") || lower.includes("padano") || lower.includes("lait") || lower.includes("crème") || lower.includes("yaourt") || lower.includes("camembert") || lower.includes("vanille") || lower.includes("meringue") || lower.includes("anglaise")) return { bg: "#faf5ff", text: "#581c87", border: "#e9d5ff" };
  if (lower.includes("sauces") || lower.includes("sauce") || lower.includes("mayonnaise") || lower.includes("vinaigrette") || lower.includes("condiment") || lower.includes("oignon") || lower.includes("coleslaw") || lower.includes("riz") || lower.includes("frites") || lower.includes("chamallows") || lower.includes("cornichons") || lower.includes("marination")) return { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" };
  return { bg: "#e2e8f0", text: "#1e293b", border: "#cbd5e1" };
}

function MainApp() {
  const [activeTab, setActiveTab] = useState("plats");
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [mode, setMode] = useState("learn");
  
  // États robustes découplés pour le moteur de Quiz
  const [questionsPool, setQuestionsPool] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ ok: 0, nok: 0 });
  const [quizFinished, setQuizFinished] = useState(false);
  const [flashcardMode, setFlashcardMode] = useState(false);

  const section = window.SECTIONS[activeTab];

  // Compilateur de Quiz Dynamique de Haute Complexité
  const buildExamSimulator = () => {
    let pool = [];

    // Injection automatique depuis TOUTES les sections de data.js
    Object.entries(window.SECTIONS).forEach(([secKey, sec]) => {
      Object.entries(sec.categories).forEach(([catKey, cat]) => {
        cat.items.forEach((item) => {
          // Type de question 1 : La composition brute
          pool.push({
            q: `Quels sont les ingrédients précis composants la recette : "${item.name}" ?`,
            a: `Composition exacte : ${item.ingredients.join(", ")}.`,
            cat: `${sec.label} — ${cat.label}`
          });

          // Type de question 2 : Les alertes mémos critiques
          if (item.memo) {
            pool.push({
              q: `Quel est le mémo opérationnel ou le point de vigilance pour le produit : "${item.name}" ?`,
              a: item.memo,
              cat: `${sec.label} — Mémo`
            });
          }

          // Type de question 3 : Diagnostic Allergènes d'examen
          const detected = detectAllergens(item.ingredients, item.name);
          if (detected.length > 0) {
            pool.push({
              q: `Quels sont les allergènes majeurs réglementaires présents dans : "${item.name}" ?`,
              a: `Allergènes détectés à déclarer : ${detected.join(", ")}.`,
              cat: `Sécurité Alimentaire`
            });
          }
        });
      });
    });

    // Algorithme de mélange de Fisher-Yates pour briser la linéarité
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    setQuestionsPool(pool);
    setQuizIdx(0);
    setShowAnswer(false);
    setQuizFinished(false);
    setScore({ ok: 0, nok: 0 });
  };

  // Déclenchement propre sans boucle infinie
  useEffect(() => {
    if (mode === "quiz") {
      buildExamSimulator();
    }
  }, [mode]);

  const handleNextQuestion = (isCorrect) => {
    setScore((prev) => ({
      ...prev,
      [isCorrect ? "ok" : "nok"]: prev[isCorrect ? "ok" : "nok"] + 1
    }));

    if (quizIdx + 1 >= questionsPool.length) {
      setQuizFinished(true);
    } else {
      setQuizIdx((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top Banner Dashboard */}
      <div style={{ background: "linear-gradient(135deg, #021106 0%, var(--primary-green) 100%)", padding: "30px 16px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: "clamp(20px, 5vw, 34px)", fontWeight: 955, color: "var(--accent-gold)", letterSpacing: 1.5, textTransform: "uppercase" }}>🌴 MASTERMIND PARADIS</div>
        <div style={{ color: "#a2dbb0", fontSize: 12, marginTop: 6, marginBottom: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        </div>
        
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {[
            { id: "learn", label: "💡 La Carte" },
            { id: "allergens_tab", label: "🛡️ Allergènes" },
            { id: "quiz", label: "🎯 Quizz" }
          ].map(m => (
            <button key={m.id} 
              onClick={() => setMode(m.id)}
              className="touch-target"
              style={{ 
                padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13,
                transition: "all 0.2s",
                background: mode === m.id ? "var(--bg-main)" : "rgba(255,255,255,0.06)", 
                color: mode === m.id ? "var(--primary-green)" : "#ffffff"
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rendu du Mode Quiz Entièrement Réparé */}
      {mode === "quiz" && (
        <div style={{ maxWidth: 650, width: "100%", margin: "20px auto", padding: "0 16px", boxSizing: "border-box" }} className="animate-fade">
          {quizFinished ? (
            <div style={{ background: "var(--panel-bg)", borderRadius: 24, padding: "40px 24px", textAlign: "center", border: "1px solid #cbd5e1", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 64 }}>🏆</div>
              <div style={{ fontSize: 24, fontWeight: 900, marginTop: 16, color: "var(--text-dark)" }}>Session Terminée</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary-green)", marginTop: 8 }}>
                Score : {score.ok} / {questionsPool.length} Réussites
              </div>
              <button onClick={buildExamSimulator} className="touch-target" style={{ width: "100%", marginTop: 24, padding: "16px", background: "var(--primary-green)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                🔄 Regénérer une Session d'Examen
              </button>
            </div>
          ) : questionsPool.length > 0 ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 4px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 800 }}>QUESTION : {quizIdx + 1} / {questionsPool.length}</span>
                <span style={{ fontSize: 12, fontWeight: 800, background: "#ffffff", padding: "6px 14px", borderRadius: 99, border: "1px solid #e2e8f0" }}>✅ {score.ok} &nbsp;&bull;&nbsp; ❌ {score.nok}</span>
              </div>
              
              <div style={{ background: "var(--panel-bg)", borderRadius: 24, padding: "24px", border: "1px solid #cbd5e1", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 900, marginBottom: 12, display: "inline-block", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6 }}>
                  Secteur : {questionsPool[quizIdx].cat}
                </div>
                
                <div style={{ fontSize: "clamp(16px, 4.5vw, 20px)", fontWeight: 900, lineHeight: 1.4, color: "var(--text-dark)", marginBottom: 24 }}>
                  {questionsPool[quizIdx].q}
                </div>

                {!showAnswer ? (
                  <button onClick={() => setShowAnswer(true)} className="touch-target" style={{ width: "100%", padding: "16px", background: "var(--primary-green)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                    👁️ Interroger la Fiche Recette
                  </button>
                ) : (
                  <div className="animate-fade">
                    <div style={{ background: "#f0fdf4", borderRadius: 16, padding: 16, marginBottom: 20, borderLeft: "5px solid #16a34a" }}>
                      <div style={{ fontWeight: 700, color: "#14532d", fontSize: 15, lineHeight: 1.5 }}>
                        {questionsPool[quizIdx].a}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={() => handleNextQuestion(false)} className="touch-target" style={{ flex: 1, padding: "14px", background: "#fef2f2", color: "#991b1b", border: "none", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>❌ Échec</button>
                      <button onClick={() => handleNextQuestion(true)} className="touch-target" style={{ flex: 1, padding: "14px", background: "#f0fdf4", color: "#166534", border: "none", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>✅ Validé</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>Compilation du bassin de questions...</div>
          )}
        </div>
      )}

      {/* Rendu Mode Allergènes Règlementaires */}
      {mode === "allergens_tab" && (
        <div style={{ maxWidth: 800, width: "100%", margin: "20px auto", padding: "0 16px", boxSizing: "border-box" }} className="animate-fade">
          <div style={{ marginBottom: 20, background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #cbd5e1" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "var(--primary-green)", fontWeight: 900 }}>🛡️ Les 14 Allergènes Majeurs Réglementaires</h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Base légale européenne de contrôle des flux de service. Cet onglet sert de référentiel théorique direct.
            </p>
          </div>
          <div className="responsive-grid">
            {window.OFFICIAL_ALLERGENS.map((alg) => (
              <div key={alg.id} style={{ background: "#fff", border: `2px solid ${alg.color.border}`, borderRadius: 16, padding: 16 }}>
                <span style={{ background: alg.color.bg, color: alg.color.text, border: `1px solid ${alg.color.border}`, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 900, display: "inline-block" }}>
                  {alg.name}
                </span>
                <p style={{ margin: "10px 0 0 0", fontSize: 13, color: "var(--text-dark)", fontWeight: 600, lineHeight: 1.4 }}>{alg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rendu Mode Apprentissage Carte */}
      {mode === "learn" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
          <div className="tab-container" style={{ display: "flex", gap: 8, padding: "12px 16px", background: "var(--panel-bg)", borderBottom: "1px solid #e2e8f0", overflowX: "auto", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(window.SECTIONS).map(([key, s]) => {
                const totalItems = Object.values(s.categories).reduce((acc, cat) => acc + cat.items.length, 0);
                return (
                  <button key={key} onClick={() => { setActiveTab(key); setExpandedCat(null); setExpandedItem(null); }}
                    className="touch-target"
                    style={{ 
                      padding: "10px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap",
                      background: activeTab === key ? s.color : "#f1f5f9", 
                      color: activeTab === key ? "#fff" : "var(--text-muted)"
                    }}>
                    {s.label} ({totalItems})
                  </button>
                );
              })}
            </div>
            <button onClick={() => setFlashcardMode(!flashcardMode)} className="touch-target" style={{ padding: "10px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, whiteSpace: "nowrap", background: flashcardMode ? "var(--primary-green)" : "#e2e8f0", color: flashcardMode ? "#fff" : "var(--text-dark)" }}>
              {flashcardMode ? "👁️ Afficher" : "🙈 Masquer"}
            </button>
          </div>

          <div style={{ padding: "16px", width: "100%", boxSizing: "border-box" }}>
            {Object.entries(section.categories).map(([catKey, cat]) => (
              <div key={catKey} style={{ marginBottom: 16, borderRadius: 16, overflow: "hidden", background: "var(--panel-bg)", border: "1px solid #e2e8f0" }}>
                <button onClick={() => setExpandedCat(expandedCat === catKey ? null : catKey)} className="touch-target" style={{ width: "100%", padding: "16px 20px", background: "var(--panel-bg)", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <span style={{ fontWeight: 955, fontSize: 16, color: "var(--text-dark)" }}>{cat.emoji} &nbsp;&nbsp; {cat.label} ({cat.items.length})</span>
                  <span style={{ color: "var(--text-muted)", fontSize: 18, fontWeight: "bold" }}>{expandedCat === catKey ? "−" : "＋"}</span>
                </button>

                {expandedCat === catKey && (
                  <div style={{ padding: "12px", background: "#faf9f4", borderTop: "1px solid #f1f5f9" }}>
                    <div className="responsive-grid">
                      {cat.items.map((item, i) => {
                        const isRevealed = expandedItem === `${catKey}-${i}`;
                        const allergensDetected = detectAllergens(item.ingredients, item.name);
                        
                        return (
                          <div key={i} style={{ background: "var(--panel-bg)", border: "1px solid #cbd5e1", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 900, fontSize: 15, color: "var(--text-dark)", background: "#ffffff" }}>
                              {item.name}
                            </div>
                            
                            <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                              {(!flashcardMode || isRevealed) ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                  <div>
                                    <div style={{ fontSize: 9, fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>Composition</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                      {item.ingredients.map((ing, j) => {
                                        const colors = getIngredientStyle(ing);
                                        return (
                                          <span key={j} style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>
                                            {ing}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {allergensDetected.length > 0 && (
                                    <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 10 }}>
                                      <div style={{ fontSize: 9, fontWeight: 900, color: "#be123c", textTransform: "uppercase", marginBottom: 6 }}>🛡️ Allergènes critiques</div>
                                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                        {allergensDetected.map((algName, k) => {
                                          const matched = window.OFFICIAL_ALLERGENS.find(a => a.name === algName);
                                          return (
                                            <span key={k} style={{ background: matched?.color.bg || "#fff1f2", color: matched?.color.text || "#be123c", border: `1px solid ${matched?.color.border || "#fecdd3"}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 900 }}>
                                              {algName}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {item.memo && (
                                    <div style={{ background: "#fffdf5", border: "1px solid #fef3c7", borderRadius: 10, padding: "10px 12px", fontSize: 11, color: "#78350f", lineHeight: 1.5 }}>
                                      <strong>⚡ MÉMO :</strong> {item.memo}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button onClick={() => setExpandedItem(`${catKey}-${i}`)} className="touch-target" style={{ width: "100%", padding: "12px", background: "#fffbeb", border: "1px dashed #d97706", borderRadius: 10, color: "#b45309", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                                  ❓ Révéler la composition & allergènes
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);