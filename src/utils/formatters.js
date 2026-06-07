export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getScoreColor(score) {
  if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]';
  if (score >= 60) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
  return 'bg-[#ff5f57]/10 text-[#ff5f57] border border-[#ff5f57]/20 shadow-[0_0_15px_rgba(255,95,87,0.05)]';
}

export function getScoreLabel(score) {
  if (score >= 80) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  return 'Weak Match';
}

export function getRankDisplay(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

export function exportToCSV(results) {
  const headers = ['Rank', 'Name', 'Email', 'Score', 'Skill Score', 'Experience Score', 'Education Score', 'Matched Skills', 'Missing Skills'];
  const rows = results.map((r) => [
    r.rank,
    r.candidateName,
    r.email || '',
    `${r.totalScore}%`,
    `${r.skillScore}%`,
    `${r.experienceScore}%`,
    `${r.educationScore}%`,
    (r.matchedSkills || []).join('; '),
    (r.missingSkills || []).join('; '),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume-screening-results-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
