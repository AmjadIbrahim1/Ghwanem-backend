// backend/src/modules/analytics/analytics.service.ts
import prisma from '../../config/db';

export class AnalyticsService {
  async getAnalytics(grade?: string) {
    // Get active academic settings for the specified grade
    const settings = await prisma.academicSettings.findFirst({
      where: { 
        isActive: true,
        ...(grade && { grade })
      },
    });

    if (!settings) {
      // Return empty analytics if no settings found
      return {
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
        topStudents: [],
        subjectStats: [],
        scoreDistribution: [],
      };
    }

    // Fetch students with their grades
    const students = await prisma.student.findMany({
      where: {
        academicSettingsId: settings.id,
      },
      include: {
        grades: true,
      },
      orderBy: {
        rank: 'asc',
      },
    });

    const totalStudents = students.length;

    // If no students, return empty analytics
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
        topStudents: [],
        subjectStats: [],
        scoreDistribution: [],
      };
    }

    // Calculate overall statistics
    const studentTotals = students.map((student) => student.totalScore);
    const averageScore = studentTotals.reduce((sum, score) => sum + score, 0) / totalStudents;
    const highestScore = Math.max(...studentTotals);
    const lowestScore = Math.min(...studentTotals);

    // Calculate pass rate (assuming 50% is passing)
    const maxPossibleScore = students[0]?.grades.reduce((sum, g) => sum + g.maxScore, 0) || 500;
    const passedCount = students.filter((s) => (s.totalScore / maxPossibleScore) * 100 >= 50).length;
    const passRate = (passedCount / totalStudents) * 100;

    // Get top 10 students
    const topStudents = students.slice(0, 10).map((student) => ({
      seatNumber: student.seatNumber,
      name: student.name,
      totalScore: student.totalScore,
      rank: student.rank,
    }));

    // Calculate subject statistics
    const subjectGroups = await prisma.grade.groupBy({
      by: ['subject'],
      where: {
        academicSettingsId: settings.id,
      },
      _avg: {
        score: true,
      },
      _max: {
        score: true,
      },
      _min: {
        score: true,
      },
    });

    const subjectStats = subjectGroups.map((group) => ({
      subject: group.subject,
      average: Number(group._avg.score?.toFixed(2) || 0),
      highest: Number(group._max.score?.toFixed(2) || 0),
      lowest: Number(group._min.score?.toFixed(2) || 0),
    }));

    // Calculate score distribution
    const scoreRanges = [
      { range: '0-50', min: 0, max: 50 },
      { range: '51-100', min: 51, max: 100 },
      { range: '101-150', min: 101, max: 150 },
      { range: '151-200', min: 151, max: 200 },
      { range: '201-250', min: 201, max: 250 },
      { range: '251-300', min: 251, max: 300 },
      { range: '301-350', min: 301, max: 350 },
      { range: '351-400', min: 351, max: 400 },
      { range: '401-450', min: 401, max: 450 },
      { range: '451-500', min: 451, max: 500 },
    ];

    const scoreDistribution = scoreRanges.map((range) => {
      const count = studentTotals.filter(
        (score) => score >= range.min && score <= range.max
      ).length;
      return {
        range: range.range,
        count,
        percentage: Number(((count / totalStudents) * 100).toFixed(1)),
      };
    }).filter(item => item.count > 0);

    return {
      totalStudents,
      averageScore: Number(averageScore.toFixed(2)),
      highestScore: Number(highestScore.toFixed(2)),
      lowestScore: Number(lowestScore.toFixed(2)),
      passRate: Number(passRate.toFixed(2)),
      topStudents,
      subjectStats,
      scoreDistribution,
    };
  }
}