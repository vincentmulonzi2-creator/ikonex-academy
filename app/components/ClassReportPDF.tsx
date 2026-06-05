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
  classInfo: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
  },
  classInfoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  classInfoLabel: {
    width: 120,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  classInfoValue: {
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
  totalCol: { width: '15%' },
  averageCol: { width: '15%' },
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

interface ClassReportProps {
  className: string
  classCode: string
  academicYear: string
  term: string
  students: any[]
  summary: {
    totalStudents: number
    totalMarks: number
    classAverage: number
    passCount: number
    failCount: number
    passRate: number
    topStudent: string
    topScore: number
  }
}

export default function ClassReportPDF({ className, classCode, academicYear, term, students, summary }: ClassReportProps) {
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>IKONEX ACADEMY</Text>
          <Text style={styles.schoolMotto}>Excellence in Education</Text>
          <Text style={styles.reportTitle}>CLASS PERFORMANCE REPORT</Text>
          <Text style={styles.reportTitle}>
            {academicYear} - {term}
          </Text>
        </View>

        {/* Class Information */}
        <View style={styles.classInfo}>
          <View style={styles.classInfoRow}>
            <Text style={styles.classInfoLabel}>Class Name:</Text>
            <Text style={styles.classInfoValue}>{className} ({classCode})</Text>
          </View>
          <View style={styles.classInfoRow}>
            <Text style={styles.classInfoLabel}>Total Students:</Text>
            <Text style={styles.classInfoValue}>{summary.totalStudents}</Text>
          </View>
          <View style={styles.classInfoRow}>
            <Text style={styles.classInfoLabel}>Reporting Period:</Text>
            <Text style={styles.classInfoValue}>{term}, {academicYear}</Text>
          </View>
        </View>

        {/* Summary Statistics */}
        <View style={styles.summaryStats}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Class Average</Text>
            <Text style={styles.statValue}>{summary.classAverage.toFixed(2)}%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Marks</Text>
            <Text style={styles.statValue}>{summary.totalMarks}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Passing</Text>
            <Text style={styles.statValue}>{summary.passCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pass Rate</Text>
            <Text style={styles.statValue}>{summary.passRate.toFixed(1)}%</Text>
          </View>
        </View>

        {/* Top Performer Highlight */}
        {summary.topStudent && (
          <View style={{ backgroundColor: '#fef3c7', padding: 8, borderRadius: 5, marginBottom: 15, alignItems: 'center' }}>
            <Text style={{ fontSize: 10, color: '#92400e' }}>🏆 TOP PERFORMER</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#92400e' }}>{summary.topStudent}</Text>
            <Text style={{ fontSize: 10, color: '#92400e' }}>Score: {summary.topScore.toFixed(2)}%</Text>
          </View>
        )}

        {/* Students Performance Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.rankCol]}>RANK</Text>
            <Text style={[styles.tableHeaderCell, styles.nameCol]}>STUDENT NAME</Text>
            <Text style={[styles.tableHeaderCell, styles.admissionCol]}>ADMISSION NO</Text>
            <Text style={[styles.tableHeaderCell, styles.totalCol]}>TOTAL MARKS</Text>
            <Text style={[styles.tableHeaderCell, styles.averageCol]}>AVERAGE (%)</Text>
            <Text style={[styles.tableHeaderCell, styles.gradeCol]}>GRADE</Text>
          </View>

          {/* Table Rows */}
          {students.map((student, index) => (
            <View key={student.studentId} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff' }]}>
              <View style={[styles.rankCol, getRankBadge(index + 1)]}>
                <Text style={styles.rankText}>
                  {index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `${index + 1}th`}
                </Text>
              </View>
              <Text style={[styles.tableCell, styles.nameCol]}>{student.name}</Text>
              <Text style={[styles.tableCell, styles.admissionCol]}>{student.admissionNo}</Text>
              <Text style={[styles.tableCell, styles.totalCol]}>{student.totalMarks}</Text>
              <Text style={[styles.tableCell, styles.averageCol, { color: getGradeColor(student.averageScore), fontWeight: 'bold' }]}>
                {student.averageScore.toFixed(2)}%
              </Text>
              <Text style={[styles.tableCell, styles.gradeCol]}>
                {getGradeLetter(student.averageScore)}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Ikonex Academy Management System | {new Date().toLocaleDateString()}</Text>
          <Text>This is a computer-generated document. No signature required.</Text>
        </View>
      </Page>
    </Document>
  )
}