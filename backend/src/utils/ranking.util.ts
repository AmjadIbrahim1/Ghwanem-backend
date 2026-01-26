// backend/src/utils/ranking.util.ts
import { StudentData } from '../types';

export const calculateRanks = (students: StudentData[]): StudentData[] => {
  // Sort students by total score (descending)
  const sortedStudents = [...students].sort((a, b) => b.totalScore - a.totalScore);

  // Assign ranks
  let currentRank = 1;
  let previousScore = -1;
  let studentsWithSameRank = 0;

  const rankedStudents = sortedStudents.map((student, index) => {
    if (student.totalScore === previousScore) {
      // Same score as previous student, same rank
      studentsWithSameRank++;
      return {
        ...student,
        rank: currentRank,
      };
    } else {
      // Different score, new rank
      currentRank = index + 1;
      previousScore = student.totalScore;
      studentsWithSameRank = 0;
      return {
        ...student,
        rank: currentRank,
      };
    }
  });

  return rankedStudents;
};