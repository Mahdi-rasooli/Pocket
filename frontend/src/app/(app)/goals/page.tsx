'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import type { Goal, GoalProjections } from '@/lib/types';
import GoalForm from '@/components/GoalForm';
import GoalProgressCard from '@/components/GoalProgressCard';
import ProjectionsPanel from '@/components/ProjectionsPanel';
import SuggestionsPanel from '@/components/SuggestionsPanel';
import { Card, CardContent } from '@/components/ui/card';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [projections, setProjections] = useState<GoalProjections | null>(null);
  const [currentSavedById, setCurrentSavedById] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [projectionsLoading, setProjectionsLoading] = useState(false);

  async function loadGoals() {
    const data = await apiFetch<Goal[]>('/api/goals');
    setGoals(data);
    return data;
  }

  async function loadProjections(id: string) {
    setProjectionsLoading(true);
    try {
      const proj = await apiFetch<GoalProjections>(`/api/goals/${id}/projections`);
      setProjections(proj);
      setCurrentSavedById((prev) => ({ ...prev, [id]: proj.currentSaved }));
    } finally {
      setProjectionsLoading(false);
    }
  }

  useEffect(() => {
    loadGoals().then(async (data) => {
      if (data.length > 0) {
        setSelectedId(data[0]._id);
        await loadProjections(data[0]._id);
      }
      setLoading(false);
    });
  }, []);

  async function createGoal(data: { name: string; targetAmount: number; targetDate: string | null }) {
    const goal = await apiFetch<Goal>('/api/goals', { method: 'POST', body: JSON.stringify(data) });
    await loadGoals();
    setSelectedId(goal._id);
    await loadProjections(goal._id);
  }

  function selectGoal(id: string) {
    setSelectedId(id);
    loadProjections(id);
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading goals…</div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Goals</h1>
        <p className="text-sm text-muted-foreground">Set a savings goal and see algorithm-driven projections for when you'll get there.</p>
      </div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand/15 text-brand p-1.5 rounded-lg"><PiggyBank size={16} /></div>
              <p className="font-medium">New goal</p>
            </div>
            <GoalForm onSubmit={createGoal} />
          </CardContent>
        </Card>
      </motion.div>

      {goals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No goals yet — create one above to see projections.</p>
      ) : (
        <>
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g) => (
              <GoalProgressCard
                key={g._id}
                goal={g}
                currentSaved={currentSavedById[g._id] ?? 0}
                active={selectedId === g._id}
                onClick={() => selectGoal(g._id)}
              />
            ))}
          </motion.div>

          {projectionsLoading && <p className="text-sm text-muted-foreground">Calculating projections…</p>}
          {!projectionsLoading && projections && (
            <>
              <ProjectionsPanel projections={projections} />
              <SuggestionsPanel suggestions={projections.suggestions} />
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
