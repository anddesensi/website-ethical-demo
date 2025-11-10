"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, FileJson, RefreshCcw, Settings2 } from "lucide-react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Types
type Weights = { x: number; y: number };
type Question = {
  id: string;
  text: string;
  weights: Weights;
};
type Answers = Record<string, number>;

// 24 Questions from the image
const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "It is acceptable to conceal information temporarily if doing so serves a greater humanitarian purpose.",
    weights: { x: 0.6, y: 0.4 }
  },
  {
    id: "q2",
    text: "Scientific truth should never be compromised, even to accelerate innovation or attract investment.",
    weights: { x: -0.7, y: 0.6 }
  },
  {
    id: "q3",
    text: "If the ultimate goal is to improve public health, it can justify bending some regulatory rules.",
    weights: { x: 0.7, y: 0.4 }
  },
  {
    id: "q4",
    text: "Transparency and honesty toward patients are moral duties, regardless of business pressures.",
    weights: { x: -0.7, y: 0.7 }
  },
  {
    id: "q5",
    text: "Results that could benefit millions justify taking calculated ethical risks in experimentation.",
    weights: { x: 0.7, y: -0.2 }
  },
  {
    id: "q6",
    text: "Misleading investors or partners is always wrong, even if the deception is intended to ensure survival of a good cause.",
    weights: { x: -0.8, y: 0.6 }
  },
  {
    id: "q7",
    text: "The value of an innovation should be judged by its potential impact on society, not by strict compliance with current laws.",
    weights: { x: 0.6, y: 0.2 }
  },
  {
    id: "q8",
    text: "Rules of medical ethics exist to protect human dignity and must be respected in all circumstances.",
    weights: { x: -0.8, y: 0.7 }
  },
  {
    id: "q9",
    text: "In highly competitive industries, moral flexibility is necessary to achieve progress.",
    weights: { x: 0.5, y: -0.2 }
  },
  {
    id: "q10",
    text: "Respecting universal moral duties is more important than producing rapid technological breakthroughs.",
    weights: { x: -0.8, y: 0.5 }
  },
  {
    id: "q11",
    text: "If an action saves or improves many lives, small-scale harms can be acceptable.",
    weights: { x: 0.7, y: -0.3 }
  },
  {
    id: "q12",
    text: "Truthfulness in scientific communication is an absolute duty, even if full disclosure harms the company.",
    weights: { x: -0.7, y: 0.6 }
  },
  {
    id: "q13",
    text: "It is legitimate to prioritize visionary goals over short-term accuracy when the innovation's promise is extraordinary.",
    weights: { x: 0.6, y: 0.1 }
  },
  {
    id: "q14",
    text: "Patients' trust can be rebuilt even after temporary deception if long-term results are positive.",
    weights: { x: 0.5, y: 0.1 }
  },
  {
    id: "q15",
    text: "Public confidence in science is more damaged by lies than by failures.",
    weights: { x: -0.4, y: 0.6 }
  },
  {
    id: "q16",
    text: "Every patient has a right to informed consent that cannot be suspended for any strategic reason.",
    weights: { x: -0.9, y: 0.7 }
  },
  {
    id: "q17",
    text: "If hiding temporary flaws avoids panic and protects the company's mission, it can be ethically justified.",
    weights: { x: 0.5, y: 0.1 }
  },
  {
    id: "q18",
    text: "Deceiving stakeholders violates their autonomy and can never be morally justified.",
    weights: { x: -0.9, y: 0.7 }
  },
  {
    id: "q19",
    text: "A morally good intention (e.g. democratizing healthcare) can outweigh dishonest methods used to reach it.",
    weights: { x: 0.6, y: -0.2 }
  },
  {
    id: "q20",
    text: "Ethical principles must apply equally to powerful innovators and ordinary professionals.",
    weights: { x: -0.8, y: 0.6 }
  },
  {
    id: "q21",
    text: "Concealing product flaws that could harm users is never justified, even if disclosure destroys the firm.",
    weights: { x: -0.9, y: 0.8 }
  },
  {
    id: "q22",
    text: "Innovation inherently requires risk; occasional harm to some individuals is acceptable if the overall impact is positive.",
    weights: { x: 0.7, y: -0.4 }
  },
  {
    id: "q23",
    text: "An organization that endangers lives to protect its image causes irreparable moral harm.",
    weights: { x: -0.9, y: 0.8 }
  },
  {
    id: "q24",
    text: "In technology and health innovation, moral harm often begins when transparency becomes secondary to ambition.",
    weights: { x: -0.7, y: 0.6 }
  }
];

const LIKERT = [
  { label: "Strongly Disagree", value: -2 },
  { label: "Disagree", value: -1 },
  { label: "Neutral", value: 0 },
  { label: "Agree", value: 1 },
  { label: "Strongly Agree", value: 2 },
];

function normalizeScore(sum: number, questions: Question[], axis: "x" | "y", answers: Answers) {
  const denom = 2 * questions.reduce((acc, q) => acc + (answers[q.id] != null ? Math.abs(q.weights[axis]) : 0), 0);
  if (!isFinite(denom) || denom <= 0) return 0;
  return Math.max(-1, Math.min(1, sum / denom));
}

function downloadFile(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function EthicsMatrixDashboard() {
  const [answers, setAnswers] = useState<Answers>({});
  const [showGuides, setShowGuides] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ethics_answers");
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("ethics_answers", JSON.stringify(answers));
  }, [answers]);

  const progress = useMemo(() => {
    const answered = QUESTIONS.filter((q) => answers[q.id] != null).length;
    const total = QUESTIONS.length;
    return { answered, total, pct: total ? Math.round((answered / total) * 100) : 0 };
  }, [answers]);

  const { scoreX, scoreY } = useMemo(() => {
    let sumX = 0;
    let sumY = 0;
    for (const q of QUESTIONS) {
      const v = answers[q.id];
      if (v == null) continue;
      sumX += v * q.weights.x;
      sumY += v * q.weights.y;
    }
    return {
      scoreX: normalizeScore(sumX, QUESTIONS, "x", answers),
      scoreY: normalizeScore(sumY, QUESTIONS, "y", answers),
    };
  }, [answers]);

  const dataPoint = useMemo(() => [{ x: scoreX, y: scoreY }], [scoreX, scoreY]);

  const interpretation = useMemo(() => {
    const leanX =
      scoreX > 0.3
        ? "Utilitarian orientation"
        : scoreX < -0.3
        ? "Universalist orientation"
        : "Balanced ethical framework";
    const leanY =
      scoreY > 0.3
        ? "Harm-minimizing approach"
        : scoreY < -0.3
        ? "Risk-accepting approach"
        : "Neutral on harm tolerance";
    return { leanX, leanY };
  }, [scoreX, scoreY]);

  function setAnswer(qid: string, val: number) {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  }

  function resetAll() {
    if (confirm("Reset all answers?")) {
      setAnswers({});
    }
  }

  function exportJSON() {
    const payload = {
      timestamp: new Date().toISOString(),
      answers,
      scores: { x: scoreX, y: scoreY },
      interpretation,
    };
    downloadFile("ethics-matrix-results.json", JSON.stringify(payload, null, 2));
  }

  function exportCSV() {
    const header = "question_id,question_text,answer,timestamp\n";
    const ts = new Date().toISOString();
    const rows = QUESTIONS.map((q) => {
      const ans = answers[q.id] ?? "";
      return `"${q.id}","${q.text.replace(/"/g, '""')}","${ans}","${ts}"`;
    }).join("\n");
    downloadFile("ethics-matrix-results.csv", header + rows, "text/csv");
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight">
            Ethics Matrix
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="guides" checked={showGuides} onCheckedChange={setShowGuides} />
              <Label htmlFor="guides" className="cursor-pointer text-sm font-light">Guides</Label>
            </div>
            <Button variant="outline" size="sm" onClick={resetAll} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 grid gap-12 lg:grid-cols-[1fr_450px]">
        {/* Questionnaire - No outer box */}
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-light mb-2">Assessment</h2>
            <p className="text-sm text-black/60">
              {progress.answered}/{progress.total} answered · {progress.pct}%
            </p>
          </div>
          
          <div className="space-y-6">
            {QUESTIONS.map((q, idx) => (
              <fieldset
                key={q.id}
                className="rounded-2xl border border-black/10 bg-black/[0.01] p-5 hover:bg-black/[0.02] transition-all duration-300"
              >
                <legend className="font-light text-black/90 px-3 text-sm mb-3">
                  {idx + 1}. {q.text}
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {LIKERT.map((opt) => {
                    const id = `${q.id}-${opt.value}`;
                    const selected = answers[q.id] === opt.value;
                    return (
                      <label
                        key={id}
                        htmlFor={id}
                        className={`cursor-pointer rounded-xl border px-3 py-2.5 text-xs sm:text-sm text-center transition-all duration-300 font-light ${
                          selected
                            ? "border-black bg-black text-white shadow-lg"
                            : "border-black/20 bg-white hover:border-black/40 hover:bg-black/5"
                        }`}
                      >
                        <input
                          type="radio"
                          id={id}
                          name={q.id}
                          value={opt.value}
                          className="sr-only"
                          checked={selected}
                          onChange={() => setAnswer(q.id, opt.value)}
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        {/* Live Dashboard - Sticky */}
        <div className="lg:sticky lg:top-24 self-start h-fit">
          {/* Chart */}
          <div className="mb-6">
            <h2 className="text-xl font-light mb-4">Live Matrix</h2>
            <div className="rounded-2xl border border-black/10 bg-black/[0.01] p-6">
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      domain={[-1, 1]}
                      ticks={[-1, -0.5, 0, 0.5, 1]}
                      stroke="rgba(0,0,0,0.5)"
                      tick={{ fill: "rgba(0,0,0,0.6)", fontSize: 11 }}
                      label={{
                        value: "Universalism ← → Utilitarianism",
                        position: "bottom",
                        offset: 40,
                        fill: "rgba(0,0,0,0.6)",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      domain={[-1, 1]}
                      ticks={[-1, -0.5, 0, 0.5, 1]}
                      stroke="rgba(0,0,0,0.5)"
                      tick={{ fill: "rgba(0,0,0,0.6)", fontSize: 11 }}
                      label={{
                        value: "Harmful ← → Non-harmful",
                        angle: -90,
                        position: "insideLeft",
                        fill: "rgba(0,0,0,0.6)",
                        fontSize: 12,
                      }}
                    />
                    {showGuides && (
                      <>
                        <ReferenceLine x={0} stroke="rgba(0,0,0,0.2)" strokeDasharray="3 3" />
                        <ReferenceLine y={0} stroke="rgba(0,0,0,0.2)" strokeDasharray="3 3" />
                      </>
                    )}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "12px",
                      }}
                      labelStyle={{ color: "#000" }}
                    />
                    <Scatter
                      name="Your Position"
                      data={dataPoint}
                      fill="#000000"
                      shape="circle"
                      r={10}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <div className="rounded-xl border border-black/20 bg-black/5 px-4 py-2 font-light">
                  X: <span className="font-normal">{scoreX.toFixed(3)}</span>
                </div>
                <div className="rounded-xl border border-black/20 bg-black/5 px-4 py-2 font-light">
                  Y: <span className="font-normal">{scoreY.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div>
            <h2 className="text-xl font-light mb-4">Insights</h2>
            <div className="rounded-2xl border border-black/10 bg-black/[0.01] p-6">
              <div className="space-y-3 text-sm font-light">
                <p className="leading-relaxed">
                  <span className="font-normal">Ethical Framework:</span>{" "}
                  <span className="text-black/70">{interpretation.leanX}</span>
                </p>
                <p className="leading-relaxed">
                  <span className="font-normal">Harm Orientation:</span>{" "}
                  <span className="text-black/70">{interpretation.leanY}</span>
                </p>
              </div>

              {progress.answered < progress.total && (
                <p className="text-xs text-black/50 italic font-light mt-4">
                  Complete all {progress.total} questions for the most accurate assessment.
                </p>
              )}

              <div className="pt-4 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" className="gap-2 font-light" onClick={exportJSON}>
                  <FileJson className="h-4 w-4" />
                  JSON
                </Button>
                <Button variant="secondary" size="sm" className="gap-2 font-light" onClick={exportCSV}>
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-6 py-8 text-center text-xs text-black/40 font-light">
        Ethics Matrix Dashboard · All data stored locally
      </footer>
    </div>
  );
}
