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
  const [flashcardMode, setFlashcardMode] = useState(false);

  // States du Quiz initialisés de manière paresseuse (Lazy Initialization) via localStorage
  const [questionsPool, setQuestionsPool] = useState(() => {
    const savedPool = localStorage.getItem("paradis_quiz_pool");
    return savedPool ? JSON.parse(savedPool) : [];
  });

  const [quizIdx, setQuizIdx] = useState(() => {
    const savedIdx = localStorage.getItem("paradis_quiz_idx");
    return savedIdx ? parseInt(savedIdx, 10) : 0;
  });

  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem("paradis_quiz_score");
    return savedScore ? JSON.parse(savedScore) : { ok: 0, nok: 0 };
  });

  const [quizFinished, setQuizFinished] = useState(() => {
    const savedFinished = localStorage.getItem("paradis_quiz_finished");
    return savedFinished ? JSON.parse(savedFinished) : false;
  });

  const [showAnswer, setShowAnswer] = useState(false);

  const section = window.SECTIONS[activeTab];

  // Effets de synchronisation avec le LocalStorage dès qu'une variable d'état change
  useEffect(() => {
    localStorage.setItem("paradis_quiz_pool", JSON.stringify(questionsPool));
  }, [questionsPool]);

  useEffect(() => {
    localStorage.setItem("paradis_quiz_idx", quizIdx.toString());
  }, [quizIdx]);

  useEffect(() => {
    localStorage.setItem("paradis_quiz_score", JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    localStorage.setItem("paradis_quiz_finished", JSON.stringify(quizFinished));
  }, [quizFinished]);

  // Générateur dynamique d'Examen avec nettoyage préalable
  const buildExamSimulator = () => {
    let pool = [];

    Object.entries(window.SECTIONS).forEach(([secKey, sec]) => {
      Object.entries(sec.categories).forEach(([catKey, cat]) => {
        cat.items.forEach((item) => {
          pool.push({
            q: `Quelle est la composition exacte et complète du produit suivant : "${item.name}" ?`,
            a: `Ingrédients requis : ${item.ingredients.join(", ")}.`,
            cat: `${sec.label} — Ingrédients`
          });

          if (item.memo) {
            pool.push({
              q: `Quelle est la règle d'or opérationnelle ou le point de vigilance à retenir pour : "${item.name}" ?`,
              a: item.memo,
              cat: `${sec.label} — Point Critique`
            });
          }

          const detected = detectAllergens(item.ingredients, item.name);
          if (detected.length > 0) {
            pool.push({
              q: `En salle ou au comptoir, quels sont les allergènes majeurs que vous devez obligatoirement déclarer pour la recette : "${item.name}" ?`,
              a: `Allergènes officiels présents : ${detected.join(", ")}.`,
              cat: `🛡️ Sécurité & Allergènes`
            });
          }
        });
      });
    });

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

  // Déclenchement automatique au premier clic sur l'onglet si aucun pool n'existe
  useEffect(() => {
    if (mode === "quiz" && questionsPool.length === 0) {
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

  // Réinitialisation explicite du LocalStorage pour forcer un nouveau mélange
  const resetQuizStorage = () => {
    localStorage.removeItem("paradis_quiz_pool");
    localStorage.removeItem("paradis_quiz_idx");
    localStorage.removeItem("paradis_quiz_score");
    localStorage.removeItem("paradis_quiz_finished");
    buildExamSimulator();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top Banner Dashboard */}
      <div style={{ background: "linear-gradient(135deg, #010f05 0%, var(--primary-green) 100%)", padding: "35px 16px", textAlign: "center", boxShadow: "0 10px 30px rgba(6,36,16,0.15)" }}>
        <div style={{ fontSize: "clamp(22px, 5vw, 36px)", fontWeight: 955, color: "var(--accent-gold)", letterSpacing: 2, textTransform: "uppercase" }}>🌴 MASTERMIND PARADIS</div>
        <div style={{ color: "#bbf7d0", fontSize: 12, marginTop: 6, marginBottom: 24, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2 }}>
        </div>
        
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { id: "learn", label: "💡 Carte" },
            { id: "allergens_tab", label: "🛡️ Allergènes" },
            { id: "quiz", label: "🎯 Quizz" }
          ].map(m => (
            <button key={m.id} 
              onClick={() => setMode(m.id)}
              className="touch-target btn-interactive"
              style={{ 
                padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13,
                background: mode === m.id ? "var(--accent-gold)" : "rgba(255,255,255,0.08)", 
                color: mode === m.id ? "var(--primary-green)" : "#ffffff",
                boxShadow: mode === m.id ? "0 4px 15px rgba(234,179,8,0.3)" : "none",
                transition: "all 0.2s"
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rendu du Mode Quiz */}
      {mode === "quiz" && (
        <div style={{ maxWidth: 650, width: "100%", margin: "25px auto", padding: "0 16px", boxSizing: "border-box" }} className="animate-fade">
          {quizFinished ? (
            <div className="card-ui" style={{ textAlign: "center", padding: "40px 24px" }}>
              <div style={{ fontSize: 72 }}>🏆</div>
              <div style={{ fontSize: 26, fontWeight: 955, marginTop: 16, color: "var(--text-dark)" }}>Évaluation Terminée</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-green)", marginTop: 10, background: "#f0fdf4", display: "inline-block", padding: "8px 20px", borderRadius: 99 }}>
                Score Obtenu : {score.ok} / {questionsPool.length} ({questionsPool.length > 0 ? Math.round((score.ok / questionsPool.length) * 100) : 0}%)
              </div>
              <button onClick={resetQuizStorage} className="touch-target btn-interactive" style={{ width: "100%", marginTop: 30, padding: "16px", background: "var(--primary-green)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 15px rgba(6,36,16,0.2)" }}>
                🔄 Recommencer un Nouvel Examen
              </button>
            </div>
          ) : questionsPool.length > 0 ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "0 4px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Progression : {quizIdx + 1} / {questionsPool.length}</span>
                <span style={{ fontSize: 12, fontWeight: 800, background: "#ffffff", padding: "6px 14px", borderRadius: 99, border: "1px solid #cbd5e1" }}>✅ {score.ok} &nbsp;&bull;&nbsp; ❌ {score.nok}</span>
              </div>
              
              <div className="card-ui" style={{ padding: "30px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: "var(--primary-green)", textTransform: "uppercase", fontWeight: 900, background: "#e6f4ea", padding: "6px 12px", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                    {questionsPool[quizIdx].cat}
                  </div>
                  <button onClick={resetQuizStorage} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                    Réinitialiser 🔄
                  </button>
                </div>
                
                <div style={{ fontSize: "clamp(17px, 4.5vw, 21px)", fontWeight: 950, lineHeight: 1.4, color: "var(--text-dark)", marginBottom: 30 }}>
                  {questionsPool[quizIdx].q}
                </div>

                {!showAnswer ? (
                  <button onClick={() => setShowAnswer(true)} className="touch-target btn-interactive" style={{ width: "100%", padding: "16px", background: "var(--primary-green)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 15px rgba(6,36,16,0.15)" }}>
                    👁️ Vérifier la Fiche Technique
                  </button>
                ) : (
                  <div className="animate-fade">
                    <div style={{ background: "#f0fdf4", borderRadius: 16, padding: 20, marginBottom: 25, borderLeft: "5px solid #16a34a" }}>
                      <div style={{ fontWeight: 800, color: "#14532d", fontSize: 15, lineHeight: 1.6 }}>
                        {questionsPool[quizIdx].a}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={() => handleNextQuestion(false)} className="touch-target btn-interactive" style={{ flex: 1, padding: "14px", background: "#fef2f2", color: "#991b1b", border: "1px solid #fee2e2", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>❌ À Revoir</button>
                      <button onClick={() => handleNextQuestion(true)} className="touch-target btn-interactive" style={{ flex: 1, padding: "14px", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>✅ Maîtrisé</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)", fontWeight: 700 }}>
              <button onClick={buildExamSimulator} className="touch-target btn-interactive" style={{ padding: "12px 24px", background: "var(--primary-green)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800 }}>
                🚀 Générer le pool de questions
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode Référentiel Allergènes */}
      {mode === "allergens_tab" && (
        <div style={{ maxWidth: 800, width: "100%", margin: "25px auto", padding: "0 16px", boxSizing: "border-box" }} className="animate-fade">
          <div className="card-ui" style={{ marginBottom: 20, padding: 20, borderLeft: "5px solid var(--primary-green)" }}>
            <h3 style={{ margin: "0 0 6px 0", color: "var(--primary-green)", fontWeight: 955, fontSize: 18 }}>🛡️ Les 14 Allergènes Majeurs Réglementaires</h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, fontWeight: 500 }}>
              Base légale de contrôle sanitaire. L'application extrait dynamiquement ces allergènes depuis la liste des ingrédients de vos fiches techniques.
            </p>
          </div>
          <div className="responsive-grid">
            {window.OFFICIAL_ALLERGENS.map((alg) => (
              <div key={alg.id} className="card-ui card-hover" style={{ padding: 18, borderTop: `4px solid ${alg.color.border}` }}>
                <span style={{ background: alg.color.bg, color: alg.color.text, border: `1px solid ${alg.color.border}`, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 900, display: "inline-block" }}>
                  {alg.name}
                </span>
                <p style={{ margin: "12px 0 0 0", fontSize: 13, color: "var(--text-dark)", fontWeight: 600, lineHeight: 1.5 }}>{alg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode Consultation de la Carte */}
      {mode === "learn" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
          <div className="tab-container" style={{ display: "flex", gap: 8, padding: "14px 16px", background: "var(--panel-bg)", borderBottom: "1px solid #cbd5e1", overflowX: "auto", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(window.SECTIONS).map(([key, s]) => {
                const totalItems = Object.values(s.categories).reduce((acc, cat) => acc + cat.items.length, 0);
                return (
                  <button key={key} onClick={() => { setActiveTab(key); setExpandedCat(null); setExpandedItem(null); }}
                    className="touch-target btn-interactive"
                    style={{ 
                      padding: "10px 18px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap",
                      background: activeTab === key ? s.color : "#f1f5f9", 
                      color: activeTab === key ? "#fff" : "var(--text-muted)",
                      boxShadow: activeTab === key ? `0 4px 12px ${s.color}40` : "none"
                    }}>
                    {s.label} ({totalItems})
                  </button>
                );
              })}
            </div>
            <button onClick={() => setFlashcardMode(!flashcardMode)} className="touch-target btn-interactive" style={{ padding: "10px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, whiteSpace: "nowrap", background: flashcardMode ? "var(--primary-green)" : "#e2e8f0", color: flashcardMode ? "#fff" : "var(--text-dark)" }}>
              {flashcardMode ? "👁️ Tout Afficher" : "🙈 Mode Cache"}
            </button>
          </div>

          <div style={{ padding: "20px 16px", width: "100%", boxSizing: "border-box", maxWidth: 1200, margin: "0 auto" }}>
            {Object.entries(section.categories).map(([catKey, cat]) => (
              <div key={catKey} style={{ marginBottom: 20, borderRadius: 16, overflow: "hidden", background: "var(--panel-bg)", border: "1px solid #cbd5e1" }}>
                <button onClick={() => setExpandedCat(expandedCat === catKey ? null : catKey)} className="touch-target card-hover" style={{ width: "100%", padding: "18px 20px", background: "var(--panel-bg)", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <span style={{ fontWeight: 955, fontSize: 16, color: "var(--text-dark)" }}>{cat.emoji} &nbsp;&nbsp; {cat.label} ({cat.items.length})</span>
                  <span style={{ color: "var(--text-muted)", fontSize: 18, fontWeight: "bold" }}>{expandedCat === catKey ? "−" : "＋"}</span>
                </button>

                {expandedCat === catKey && (
                  <div style={{ padding: "16px", background: "#faf9f5", borderTop: "1px solid #cbd5e1" }}>
                    <div className="responsive-grid">
                      {cat.items.map((item, i) => {
                        const isRevealed = expandedItem === `${catKey}-${i}`;
                        const allergensDetected = detectAllergens(item.ingredients, item.name);
                        
                        return (
                          <div key={i} className="card-ui" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #cbd5e1" }}>
                            <div style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", fontWeight: 955, fontSize: 15, color: "var(--text-dark)", background: "#ffffff" }}>
                              {item.name}
                            </div>
                            
                            <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                              {(!flashcardMode || isRevealed) ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                  <div>
                                    <div style={{ fontSize: 9, fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Fiche Ingrédients</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                      {item.ingredients.map((ing, j) => {
                                        const colors = getIngredientStyle(ing);
                                        return (
                                          <span key={j} style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 800 }}>
                                            {ing}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {allergensDetected.length > 0 && (
                                    <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 12 }}>
                                      <div style={{ fontSize: 9, fontWeight: 900, color: "#be123c", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>🛡️ Allergènes Présents</div>
                                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                        {allergensDetected.map((algName, k) => {
                                          const matched = window.OFFICIAL_ALLERGENS.find(a => a.name === algName);
                                          return (
                                            <span key={k} style={{ background: matched?.color.bg || "#fff1f2", color: matched?.color.text || "#be123c", border: `1px solid ${matched?.color.border || "#fecdd3"}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 900 }}>
                                              {algName}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {item.memo && (
                                    <div style={{ background: "#fffdf5", border: "1px solid #fde047", borderRadius: 10, padding: "12px", fontSize: 11, color: "#78350f", lineHeight: 1.5, fontWeight: 600 }}>
                                      <strong>⚡ MÉMO :</strong> {item.memo}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button onClick={() => setExpandedItem(`${catKey}-${i}`)} className="touch-target btn-interactive" style={{ width: "100%", padding: "14px", background: "#fffbeb", border: "1px dashed #d97706", borderRadius: 10, color: "#b45309", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                                  ❓ Révéler les Ingrédients & Allergènes
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