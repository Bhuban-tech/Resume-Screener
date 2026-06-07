import { getScoreColor, getScoreLabel } from '../../../utils/formatters.js';

export default function ScoreBadge({ score, showLabel = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getScoreColor(score)}`}>
      {score}%
      {showLabel && <span className="font-normal opacity-75">· {getScoreLabel(score)}</span>}
    </span>
  );
}
