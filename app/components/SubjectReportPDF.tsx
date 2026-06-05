import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e40af',
  },
  schoolMotto: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 5,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#374151',
  },
  infoBox: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: 120,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  infoValue: {
    fontSize: 10,
    color: '#1f2937',
    flex: 1,
  },
  summaryStats: {
    marginBottom: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '23%',
    margin: '1%',
    padding: 8,
    backgroundColor: '#e0e7ff',
    borderRadius: 5,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 8,
    color: '#4338ca',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 5,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 6,
  },
  tableCell: {
    fontSize: 8,
    textAlign: 'center',
    color: '#374151',
  },
  rankCol: { width: '10%' },
  nameCol: { width: '30%' },
  admissionCol: { width: '20%' },
  caCol: { width: '15%' },
  examCol: { width: '15%' },
  gradeCol: { width: '10%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  rankBadge1: { backgroundColor: '#fbbf24', padding: 2, borderRadius: 10, textAlign: 'center', width: 50 },
  rankBadge2: { backgroundColor: '#e5e7eb', padding: 2, borderRadius: 10, textAlign: 'center', width: 50 },
  rankBadge3: { backgroundColor: '#fcd34d', padding: 2, borderRadius: 10, textAlign: 'center', width: 50 },
  rankText: { fontSize: 8, fontWeight: 'bold', color: '#92400e' },
})

interface SubjectReportProps {
  className: string
  classCode: string
  subjectName: string
  subjectCode: string
  term: string
  students: any[]
  summary?: {
    totalStudents?: number
    withScores?: number
    withoutScores?: number
    classAverage?: number
    highestScore?: number
    lowestScore?: number
    passCount?: number
    passRate?: number
  }
}

export default function SubjectReportPDF({ 
  className, 
  classCode, 
  subjectName, 
  subjectCode, 
  term, 
  students, 
  summary = {} 
}: SubjectReportProps) {
  // Safe values with defaults
  const totalStudents = summary?.totalStudents || 0
  const withScores = summary?.withScores || 0
  const classAverage = summary?.classAverage || 0
  const passRate = summary?.passRate || 0
  const highestScore = summary?.highestScore || 0

  const getGradeLetter = (score: number) => {
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  const getGradeColor = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 70) return '#3b82f6'
    if (score >= 60) return '#eab308'
    if (score >= 50) return '#f97316'
    return '#ef4444'
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return styles.rankBadge1
    if (rank === 2) return styles.rankBadge2
    if (rank === 3) return styles.rankBadge3
    return {}
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.schoolName}>IKONEX ACADEMY</Text>
          <Text style={styles.schoolMotto}>Excellence in Education</Text>
          <Text style={styles.reportTitle}>SUBJECT PERFORMANCE REPORT</Text>
          <Text style={styles.reportTitle}>{subjectName} ({subjectCode})</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Class:</Text>
            <Text style={styles.infoValue}>{className} ({classCode})</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Term:</Text>
            <Text style={styles.infoValue}>{term}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Students:</Text>
            <Text style={styles.infoValue}>{totalStudents}</Text>
          </View>
        </View>

        <View style={styles.summaryStats}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Class Average</Text>
            <Text style={styles.statValue}>{classAverage.toFixed(2)}%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>With Scores</Text>
            <Text style={styles.statValue}>{withScores}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pass Rate</Text>
            <Text style={styles.statValue}>{passRate.toFixed(1)}%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Highest Score</Text>
            <Text style={styles.statValue}>{highestScore}%</Text>
          </View>
        </View>

        {students.length > 0 && students[0]?.averageScore > 0 && (
          <View style={{ backgroundColor: '#fef3c7', padding: 8, borderRadius: 5, marginBottom: 15, alignItems: 'center' }}>
            <Text style={{ fontSize: 10, color: '#92400e' }}>🏆 TOP PERFORMER</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#92400e' }}>{students[0].studentName}</Text>
            <Text style={{ fontSize: 10, color: '#92400e' }}>Score: {students[0].averageScore.toFixed(2)}%</Text>
          </View>
        )}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.rankCol]}>RANK</Text>
            <Text style={[styles.tableHeaderCell, styles.nameCol]}>STUDENT NAME</Text>
            <Text style={[styles.tableHeaderCell, styles.admissionCol]}>ADMISSION NO</Text>
            <Text style={[styles.tableHeaderCell, styles.caCol]}>CA (%)</Text>
            <Text style={[styles.tableHeaderCell, styles.examCol]}>EXAM (%)</Text>
            <Text style={[styles.tableHeaderCell, styles.gradeCol]}>GRADE</Text>
          </View>

          {students.map((student, index) => (
            <View key={student.studentId} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff' }]}>
              <View style={[styles.rankCol, getRankBadge(index + 1)]}>
                <Text style={styles.rankText}>
                  {index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `${index + 1}th`}
                </Text>
              </View>
              <Text style={[styles.tableCell, styles.nameCol]}>{student.studentName}</Text>
              <Text style={[styles.tableCell, styles.admissionCol]}>{student.admissionNo}</Text>
              <Text style={[styles.tableCell, styles.caCol]}>{student.caScore ? `${student.caScore}%` : '-'}</Text>
              <Text style={[styles.tableCell, styles.examCol]}>{student.examScore ? `${student.examScore}%` : '-'}</Text>
              <Text style={[styles.tableCell, styles.gradeCol, { color: student.averageScore > 0 ? getGradeColor(student.averageScore) : '#9ca3af', fontWeight: 'bold' }]}>
                {student.averageScore > 0 ? getGradeLetter(student.averageScore) : '-'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Generated by Ikonex Academy Management System | {new Date().toLocaleDateString()}</Text>
          <Text>This is a computer-generated document. No signature required.</Text>
        </View>
      </Page>
    </Document>
  )
}