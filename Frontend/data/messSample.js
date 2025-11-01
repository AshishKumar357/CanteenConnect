// Generates a calendar-like dataset of opt-out counts for meals
// Total students is kept constant at 661 as requested.

const TOTAL_STUDENTS = 621;
const MEAL_KEYS = ['breakfast', 'lunch', 'snacks', 'dinner'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDateArray(centerDate, days = 11) {
  const arr = [];
  const start = new Date(centerDate);
  start.setDate(start.getDate() - Math.floor(days / 2));
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    arr.push(d);
  }
  return arr;
}

// Generate a deterministic-ish opt-out count for a given date index so numbers look plausible
function generateCountsForDate(index) {
  // base variations so numbers are different each day
  const base = 40 + (index % 7) * 3;
  const counts = {};
  MEAL_KEYS.forEach((k, i) => {
    // breakfast/lunch/dinner larger, snacks smaller
    const variability = i === 2 ? 0.35 : 0.25;
    const maxOpt = Math.round(TOTAL_STUDENTS * variability);
    const opt = Math.max(0, Math.min(TOTAL_STUDENTS, Math.round(base + ((i + index) * 7) % (maxOpt || 10))));
    counts[k] = opt;
  });
  return counts;
}

export function generateCalendar(centerDate = new Date(), days = 11) {
  const dates = getDateArray(centerDate, days);
  return dates.map((d, idx) => ({
    date: d,
    totalStudents: TOTAL_STUDENTS,
    optOut: generateCountsForDate(idx),
  }));
}

export default {
  generateCalendar,
  TOTAL_STUDENTS,
};
